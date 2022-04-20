---
title: PR 로컬에 가져오기

---
## PR 가져오기

Git을 기반으로 하는 프로젝트를 다룰 때에 PR에 대한 테스트를 진행 후 병합을 진행하고 싶을 때가 많습니다. (실제로 더 안전한 방법입니다)

PR을 가져오기에 앞서 PR `pull`을 위한 브랜치를 먼저 생성해줍니다.

```sh
git checkout -b pr/test
```

이후 깃헙 Pull Request탭에 들어가 URL을 보면 다음과 같은 형태가 보이실겁니다.

![image](../.vuepress/assets/git/pr.png)

`Username/repository/pull/1`

`pull` 뒤의 숫자가 해당 PR의 아이디이며, 이를 통해 각 PR들을 구분하여 로컬 상에 불러올 수 있게 됩니다. PR을 로컬에 가져오려면 다음의 명령어를 실행하면 됩니다.

```sh
git pull origin pull/1/head:main

git pull 원격저장소_브랜치명 pull/pull_ID/head:PR의_브랜치명
```



