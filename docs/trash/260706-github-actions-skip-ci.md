---
title: Snack - [CI/CD] GitHub Actions에서 [skip ci]로 특정 푸시 워크플로 건너뛰기
tags: ['CI/CD', 'GitHub Actions']
---

## 개요

README 문서만 수정하고 push할 때, 테스트 → 빌드 → 배포로 이어지는 CI 워크플로를 굳이 돌릴 필요가 없다. 코드가 바뀐 게 없으니 배포 결과도 동일하고, 몇 분의 러너 시간과 Cloud Run 롤아웃만 낭비된다. 이럴 때 **커밋 메시지에 `[skip ci]`를 넣으면 그 push에 대한 워크플로 실행 자체가 생성되지 않는다.**

## 사용법

커밋 메시지 어딘가에 아래 키워드 중 하나를 포함하면 된다.

```bash
git commit -m "docs: update README with CI/CD notes [skip ci]"
git push
```

GitHub이 인식하는 키워드는 다음과 같다. (제목/본문 어디에 있어도 동작)

| 키워드         | 형태            |
| -------------- | --------------- |
| `[skip ci]`    | 대괄호          |
| `[ci skip]`    | 대괄호 (순서 무관) |
| `[no ci]`      | 대괄호          |
| `[skip actions]` | 대괄호        |
| `[actions skip]` | 대괄호        |
| `skip-checks: true` | 커밋 본문 (trailer, 앞에 빈 줄 필요) |

가장 많이 쓰는 건 `[skip ci]`다.

:::tip 여러 커밋을 한 번에 push할 때
`git push`가 여러 커밋을 한꺼번에 올릴 경우, **HEAD(가장 최근) 커밋 메시지**에만 키워드가 있으면 그 push 전체가 스킵된다. 중간 커밋에만 붙어 있으면 무시된다.
:::

## 동작 원리 — "스킵"이 아니라 "생성 안 함"

`[skip ci]`는 워크플로를 *실행하다가 중간에 멈추는* 것이 아니다. GitHub이 이벤트를 받는 시점에 **워크플로 run 자체를 만들지 않는다.** 그래서:

- Actions 탭에 실패/취소된 run이 남지 않고, 아예 새 run이 나타나지 않는다.
- `gh run list`로 확인해도 해당 push에 대한 항목이 생기지 않는다.

```bash
# push 직후 확인 — 새 run이 없으면 정상 스킵
gh run list --limit 3
```

## 주의할 점

:::warning `push`·`pull_request` 이벤트에만 적용된다
`[skip ci]`는 `push`와 `pull_request` 트리거에 대해서만 동작한다. `workflow_dispatch`(수동 실행), `schedule`(크론), `repository_dispatch` 등으로 트리거되는 워크플로는 커밋 메시지와 무관하게 그대로 실행된다.
:::

- **필수 체크(required status check)를 걸어둔 브랜치**에서는 주의가 필요하다. PR 머지 조건으로 특정 워크플로 성공을 요구하는데 `[skip ci]`로 run이 생성되지 않으면, 그 체크가 "대기 중" 상태로 남아 머지가 막힐 수 있다. 이 경우엔 스킵을 쓰지 말거나, 조건부 실행(`paths-ignore` 등)으로 설계를 바꾸는 편이 낫다.
- 문서/설정만 바뀌는 경로를 상시 제외하고 싶다면, 커밋마다 `[skip ci]`를 붙이는 대신 워크플로에 `paths-ignore`를 두는 방법도 있다.

```yaml
on:
  push:
    branches: [main]
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

`[skip ci]`는 "이번 한 번만 건너뛰기", `paths-ignore`는 "이 경로 변경은 항상 무시"라는 차이로 이해하면 된다.
