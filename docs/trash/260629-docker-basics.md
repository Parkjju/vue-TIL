---
title: Snack - [Docker] 도커 기초 개념부터 Spring Boot + PostgreSQL 로컬 환경 세팅까지
tags: ['Docker', 'Spring Boot', 'PostgreSQL', 'DevOps']
---

## 도커란?

> "내 맥에서 돌아가는 걸, 다른 어떤 환경에서도 똑같이 돌아가게 해주는 기술"

Java 버전, DB 버전, 환경변수 설정이 환경마다 달라서 생기는 "내 맥에선 됐는데 서버에서 안 돼요" 문제를 해결한다. 앱 실행에 필요한 모든 것을 하나의 **이미지**로 패키징해서 어디서든 동일하게 실행할 수 있다.

### 핵심 개념 3가지

| 개념 | 설명 |
|---|---|
| **이미지** | 앱 실행에 필요한 모든 것을 담은 설계도/스냅샷. 읽기 전용 |
| **컨테이너** | 이미지를 실제로 실행한 인스턴스. 이미지:컨테이너 = 클래스:객체 |
| **Dockerfile** | 이미지를 만드는 레시피 파일 |

---

## Dockerfile

이미지를 만드는 단계별 지시문 파일이다. 각 줄이 하나의 명령어이고 위에서 아래로 순서대로 실행된다.

### 주요 명령어

| 명령어 | 의미 |
|---|---|
| `FROM` | 베이스 이미지 지정 |
| `WORKDIR` | 컨테이너 안의 작업 디렉토리 설정. 없으면 자동 생성 |
| `COPY` | 로컬 파일 → 컨테이너 안으로 복사 |
| `RUN` | 이미지 빌드 중 실행할 명령어 |
| `EXPOSE` | 컨테이너가 사용할 포트 선언 |
| `ENTRYPOINT` | 컨테이너 시작 시 실행할 명령어 |

### COPY 문법

```dockerfile
COPY <로컬 경로> <컨테이너 경로>
COPY build.gradle settings.gradle gradlew ./   # 여러 파일을 한 번에 복사
COPY src src                                    # 폴더 구조 유지하려면 이름 명시
```

- 마지막 인자가 항상 목적지
- 로컬 경로 기준은 Dockerfile이 있는 디렉토리
- `./`와 `.`은 동일하게 현재 디렉토리를 의미

### 멀티스테이지 빌드

Spring Boot 앱은 빌드 단계와 실행 단계가 다르다.

```
빌드: Gradle로 .jar 생성  → JDK 필요 (컴파일러 포함, ~400MB)
실행: .jar 파일 실행       → JRE만 있으면 됨 (~200MB)
```

하나의 Dockerfile에 `FROM`을 두 번 써서 두 단계를 분리한다. 최종 이미지에는 2단계만 포함된다.

```dockerfile
# 1단계: 빌드
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY build.gradle settings.gradle gradlew ./
COPY gradle gradle
RUN ./gradlew dependencies --no-daemon
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# 2단계: 실행
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

:::tip 의존성을 소스코드보다 먼저 복사하는 이유
도커는 각 명령어를 캐싱한다. `build.gradle`이 바뀌지 않으면 의존성 다운로드 단계는 캐시를 재사용한다. 소스코드를 먼저 복사하면 코드가 바뀔 때마다 의존성을 매번 새로 다운로드하게 된다.
:::

:::tip `--no-daemon` 옵션
Gradle은 기본적으로 데몬 프로세스를 백그라운드에 띄운다. 도커 빌드는 일회성이라 데몬이 필요 없고, 오히려 컨테이너 종료 시 문제가 생길 수 있어서 붙인다.
:::

:::tip `-x test` 옵션
도커 빌드 환경에는 `JWT_SECRET` 등 환경변수와 DB 연결이 없어서 통합 테스트가 실패할 수 있다. 테스트는 로컬 IDE나 CI 파이프라인에서 별도로 실행하고, 이미지 빌드에서는 제외한다.
:::

:::warning bootJar와 plain jar
`bootJar`를 실행하면 `*.jar`와 `*-plain.jar` 두 파일이 생성될 수 있다. `COPY --from=build /app/build/libs/*.jar`가 두 파일에 매칭되어 오류가 발생한다. `build.gradle`에 아래를 추가해 plain jar 생성을 막는다.

```groovy
jar {
    enabled = false
}
```
:::

### jar vs bootJar

| | 설명 |
|---|---|
| `jar` | 소스코드만 패키징. 실행 시 의존성 라이브러리 별도 필요 |
| `bootJar` | 소스코드 + 의존성 전부 패키징 (fat jar). `java -jar` 하나로 실행 가능 |

### ENTRYPOINT 형식

```dockerfile
ENTRYPOINT ["java", "-jar", "app.jar"]
# 배열의 각 요소가 공백으로 합쳐져 하나의 명령어로 실행됨
# → java -jar app.jar
```

---

## docker-compose

여러 컨테이너를 한 번에 정의하고 실행하는 도구다. `docker run`으로 각 컨테이너를 따로 띄우는 번거로움을 해결한다.

### 핵심 개념

**ports (포트 매핑)**

```yaml
ports:
  - "5432:5432"   # 내 맥 포트:컨테이너 내부 포트
```

컨테이너는 격리된 환경이라 외부에서 접근하려면 포트를 열어줘야 한다.

**volumes (볼륨)**

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
  # named volume 이름 : 컨테이너 내부 경로
```

컨테이너가 꺼지면 내부 데이터가 사라진다. 볼륨으로 컨테이너 외부에 데이터를 영구 저장한다. PostgreSQL은 컨테이너 내부의 `/var/lib/postgresql/data`에 항상 데이터를 저장하는데, 도커 엔진이 이 경로를 가로채서 named volume으로 리다이렉트한다.

| 볼륨 종류 | 설명 | 이식성 |
|---|---|---|
| Named Volume | 도커 엔진이 관리하는 추상화된 볼륨 | 어디서든 동작 |
| Bind Mount | 로컬 절대경로를 직접 마운트 | 경로가 하드코딩되어 환경마다 다름 |

**depends_on + healthcheck**

```yaml
app:
  depends_on:
    postgres:
      condition: service_healthy
```

컨테이너가 시작됐다고 DB가 바로 연결 가능한 게 아니다. `healthcheck`로 실제 DB가 응답할 때까지 기다린 후 앱을 시작한다.

### Spring Boot + PostgreSQL 구성

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: dignify        # DB 이름 (PostgreSQL 공식 이미지 규약)
      POSTGRES_USER: dignify      # 유저명
      POSTGRES_PASSWORD: dignify  # 비밀번호
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dignify"]
      interval: 5s    # 5초마다 헬스체크
      timeout: 5s     # 5초 안에 응답 없으면 실패 처리
      retries: 5      # 5번 연속 실패 시 unhealthy

  app:
    build: .          # 현재 디렉토리의 Dockerfile로 이미지 빌드
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres   # 컨테이너 이름이 곧 호스트명 (도커 내부 DNS)
      DB_PORT: 5432
      DB_NAME: dignify
      DB_USERNAME: dignify
      DB_PASSWORD: dignify
      JWT_SECRET: ${JWT_SECRET}      # .env 파일에서 읽어옴
      CRON_SECRET: ${CRON_SECRET}
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:   # named volume 선언 (services와 같은 레벨)
```

:::tip 같은 docker-compose 안의 컨테이너 통신
같은 docker-compose 안의 컨테이너끼리는 **서비스 이름이 곧 호스트명**이다. `DB_HOST: postgres`처럼 IP 대신 서비스 이름을 쓰면 도커가 내부 DNS로 자동 처리한다.
:::

---

## .env 파일

`docker-compose.yml`과 같은 디렉토리에 두면 `docker-compose up` 시 자동으로 읽어서 환경변수로 주입한다. 경로를 별도로 명시할 필요 없다.

```
JWT_SECRET=로컬개발용시크릿키32자이상권장
CRON_SECRET=로컬개발용크론시크릿
```

:::warning 시크릿을 docker-compose.yml에 직접 쓰면 git에 노출된다
`.env`로 분리해서 `.gitignore`에 추가하는 게 기본이다.
:::

---

## application.properties — PostgreSQL 연결 설정

환경변수를 기본값과 함께 받도록 설정한다.

```properties
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:dignify}
spring.datasource.username=${DB_USERNAME:dignify}
spring.datasource.password=${DB_PASSWORD:dignify}
spring.jpa.hibernate.ddl-auto=update
```

`${변수명:기본값}` 형식으로 환경변수가 없으면 기본값을 사용한다. 도커 환경에서는 `DB_HOST=postgres`가 주입되고, 로컬 IDE에서 직접 실행할 때는 기본값 `localhost`를 사용한다.

테스트용 `application.properties`는 별도로 분리해 H2 인메모리 DB를 사용하도록 구성한다.

```properties
# src/test/resources/application.properties
spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
```

---

## 도커 허브 vs 도커 엔진

| | 설명 |
|---|---|
| **도커 허브** | 이미지를 저장하고 배포하는 원격 저장소 (GitHub 같은 것) |
| **도커 엔진** | 맥에 설치된 도커 실행 환경. 컨테이너 실행, volume 관리 담당 |

```
도커 허브 → 이미지 다운로드 → 도커 엔진이 컨테이너 실행 + volume 관리
```

---

## 로컬 vs 클라우드

| 환경 | 구성 |
|---|---|
| 로컬 | docker-compose (app + postgres 컨테이너) |
| Cloud Run | app 컨테이너 → Cloud SQL (GCP 관리형 PostgreSQL) |

Cloud Run은 컨테이너가 요청 처리 후 종료될 수 있는 구조라 볼륨으로 데이터를 저장하는 게 의미 없다. DB는 Cloud SQL에 따로 올리고, 앱 컨테이너의 DB 연결 정보만 Cloud SQL로 바꾸면 된다.

---

## 실행 명령어

```bash
docker-compose up --build    # 이미지 빌드 + 컨테이너 실행
docker-compose down          # 컨테이너 종료
docker-compose down -v       # 컨테이너 + 볼륨까지 삭제
```
