#!/usr/bin/env python3
import json
import os
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

SKIP_FILES = {"README.md", "index.md", "archive.md"}
SKIP_DIRS = {".vuepress", "dist", "public"}


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


def get_all_urls():
    docs_dir = os.path.join(REPO_DIR, "docs")
    urls = []
    for root, dirs, files in os.walk(docs_dir):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for file in files:
            if not file.endswith(".md") or file in SKIP_FILES:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, REPO_DIR).replace("\\", "/")
            url_path = rel_path.removeprefix("docs/").replace(".md", ".html")
            urls.append(f"{BASE_URL}/{url_path}")
    return sorted(urls)


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

    urls = get_all_urls()
    print(f"총 {len(urls)}개 URL 검사\n")

    not_indexed = []
    errors = []

    for i, url in enumerate(urls, 1):
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
