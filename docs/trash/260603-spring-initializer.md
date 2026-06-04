---
title: Spring Initializer 옵션 정리
tags: ['Spring', 'Java']
---

## Spring Initializr 옵션 정리

Spring Initializr(start.spring.io)에서 프로젝트 생성 시 선택하는 옵션별 차이를 정리한다.

### Project (빌드 도구)

프로젝트를 빌드하고 의존성을 관리하는 도구를 선택한다. Maven과 Gradle 중에서 고를 수 있다.

-   **Gradle - Groovy** : 현재 신규 프로젝트에서 가장 널리 쓰이는 선택. 빌드 속도가 빠르고 설정 파일(`build.gradle`)이 간결하다. 대부분의 강의·예제가 이 방식을 사용한다.
-   **Gradle - Kotlin** : Gradle 설정을 Kotlin DSL(`build.gradle.kts`)로 작성. 타입 안정성과 IDE 자동완성이 우수하지만 입문 단계에서는 굳이 선택할 필요 없다.
-   **Maven** : XML(`pom.xml`) 기반의 전통적인 빌드 도구. 오래된 프로젝트나 사내 표준이 Maven인 경우 사용한다. 설정이 장황하지만 안정적이고 자료가 많다.

:::tip 입문 추천
특별한 제약이 없다면 **Gradle - Groovy**를 선택하면 된다.
:::

### Language (언어)

프로젝트에서 사용할 JVM 언어를 선택한다.

-   **Java** : 기본값이자 가장 표준적인 선택. 자료와 레퍼런스가 가장 풍부하다.
-   **Kotlin** : 간결한 문법과 null 안정성이 강점. 안드로이드·신규 서비스에서 채택 증가 중.
-   **Groovy** : 동적 언어. 실무 백엔드에서는 거의 쓰지 않는다.

### Spring Boot (버전)

프로젝트에 적용할 Spring Boot 버전을 선택한다.

-   **정식 버전(숫자만)** : 안정 버전. 실무·학습 모두 이걸 선택한다.
-   **SNAPSHOT** : 개발 중인 불안정 버전. 선택하지 않는다.
-   **M(Milestone), RC(Release Candidate)** : 정식 출시 전 시험 버전. 특수한 경우가 아니면 선택하지 않는다.

:::warning 버전 주의
Spring Boot 3.x 이상은 `javax` 대신 `jakarta` 패키지를 사용한다. 강의 자료가 구버전 기준이면 import 경로가 다를 수 있으니, 괄호 없는 **정식 안정 버전**을 선택한다.
:::

### Spring Boot 3.x vs 4.x

Spring Boot는 2025년 말 3.x에서 4.0으로 메이저 업그레이드되었고, 기반이 되는 Spring Framework도 6.x에서 7.0으로 올라갔다. 두 메이저 버전의 핵심 차이는 다음과 같다.

-   **Spring Boot 3.x** : Spring Framework 6 기반. `javax` → `jakarta` 네임스페이스 전환, Java 17 베이스라인, GraalVM 네이티브 이미지 초기 지원이 핵심이었던 세대다. 3.5가 마지막 3.x 마이너 버전이며, Spring Framework 6 호환이 필요한 환경(레거시 서버·라이브러리)에서 권장된다.
-   **Spring Boot 4.x** : Spring Framework 7 기반의 첫 메이저 릴리스. Jakarta EE 11(Servlet 6.1, JPA 3.2 등)을 채택하고, 코드베이스 모듈화와 신규 기능이 대거 추가됐다.

    4.0에서 달라진 주요 내용:

-   **Java 베이스라인** : 최소 요구 버전은 **여전히 Java 17**이라 기존 3.x 앱 대부분이 JDK 업그레이드 없이 마이그레이션 가능하다. 다만 가상 스레드 등 최신 이점을 위해 Java 21·25 사용을 권장한다.
-   **모듈화(Modularization)** : 3.x에서 하나의 큰 `spring-boot-autoconfigure` JAR에 안 쓰는 자동 설정까지 포함됐던 것을, 4.0은 여러 개의 작은 모듈·세분화된 스타터로 분리했다. 필요한 것만 가져오는 구조다.
-   **API 버저닝 내장** : 그동안 URL 경로 중복(`/api/v1`, `/api/v2`)이나 커스텀 인터셉터로 직접 해결하던 REST API 버전 관리가, `@GetMapping` 등 매핑 애노테이션의 `version` 속성으로 프레임워크 차원에서 지원된다.
-   **선언적 HTTP 클라이언트** : `@HttpExchange`, `RestClient` 기반의 Feign과 유사한 Spring 네이티브 HTTP 클라이언트가 강화됐다.
-   **JSpecify null 안정성** : 기존 `@Nullable` 패턴을 JSpecify 애노테이션으로 대체해 정적 분석 정확도가 높아졌다.
-   **3.x deprecated API 제거** : `@MockBean`, `@SpyBean`(테스트), 구형 Actuator 엔드포인트, 레거시 설정 프로퍼티 등이 완전히 제거됐다.
-   **서드파티 업그레이드** : Jackson 3.x, Hibernate 7.1, Tomcat 11, JUnit Jupiter 6.x 등으로 갱신됐다.

:::warning 마이그레이션 주의
3.x에서 4.0으로 바로 점프하지 말고, **3.5에서 deprecation 경고를 모두 해결한 뒤** 4.0으로 올리는 것이 권장된다. 3.5는 4.0으로 가는 디딤돌 버전으로 정렬되어 있어, 3.5까지 남아있던 deprecated API는 4.0에서 예외 없이 제거됐다.
:::

:::tip 학습용 선택
새로 학습을 시작한다면 최신 안정 버전(4.x)을 그대로 써도 무방하다. 단, 강의·교재가 3.x 기준이면 일부 API(테스트 애노테이션 등)나 설정이 다를 수 있으니, 자료와 버전을 맞추고 싶다면 3.5.x를 선택하는 것도 방법이다.
:::

### Project Metadata (프로젝트 정보)

프로젝트의 식별 정보와 구조를 정의한다.

-   **Group** : 조직·프로젝트 그룹 ID. 보통 도메인을 거꾸로 쓴다 (예: `com.example`). Maven의 groupId에 해당한다.
-   **Artifact** : 애플리케이션(프로젝트) 이름. 빌드 결과물의 이름이 된다 (예: `demo`).
-   **Name** : 애플리케이션 이름. 보통 Artifact와 동일하게 둔다.
-   **Description** : 프로젝트 설명. 자유롭게 작성한다.
-   **Package name** : 소스 코드의 루트 패키지. 기본적으로 `Group + Artifact` 조합으로 자동 생성된다 (예: `com.example.demo`).

### Packaging (패키징 방식)

빌드 결과물을 어떤 형태로 묶을지 선택한다.

-   **Jar** : 내장 톰캣(WAS)을 포함한 독립 실행형 패키지. `java -jar`로 바로 실행 가능. 현재 Spring Boot의 표준이며 대부분 이걸 선택한다.
-   **War** : 외부 WAS(톰캣 등)에 배포하는 전통적 방식. 별도 WAS 서버에 올려야 하는 레거시 환경에서만 사용한다.

:::tip 입문 추천
특별한 배포 요구사항이 없다면 **Jar**를 선택한다.
:::

### Java (JVM 버전)

프로젝트에서 사용할 Java 버전을 선택한다.

-   LTS(Long Term Support) 버전(17, 21 등)을 선택하는 것이 안전하다.
-   선택하는 Spring Boot 버전이 요구하는 최소 Java 버전 이상을 골라야 한다. (Spring Boot 3.x는 Java 17 이상 필수)

현재 실무에서 선택지가 되는 LTS 버전은 Java 17과 Java 21이다. 두 버전의 차이는 다음과 같다.

-   **Java 17** : 2021년 9월 출시된 LTS. 충분히 검증되어 안정적이며, 자료와 서드파티 라이브러리 호환성이 가장 넓다. sealed class(상속 제한 클래스), record(불변 데이터 클래스), instanceof 패턴 매칭 등이 정식 포함됐다.
-   **Java 21** : 2023년 9월 출시된 LTS. Java 17의 기능을 기반으로 최신 기능이 대폭 추가됐다. 입문·일반 백엔드 학습 목적이면 17, 최신 기능과 고동시성 처리가 필요하면 21을 고려한다.

Java 21에서 새로 추가된 주요 기능은 다음과 같다.

-   **Virtual Threads (가상 스레드, Project Loom)** : 수천 개의 경량 스레드를 적은 자원으로 다룰 수 있게 해주는 가장 큰 변화. I/O 대기가 많은 고동시성 웹 애플리케이션에서 기존 스레드 풀보다 효율적으로 확장된다. (단, CPU 연산 위주 작업에는 효과가 제한적이다.)
-   **Pattern Matching for switch (정식화)** : Java 17에서 preview였던 switch 패턴 매칭이 정식 기능이 됐다. 장황한 instanceof 분기 체인을 간결하고 안전하게 대체한다.
-   **Record Patterns** : record 객체를 패턴으로 분해(destructuring)해서 다룰 수 있어, record + sealed 조합의 활용도가 크게 올라갔다.
-   **Sequenced Collections** : 순서가 있는 컬렉션에 `getFirst()`, `getLast()`, 역순 순회 등 일관된 메서드를 제공하는 인터페이스가 추가됐다.

:::tip 17 vs 21 선택 기준
안정성·호환성 우선, 또는 학습용이면 **Java 17**. 가상 스레드 등 최신 기능이 필요하거나 신규 프로젝트를 미래지향적으로 시작하려면 **Java 21**. 둘 다 LTS라 장기 지원 측면에서는 안전하다.
:::

### Dependencies (의존성)

프로젝트에 필요한 라이브러리를 스타터(starter) 단위로 추가한다. 백엔드/JPA 학습 시 자주 쓰는 의존성은 다음과 같다.

-   **Spring Web** : REST API, MVC 등 웹 애플리케이션 개발용. 내장 톰캣 포함.
-   **Spring Data JPA** : JPA/Hibernate 기반 데이터 접근 계층. 엔티티 매핑·리포지토리 사용 시 필수.
-   **H2 Database** : 인메모리 DB. 학습·테스트 단계에서 별도 설치 없이 빠르게 쓸 수 있다.
-   **Lombok** : Getter/Setter, 생성자 등 반복 코드를 애노테이션으로 자동 생성. (선택)
-   **MySQL Driver / PostgreSQL Driver** : 실제 운영 DB에 연결할 때 해당 드라이버를 추가한다.

:::tip JPA 학습용 조합
JPA를 학습한다면 **Spring Web + Spring Data JPA + H2 Database + Lombok** 조합으로 시작하면 무난하다.
:::

### Generate / Explore / Share

-   **Generate** : 설정한 내용대로 프로젝트를 ZIP으로 다운로드한다. 압축 해제 후 IDE로 열면 된다.
-   **Explore** : 생성될 프로젝트 구조와 파일을 미리 확인한다.
-   **Share** : 현재 설정을 URL로 공유한다.
