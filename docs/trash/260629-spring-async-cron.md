---
title: Snack - [Spring] 장기 실행 크론잡을 @Async로 분리하기 — HTTP 클라이언트 연결 종료와 서버 스레드
tags: ['Java', 'Spring', 'Async']
---

## 문제 상황

크론잡 트리거 엔드포인트 `POST /internal/cron/collect`를 curl로 호출했더니, 응답(500)이 왔는데도 DB 적재가 계속 진행되고 있었다.

```bash
curl -X POST http://localhost:8080/internal/cron/collect \
  -H "X-Cron-Secret: ..."
{"code":"INTERNAL_SERVER_ERROR","message":"서버 에러가 발생했습니다."}
# curl 종료됐는데 DB는 계속 적재 중...
```

원인을 파악하기 위해 컨트롤러 코드를 봤다.

```java
@PostMapping("/internal/cron/collect")
public CronJobResult processCronJob(@RequestHeader("X-Cron-Secret") String requestSecret)
        throws InterruptedException {
    // ...
    return cronService.callItunesAPI("track_collect");
}
```

`callItunesAPI`는 100번 루프 × 30초 sleep = 최대 50분짜리 작업이다. 이걸 **동기 HTTP 핸들러** 안에서 그대로 실행하고 있었다.

## Spring MVC 서버 스레드는 클라이언트 연결 종료를 모른다

Spring MVC 동기 컨트롤러의 핵심 특성이다.

```
클라이언트(curl) → TCP 연결 종료
                        ↓
              Spring 서버 스레드는 그대로 실행 중
              (Thread.sleep, HTTP 외부 호출 등 계속)
                        ↓
              루프 완료 or 예외 발생 시 비로소 스레드 종료
```

클라이언트가 Ctrl+C를 누르거나 터미널을 닫으면 TCP 소켓만 닫힌다. 서버 스레드는 소켓에 뭔가 쓸 때가 아니면 연결이 끊긴 걸 알 방법이 없다. `Thread.sleep(30000)` 중이거나 iTunes API 호출 중이라면, 서버 입장에선 아무 이상이 없는 상태다.

그래서 curl이 종료된 이후에도 서버 스레드는 루프를 계속 돌며 DB에 적재하고 있었던 것이다.

:::warning HTTP 응답이 나갔다고 스레드가 종료된 게 아닐 수 있다
정확히는:
- 클라이언트가 응답을 받고 종료: 응답 = 메서드 리턴/예외 → 스레드 종료 (완전히 멈춤)
- 클라이언트가 연결을 먼저 끊음: 서버 스레드는 여전히 살아있음

500 응답이 찍힌 경우라도, 그게 **이전에 실행 중이던 다른 요청**의 스레드가 DB를 계속 쓰고 있는 상황일 수 있다. 같은 엔드포인트를 여러 번 호출하면 여러 스레드가 동시에 루프를 돌게 된다.
:::

## 근본 문제: 50분짜리 작업을 동기 HTTP 핸들러에 묶어두면 안 된다

Cloud Run은 HTTP 요청 단위로 인스턴스를 관리한다. 요청이 50분 동안 살아있으면:
- Cloud Run 타임아웃(기본 60분)에 걸릴 수 있다
- 인스턴스가 요청을 "처리 중"으로 보고 계속 살아있는다 (불필요한 비용)
- Cloud Scheduler가 응답을 기다리다 타임아웃이 난다

올바른 패턴은 **즉시 202 Accepted를 반환하고, 실제 작업은 백그라운드 스레드로 돌리는 것**이다.

## @Async로 해결

### 1. AsyncConfig 추가

```java
@EnableAsync
@Configuration
public class AsyncConfig {
}
```

`@EnableAsync`를 붙인 `@Configuration`이 하나 있어야 `@Async`가 동작한다.

### 2. CronService에 @Async 추가, 반환 타입을 void로 변경

```java
@Async
public void callItunesAPI(String jobName) throws InterruptedException {
    int processedSize = 0;

    for (int i = 0; i < MAX_BATCHES_PER_RUN; i++) {
        try {
            CronBatchService.ProcessResult result = cronBatchService.processBatch(jobName);
            processedSize += result.processedSize();
            log.info("Batch {}/{} done — processed: {}, lastId: {}",
                i + 1, MAX_BATCHES_PER_RUN, result.processedSize(), result.lastProcessedId());
            Thread.sleep(30000);
        } catch (ResourceAccessException e) {
            log.warn("iTunes API connection dropped after {} batches: {}", i, e.getMessage());
            break;
        }
    }

    log.info("Cron job '{}' finished — total processed: {}", jobName, processedSize);
}
```

`@Async`를 붙이면 해당 메서드는 호출 즉시 Spring의 비동기 스레드 풀에 작업을 위임하고 바로 리턴된다. 반환 타입이 `void`면 "fire and forget" 방식으로 동작한다.

### 3. CronController에서 202 즉시 반환

```java
@PostMapping("/internal/cron/collect")
public ResponseEntity<Void> processCronJob(@RequestHeader("X-Cron-Secret") String requestSecret)
        throws InterruptedException {
    if (!cronSecret.equals(requestSecret)) {
        throw new BusinessException(ErrorCode.CRON_SECRET_INVALID);
    }

    cronService.callItunesAPI("track_collect"); // 백그라운드로 위임, 즉시 리턴
    return ResponseEntity.accepted().build();   // 202 Accepted
}
```

이제 Cloud Scheduler는 즉시 202를 받고 끝난다. 실제 작업은 서버 내부 스레드에서 독립적으로 실행되고, 진행 상황은 로그로 확인한다.

```bash
docker logs <container> --tail 50
# Batch 1/100 done — processed: 12, lastId: 200
# Batch 2/100 done — processed: 8, lastId: 400
# ...
```

## @Async 주의사항

같은 클래스 내부에서 `@Async` 메서드를 this로 호출하면 프록시를 거치지 않아 비동기로 동작하지 않는다 (`@Transactional`과 동일한 self-invocation 문제). 반드시 다른 빈에서 호출해야 한다. `CronController → CronService.callItunesAPI`처럼 빈이 분리되어 있으면 문제없다.

## 정리

| | 수정 전 | 수정 후 |
|---|---|---|
| 응답 시점 | 루프 완료(최대 50분) 후 | 즉시 202 |
| 서버 스레드 | HTTP 요청 스레드가 루프 실행 | 비동기 스레드 풀이 루프 실행 |
| 클라이언트 연결 종료 시 | 스레드 계속 실행(감지 못함) | 처음부터 독립 스레드라 무관 |
| Cloud Run 타임아웃 위험 | 있음 | 없음 |
