---
title: Snack - [Spring] Mockito 기반 서비스 계층 단위 테스트
tags: ['Java', 'Spring', 'Test']
---

## 개요

Spring Boot 서비스 계층을 테스트할 때 `@SpringBootTest`는 컨텍스트 전체를 로드해 느리다. Mockito만 사용하면 DB 연결 없이 빠르게 비즈니스 로직만 검증할 수 있다. 서비스 단위 테스트의 기본 구조와 각 요소의 의미를 정리한다.

## 기본 틀

```java
@ExtendWith(MockitoExtension.class)
class GenreServiceTest {

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private GenreService genreService;

    @Test
    @DisplayName("장르 목록 조회 - 정상")
    void getGenreList() {
        // given
        Genre genre = Genre.create("Pop", "팝");
        given(genreRepository.findAll()).willReturn(List.of(genre));

        // when
        GenreListResponse response = genreService.getGenreList();

        // then
        assertThat(response.genres()).hasSize(1);
    }
}
```

## 각 요소 설명

### `@ExtendWith(MockitoExtension.class)`

JUnit 5에 Mockito를 붙여주는 선언이다. 이게 있어야 `@Mock`, `@InjectMocks`가 동작한다.

`@SpringBootTest`는 Spring 컨텍스트 전체를 로드하지만, 이 방식은 Mockito만 올려서 훨씬 빠르다. 서비스 계층 로직만 테스트할 때는 Spring 컨텍스트가 필요 없다.

### `@Mock`

진짜 `GenreRepository` 대신 껍데기(Mock) 객체를 만든다. 메서드를 호출하면 기본값(`null`, `0`, 빈 리스트 등)을 반환하고, `given()`으로 원하는 반환값을 지정할 수 있다. DB 연결 없이 동작한다.

### `@InjectMocks`

`GenreService` 인스턴스를 생성하면서 `@Mock`으로 만든 객체들을 생성자 주입해준다. `new GenreService(genreRepository)`와 동일한 효과다.

:::warning @RequiredArgsConstructor 사용 시 주의
`@InjectMocks`는 `final` 필드를 기준으로 생성자 주입을 시도한다. 서비스 클래스에 `@RequiredArgsConstructor`를 썼다면 주입받을 필드를 반드시 `final`로 선언해야 한다. non-final로 선언하면 `@InjectMocks`가 주입 대상으로 인식하지 못해 NPE가 발생한다.
:::

### `@Test` / `@DisplayName`

- `@Test`: 이 메서드가 테스트 케이스임을 JUnit에 알린다.
- `@DisplayName`: 테스트 실행 결과에 표시되는 이름. 메서드명 대신 읽기 좋은 설명을 쓴다.

### given / when / then

테스트 구조를 3단계로 나누는 패턴이다.

| 단계 | 역할 | 예시 |
|---|---|---|
| **given** | Mock이 어떤 값을 반환할지 설정 | `given(repo.findAll()).willReturn(list)` |
| **when** | 실제로 테스트할 메서드 호출 | `service.getGenreList()` |
| **then** | 결과 검증 | `assertThat(response).hasSize(1)` |

`given()`은 BDDMockito의 메서드다. Mockito의 `when()`과 동일한 역할이지만 given/when/then 단계 구분이 명확해진다.

### `assertThat`

AssertJ 라이브러리의 검증 메서드로, `spring-boot-starter-test`에 기본 포함된다. 체이닝으로 검증 조건을 붙일 수 있다.

```java
assertThat(response.genres()).hasSize(1);
assertThat(response.genres().get(0).genreName()).isEqualTo("Pop");
assertThat(user).isNotNull();
```

## 엔티티 인스턴스 생성 문제

JPA 엔티티는 보통 `@NoArgsConstructor(access = AccessLevel.PROTECTED)`를 쓴다. 외부에서 `new Genre()`로 직접 생성이 불가능하기 때문에, 테스트에서 엔티티 인스턴스를 만드는 방법을 선택해야 한다.

**방법 1 — 정적 팩토리 메서드 추가 (권장)**

```java
// 엔티티에 추가
public static Genre create(String genreNameEn, String genreNameKo) {
    Genre genre = new Genre(); // 클래스 내부이므로 protected 접근 가능
    genre.genreNameEn = genreNameEn;
    genre.genreNameKo = genreNameKo;
    return genre;
}
```

```java
// 테스트에서 사용
Genre genre = Genre.create("Pop", "팝");
```

다른 엔티티와 컨벤션을 통일할 수 있고 테스트 코드도 읽기 좋다.

**방법 2 — ReflectionTestUtils (프로덕션 코드를 건드리기 싫을 때)**

```java
Genre genre = (Genre) ReflectionTestUtils.invokeConstructor(Genre.class);
ReflectionTestUtils.setField(genre, "genreNameEn", "Pop");
ReflectionTestUtils.setField(genre, "genreNameKo", "팝");
```

## 테스트 계층별 선택 기준

| 계층 | 애노테이션 | 사용 시점 |
|---|---|---|
| Service | `@ExtendWith(MockitoExtension.class)` | 비즈니스 로직 검증 (지금) |
| Repository | `@DataJpaTest` | 커스텀 JPQL/쿼리 메서드 생길 때 |
| Controller | `@WebMvcTest` + `MockMvc` | Security 필터체인 붙인 후 |

Repository 단위 테스트(`@DataJpaTest`)는 H2 인메모리 DB를 띄워 JPA 쿼리를 검증한다. `findAll()`처럼 Spring Data JPA가 이미 검증한 메서드는 테스트할 필요 없고, 직접 작성한 JPQL이나 `@Query` 메서드가 생길 때 작성한다.
