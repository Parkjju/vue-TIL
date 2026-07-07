---
title: Snack - [GCP] Cloud Run + Cloud SQL 배포 명령어 정리
tags: ['GCP', 'DevOps', 'CloudRun']
---

## 개요

Spring Boot 앱을 GCP Cloud Run에 배포하고, Cloud SQL(PostgreSQL)과 연결하는 전체 과정을 명령어 단위로 정리한다. Cloud Scheduler로 크론잡 트리거까지 세팅하는 것까지 포함한다.

---

## 1. GCP 프로젝트 설정

```bash
gcloud config set project PROJECT_ID
```

`gcloud projects list`로 프로젝트 ID를 먼저 확인한다. 콘솔 URL(`console.cloud.google.com/...?project=PROJECT_ID`)에서도 확인 가능하다.

:::tip 프로젝트 ID vs 프로젝트 이름
GCP 콘솔에서 보이는 이름(예: "Dignify")과 실제 프로젝트 ID(예: `dignify-501004`)는 다를 수 있다. gcloud 명령어에는 항상 프로젝트 **ID**를 써야 한다.
:::

---

## 2. 필요한 API 활성화

```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudscheduler.googleapis.com
```

GCP는 서비스별로 API를 명시적으로 켜야 사용할 수 있다. 활성화 자체는 무료다.

| API | 용도 |
|---|---|
| `run.googleapis.com` | Cloud Run — 컨테이너 실행 |
| `sqladmin.googleapis.com` | Cloud SQL — PostgreSQL 관리 |
| `artifactregistry.googleapis.com` | Docker 이미지 저장소 |
| `cloudscheduler.googleapis.com` | 크론잡 스케줄러 |

---

## 3. Artifact Registry — Docker 저장소 생성

```bash
gcloud artifacts repositories create REPO_NAME \
  --repository-format=docker \
  --location=REGION
```

Docker 이미지를 올려둘 저장소다. ECR(AWS), Docker Hub와 동일한 역할.

- `--location`: Cloud Run과 **같은 리전**으로 설정해야 한다. 리전이 다르면 이미지를 pull할 때 네트워크 비용이 발생하고 속도도 느리다.
- 비용: $0.10/GB/월. 이미지 1개 기준 약 $0.05/월 수준.

### Docker 인증 설정

```bash
gcloud auth configure-docker REGION-docker.pkg.dev
```

로컬 Docker가 Artifact Registry에 push/pull할 수 있도록 인증을 연결한다. 처음 한 번만 실행하면 된다.

---

## 4. Cloud SQL 인스턴스 + DB + 유저 생성

```bash
# 인스턴스 생성 (3~5분 소요)
gcloud sql instances create INSTANCE_NAME \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=REGION \
  --edition=ENTERPRISE
```

- `--tier=db-f1-micro`: 가장 저렴한 스펙 (공유 vCPU, RAM 0.6GB). 토이 프로젝트 수준이면 충분하다.
- `--edition=ENTERPRISE`: GCP Cloud SQL은 현재 Enterprise / Enterprise Plus 두 에디션이 있다. `db-f1-micro` 같은 소형 머신은 Enterprise에서만 지원된다. `--edition`을 명시하지 않으면 GCP가 Enterprise Plus로 생성하려 하고, 소형 머신 티어가 지원되지 않아 에러가 난다.
- 비용: db-f1-micro Enterprise 기준 **약 $7.65/월**. 인스턴스가 켜져 있는 동안 요청 유무와 관계없이 과금된다.

:::warning Cloud SQL은 항상 켜져있는 비용이다
Cloud Run은 요청이 없으면 과금이 없지만, Cloud SQL은 인스턴스가 살아있는 동안 계속 과금된다. 개발/테스트가 끝나면 인스턴스를 중지하거나 삭제하는 걸 잊지 말자.
:::

```bash
# DB 생성
gcloud sql databases create DB_NAME --instance=INSTANCE_NAME

# 유저 생성
gcloud sql users create DB_USER \
  --instance=INSTANCE_NAME \
  --password=DB_PASSWORD
```

---

## 5. Docker 이미지 빌드 & 푸시

```bash
IMAGE=REGION-docker.pkg.dev/PROJECT_ID/REPO_NAME/APP_NAME

docker build --platform linux/amd64 -t $IMAGE .
docker push $IMAGE
```

- `--platform linux/amd64`: M1/M2 Mac은 기본적으로 arm64 아키텍처로 빌드된다. Cloud Run은 linux/amd64 환경이므로 이 옵션을 반드시 명시해야 한다. 없으면 Cloud Run에서 실행 불가.

---

## 6. Cloud Run 배포

### 인스턴스 연결 이름(connectionName) 조회

```bash
INSTANCE_CONNECTION_NAME=$(gcloud sql instances describe INSTANCE_NAME \
  --format='value(connectionName)')

echo $INSTANCE_CONNECTION_NAME
# 출력 예: dignify-501004:us-central1:dignify
```

`connectionName`은 `PROJECT_ID:REGION:INSTANCE_NAME` 형태의 문자열이다. Cloud Run이 Cloud SQL 소켓을 마운트할 때 이 값으로 인스턴스를 식별한다.

- `--format='value(connectionName)'`: gcloud describe 결과에서 `connectionName` 필드만 추출하는 옵션. 전체 JSON 출력 대신 값만 꺼내서 셸 변수에 바로 담는다.

### Cloud Run 서비스 배포

```bash
gcloud run deploy APP_NAME \
  --image=REGION-docker.pkg.dev/PROJECT_ID/REPO_NAME/APP_NAME \
  --region=REGION \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=$INSTANCE_CONNECTION_NAME \
  --set-env-vars="\
DB_URL=jdbc:postgresql:///DB_NAME?cloudSqlInstance=${INSTANCE_CONNECTION_NAME}&socketFactory=com.google.cloud.sql.postgres.SocketFactory,\
DB_USERNAME=DB_USER,\
DB_PASSWORD=DB_PASSWORD,\
JWT_SECRET=JWT_SECRET_VALUE,\
CRON_SECRET=CRON_SECRET_VALUE"
```

**배포 옵션:**

- `--platform=managed`: GCP가 인프라를 완전 관리하는 모드. 서버 관리 불필요.
- `--allow-unauthenticated`: iOS 클라이언트 등 외부에서 API를 인증 없이 호출할 수 있도록 공개 접근 허용.
- `--add-cloudsql-instances=$INSTANCE_CONNECTION_NAME`: Cloud Run 컨테이너 안에 `/cloudsql/...` 유닉스 소켓을 마운트하고 빌트인 프록시를 띄운다. 단, 이 문서는 아래처럼 소켓 팩토리 라이브러리(`socketFactory=`)로 붙기 때문에 마운트된 이 소켓은 실제로 쓰이지 않는다 — 플래그가 있어도 무해하지만 이 구성에선 중복이다. (자세한 관계는 아래 '설정' 절 참고)

**환경변수(`--set-env-vars`):**

| 변수 | 값 | 설명 |
|---|---|---|
| `DB_URL` | `jdbc:postgresql:///DB_NAME?cloudSqlInstance=...&socketFactory=...` | 소켓 팩토리 방식 JDBC URL. `application.properties`에서 이 값이 있으면 TCP fallback을 무시하고 이 URL을 사용한다. |
| `DB_USERNAME` | Cloud SQL 유저명 | `gcloud sql users create`로 만든 유저 |
| `DB_PASSWORD` | Cloud SQL 비밀번호 | 유저 생성 시 설정한 비밀번호 |
| `JWT_SECRET` | 임의의 시크릿 문자열 | access/refresh token 서명용 HS256 키 |
| `CRON_SECRET` | 임의의 시크릿 문자열 | `/internal/cron/collect` 엔드포인트 인증 헤더 값 |

:::tip DB_URL의 `///` (슬래시 3개)
`jdbc:postgresql:///DB_NAME` — 호스트 부분이 비어있다(`//` 다음 바로 `/DB_NAME`). TCP 방식이라면 `//localhost:5432/DB_NAME`처럼 호스트를 명시하지만, 소켓 팩토리 방식은 접속 대상을 호스트:포트가 아니라 `socketFactory`·`cloudSqlInstance` 파라미터가 정하므로 호스트를 생략한다. 소켓 팩토리가 `cloudSqlInstance` 값으로 인스턴스를 식별해 직접 mTLS 연결을 연다(마운트된 `/cloudsql` 소켓을 쓰는 게 아니다).
:::

- 비용: 요청이 없으면 과금 없음. 요청 수 + CPU 사용 시간 기준 과금. 트래픽이 거의 없는 수준이면 **$0~1/월**.

### Cloud SQL 접속 방식

Cloud Run에서 Cloud SQL에 붙는 방식은 **두 개의 독립된 축**으로 갈린다. 헷갈리기 쉬운데, 이 둘은 서로 별개이며 조합해서 쓴다.

- **① 인터페이스** — 앱이 무엇에 대고 붙느냐
- **② 경로** — 트래픽이 어느 IP로 나가느냐

#### ① 인터페이스

| 방식 | 실제 동작 | 설정 |
|---|---|---|
| 소켓 팩토리 라이브러리 (이 문서) | 자바 라이브러리가 Admin API로 인증서를 받아 **자체 mTLS 연결**을 연다. OS 유닉스 소켓이 아니다. | 의존성 추가 + JDBC URL 변경 |
| 유닉스 소켓 (`/cloudsql/...`) | `--add-cloudsql-instances`가 마운트한 소켓 파일에 붙는다. 빌트인 프록시가 뒤에서 중계. | URL에 `host=/cloudsql/...` |
| TCP 직결 | 인스턴스 IP:5432로 직접 TCP 접속 | IP·인증 직접 관리 |

:::warning "socket factory"는 유닉스 소켓이 아니다
이름 때문에 오해하기 쉽다. 여기서 `SocketFactory`는 자바에서 `Socket`(TCP 연결) 객체를 만드는 표준 인터페이스 `javax.net.SocketFactory`의 이름일 뿐, OS의 유닉스 도메인 소켓과 무관하다. `com.google.cloud.sql.postgres.SocketFactory`는 마운트된 `/cloudsql/...` 소켓을 **쓰지 않고**, Cloud SQL Admin API로 인스턴스 주소·임시 인증서를 받아 **직접 mTLS/TCP 연결**을 연다.
:::

#### ② 경로

| | 기본값 | 조건 |
|---|---|---|
| 공인 IP | ✅ 소켓 팩토리 기본값 | 별도 설정 없음 |
| 사설 IP (VPC) | 옵션 | `ipTypes=PRIVATE` + 인스턴스 사설 IP + VPC 연결 |

이 문서 구성은 **소켓 팩토리 + 공인 IP**다. VPC는 켜지 않았다.

#### 실제 통신 흐름 — 로컬 유닉스 소켓과 헷갈리지 말 것

로컬 개발의 유닉스 소켓과 Cloud Run의 소켓 팩토리는 겉보기만 비슷하고 실체가 다르다.

**로컬 Postgres (진짜 유닉스 소켓)** — 같은 머신, 네트워크 안 탐:

```
앱 → /var/run/postgresql/.s.PGSQL.5432 → postgres (DB 본체)
```

소켓 파일 반대편에 DB 본체가 직접 있어 네트워크를 거치지 않는다. TCP보다 빠르고 파일 권한으로 접근을 통제한다. **이 설명은 로컬에서만 참이다.**

**Cloud Run 소켓 팩토리** — Cloud SQL은 원격 머신이라 네트워크를 반드시 건넌다:

```
앱 → 소켓 팩토리(라이브러리) → mTLS/TCP → Cloud SQL (원격, 기본 공인 IP)
```

Cloud Run에서는 "네트워크를 안 탄다"가 성립하지 않는다. 보안 이점은 *공인 IP가 없어서*가 아니라, 라이브러리가 **mTLS 암호화 + IAM 인증**을 걸어주기 때문이다. 공인 IP로 나가더라도 인증된 클라이언트만 붙을 수 있다. 공인 IP 노출 자체를 없애려면 위 ②에서 사설 IP + VPC로 경로를 바꾼다.

:::tip mTLS (mutual TLS)
일반 TLS(HTTPS)는 **서버만** 인증서로 신원을 증명하고 클라이언트는 익명이다. mTLS는 여기에 더해 **클라이언트도 인증서를 제시**해 서로(mutual) 신원을 검증한다. 즉 "서버가 진짜 그 Cloud SQL인지" + "클라이언트가 허가된 앱인지"를 양방향으로 확인하고 통신을 암호화한다. 소켓 팩토리가 Admin API에서 받아온 임시 인증서로 이 과정을 자동 처리하므로, 공인 IP로 나가도 아무나 붙을 수 없다.
:::

#### 설정

소켓 팩토리를 쓰려면 `build.gradle`에 의존성을 추가하고, JDBC URL을 소켓 팩토리 형식으로 작성한다.

```gradle
implementation 'com.google.cloud.sql:postgres-socket-factory:1.14.0'
```

```
# Cloud Run용 DB URL
jdbc:postgresql:///DB_NAME?cloudSqlInstance=PROJECT:REGION:INSTANCE&socketFactory=com.google.cloud.sql.postgres.SocketFactory
```

`jdbc:postgresql:///DB_NAME`에서 호스트가 비어 있는 이유는, 접속 대상을 호스트:포트가 아니라 `socketFactory`·`cloudSqlInstance` 파라미터가 정하기 때문이다. 소켓 팩토리가 `cloudSqlInstance` 값으로 인스턴스를 식별해 mTLS 연결을 연다.

로컬에서는 기존 TCP URL을 그대로 쓰고, Cloud Run에서만 이 URL을 환경변수로 주입한다.

```properties
# application.properties
# DB_URL이 있으면 그 값 사용, 없으면 TCP fallback
spring.datasource.url=${DB_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:dignify}}
```

:::tip `--add-cloudsql-instances`와의 관계
이 플래그는 `/cloudsql/...` 유닉스 소켓을 마운트하는 **별개 방식**이다. 위처럼 URL에 `socketFactory=`를 쓰면 라이브러리가 자체 연결을 열기 때문에 마운트된 소켓은 사용되지 않는다(플래그가 있어도 무해하지만 이 구성에선 중복). 반대로 소켓 팩토리 라이브러리 없이 붙으려면, 이 플래그로 마운트한 뒤 URL에 `host=/cloudsql/PROJECT:REGION:INSTANCE`를 지정하면 된다.
:::

#### 세 가지 연결 방식을 하나로 — "앞단만 다르고 뒷단은 같다"

여기까지 등장한 연결 방식이 사실 세 가지다. 로컬 크론잡([Cloud SQL Auth Proxy 문서](./260629-cloud-sql-proxy.md))까지 합치면 전부 **"프록시를 어디에 두고 앱이 그 앞단에 뭘로 붙느냐"만 다르고, 프록시 뒷단(→ Cloud SQL)은 셋 다 똑같이 TCP mTLS:3307**이다.

| 방식 | 프록시 위치 | 앱이 붙는 곳(앞단) | 뒷단(→ Cloud SQL) |
|---|---|---|---|
| 크론잡 (로컬) | 독립 `cloud-sql-proxy` **프로세스** (스크립트가 띄움) | `localhost:5433` 평문 TCP | TCP mTLS:3307 |
| Cloud Run (이 문서) | **소켓 팩토리 라이브러리** (앱 JVM 내장) | 없음 — 앱이 직결 | TCP mTLS:3307 |
| 유닉스 소켓 마운트 | Cloud Run 관리 프록시 (같은 인스턴스 사이드카) | `/cloudsql/...` 소켓 파일 | TCP mTLS:3307 |

- **앞단이 다른 이유**: 프록시를 프로세스로 띄우면 로컬 포트(TCP)로, 소켓을 마운트하면 소켓 파일(IPC)로, 라이브러리로 흡수하면 앞단 자체가 없다.
- **뒷단이 같은 이유**: 프록시는 어차피 **다른 인스턴스인 Cloud SQL로 나가야** 하고, 네트워크 경계를 넘는 방법은 TCP mTLS 하나뿐이라 선택지가 없다.
- 소켓 팩토리 방식은 "프록시가 없다"기보다 **프록시가 하던 일을 앱 JVM 안 라이브러리가 흡수**해 홉을 하나 줄인 형태로 보면 된다.

:::warning "유닉스 소켓 마운트 = IPC로 Cloud SQL과 통신"은 오해
유닉스 도메인 소켓(IPC)은 **같은 커널을 공유하는 프로세스끼리만** 가능한 로컬 통신이다. Cloud Run과 Cloud SQL은 **물리적으로 다른 인스턴스**이므로 소켓 파일로 직접 붙을 수 없다. 그래서 IPC 구간은 **앱 ↔ 같은 인스턴스 안의 관리 프록시**까지이고, 그 프록시가 인스턴스 경계를 넘는 순간 **네트워크 TCP mTLS**로 바뀐다. 즉 소켓 마운트 방식도 "끝까지 IPC"가 아니라 **로컬 IPC(앞단) + 네트워크 TCP mTLS(뒷단)** 의 조합이다.
:::

#### Admin API의 역할 vs 실제 암호화 주체

mTLS를 얘기할 때 가장 헷갈리는 지점이 "Cloud SQL Admin API가 암호화를 해준다"는 오해다. **Admin API는 암호화를 하지 않는다 — 재료만 내주는 창구다.**

| | 담당 | 하는 일 |
|---|---|---|
| Cloud SQL Admin API | 재료 조달 | ① 인스턴스 IP/메타데이터 ② **짧은 수명의 클라이언트 인증서** 발급. 연결 데이터 경로엔 끼지 않고, 연결 *전에* 호출된다 |
| 프록시 / 소켓 팩토리 | 실제 암호화 | 그 인증서로 **mTLS 핸드셰이크**를 수행하고, 소켓을 유지하며 **트래픽을 암호화**한다 |

즉 **Admin API = 인증서 발급소, 실제 mTLS 암호화 = 프록시(또는 라이브러리)**. 프록시가 Cloud SQL에 붙기 직전 Admin API에 IP/메타데이터**와 임시 클라이언트 인증서**를 요청하고, 그 인증서로 양방향 인증을 수행한다. IP만으론 mTLS가 성립하지 않는다 — 클라이언트 인증서가 있어야 "나는 허가된 접속자"임을 증명할 수 있다.

:::tip TCP 핸드셰이크 vs TLS 핸드셰이크는 다른 층위다
"TCP도 3-way 핸드셰이크가 있는데 TLS랑 같은 거냐"는 흔한 질문. 둘은 경쟁이 아니라 **순차로 겹쳐** 일어난다.

```
1. TCP 3-way    : SYN → SYN-ACK → ACK      ← L4, "관을 연다"
2. TLS 핸드셰이크 : 인증서 교환·키 협상        ← TCP 위에서, "관을 암호화한다"
3. 실제 데이터   : 암호화된 트래픽
```

TCP는 밑바닥 연결(관)을 뚫는 전송 계층이고, TLS/mTLS는 **그 관 위에 얹혀** 암호화를 협상하는 상위 절차다. TCP 핸드셰이크가 끝나야 TLS 핸드셰이크를 시작할 수 있다. "프록시 → Cloud SQL의 TCP mTLS:3307"은 곧 *3307로 TCP 연결(1) → 그 위에서 mTLS 핸드셰이크(2) → 암호화 통신(3)* 이라는 뜻이다.
:::

---

## 7. Cloud Scheduler — 크론잡 트리거

```bash
CLOUD_RUN_URL=$(gcloud run services describe APP_NAME \
  --region=REGION \
  --format='value(status.url)')

gcloud scheduler jobs create http JOB_NAME \
  --location=REGION \
  --schedule="0 2 * * *" \
  --time-zone="America/Phoenix" \
  --uri="${CLOUD_RUN_URL}/internal/cron/collect" \
  --http-method=POST \
  --headers="X-Cron-Secret=CRON_SECRET_VALUE"
```

- `--schedule="0 2 * * *"`: 매일 새벽 2시 (cron 표현식)
- `--time-zone`: 기준 시간대. 생략하면 UTC 기준.
- `--headers`: 크론잡 엔드포인트의 인증용 시크릿 헤더.
- 비용: 월 3개 job까지 무료.

### 수동 실행으로 테스트

```bash
gcloud scheduler jobs run JOB_NAME --location=REGION
```

---

## 8. 배포 후 로그 확인

```bash
gcloud run services logs tail APP_NAME --region=REGION
```

---

## 월 예상 비용 요약

| 서비스 | 비용 |
|---|---|
| Cloud SQL db-f1-micro | ~$7.65/월 |
| Cloud Run | ~$0~1/월 |
| Artifact Registry | ~$0.05/월 |
| Cloud Scheduler | 무료 (3개 이하) |
| **합계** | **~$8~9/월** |

예산 알림은 GCP 콘솔 → 결제 → 예산 및 알림에서 설정할 수 있다. 단, GCP는 예산 초과 시 서비스를 자동으로 중단하지 않고 이메일 알림만 보낸다. 강제 차단이 필요하면 별도 자동화가 필요하다.
