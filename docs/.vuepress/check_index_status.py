#!/usr/bin/env python3
import json
import os
import subprocess
import time
import urllib.request
from datetime import datetime

import google.auth.transport.requests
from google.oauth2.credentials import Credentials

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
TOKEN_FILE = os.path.join(SCRIPT_DIR, "indexing_token.json")
SITE_URL = "https://parkjju.github.io/vue-TIL/"
BASE_URL = "https://parkjju.github.io/vue-TIL"
INSPECTION_API = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"

SINCE = "2 weeks ago"


def get_access_token():
    with open(TOKEN_FILE) as f:
        data = json.load(f)
    creds = Credentials(
        token=None,
        refresh_token=data["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=data["client_id"],
        client_secret=data["client_secret"],
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
    print(f"\n{sep}")
    print(f"[{now}] 색인 상태 검사 시작")
    print(sep)

    try:
        token = get_access_token()
    except Exception as e:
        print(f"토큰 발급 실패: {e}")
        return

    urls = get_recent_urls()
    if not urls:
        print("최근 2주 내 추가/변경된 문서 없음")
        subprocess.run(["osascript", "-e", 'display notification "최근 2주 내 변경 문서 없음" with title "색인 상태 검사 완료"'])
        return
    print(f"최근 2주 내 변경 문서 {len(urls)}개 검사\n")

    not_indexed = []
    errors = []

    for url in urls:
        try:
            result = check_url(url, token)
            state = (
                result.get("inspectionResult", {})
                .get("indexStatusResult", {})
                .get("coverageState", "Unknown")
            )
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

    if not_indexed:
        msg = f"미등록 {len(not_indexed)}개 발견 (전체 {len(urls)}개)"
    else:
        msg = f"전체 {len(urls)}개 모두 색인 등록됨"

    subprocess.run([
        "osascript", "-e",
        f'display notification "{msg}" with title "색인 상태 검사 완료"'
    ])


if __name__ == "__main__":
    main()
