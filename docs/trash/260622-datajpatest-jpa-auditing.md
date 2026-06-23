---
title: Snack - [Spring] @DataJpaTest에서 @EnableJpaAuditing이 적용 안 되는 이유
tags: ['Java', 'Spring', 'Test']
---

## 개요

`@DataJpaTest`로 첫 Repository 테스트(`TrackRepositoryTest`)를 작성하다가, `Genre` 픽스처 하나를 저장하는 시점에 `ConstraintViolationException`을 만났다. 원인을 추적해보니 데이터 값 문제가 아니라, **JPA Auditing(`@CreatedDate`)이 테스트 슬라이스에서 아예 동작하지 않은 것**이 원인이었다.

## 증상

```java
Genre rockGenre = Genre.create("rock", "락");
entityManager.persistAndFlush(rockGenre);  // 여기서 터짐
```

`rockGenre`는 "rock"/"락"이라는 평범한 값이고, 같은 이름으로 먼저 들어간 row도 없었다. 그런데도 INSERT가 제약조건 위반으로 실패했다. 처음엔 "유니크 제약에 걸렸나?" 싶었지만, 실제 메시지를 까보니 전혀 다른 이야기였다.

```
org.hibernate.exception.ConstraintViolationException: could not execute statement
Caused by: org.h2.jdbc.JdbcSQLIntegrityConstraintViolationException:
NULL not allowed for column "CREATED_AT";
insert into genres (created_at,genre_name_en,genre_name_ko,updated_at,genre_id) values (?,?,?,?,default)
```

`genre_name_en`/`genre_name_ko`가 아니라 **`created_at`이 NULL이라서 막힌 것**이었다.

:::tip 증상만 보고 짐작하지 말 것
"제약조건 위반"이라고 해서 곧바로 유니크 제약이나 직접 넣은 값을 의심하기 쉽다. 실제로는 항상 전체 SQL과 어떤 컬럼이 NULL인지부터 정확히 읽어야 한다. 이번에도 짐작이 아니라 실제 INSERT문을 보고서야 진짜 원인을 찾았다.
:::

## 원인 추적

`Genre`는 `BaseTimeEntity`를 상속한다.

```java
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public class BaseTimeEntity {
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    @LastModifiedDate
    private Instant updatedAt;
}
```

`@CreatedDate`가 INSERT 시점에 자동으로 값을 채워주는 건 `AuditingEntityListener`가 동작할 때만 가능하고, 그 전제 조건이 `@EnableJpaAuditing`이 활성화되어 있어야 한다는 것이다. 이 프로젝트에서는 이게 메인 애플리케이션 클래스가 아니라 별도 설정 클래스에 있다.

```java
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
```

(이 설정 클래스를 메인 클래스에서 분리해둔 이유 자체도 예전에 `@WebMvcTest`에서 겪은 트러블슈팅 때문이었다 — JPA 메타모델이 없는 슬라이스에서 `@EnableJpaAuditing`이 같이 따라오면서 `jpaMappingContext` 빈 생성에 실패했던 문제였다.)

문제는 `@DataJpaTest`가 **이 커스텀 `@Configuration` 클래스를 기본적으로 스캔하지 않는다는 것**이었다. `@WebMvcTest`가 Service/Repository를 컨텍스트에서 빼는 것처럼, `@DataJpaTest`도 "JPA 슬라이스에 필요한 것"만 골라서 띄우는 자체 필터(`TypeExcludeFilter`)를 쓰는데, `JpaAuditingConfig`는 이 필터에 걸려 같이 올라오지 않았다. 그 결과 `@CreatedDate`가 한 번도 실행되지 않은 채 INSERT가 나갔고, NOT NULL 컬럼에 `null`이 들어가려다 막힌 것이다.

## 가설 검증

추측만으로 끝내지 않고, 실제로 `@Import`를 추가해서 재현 테스트를 돌려 확인했다.

```java
@DataJpaTest
@Import(JpaAuditingConfig.class)
public class TrackRepositoryTest {
    // ...
}
```

이걸 추가하자 동일한 픽스처 저장이 `BUILD SUCCESSFUL`로 정상 통과했다. 가설이 맞았다는 걸 직접 실행으로 확인하고서야 해결책으로 확정했다.

## 정리

| | 원인 | 해결 |
|---|---|---|
| 증상 | `Genre` 저장 시 `ConstraintViolationException` | — |
| 겉보기 의심 | `genre_name_en`/`genre_name_ko` 유니크 제약 | 실제로는 무관 |
| 진짜 원인 | `created_at` NOT NULL인데 값이 안 채워짐 | `@EnableJpaAuditing`이 활성화 안 됨 |
| 근본 원인 | `@DataJpaTest`가 커스텀 `@Configuration`(`JpaAuditingConfig`)을 스캔 대상에서 제외 | `@Import(JpaAuditingConfig.class)`로 명시적으로 포함 |

`BaseTimeEntity`를 상속하는 엔티티를 저장하는 모든 `@DataJpaTest`에 공통으로 적용되는 패턴이라, 앞으로 작성할 Repository 테스트 클래스마다 이 `@Import`가 똑같이 필요할 것으로 보인다.

`@WebMvcTest`에서는 `@EnableJpaAuditing`이 "같이 따라와서" 문제였고, `@DataJpaTest`에서는 정반대로 "안 따라와서" 문제였다 — 두 슬라이스 테스트 모두 "내가 검증하려는 계층이 정확히 뭔가"를 기준으로 빈을 포함/제외한다는 같은 원리에서 나온, 방향만 반대인 증상이었다.
