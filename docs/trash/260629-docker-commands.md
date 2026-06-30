---
title: Snack - [Docker] 자주 쓰는 도커 실행 명령어 모음
tags: ['Docker', 'DevOps']
---

## docker-compose 실행/종료

```bash
# 컨테이너 실행 (이미지 빌드 없이)
docker-compose up

# 이미지 새로 빌드 후 실행
docker-compose up --build

# 백그라운드로 실행 (터미널 점유 안 함)
docker-compose up -d

# 컨테이너 종료
docker-compose down

# 컨테이너 + 볼륨(데이터)까지 삭제
docker-compose down -v
```

:::tip `--build`가 필요한 경우
소스코드를 바꿨을 때. 도커는 이미지를 캐싱하기 때문에 `up`만 하면 이전 빌드 결과를 그대로 쓴다.
:::

:::warning 볼륨 초기화가 필요한 경우
DB 스키마를 바꿨거나 `data.sql` 같은 초기 데이터를 수정했을 때는 `-v` 옵션으로 볼륨을 비우고 다시 시작해야 변경이 반영된다.

```bash
docker-compose down -v && docker-compose up --build
```
:::

---

## 로그 확인

```bash
# 모든 컨테이너 로그 출력 (실시간 스트리밍)
docker-compose logs -f

# 특정 서비스 로그만
docker-compose logs -f app
docker-compose logs -f postgres

# 마지막 100줄만
docker-compose logs --tail=100 app
```

:::tip 앱이 실행 직후 바로 꺼질 때
`docker-compose up`이 실패하면 컨테이너가 종료되면서 로그가 사라지기도 한다. 이때는 `docker-compose logs app`으로 종료된 컨테이너의 로그를 확인할 수 있다.
:::

---

## 컨테이너 접속

```bash
# 실행 중인 컨테이너에 bash로 접속
docker-compose exec app bash
docker-compose exec postgres bash

# PostgreSQL 접속 (컨테이너 내부에서)
docker-compose exec postgres psql -U dignify -d dignify
```

---

## 상태 확인

```bash
# 실행 중인 컨테이너 목록
docker ps

# 종료된 컨테이너 포함 전체 목록
docker ps -a

# docker-compose 서비스 상태 (Up/Exit 등)
docker-compose ps
```

---

## 이미지 / 컨테이너 정리

```bash
# 미사용 컨테이너, 이미지, 네트워크 일괄 삭제
docker system prune

# 볼륨까지 포함해서 삭제
docker system prune --volumes

# 이미지 목록 확인
docker images

# 특정 이미지 삭제
docker rmi <image-id>
```

:::warning `docker system prune`은 실행 중이지 않은 모든 것을 지운다
다른 프로젝트의 이미지나 볼륨도 같이 날아갈 수 있다. 특정 프로젝트만 정리하려면 `docker-compose down -v`를 쓰는 게 안전하다.
:::

---

## 자주 쓰는 조합 패턴

```bash
# 클린 재시작 (볼륨 초기화 + 리빌드)
docker-compose down -v && docker-compose up --build

# 백그라운드 실행 후 로그 스트리밍
docker-compose up -d && docker-compose logs -f app

# 앱만 재시작 (DB는 유지)
docker-compose restart app
```
