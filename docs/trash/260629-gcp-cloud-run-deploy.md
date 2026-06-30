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
- `--add-cloudsql-instances=$INSTANCE_CONNECTION_NAME`: Cloud Run 컨테이너 안에 Cloud SQL 유닉스 소켓 경로를 마운트한다. 이 옵션이 없으면 소켓 경로 자체가 존재하지 않아 DB 연결 불가.

**환경변수(`--set-env-vars`):**

| 변수 | 값 | 설명 |
|---|---|---|
| `DB_URL` | `jdbc:postgresql:///DB_NAME?cloudSqlInstance=...&socketFactory=...` | 소켓 팩토리 방식 JDBC URL. `application.properties`에서 이 값이 있으면 TCP fallback을 무시하고 이 URL을 사용한다. |
| `DB_USERNAME` | Cloud SQL 유저명 | `gcloud sql users create`로 만든 유저 |
| `DB_PASSWORD` | Cloud SQL 비밀번호 | 유저 생성 시 설정한 비밀번호 |
| `JWT_SECRET` | 임의의 시크릿 문자열 | access/refresh token 서명용 HS256 키 |
| `CRON_SECRET` | 임의의 시크릿 문자열 | `/internal/cron/collect` 엔드포인트 인증 헤더 값 |

:::tip DB_URL의 `///` (슬래시 3개)
`jdbc:postgresql:///DB_NAME` — 호스트 부분이 비어있다(`//` 다음 바로 `/DB_NAME`). TCP 방식이라면 `//localhost:5432/DB_NAME`처럼 호스트를 명시하지만, 유닉스 소켓 방식은 호스트 대신 소켓 파일 경로를 사용하므로 호스트를 생략한다. `socketFactory` 파라미터가 있으면 소켓 팩토리가 `cloudSqlInstance` 값을 보고 마운트된 소켓 경로를 자동으로 찾아서 연결한다.
:::

- 비용: 요청이 없으면 과금 없음. 요청 수 + CPU 사용 시간 기준 과금. 트래픽이 거의 없는 수준이면 **$0~1/월**.

### Cloud SQL 소켓 연결 방식

Cloud Run에서 Cloud SQL에 접속하는 방식은 두 가지다.

| 방식 | 보안 | 설정 복잡도 |
|---|---|---|
| 유닉스 소켓 (socket factory) | 공인 IP 불필요, VPC 내부 통신 | 의존성 추가 + URL 변경 필요 |
| TCP + 공인 IP | 공인 IP 필요 | 단순하지만 덜 안전 |

#### TCP vs 유닉스 소켓

**TCP**는 앱이 DB에 연결할 때 네트워크를 통해 `IP:PORT`로 찾아가는 방식이다. 로컬에서 `localhost:5432`로 접속하는 것도 TCP다.

```
앱 → 네트워크 → IP:PORT → DB 서버
```

**유닉스 소켓**은 같은 머신(또는 같은 컨테이너 환경) 안에서 파일을 통해 통신하는 방식이다. `/var/run/postgresql/.s.PGSQL.5432` 같은 특수 파일이 소켓 역할을 한다. 네트워크를 거치지 않아 TCP보다 빠르고, 공인 IP가 없어 외부에서 직접 접근할 수 없다.

```
앱 → 파일 경로 → DB 서버
```

**Cloud Run에서 소켓 방식을 쓰는 이유**: `--add-cloudsql-instances`를 붙이면 GCP가 컨테이너 안에 소켓 파일을 직접 마운트해준다.

```
Cloud Run 컨테이너 내부
  /cloudsql/PROJECT:REGION:INSTANCE  ← 소켓 파일이 이 경로에 마운트됨
```

그래서 DB_URL에서 호스트:포트 대신 이 소켓 파일 경로로 연결한다. `jdbc:postgresql:///DB_NAME`에서 호스트를 비워두는 게 "소켓 파일 경로로 연결하겠다"는 의미다. `socketFactory` 파라미터가 `cloudSqlInstance` 값을 보고 위 경로를 자동으로 찾아 연결한다.

소켓 방식을 사용하려면 `build.gradle`에 의존성을 추가하고, JDBC URL을 소켓 팩토리 형식으로 작성해야 한다.

```gradle
implementation 'com.google.cloud.sql:postgres-socket-factory:1.14.0'
```

```
# Cloud Run용 DB URL
jdbc:postgresql:///DB_NAME?cloudSqlInstance=PROJECT:REGION:INSTANCE&socketFactory=com.google.cloud.sql.postgres.SocketFactory
```

로컬에서는 기존 TCP URL을 그대로 쓰고, Cloud Run에서만 이 URL을 환경변수로 주입하면 된다.

```properties
# application.properties
# DB_URL이 있으면 그 값 사용, 없으면 TCP fallback
spring.datasource.url=${DB_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:dignify}}
```

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
