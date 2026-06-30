---
title: Snack - [GCP] Cloud SQL Auth Proxy로 로컬에서 Cloud SQL에 연결하기
tags: ['GCP', 'DevOps', 'CloudRun']
---

## 왜 필요한가

Cloud Run에서 iTunes API를 호출하면 Broken pipe 에러가 발생한다. Apple이 GCP 등 클라우드 데이터센터 IP 대역에서 오는 요청을 차단하기 때문이다.

```
Cloud Run → iTunes API ❌ (GCP IP 차단)
로컬 맥북  → iTunes API ✅ (일반 가정용 IP 허용)
```

그래서 크론잡(iTunes 브루트포스 수집)은 **로컬에서 실행**해야 한다. 그런데 수집한 데이터는 Cloud SQL(운영 DB)에 적재해야 한다.

```
로컬 맥북 → iTunes API ✅
로컬 맥북 → Cloud SQL  ✅ (이 연결이 필요)
```

로컬에서 Cloud SQL에 직접 연결하려면 **Cloud SQL Auth Proxy**가 필요하다.

---

## Cloud SQL Auth Proxy란

Cloud SQL에 안전하게 접속할 수 있는 터널 프로그램이다.

```
로컬 앱 → localhost:5433 → [Cloud SQL Auth Proxy] → Cloud SQL
```

앱 입장에서는 그냥 `localhost:5433`에 있는 PostgreSQL에 연결하는 것처럼 보이지만, 실제로는 Cloud SQL Auth Proxy가 GCP 인증을 처리하고 Cloud SQL로 안전하게 포워딩해준다.

이 방식의 장점:
- Cloud SQL에 공인 IP를 직접 열어두지 않아도 된다 (보안)
- 별도의 SSL 설정 없이 암호화된 연결이 자동으로 이루어진다
- GCP 계정 인증(ADC)을 통해 접근 권한을 제어한다

:::tip Application Default Credentials (ADC)
Cloud SQL Auth Proxy는 GCP 리소스에 접근할 권한을 "애플리케이션 기본 인증(ADC)"을 통해 확인한다. ADC는 `gcloud auth application-default login`으로 설정하며, 설정된 인증 정보는 `~/.config/gcloud/application_default_credentials.json`에 저장된다. 이후 Cloud SQL Proxy, gcloud CLI 등 GCP 관련 도구들이 이 파일을 자동으로 참조한다.
:::

---

## 전체 흐름

```
[터미널 1] cloud-sql-proxy 실행
               ↓ localhost:5433으로 터널 개방
[터미널 2] Spring Boot 실행 (DB_PORT=5433)
               ↓ localhost:5433 → Cloud SQL 연결
[터미널 3] curl로 크론잡 트리거
               ↓
          iTunes API 호출 → 트랙 수집 → Cloud SQL 적재
```

---

## 설치 및 실행

### 1. ADC 인증 설정 (최초 1회)

```bash
gcloud auth application-default login
```

브라우저가 열리지 않는 환경이면:

```bash
gcloud auth application-default login --no-browser
```

터미널에 출력되는 URL을 브라우저에서 열어 로그인하고, 브라우저에서 받은 리다이렉트 URL(`https://localhost:8085/?...`)을 터미널에 붙여넣으면 완료된다.

### 2. Cloud SQL Auth Proxy 설치

```bash
brew install cloud-sql-proxy
```

### 3. 터미널 1 — 터널 실행

```bash
cloud-sql-proxy PROJECT_ID:REGION:INSTANCE_NAME --port=5433
```

성공하면 아래 로그가 찍힌다:

```
Authorizing with Application Default Credentials
[PROJECT:REGION:INSTANCE] Listening on 127.0.0.1:5433
The proxy has started successfully and is ready for new connections!
```

이 터미널은 크론잡이 끝날 때까지 계속 열어둬야 한다.

### 4. 터미널 2 — Spring Boot 실행

`.env` 파일에 `JWT_SECRET`, `CRON_SECRET` 등이 있다면:

```bash
set -a && source .env && set +a && DB_PORT=5433 ./gradlew bootRun
```

- `set -a`: 이후 정의되는 변수를 자동으로 환경변수로 export
- `source .env`: .env 파일의 변수들을 현재 셸에 로드
- `set +a`: 자동 export 모드 종료
- `DB_PORT=5433`: 로컬 기본값(5432) 대신 프록시 포트(5433)로 오버라이드

`application.properties`의 DB URL 구조:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:dignify}}
```

`DB_URL`이 없으면 `DB_HOST`/`DB_PORT`/`DB_NAME`으로 TCP 연결을 구성한다. `DB_PORT=5433`만 오버라이드하면 프록시로 연결된다.

### 5. 터미널 3 — 크론잡 트리거

앱이 뜨면 (`Started DignifyApplication` 로그 확인 후):

```bash
curl -X POST http://localhost:8080/internal/cron/collect \
  -H "X-Cron-Secret: YOUR_CRON_SECRET"
```

202 응답이 오면 터미널 2 로그에서 배치 진행 상황을 확인할 수 있다:

```
Batch 1/100 done — processed: 12, lastId: 200
Batch 2/100 done — processed: 8, lastId: 400
...
```

Cloud SQL Studio에서 적재 확인:

```sql
SELECT COUNT(*) FROM tracks;
```

---

## 주의사항

- Cloud SQL Auth Proxy 터미널을 닫으면 DB 연결이 끊겨 Spring Boot가 에러를 낸다.
- `DB_PORT=5433`은 프록시가 열려있을 때만 유효하다. 로컬 도커 PostgreSQL(5432)과 동시에 사용할 경우 포트 충돌을 피하기 위해 다른 포트를 지정한다.
- ADC 인증은 유효 기간이 있다. 오랫동안 사용하지 않으면 재인증(`gcloud auth application-default login`)이 필요할 수 있다.
