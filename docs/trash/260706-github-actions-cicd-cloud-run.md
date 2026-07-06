---
title: Snack - [DevOps] GitHub Actions + WIF로 Cloud Run 무중단 CICD 구축
tags: ['GCP', 'DevOps', 'CICD', 'CloudRun']
---

## 개요

Spring Boot 앱을 매번 로컬에서 `docker build → push → gcloud run deploy` 스크립트로 수동 배포하던 것을, `main` 브랜치에 push하면 자동으로 테스트 → 배포되는 GitHub Actions 파이프라인으로 옮기면서 정리한 내용이다.

핵심 주제:

- **Workload Identity Federation(WIF)** — 서비스 계정 키(JSON) 없이 GitHub Actions가 GCP에 인증하는 방법
- WIF 풀 / OIDC 프로바이더 / `attribute-condition`의 의미
- `deploy.yml` 각 속성이 하는 일
- 테스트 전용 Postgres를 **서비스 컨테이너**로 띄우고 배포를 게이팅하는 방법
- Cloud Run의 무중단 배포 원리

---

## 전체 아키텍처

```
[개발자] git push origin main
    │
    ▼
[GitHub Actions]
    │
    ├── test job
    │     ├── Postgres 16 컨테이너 임시 기동 (localhost:5432)
    │     ├── ./gradlew test  (ddl-auto=create-drop으로 스키마 생성)
    │     └── 실패 시 → 파이프라인 중단 (배포 안 함) ✋
    │
    └── deploy job  (needs: test → 테스트 성공해야만 실행)
          ├── WIF로 GCP 인증 (키리스)
          ├── docker build → Artifact Registry push
          └── gcloud run deploy → Cloud Run 새 리비전 배포
                                        │
                                        ▼
                              [Cloud Run]  트래픽 100% 새 리비전으로 전환 (무중단)
                                        │
                                        ▼
                              [Cloud SQL]  운영 DB (ddl-auto=update)
```

두 개의 job이 `needs:`로 연결돼서, **테스트가 깨지면 배포 job은 시작조차 하지 않는다.**

---

## 1. 왜 서비스 계정 키 대신 WIF인가

GitHub Actions에서 GCP에 접근하려면 인증이 필요하다. 전통적인 방법은 **서비스 계정 키(JSON)를 발급받아 GitHub Secret에 저장**하는 것인데, 이 방식은 장기 유효한 크리덴셜이 유출되면 위험하고 주기적 회전이 필요하다.

**Workload Identity Federation(WIF)** 은 키를 아예 만들지 않는다. GitHub Actions가 실행될 때 발급하는 **단기 OIDC 토큰**을 GCP가 신뢰하도록 설정해두고, 그 토큰을 서비스 계정으로 **교환(impersonation)** 하는 방식이다.

:::tip 용어 정의 — OIDC 토큰 / WIF
**OIDC(OpenID Connect)** 는 OAuth 2.0 위에 얹은 **인증(authentication)** 표준이다. "이 요청 주체가 누구인지"를 신뢰할 수 있는 발급자(issuer)가 서명해서 증명하는 규격이다.

**OIDC 토큰**은 그 증명서로 발급되는 **서명된 JWT**다. GitHub Actions의 경우 워크플로가 돌 때 GitHub의 OIDC 발급자(`https://token.actions.githubusercontent.com`)가 이 토큰을 만들어주며, 안에는 `iss`(발급자), `sub`(주체), `aud`(대상), `exp`(만료), 그리고 `repository`·`ref`·`workflow` 같은 GitHub 고유 클레임(claim)이 담긴다. 유효시간이 짧고(수 분) 매 실행마다 새로 발급된다.

**WIF(Workload Identity Federation)** 는 이 외부 발급 OIDC 토큰을 GCP가 **자기 서비스 계정 권한으로 교환**해주는 GCP 기능이다. "외부 신원(GitHub) → 내부 신원(GCP 서비스 계정)"을 연합(federation)하는 다리 역할이라, 저장된 키 없이도 GCP 리소스에 접근할 수 있다.
:::

```
[GitHub Actions] 실행 시 OIDC 토큰 발급 (assertion.repository = "Parkjju/dignify-backend")
        │
        ▼
[WIF 프로바이더] "이 토큰이 우리가 신뢰하는 GitHub에서 왔고,
                  attribute-condition(레포 조건)을 만족하는가?" 검증
        │
        ▼
[서비스 계정] github-deployer@... 를 잠깐 빌려씀 (단기 토큰)
        │
        ▼
[GCP 리소스] Cloud Run 배포 / Artifact Registry push
```

:::tip 키리스의 핵심
저장되는 비밀이 없다. GitHub Secret에는 "어떤 프로바이더/서비스 계정을 쓸지"를 가리키는 **경로 문자열**만 들어가지, 실제 크리덴셜은 없다. 매 실행마다 단기 토큰을 새로 발급받고 즉시 폐기한다.
:::

---

## 2. GCP 설정 (1회)

### ① 배포 전용 서비스 계정 생성

```bash
export PROJECT_ID=dignify-501004
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
export REPO=Parkjju/dignify-backend

gcloud iam service-accounts create github-deployer \
  --project=$PROJECT_ID --display-name="GitHub Actions deployer"
export SA=github-deployer@$PROJECT_ID.iam.gserviceaccount.com
```

배포 작업에만 쓸 전용 계정을 따로 만든다. 최소 권한 원칙 — 이 계정은 딱 배포에 필요한 권한만 갖는다.

### ② 필요한 권한 3개 부여

```bash
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA" --role="roles/iam.serviceAccountUser"
```

| 역할 | 용도 |
|---|---|
| `roles/run.admin` | Cloud Run 서비스 배포/수정 |
| `roles/artifactregistry.writer` | 빌드한 도커 이미지를 Artifact Registry에 push |
| `roles/iam.serviceAccountUser` | Cloud Run이 **런타임 서비스 계정으로 실행**되도록 대리(act-as) 허용 |

:::warning `iam.serviceAccountUser`가 왜 필요한가
Cloud Run 서비스는 실행될 때 특정 런타임 서비스 계정 신원으로 동작한다. 배포하는 계정이 "그 런타임 계정으로 실행되도록 설정"하려면 해당 계정을 대리할 권한이 필요하다. 이게 없으면 배포 시 `PERMISSION_DENIED: iam.serviceaccounts.actAs` 에러가 난다.
:::

### ③ WIF 풀 생성

```bash
gcloud iam workload-identity-pools create github-pool \
  --project=$PROJECT_ID --location=global --display-name="GitHub pool"
```

**풀(Pool)** 은 외부 신원(GitHub, GitLab, AWS 등)을 담는 컨테이너다. "이 프로젝트가 신뢰할 외부 신원들의 그릇"이라고 보면 된다.

### ④ OIDC 프로바이더 생성

```bash
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --project=$PROJECT_ID --location=global \
  --workload-identity-pool=github-pool \
  --display-name="GitHub provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='${REPO}'" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

**프로바이더(Provider)** 는 풀 안에서 "구체적으로 GitHub의 OIDC 토큰을 어떻게 신뢰하고 해석할지"를 정의한다. 각 플래그의 의미:

| 플래그 | 의미 |
|---|---|
| `--issuer-uri` | GitHub Actions OIDC 토큰 발급자 URL. 이 발급자가 서명한 토큰만 신뢰 |
| `--attribute-mapping` | GitHub 토큰의 클레임(`assertion.*`)을 GCP 속성(`attribute.*`)으로 매핑. 예: 토큰의 `repository` 클레임 → `attribute.repository` |
| `--attribute-condition` | **필터.** 이 조건을 만족하는 토큰만 통과. `assertion.repository=='Parkjju/dignify-backend'` = 이 레포에서 온 요청만 허용 |

:::warning attribute-condition은 보안의 핵심
이게 없으면 **GitHub의 아무 레포나** 이 프로바이더를 통해 인증을 시도할 수 있다. `attribute-condition`으로 "우리 레포에서 온 토큰만"으로 좁혀야 한다. 여기에 브랜치 조건(`assertion.ref=='refs/heads/main'`)까지 추가로 걸 수도 있다.
:::

### ⑤ 레포 → 서비스 계정 임퍼소네이션 바인딩

```bash
gcloud iam service-accounts add-iam-policy-binding $SA \
  --project=$PROJECT_ID \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/${REPO}"
```

"WIF 풀을 통해 들어온 **이 레포의 신원**이 `github-deployer` 서비스 계정을 빌려쓸 수 있다"를 명시하는 바인딩이다. `principalSet://`은 "특정 속성을 만족하는 신원들의 집합"을 가리킨다.

:::warning `attribute` vs `attributes` — 실제로 겪은 함정
`principalSet` 경로에서 속성 부분은 **단수 `attribute.repository`** 다. `attributes.repository`(복수)로 쓰면 `INVALID_ARGUMENT: Invalid principalSet member` 에러가 난다. `--attribute-mapping`에서 쓴 `attribute.repository`와 동일한 단수형이다.
:::

### ⑥ GitHub Secret에 넣을 값 출력

```bash
echo "WIF_PROVIDER = projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
echo "DEPLOY_SA    = ${SA}"
```

이 두 값을 GitHub 레포 → Settings → Secrets and variables → Actions에 등록한다. `gh` CLI를 쓰면:

```bash
gh secret set WIF_PROVIDER --body "projects/460750160818/.../providers/github-provider"
gh secret set DEPLOY_SA --body "github-deployer@dignify-501004.iam.gserviceaccount.com"
```

다시 강조하지만, 이 Secret들은 **경로 문자열**일 뿐 크리덴셜이 아니다.

---

## 3. deploy.yml 작성

```yaml
name: deploy

on:
  push:
    branches: [main]

env:
  REGION: us-central1
  SERVICE: dignify-backend
  IMAGE: us-central1-docker.pkg.dev/dignify-501004/dignify/dignify-backend

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: dignify
          POSTGRES_USER: dignify
          POSTGRES_PASSWORD: dignify
        ports: [5432:5432]
        options: >-
          --health-cmd "pg_isready -U dignify" --health-interval 5s
          --health-timeout 5s --health-retries 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
      - run: ./gradlew test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.DEPLOY_SA }}
      - uses: google-github-actions/setup-gcloud@v2
      - run: gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
      - name: build & push
        run: |
          docker build --platform linux/amd64 -t "$IMAGE:$GITHUB_SHA" .
          docker push "$IMAGE:$GITHUB_SHA"
      - name: deploy
        run: |
          gcloud run deploy "$SERVICE" \
            --image "$IMAGE:$GITHUB_SHA" \
            --region "$REGION" \
            --min-instances 1
```

### 각 속성의 의미

| 블록 | 의미 |
|---|---|
| `on: push: branches: [main]` | **트리거** — `main`에 push될 때만 실행 |
| `env` | 워크플로우 전역 환경변수 (리전, 서비스명, 이미지 경로) |
| `services: postgres` | **테스트 job 동안만** 살아있는 Postgres 컨테이너 |
| `options: --health-cmd` | DB가 준비될 때까지 대기 후 스텝 실행 (경쟁 조건 방지) |
| `needs: test` | test job 성공이 deploy job의 **전제 조건** |
| `permissions: id-token: write` | **WIF에 필수** — GitHub이 OIDC 토큰을 발급하도록 허용 |
| `google-github-actions/auth@v2` | Secret의 프로바이더/서비스 계정으로 GCP 인증 (키리스) |
| `configure-docker` | Artifact Registry에 push할 수 있게 도커 인증 설정 |
| `$GITHUB_SHA` | 이미지 태그를 **커밋 해시**로 → 어떤 커밋이 배포됐는지 추적 & 롤백 용이 |

:::tip `id-token: write`를 빼먹으면
WIF 인증이 `Unable to get ACTIONS_ID_TOKEN_REQUEST_URL` 류 에러로 실패한다. GitHub이 OIDC 토큰을 발급하는 것 자체가 이 권한에 달려 있어서, WIF를 쓸 때 반드시 명시해야 한다.
:::

---

## 4. 테스트 DB를 서비스 컨테이너로

이 프로젝트는 별도의 테스트 DB 인스턴스가 없다. 대신 로컬에서 `docker-compose`로 띄운 Postgres에 테스트를 물려 돌린다. (H2는 cascade/flush 순서/제약 동작이 실제 Postgres와 달라 폐기했다.)

`src/test/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dignify
spring.datasource.username=dignify
spring.datasource.password=dignify
spring.jpa.hibernate.ddl-auto=create-drop
```

CI에서는 여기 접속정보와 **완전히 동일한** Postgres를 서비스 컨테이너로 띄워주기만 하면 된다. 그래서 `deploy.yml`의 `services.postgres` env가 `dignify` / `dignify` / `dignify`로 맞춰져 있다.

동작 흐름:

1. GitHub Actions 러너 안에 `postgres:16` 컨테이너를 **임시로** 기동 (localhost:5432)
2. 앱이 뜰 때 `ddl-auto=create-drop`이 **엔티티 클래스 기준으로 테이블을 새로 생성**
3. 빈 DB에서 테스트가 데이터 넣고 검증
4. job 끝나면 컨테이너째 폐기 (다음 실행 땐 또 새 DB)

:::tip 테스트 코드는 손댈 게 없다
`ddl-auto=create-drop`이 스키마를 엔티티에서 파생하므로 별도 마이그레이션이나 시드 스키마가 필요 없다. 로컬 접속정보와 동일한 컨테이너를 CI가 띄워주는 것만으로 로컬과 100% 동일하게 돈다.
:::

:::warning CI 테스트가 검증하지 못하는 것
`create-drop`은 항상 엔티티에서 스키마를 만들므로, 테스트는 "엔티티 ↔ **실제 운영 스키마**가 일치하는지"는 검증하지 못한다. 운영 DB는 `ddl-auto=update`인데, 만약 파괴적 변경(컬럼 삭제/타입 변경/NOT NULL 추가)이 엔티티와 어긋나면 테스트는 초록불인데 배포 후 런타임에서 터질 수 있다. 스키마 변경이 복잡해지면 Flyway 같은 마이그레이션 도구로 넘어가는 게 정석이다.
:::

---

## 5. Cloud Run 무중단 배포 원리

`gcloud run deploy`는 기존 인스턴스를 죽이고 새로 띄우는 게 아니다.

```
[구 리비전 100%] → [신 리비전 기동, 헬스체크] → [신 100% / 구 0%] → [구 리비전 종료]
```

- 새 **리비전(revision)** 을 먼저 띄우고, 헬스체크를 통과하면 트래픽을 100% 새 리비전으로 넘긴다.
- 전환 중에는 두 리비전이 공존하고, 진행 중이던 요청은 구 리비전에서 끝까지 처리된다.
- 그래서 다운타임이 0이다.

`--min-instances 1`로 항상 warm 인스턴스가 있어서, 콜드스타트가 있는 Spring Boot 앱도 전환 시점에 지연 없이 트래픽을 받는다.

:::tip 리비전 = App Engine의 버전
App Engine의 "버전(version)"이 Cloud Run에서는 "리비전(revision)"이다. 개념이 같다. 트래픽을 퍼센트로 쪼개 카나리 배포/즉시 롤백도 동일하게 지원한다.

```bash
# 새 리비전을 트래픽 0으로 배포 (태그 URL로 검증만)
gcloud run deploy dignify-backend --image ... --no-traffic --tag canary
# 10%만 흘리기
gcloud run services update-traffic dignify-backend --to-tags canary=10
# 문제 생기면 구버전으로 즉시 롤백
gcloud run services update-traffic dignify-backend --to-revisions <구리비전>=100
```

지금은 트래픽 규모가 작아 즉시 100% 전환(기본값)이 합리적이고, 카나리는 유저가 늘고 배포 리스크가 커질 때 켜면 된다.
:::

:::warning 무중단의 진짜 함정은 배포가 아니라 스키마
전환 순간 구/신 리비전이 **같은 DB**를 동시에 바라본다. 컬럼 삭제나 NOT NULL 추가 같은 파괴적 변경을 하면 구 리비전이 깨진다. "컬럼 추가는 nullable로 먼저 배포 → 코드 반영 → 나중에 제약 추가" 식의 **확장-수축(expand/contract)** 패턴을 지켜야 진짜 무중단이 된다.
:::

---

## 비용

CI/CD를 붙이는 것 자체는 무료다.

| 항목 | 비용 |
|---|---|
| 서비스 계정 생성 / IAM | 무료 (개수 무제한) |
| WIF 풀 / 프로바이더 | 무료 |
| GitHub Actions 실행 | 퍼블릭 레포 무제한 / 프라이빗 월 2,000분 무료 (1회 ~3분) |
| Artifact Registry 저장 | `$0.10/GB/월`, 무료 0.5GB. 커밋 해시 태그가 쌓이면 정리 정책 필요 |

실질적으로 늘어나는 비용은 Artifact Registry에 쌓이는 이미지 저장료뿐이고, 당분간 무료 한도 안이다. (`--min-instances 1`의 상시 과금은 CI/CD와 무관하게 원래 있던 설정이다.)

---

## 정리

- **WIF**로 서비스 계정 키 없이 GitHub → GCP 인증. 저장되는 비밀이 없고 매 실행마다 단기 토큰을 발급/폐기한다.
- **풀 → 프로바이더 → attribute-condition → 임퍼소네이션 바인딩** 순으로 "우리 레포에서 온 토큰만 이 서비스 계정을 빌려쓴다"를 좁혀나간다.
- `needs: test` + **서비스 컨테이너 Postgres**로, 테스트가 깨지면 배포가 막히는 게이트를 만든다.
- Cloud Run은 리비전 기반으로 **무중단 배포**를 기본 제공하고, 진짜 위험은 배포가 아니라 스키마 변경이다.
