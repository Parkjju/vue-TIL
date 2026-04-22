---
title: Snack - [Claude Code] git push 시 Google 색인 자동 등록
tags: ['Claude Code', 'Google Search Console']
---

## 개요

새로운 문서를 추가하고 `git push`하면 Claude Code 훅이 자동으로 Google Indexing API에 색인 등록 요청을 보내도록 자동화한 과정이다.

**흐름 요약:**

```
git push origin main
    → PostToolUse 훅 발동
    → hook_trigger.py: 명령어 확인
    → index_new_pages.py: 새 .md 파일 감지 → Indexing API 호출
```

## 사전 준비

### 1. Google Cloud — Indexing API 활성화 및 OAuth2 클라이언트 발급

1. [Google Cloud Console](https://console.cloud.google.com) 프로젝트 생성
2. **API 및 서비스 → 라이브러리** → `Web Search Indexing API` 검색 후 활성화
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
SCOPES = ["https://www.googleapis.com/auth/indexing"]

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
        ["git", "diff", "--name-only", "--diff-filter=A", range_arg],
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
    current_commit = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, cwd=REPO_DIR).stdout.strip()

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

### hook_trigger.py

Claude Code PostToolUse 훅에서 호출되는 진입점. stdin에서 훅 JSON을 읽어 `git push` 명령어인지 확인한다.

```python
# docs/.vuepress/hook_trigger.py
import json, subprocess, sys, os

data = json.loads(sys.stdin.read())
cmd = data.get("tool_input", {}).get("command", "")

if "git push" not in cmd or "gh-pages" in cmd:
    sys.exit(0)

repo_dir = "/path/to/your/repo"
script = os.path.join(repo_dir, "docs/.vuepress/index_new_pages.py")
result = subprocess.run(["python3", script], cwd=repo_dir)
sys.exit(result.returncode)
```

## Claude Code 훅 설정

`.claude/settings.local.json`에 PostToolUse 훅을 등록한다.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 /path/to/your/repo/docs/.vuepress/hook_trigger.py"
          }
        ]
      }
    ]
  }
}
```

## .gitignore 설정

credential 파일들이 커밋에 포함되지 않도록 추가한다.

```
docs/.vuepress/*.json
docs/.vuepress/get_token.py
docs/.vuepress/.last_indexed_commit
```

## 동작 확인

`git push origin main` 실행 후 `.last_indexed_commit` 파일이 생성/갱신되면 훅이 정상 동작한 것이다.

새로 추가된 `.md` 파일이 있으면 다음과 같이 출력된다.

```
[색인] 등록 완료: https://<username>.github.io/<repo>/database/some-doc.html
[색인] 1/1개 처리 완료
```

색인 반영은 수 시간 ~ 1일 후 Search Console에서 확인 가능하다.
