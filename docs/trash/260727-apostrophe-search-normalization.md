---
title: Snack - [SQL] 따옴표는 쿼리를 깨지 않는다, 대신 검색을 조용히 실패시킨다
tags: ['Java', 'JPA', 'SQL', 'Unicode']
---

## 개요

음악 디깅 앱의 검색 기능에서 `Wit'milly`라는 아티스트를 발견하고 든 생각은 이거였다.

> "이름에 따옴표가 들어가면 쿼리가 깨지는 거 아닌가?"

SQL 문자열 리터럴을 닫아버리는 그 따옴표 말이다. 결론부터 말하면 **쿼리는 안 깨진다**. 그런데 확인하는 과정에서 훨씬 발견하기 어려운 문제가 나왔다. 유저 입장에서는 "검색해도 안 나온다"로 보이지만, 서버 로그에는 에러가 한 줄도 안 남는 종류의 문제다.

## 1차 확인 — 쿼리는 왜 안 깨지나

검색 쿼리는 이렇게 생겼다.

```java
@Query(value = "SELECT t FROM Track t " +
        "WHERE (LOWER(t.artistName) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) " +
        "OR LOWER(t.trackName) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) " +
        "OR LOWER(t.artistNameKo) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) " +
        "OR LOWER(t.trackNameKo) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) ) " +
        "AND t.isActive = TRUE " +
        "ORDER BY ... "
)
List<Track> findTracksWithSearchKeyword(@Param("searchKeyword") String searchKeyword, ...);
```

핵심은 `:searchKeyword`가 **명명 파라미터**라는 점이다. 이건 문자열 결합이 아니다. Hibernate가 `?` 플레이스홀더가 든 SQL을 먼저 DB에 보내고, 값은 별도 채널로 바인딩한다(PreparedStatement). DB는 이미 파싱이 끝난 쿼리 구조에 값을 꽂아 넣을 뿐이라, 값 안에 뭐가 들어있든 SQL 문법으로 재해석될 여지가 없다.

라이브 서버에 그대로 찔러봤다.

```bash
curl -s -G "https://<host>/feed/search" --data-urlencode "q=Wit'milly"
```

```json
{"items":[{"trackId":79869,"trackName":"Happier","artistName":"Wit'milly", ...}]}
```

정상 응답. SQL 인젝션도 같은 이유로 불가능하다. 여기서 끝났으면 좋았을 텐데, 확인차 몇 가지 변형을 더 넣어봤다.

## 진짜 문제 — 두 종류의 따옴표

```bash
curl -s -G "https://<host>/feed/search" --data-urlencode "q=Wit’milly"
```

```json
{"items":[],"nextCursor":null,"hasMore":false,"genreExhausted":false}
```

0건. 눈으로 보면 같은 글자인데 결과가 다르다. 둘은 서로 다른 유니코드 코드포인트다.

| 문자 | 코드포인트 | 이름 |
|---|---|---|
| `'` | U+0027 | APOSTROPHE (ASCII, straight) |
| `’` | U+2019 | RIGHT SINGLE QUOTATION MARK (typographic, curly) |

`LIKE`는 바이트 단위로 비교하기 때문에 이 둘은 완전히 남남이다. `Wit’milly`는 `Wit'milly`와 한 글자도 안 겹치는 게 아니라, 딱 그 한 글자가 안 겹쳐서 매칭에 실패한다.

:::warning 에러가 아니라 빈 결과다
이게 고약한 이유는 실패가 예외로 드러나지 않기 때문이다. 쿼리는 성공하고, HTTP 200이 나가고, `items`만 비어있다. 서버 로그에는 아무 흔적이 없다. 유저는 "이 아티스트 없나 보다" 하고 나가고, 개발자는 문제가 있다는 사실조차 모른다.
:::

## 어느 쪽이 문제인가 — DB 실태 조사

처음엔 "DB는 ASCII로 저장돼 있으니 입력만 정규화하면 되겠다"고 생각했다. 확인이 필요했다.

검색 API 자체가 `LIKE '%키워드%'`라는 점을 이용하면 DB를 직접 안 열어도 조사가 된다. 따옴표 한 글자만 검색어로 넣으면, 그 문자를 포함한 모든 행이 걸린다.

```bash
# 커브 따옴표를 포함한 행
curl -s -G ".../feed/search" --data-urlencode "q=’"
# → ['Big Star’s Third Live', ...]

# ASCII 따옴표를 포함한 행
curl -s -G ".../feed/search" --data-urlencode "q='"
# → ["Adam Port & Stereo MC's", "A'Dre", "Alex D'Castro", "Cam'ron", ...]
```

**둘 다 나왔다.** DB에 두 표기가 섞여 있다. iTunes에서 긁어온 메타데이터를 그대로 저장하는데, 애플 카탈로그 자체가 레이블마다 표기가 제각각이라 그렇다.

그래서 문제는 양방향이다.

- 유저가 `Wit'milly`(ASCII)로 검색 → DB의 `Wit'milly`는 매칭, `Big Star’s`는 실패
- 유저가 `Big Star’s`(커브)로 검색 → 반대로 실패

여기에 결정타가 하나 더 있다. **iOS 키보드는 기본 설정이 스마트 따옴표(smart punctuation)라서, 유저가 `'`를 눌러도 실제로 입력되는 건 `’`다.** 즉 iOS 앱에서 검색하는 유저는 사실상 항상 커브 따옴표를 보내고 있었고, DB에 ASCII로 저장된 `Cam'ron`, `Alex D'Castro` 같은 아티스트들은 앱에서 아예 도달 불가능한 상태였다.

## 해결 — 어느 쪽을 정규화할 것인가

세 가지 선택지가 있었다.

**1. 컬럼 쪽을 정규화한다.** 쿼리에서 `REPLACE(t.artistName, '’', '''')` 식으로 감싸는 방법. 확실하지만 4개 컬럼 × 등장 위치마다 붙어서 쿼리가 지저분해진다. 인덱스도 못 타는데, 어차피 `LIKE '%...%'`라 이미 풀스캔이므로 성능 손해는 없다.

**2. 정규화 컬럼을 따로 둔다.** `artist_name_normalized` 같은 컬럼을 추가하고 수집 시점에 정규화해서 저장. 가장 깔끔하지만 마이그레이션 + 크론 수정 + 기존 5만 행 백필이 필요하다.

**3. 키워드만 손본다.** 검색어의 따옴표류를 `LIKE`의 단일문자 와일드카드 `_`로 치환. `Wit_milly`는 `Wit'milly`와 `Wit’milly` 둘 다 매칭한다.

3번을 골랐다. 한 줄이고, DB도 쿼리도 안 건드린다.

```java
// DB에 ASCII(')와 커브(’) 따옴표가 섞여 있어서, 어느 쪽으로 쳐도 걸리게 LIKE 단일문자 와일드카드로 치환한다.
String normalizedKeyword = searchKeyword.replaceAll("['‘’ʼ]", "_");
result = trackRepository.findTracksWithSearchKeyword(normalizedKeyword, FETCH_LIMIT, currentCursor.genreOffset());
```

문자 클래스에 여는 작은따옴표(U+2018)와 모디파이어 문자(U+02BC)도 같이 넣었다. 후자는 하와이어나 일부 로마자 표기에서 쓰이는데, 아티스트명에 종종 등장한다.

:::tip 왜 특정 문자로 통일하지 않고 와일드카드인가
`’`를 `'`로 통일하는 방식은 **입력 한쪽만** 정규화한다. 유저가 뭘 치든 ASCII로 바뀌지만, DB에 커브로 저장된 `Big Star’s`는 여전히 못 찾는다. 양쪽을 다 정규화하려면 결국 컬럼에도 손을 대야 한다.

`_`는 "이 자리에 아무 문자 하나"라는 뜻이라, 컬럼을 안 건드리고도 양쪽을 동시에 커버한다. 한쪽을 다른 쪽에 맞추는 대신, 양쪽 모두와 매칭되는 제3의 표현으로 바꾸는 셈이다.
:::

## 부작용과 남은 것

**정렬 티어가 한 단계 내려간다.** 검색 결과는 관련도 티어로 정렬하는데, 최상위 티어가 `LIKE`가 아닌 `=` 비교다.

```java
"WHEN LOWER(t.artistName) = LOWER(:searchKeyword) THEN 0 " +
"WHEN LOWER(t.artistName) LIKE LOWER(CONCAT(:searchKeyword, '%')) THEN 1 " +
```

`=`는 `_`를 와일드카드로 취급하지 않는다. `Wit_milly = Wit'milly`는 거짓이므로 티어 0에 못 들어가고, 티어 1(접두 `LIKE`)로 내려간다. 티어 1도 정상 매칭되므로 **누락은 없고 순서만 미세하게 바뀐다.** 따옴표 든 아티스트를 정확히 쳤을 때 최상단 클러스터를 못 잡는 정도라, 일단 감수하기로 했다.

**`%`와 `_` 자체는 이스케이프하지 않는다.** 유저가 `%`를 검색어로 넣으면 `LIKE '%%%'`가 되어 전체 트랙이 매칭된다. 쿼리 실패는 아니고 결과가 넓어질 뿐이라 우선순위를 낮췄다. 어뷰징이 관찰되면 그때 이스케이프를 추가하면 된다.

## 정리

| | 내용 |
|---|---|
| 처음 의심 | 아티스트명의 `'`가 SQL 문자열을 닫아 쿼리를 깨뜨린다 |
| 실제 | 명명 파라미터(PreparedStatement) 바인딩이라 안 깨짐, 인젝션도 불가 |
| 진짜 문제 | ASCII `'`(U+0027)와 커브 `’`(U+2019)가 DB에 혼재 → 반대쪽 표기로 검색하면 0건 |
| 왜 안 보였나 | 예외가 아니라 HTTP 200 + 빈 배열, 서버 로그에 흔적 없음 |
| 증폭 요인 | iOS 키보드 스마트 따옴표 기본 ON → 앱 유저는 사실상 항상 커브를 전송 |
| 조사 방법 | 검색 API에 따옴표 한 글자만 넣어 `LIKE '%문자%'`로 DB 실태 확인 |
| 해결 | 키워드의 따옴표류를 `LIKE` 단일문자 와일드카드 `_`로 치환 |

외부 API에서 긁어온 메타데이터를 그대로 저장하는 구조라면 표기 혼재는 예외가 아니라 기본값에 가깝다. 따옴표뿐 아니라 하이픈(`-` vs `–` vs `—`), 공백(일반 스페이스 vs `&nbsp;` vs 전각 스페이스), 악센트 문자의 유니코드 정규화 형식(NFC vs NFD) 전부 같은 성격의 지뢰다. 공통점은 **눈으로 보면 똑같아서, 에러가 안 나서, 결과가 비어있는 걸 봐도 원인을 의심하지 않는다**는 것이다.
