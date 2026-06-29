---
title: Snack - [Spring] 배치 작업의 트랜잭션 분리 — 자기호출 문제와 detached 엔티티 함정
tags: ['Java', 'Spring', 'JPA', 'Transaction']
---

## 개요

크론잡에서 iTunes API를 배치 단위로 호출해 트랙을 DB에 저장하는 로직을 구현하면서, `@Transactional`을 어디에 어떻게 붙이느냐에 따라 전혀 다른 동작이 나온다는 걸 실무적으로 정리했다. 이론으로는 알던 내용이지만 실제 설계에서 마주치면 생각보다 빠져나오기 까다롭다.

## 문제 1 — 자기호출(self-invocation)은 트랜잭션이 적용되지 않는다

처음 구조는 같은 클래스 안에 두 메서드를 두고 `@Transactional`을 각각 붙이는 방식이었다.

```java
@Service
public class CronService {

    @Transactional
    public CronJobResult callItunesAPI(String jobName) {
        for (int i = 0; i < MAX_BATCHES; i++) {
            processBatch(startId);  // 같은 클래스 내부 호출
        }
    }

    @Transactional  // 이건 사실상 무시된다
    public int processBatch(long startId) {
        // saveAll + cronState 갱신
    }
}
```

의도는 `processBatch`마다 독립 트랜잭션으로 커밋하는 것이었지만 실제로는 전혀 다르게 동작한다.

Spring의 `@Transactional`은 **프록시 기반 AOP**로 동작한다. 외부에서 빈을 호출할 때 Spring이 생성한 프록시 객체를 거치면서 트랜잭션 로직이 끼어든다. 그런데 같은 클래스 내부에서 `this.processBatch()`를 호출하면 프록시를 우회해서 실제 객체의 메서드를 직접 호출한다. 결과적으로 `processBatch`의 `@Transactional`은 완전히 무시되고, `callItunesAPI`의 트랜잭션 하나에 전부 묶인다.

:::warning 1000배치 = 1 트랜잭션
배치가 1000개라면 50분짜리 트랜잭션이 열린 채 유지된다. JPA 1차 캐시(EntityManager)에 저장된 엔티티가 모두 쌓이고, 999번째 배치에서 실패하면 앞의 998배치가 전부 롤백된다.
:::

**해결: 배치 로직을 별도 빈으로 분리**

```java
@Service
@RequiredArgsConstructor
public class CronBatchService {

    @Transactional  // 이제 외부에서 프록시를 거쳐 호출되므로 정상 적용된다
    public ProcessResult processBatch(String jobName) {
        // saveAll + cronState 갱신
    }
}

@Service
@RequiredArgsConstructor
public class CronService {
    private final CronBatchService cronBatchService;  // 별도 빈 주입

    public CronJobResult callItunesAPI(String jobName) {
        for (int i = 0; i < MAX_BATCHES; i++) {
            cronBatchService.processBatch(jobName);  // 프록시 경유 → 트랜잭션 정상 적용
        }
    }
}
```

`CronBatchService`가 별도 Spring 빈이므로 `cronBatchService.processBatch()` 호출 시 프록시를 거친다. 배치마다 `@Transactional`이 정상적으로 적용되어 독립 트랜잭션으로 커밋된다.

## 문제 2 — 트랜잭션 밖에서 로드한 엔티티는 detached 상태다

배치를 별도 빈으로 분리한 뒤, `CronState` 엔티티를 `CronService`에서 한 번 로드해서 배치 메서드에 파라미터로 넘기는 구조를 시도했다.

```java
// CronService (트랜잭션 없음)
public CronJobResult callItunesAPI(String jobName) {
    CronState cronState = cronStateRepository.findByJobName(jobName)...;  // 여기서 로드

    for (int i = 0; i < MAX_BATCHES; i++) {
        cronBatchService.processBatch(startId, cronState);  // 파라미터로 넘김
    }
}

// CronBatchService
@Transactional
public int processBatch(long startId, CronState cronState) {
    // ... saveAll ...
    cronState.updateLastProcessedId(startId + 199);  // dirty checking으로 갱신하려 했지만...
}
```

`cronState.updateLastProcessedId()`를 호출해도 DB가 갱신되지 않는다.

JPA의 dirty checking은 **영속성 컨텍스트(EntityManager)에 managed 상태로 등록된 엔티티**에만 동작한다. `CronService`에는 트랜잭션이 없으므로, `cronStateRepository.findByJobName()`으로 로드된 `cronState`는 로드 직후 트랜잭션이 없어 **detached 상태**가 된다. 이 객체를 `processBatch`에 넘겨도 `CronBatchService`의 영속성 컨텍스트에는 등록되지 않은 채로 넘어온 것이라 dirty checking 감지 대상이 아니다.

:::tip managed vs detached
- **managed**: 트랜잭션 내 영속성 컨텍스트에 등록된 상태. 필드를 수정하면 트랜잭션 커밋 시 UPDATE SQL이 자동 발행된다.
- **detached**: 영속성 컨텍스트와 분리된 상태. 필드를 수정해도 DB에 반영되지 않는다.
:::

**해결: 트랜잭션 안에서 직접 조회**

`processBatch` 내부에서 `CronState`를 직접 조회하면, 해당 트랜잭션의 영속성 컨텍스트에 managed 상태로 등록된다.

```java
@Transactional
public ProcessResult processBatch(String jobName) {
    // 트랜잭션 안에서 직접 조회 → managed 상태
    CronState cronState = cronStateRepository.findByJobName(jobName)...;
    long startId = cronState.getLastProcessedId() != null
            ? cronState.getLastProcessedId() + 1 : 1L;

    // ... saveAll ...

    cronState.updateLastProcessedId(startId + 199);  // dirty checking 정상 동작
    return new ProcessResult(tracks.size(), startId + 199);
}
```

## 최종 구조

```
CronService.callItunesAPI() — 트랜잭션 없음
  └─ loop (1000회)
       └─ CronBatchService.processBatch() @Transactional
            ├─ cronStateRepository.findByJobName() → managed CronState
            ├─ iTunesAPIClient.lookup() → 200개 배치 조회
            ├─ trackRepository.saveAll()
            ├─ cronState.updateLastProcessedId() → dirty checking → UPDATE
            └─ 커밋 ← 배치마다 독립 커밋
```

| 시도 | 문제 | 결과 |
|---|---|---|
| 같은 클래스에서 자기호출 | AOP 프록시 우회 | `@Transactional` 무시, 전체가 하나의 트랜잭션 |
| 별도 빈 분리 + 외부에서 cronState 로드 후 파라미터로 전달 | detached 엔티티 | dirty checking 동작 안 함, DB 미갱신 |
| 별도 빈 분리 + 트랜잭션 안에서 cronState 직접 조회 | 없음 | 배치마다 독립 커밋, dirty checking 정상 동작 |

## 정리

배치 작업에서 `@Transactional`을 설계할 때 확인할 두 가지:

1. **호출 경로**: 같은 클래스 내부 호출이면 프록시를 우회한다 → 배치 단위 트랜잭션이 필요하면 별도 빈으로 분리
2. **엔티티 상태**: dirty checking이 동작하려면 해당 트랜잭션의 영속성 컨텍스트 안에서 엔티티를 로드해야 한다 → 트랜잭션 밖에서 로드한 엔티티는 detached
