#!/usr/bin/env python3
import json
import subprocess
import sys
import os
import urllib.request

import google.auth.transport.requests
from google.oauth2.credentials import Credentials

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.join(SCRIPT_DIR, "..", "..")
TOKEN_FILE = os.path.join(SCRIPT_DIR, "indexing_token.json")
LAST_COMMIT_FILE = os.path.join(SCRIPT_DIR, ".last_indexed_commit")
BASE_URL = "https://parkjju.github.io/vue-TIL"
INDEXING_API = "https://indexing.googleapis.com/v3/urlNotifications:publish"


def get_last_indexed_commit():
    if os.path.exists(LAST_COMMIT_FILE):
        with open(LAST_COMMIT_FILE) as f:
            return f.read().strip()
    return None


def save_last_indexed_commit(commit_hash):
    with open(LAST_COMMIT_FILE, "w") as f:
        f.write(commit_hash)


def get_current_commit():
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    return result.stdout.strip()


def get_new_md_files(since_commit):
    if since_commit:
        range_arg = f"{since_commit}..HEAD"
    else:
        range_arg = "HEAD~1..HEAD"

    result = subprocess.run(
        ["git", "diff", "--name-only", "--diff-filter=A", range_arg],
        capture_output=True, text=True, cwd=REPO_DIR
    )
    return [
        f.strip() for f in result.stdout.strip().split("\n")
        if f.strip().endswith(".md") and f.strip().startswith("docs/")
    ]


def md_path_to_url(path):
    path = path.removeprefix("docs/")
    path = path.replace(".md", ".html")
    return f"{BASE_URL}/{path}"


def get_access_token():
    with open(TOKEN_FILE) as f:
        data = json.load(f)

    creds = Credentials(
        token=None,
        refresh_token=data["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=data["client_id"],
        client_secret=data["client_secret"],
        scopes=["https://www.googleapis.com/auth/indexing"],
    )
    creds.refresh(google.auth.transport.requests.Request())
    return creds.token


def request_indexing(url, access_token):
    body = json.dumps({"url": url, "type": "URL_UPDATED"}).encode()
    req = urllib.request.Request(
        INDEXING_API,
        data=body,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def main():
    last_commit = get_last_indexed_commit()
    current_commit = get_current_commit()

    if last_commit == current_commit:
        print("[색인] 변경사항 없음 (이미 처리됨)")
        return

    new_files = get_new_md_files(last_commit)

    if not new_files:
        save_last_indexed_commit(current_commit)
        print("[색인] 새로 추가된 문서 없음")
        return

    try:
        access_token = get_access_token()
    except Exception as e:
        print(f"[색인] 토큰 발급 실패: {e}", file=sys.stderr)
        sys.exit(1)

    success = 0
    for path in new_files:
        url = md_path_to_url(path)
        try:
            request_indexing(url, access_token)
            print(f"[색인] 등록 완료: {url}")
            success += 1
        except Exception as e:
            print(f"[색인] 등록 실패: {url} — {e}", file=sys.stderr)

    save_last_indexed_commit(current_commit)
    print(f"[색인] {success}/{len(new_files)}개 처리 완료")


if __name__ == "__main__":
    main()
