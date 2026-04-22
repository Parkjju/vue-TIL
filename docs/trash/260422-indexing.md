---
title: Snack - [Git Hook] Google 색인 자동 등록 및 상태 검사
tags: ['Git', 'Google Search Console']
---

## 개요

새로운 문서를 추가하고 `git push`하면 git의 `pre-push` 훅이 자동으로 Google Indexing API에 색인 등록 요청을 보내도록 자동화한 과정이다.

**흐름 요약:**

```
git push origin main
    → .git/hooks/pre-push 실행 (git 자체 훅)
    → index_new_pages.py: 새 .md 파일 감지 → Indexing API 호출
```

:::tip Claude Code 훅과의 차이

Claude Code PostToolUse 훅은 Claude가 Bash 도구로 실행한 명령에만 반응한다. 터미널에서 직접 `git push`해도 동작하게 하려면 git 자체 훅(`.git/hooks/pre-push`)을 사용해야 한다.

:::

## 사전 준비

### 1. Google Cloud — API 활성화 및 OAuth2 클라이언트 발급

1. [Google Cloud Console](https://console.cloud.google.com) 프로젝트 생성
2. **API 및 서비스 → 라이브러리** 에서 아래 두 API 활성화
    - `Web Search Indexing API` — 색인 등록 요청용
    - `Google Search Console API` — 색인 상태 조회용
3. **API 및 서비스 → OAuth 동의 화면** 구성
    - 앱 유형: 외부
    - 테스트 사용자에 본인 Google 계정 이메일 추가
    - **앱 게시** (테스트 모드는 refresh token이 7일 후 만료됨)
4. **사용자 인증 정보 → OAuth 2.0 클라이언트 ID** 생성
    - 애플리케이션 유형: **데스크톱 앱**
    - 생성된 JSON 파일 다운로드

:::warning 서비스 계정 방식 불가

Search Console의 **사용자 및 권한** 페이지는 일반 Google 계정만 지원하고, **소유권 확인** 페이지에서도 서비스 계정 추가 기능이 현재 UI에서 제거된 상태다.

→ **OAuth2 + 소유자 계정** 방식으로 우회한다.

:::

### 2. refresh token 발급

아래 스크립트를 실행하면 브라우저가 열리고 Google 계정으로 로그인 후 `indexing_token.json`이 생성된다.

```python
# docs/.vuepress/get_token.py
import json, os
from google_auth_oauthlib.flow import InstalledAppFlow

CLIENT_SECRET_FILE = "client_secret_xxx.json"  # 다운로드한 파일명으로 변경
TOKEN_FILE = os.path.join(os.path.dirname(__file__), "indexing_token.json")
SCOPES = [
    "https://www.googleapis.com/auth/indexing",
    "https://www.googleapis.com/auth/webmasters.readonly",
]

flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
creds = flow.run_local_server(port=0)

with open(TOKEN_FILE, "w") as f:
    json.dump({
        "refresh_token": creds.refresh_token,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
    }, f, indent=2)
```

```sh
pip3 install google-auth-oauthlib google-auth-httplib2
python3 docs/.vuepress/get_token.py
```

:::tip 앱 게시 후 토큰 재발급 필요

앱을 테스트 모드에서 게시(프로덕션)로 전환한 뒤 get_token.py를 다시 실행해야 영구 토큰이 발급된다.

:::

## 색인 스크립트

### index_new_pages.py

직전 색인 처리 커밋 이후 새로 추가된 `.md` 파일을 감지해 Indexing API에 등록한다.

```python
# docs/.vuepress/index_new_pages.py
import json, subprocess, sys, os, urllib.request
import google.auth.transport.requests
from google.oauth2.credentials import Credentials

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.join(SCRIPT_DIR, "..", "..")
TOKEN_FILE = os.path.join(SCRIPT_DIR, "indexing_token.json")
LAST_COMMIT_FILE = os.path.join(SCRIPT_DIR, ".last_indexed_commit")
BASE_URL = "https://<username>.github.io/<repo>"
INDEXING_API = "https://indexing.googleapis.com/v3/urlNotifications:publish"


def get_new_md_files(since_commit):
    range_arg = f"{since_commit}..HEAD" if since_commit else "HEAD~1..HEAD"
    result = subprocess.run(
        ["git", "diff", "--name-only", "--diff-filter=AR", range_arg],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    return [
        f.strip() for f in result.stdout.strip().split("\n")
        if f.strip().endswith(".md") and f.strip().startswith("docs/")
    ]


def md_path_to_url(path):
    return f"{BASE_URL}/{path.removeprefix('docs/').replace('.md', '.html')}"


def get_access_token():
    with open(TOKEN_FILE) as f:
        data = json.load(f)
    creds = Credentials(
        token=None, refresh_token=data["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=data["client_id"], client_secret=data["client_secret"],
        scopes=["https://www.googleapis.com/auth/indexing"],
    )
    creds.refresh(google.auth.transport.requests.Request())
    return creds.token


def request_indexing(url, token):
    body = json.dumps({"url": url, "type": "URL_UPDATED"}).encode()
    req = urllib.request.Request(
        INDEXING_API, data=body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def main():
    last_commit = open(LAST_COMMIT_FILE).read().strip() if os.path.exists(LAST_COMMIT_FILE) else None
    current_commit = subprocess.run(
        ["git", "rev-parse", "HEAD"], capture_output=True, text=True, cwd=REPO_DIR
    ).stdout.strip()

    if last_commit == current_commit:
        print("[색인] 변경사항 없음"); return

    new_files = get_new_md_files(last_commit)
    if not new_files:
        open(LAST_COMMIT_FILE, "w").write(current_commit)
        print("[색인] 새로 추가된 문서 없음"); return

    token = get_access_token()
    success = 0
    for path in new_files:
        url = md_path_to_url(path)
        try:
            request_indexing(url, token)
            print(f"[색인] 등록 완료: {url}"); success += 1
        except Exception as e:
            print(f"[색인] 실패: {url} — {e}", file=sys.stderr)

    open(LAST_COMMIT_FILE, "w").write(current_commit)
    print(f"[색인] {success}/{len(new_files)}개 처리 완료")


if __name__ == "__main__":
    main()
```

## git hook 설정

`.git/hooks/pre-push` 파일을 생성하고 실행 권한을 부여한다.

```sh
# .git/hooks/pre-push
#!/bin/sh
/path/to/python3 /path/to/your/repo/docs/.vuepress/index_new_pages.py
```

```sh
chmod +x .git/hooks/pre-push
```

python3 경로는 `which python3`으로 확인한다.

```sh
which python3
# 예: /opt/homebrew/bin/python3
```

:::warning git 훅 환경의 PATH 제한

git 훅은 셸 환경보다 PATH가 좁아 `python3`만 쓰면 패키지가 설치된 Python을 못 찾을 수 있다. 반드시 `which python3`로 확인한 **전체 경로**를 사용해야 한다.

:::

:::tip pre-push vs post-push

git 클라이언트 훅에는 `post-push`가 존재하지 않는다. push 전에 실행되는 `pre-push`를 사용한다. 커밋은 이미 로컬에 존재하므로 색인 스크립트가 새 파일을 정상적으로 감지할 수 있다.

:::

:::warning .git/hooks는 git으로 관리되지 않음

`.git/` 디렉토리는 git 추적 대상이 아니므로 저장소를 새로 클론하면 훅이 사라진다. 팀 프로젝트라면 `scripts/` 등에 훅 파일을 두고 설치 스크립트로 복사하는 방식을 권장한다.

:::

## 매일 색인 상태 검사

### check_index_status.py

최근 2주 내 추가/변경된 문서를 URL Inspection API로 조회하고 결과를 출력한다. 검사 완료 후 macOS 알림 센터로 결과를 알려준다.

```python
# docs/.vuepress/check_index_status.py
import json, os, subprocess, time, urllib.request
from datetime import datetime
import google.auth.transport.requests
from google.oauth2.credentials import Credentials

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
TOKEN_FILE = os.path.join(SCRIPT_DIR, "indexing_token.json")
SITE_URL = "https://<username>.github.io/<repo>/"
BASE_URL = "https://<username>.github.io/<repo>"
INSPECTION_API = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
SINCE = "2 weeks ago"


def get_access_token():
    with open(TOKEN_FILE) as f:
        data = json.load(f)
    creds = Credentials(
        token=None, refresh_token=data["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=data["client_id"], client_secret=data["client_secret"],
        scopes=[
            "https://www.googleapis.com/auth/indexing",
            "https://www.googleapis.com/auth/webmasters.readonly",
        ],
    )
    creds.refresh(google.auth.transport.requests.Request())
    return creds.token


def get_recent_urls():
    result = subprocess.run(
        ["git", "log", f"--since={SINCE}", "--name-only", "--diff-filter=AR", "--format="],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    files = sorted(set(
        f.strip() for f in result.stdout.strip().split("\n")
        if f.strip().endswith(".md") and f.strip().startswith("docs/")
    ))
    return [f"{BASE_URL}/{f.removeprefix('docs/').replace('.md', '.html')}" for f in files]


def check_url(url, token):
    body = json.dumps({"inspectionUrl": url, "siteUrl": SITE_URL}).encode()
    req = urllib.request.Request(
        INSPECTION_API, data=body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def is_indexed(state):
    s = state.lower()
    return "indexed" in s and "not indexed" not in s


def main():
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    sep = "=" * 60
    print(f"\n{sep}\n[{now}] 색인 상태 검사 시작\n{sep}")

    try:
        token = get_access_token()
    except Exception as e:
        print(f"토큰 발급 실패: {e}"); return

    urls = get_recent_urls()
    if not urls:
        print("최근 2주 내 추가/변경된 문서 없음")
        subprocess.run(["osascript", "-e", 'display notification "최근 2주 내 변경 문서 없음" with title "색인 상태 검사 완료"'])
        return
    print(f"최근 2주 내 변경 문서 {len(urls)}개 검사\n")

    not_indexed, errors = [], []

    for url in urls:
        try:
            result = check_url(url, token)
            state = result.get("inspectionResult", {}).get("indexStatusResult", {}).get("coverageState", "Unknown")
            if is_indexed(state):
                print(f"[등록됨] {url}")
            else:
                not_indexed.append((url, state))
                print(f"[미등록] {url} — {state}")
        except Exception as e:
            errors.append((url, str(e)))
            print(f"[오류]   {url} — {e}")
        time.sleep(0.2)

    print(f"\n{sep}")
    print(f"완료: 전체 {len(urls)}개 | 미등록 {len(not_indexed)}개 | 오류 {len(errors)}개")

    if not_indexed:
        print("\n[미등록 목록]")
        for url, state in not_indexed:
            print(f"  {url}  ({state})")

    if errors:
        print("\n[오류 목록]")
        for url, err in errors:
            print(f"  {url}  ({err})")

    msg = f"미등록 {len(not_indexed)}개 발견 (전체 {len(urls)}개)" if not_indexed else f"전체 {len(urls)}개 모두 색인 등록됨"
    subprocess.run(["osascript", "-e", f'display notification "{msg}" with title "색인 상태 검사 완료"'])


if __name__ == "__main__":
    main()
```

### launchd 등록 (macOS)

crontab은 잠자기 상태에서 스케줄을 스킵하지만, `launchd`는 잠자기 중 놓친 작업을 **깨어난 직후 실행**한다.

`~/Library/LaunchAgents/com.<name>.index-check.plist` 파일을 생성한다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.<name>.index-check</string>
    <key>ProgramArguments</key>
    <array>
        <string>/path/to/python3</string>
        <string>-u</string>
        <string>/path/to/your/repo/docs/.vuepress/check_index_status.py</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PYTHONUNBUFFERED</key>
        <string>1</string>
    </dict>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/path/to/your/repo/docs/.vuepress/index_check.log</string>
    <key>StandardErrorPath</key>
    <string>/path/to/your/repo/docs/.vuepress/index_check.log</string>
</dict>
</plist>
```

등록 및 확인:

```sh
launchctl load ~/Library/LaunchAgents/com.<name>.index-check.plist
launchctl list | grep index-check
```

출력에 `-  0  com.<name>.index-check`가 보이면 등록 완료다. (앞의 `-`는 현재 실행 중이 아님을 의미)

:::warning Python 출력 버퍼링

launchd는 터미널이 없는 환경에서 실행되므로 Python이 출력을 버퍼링한다. `-u` 플래그와 `PYTHONUNBUFFERED=1`을 설정해야 로그 파일에 실시간으로 기록된다.

:::

:::tip launchd vs crontab

`StartCalendarInterval`을 사용하는 launchd는 Mac이 잠자기 상태여서 스케줄을 놓쳤더라도 다음 부팅/깨어남 시 즉시 실행된다. crontab은 해당 시각을 그냥 스킵한다.

:::

### 결과 확인

로그 파일에 누적 기록된다.

```sh
tail -100 docs/.vuepress/index_check.log
```

검사 완료 시 macOS 알림 센터로 결과가 전달된다.

- 최근 변경 문서 없을 때: `최근 2주 내 변경 문서 없음`
- 미등록 있을 때: `미등록 N개 발견 (전체 N개)`
- 전부 등록됐을 때: `전체 N개 모두 색인 등록됨`

## .gitignore 설정

credential 파일들이 커밋에 포함되지 않도록 추가한다.

```
docs/.vuepress/*.json
docs/.vuepress/get_token.py
docs/.vuepress/.last_indexed_commit
docs/.vuepress/index_check.log
```

## 동작 확인

`git push origin main` 실행 후 `.last_indexed_commit` 파일이 생성/갱신되면 훅이 정상 동작한 것이다.

새로 추가된 `.md` 파일이 있으면 다음과 같이 출력된다.

```
[색인] 등록 완료: https://<username>.github.io/<repo>/database/some-doc.html
[색인] 1/1개 처리 완료
```

색인 반영은 수 시간 ~ 1일 후 Search Console에서 확인 가능하다.
