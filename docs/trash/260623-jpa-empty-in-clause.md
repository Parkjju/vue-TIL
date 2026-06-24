---
title: Snack - [JPA] NOT IN에 빈 리스트를 넘기면 예외 대신 조용히 0건이 된다
tags: ['Java', 'JPA', 'Hibernate', 'SQL']
---

## 개요

Feed Phase 2(전체 트랙) 쿼리 `findGeneralTracksByGenreIdsExceptHypedTrackWithLimitAndOffset`를 추가하면서, "장르 선호를 하나도 설정 안 한 유저"는 `genreIds`로 빈 리스트가 들어올 수 있다는 게 신경 쓰였다. 빈 리스트를 네이티브 쿼리의 `NOT IN :genreIds`에 바인딩하면 예외가 터질 거라 예상하고 확인용 테스트를 추가했는데, 예외는 안 터지고 더 발견하기 어려운 문제가 나왔다.

## 문제 상황

```java
@Test
void test() {
    // ... Genre/Track/User 픽스처 생성 ...

    trackRepository.findGeneralTracksByGenreIdsExceptHypedTrackWithLimitAndOffset(
            user.getId(), List.of(), 0, 0);
}
```

쿼리 정의는 이렇다.

```java
@Query(value = "SELECT t.* FROM tracks t " +
        "LEFT JOIN users_hype_tracks uht ON t.track_id = uht.track_id AND uht.user_id = :userId " +
        "WHERE t.genre_id NOT IN :genreIds AND uht.user_hype_track_id IS NULL AND t.is_active IS TRUE " +
        "ORDER BY t.track_id " +
        "LIMIT :limit " +
        "OFFSET :offset", nativeQuery = true)
List<Track> findGeneralTracksByGenreIdsExceptHypedTrackWithLimitAndOffset(
        @Param("userId") Long userId, @Param("genreIds") List<Long> genreIds,
        @Param("limit") Integer limit, @Param("offset") Integer offset);
```

`genreIds`에 빈 `List.of()`를 넘기고 실행하니 `BUILD SUCCESSFUL` — 예외가 없다. 실제로 무슨 SQL이 나갔는지 로그를 보고서야 진짜 문제를 알았다.

```
Hibernate: SELECT t.* FROM tracks t LEFT JOIN users_hype_tracks uht ON t.track_id = uht.track_id AND uht.user_id = ? WHERE t.genre_id NOT IN (null) AND uht.user_hype_track_id IS NULL AND t.is_active IS TRUE ORDER BY t.track_id LIMIT ? OFFSET ?
```

Hibernate가 빈 컬렉션 파라미터를 `NOT IN ()`처럼 빈 괄호로 바인딩하는 게 아니라, **리터럴 `(null)` 하나로 치환**해서 SQL을 만들었다.

## 원인 — SQL의 3값 논리

`t.genre_id NOT IN (null)`은 `t.genre_id <> NULL`과 동치다. SQL에서 어떤 값과 `NULL`을 비교하는 연산(`=`, `<>` 등)은 절대 `TRUE`/`FALSE`로 떨어지지 않고 항상 `UNKNOWN`으로 평가된다. `WHERE`절은 `UNKNOWN`을 `TRUE`가 아닌 모든 경우와 동일하게 취급해서 그 행을 걸러낸다.

즉 **모든 행**에서 `t.genre_id NOT IN (null)`이 `UNKNOWN`이 되고, `WHERE` 전체가 걸러져서 쿼리는 항상 **0건**을 반환한다.

:::warning 의도와 정반대로 동작
이 메서드를 빈 리스트로 호출한 의도는 "제외할 장르가 없다 → 전체 포함"이었다. 그런데 실제로는 "전부 제외 → 0건"이 되어버린다. 예외였다면 바로 알았겠지만, 조용히 빈 리스트를 반환하기 때문에 `assertThat` 없는 테스트(딱 지금 작성한 `test()`처럼 반환값을 변수에 받지도 않는 테스트)로는 절대 못 잡는다.
:::

## 왜 예외가 아니라 NULL 치환인가

Hibernate는 네이티브 쿼리에서 컬렉션 파라미터를 바인딩할 때, 컬렉션 크기만큼 `?` 플레이스홀더를 펼쳐서 SQL을 다시 만든다(`IN (?, ?, ?)`처럼). 컬렉션이 비어있으면 펼칠 `?`가 0개가 되어 `IN ()`이라는, 일부 DB에서 문법 오류가 나는 빈 괄호가 만들어진다. Hibernate는 이 문법 오류를 막기 위해 빈 컬렉션을 만나면 대신 `NULL` 리터럴 하나를 채워 넣는 방어 로직을 갖고 있다 — SQL 문법은 깨지지 않지만, 의미적으로는 위에서 설명한 "전부 제외"로 둔갑한다.

## 해결 방향

쿼리 자체에서 빈 리스트를 분기할 수도 있지만(`CASE WHEN`이나 동적 쿼리), 이번에는 서비스 레이어에서 분기하기로 했다. 장르 미설정 유저(`genreIds`가 빈 경우)는 이 메서드를 호출하지 않고, 장르 조건이 전혀 없는 별도 쿼리로 라우팅한다. "장르 조건 없음"과 "모든 장르를 NOT IN 조건에 넣음"은 의미가 다른데, 후자를 빈 리스트로 표현하려던 게 애초에 무리였다.

## 정리

| | 내용 |
|---|---|
| 증상 | `NOT IN`에 빈 리스트를 넘겨도 예외 없이 `BUILD SUCCESSFUL` |
| 겉보기 | 빈 리스트 = "제외 조건 없음" = 전체 포함일 거라 예상 |
| 실제 SQL | `t.genre_id NOT IN (null)` |
| 진짜 원인 | SQL 3값 논리상 `x <> NULL`은 항상 `UNKNOWN` → `WHERE`가 전부 걸러냄 → 항상 0건 |
| 근본 원인 | Hibernate가 빈 컬렉션 파라미터를 문법 오류 방지용으로 `NULL` 리터럴로 치환 |
| 해결 | 쿼리 분기 — 빈 `genreIds`는 이 메서드를 호출하지 않고 장르 조건 없는 쿼리로 라우팅 |

`IN`/`NOT IN`에 동적 리스트를 바인딩하는 모든 쿼리에 해당하는 패턴이다. 리스트가 비어있을 수 있는 경우라면, 예외에 의존하지 말고 실제로 빈 리스트를 넘겨서 SQL 로그까지 직접 확인해보는 게 안전하다.
