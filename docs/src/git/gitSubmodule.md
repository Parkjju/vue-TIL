---
title: Git submodule
---

[참고자료 - 유튜브 생활코딩 채널, 저장소 안에 저장소 - git submodule](https://www.youtube.com/watch?v=TAe4uZqYt6c&t=262s)

### 실습내용

1. 레포 세개 생성 - 부모 레포가 될 super, 자식 레포 둘 sub1, sub2
2. sub1 sub2 모두 touch 1로 파일명이 1인 파일을 생성하여 커밋&푸시
3. **git remote -v**를 통해 자식 레포 URL 복사 -> 부모 레포에 **git submodule add URL lib**진행
    - git submodule URL directory_name -> directory_name 안에 클론됨. (lib과 module이라는 이름으로 두 서브모듈 클론진행)
4. 부모 레포에서 lib 디렉토리로 이동 (cd lib)
5. git log --oneline (부모레포에서 lib으로 이동한 상황에서의 로그 확인)

super/lib 경로에서의 로그

```bash
~/Desktop/super/lib (main)
$git log --oneline
230ca38 (HEAD -> main, origin/main, origin/HEAD) 1
```

sub1 디렉토리에서의 로그

```bash
~/Desktop/sub1 (main)
$git log --oneline
230ca38 (HEAD -> main, origin/main) 1
```

**둘이 동일함을 확인할 수 있다**

6. 부모 디렉토리로 다시 이동. (cd ..) 후 git status실행
7. .gitmodules확인 -> submodule들에 대한 정보를 표기해놓은 파일 (클론 URL)

```bash
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   .gitmodules
        new file:   lib
        new file:   module
```

8. new file: lib, new file: module은 **lib과 module 디렉토리 안의 파일을 의미하는 것이 아님.** -> **lib과 module이 어떤 버전으로 checkout 되어있는가에 대한 정보**

`checkout이란? 내가 사용할 브랜치를 지정하는 것`

9. git diff --cached 진행 : **워킹 디렉토리와 Staging Area의 차이점 보기**

```bash
+[submodule "lib"]
+       path = lib
+       url = https://github.com/Parkjju/sub1.git
+[submodule "module"]
+       path = module
+       url = https://github.com/Parkjju/sub2.git
diff --git a/lib b/lib
new file mode 160000
index 0000000..230ca38
--- /dev/null
+++ b/lib
@@ -0,0 +1 @@
+Subproject commit 230ca38eded3fcccb1c7c319c5c612b9635e3ebe
diff --git a/module b/module
new file mode 160000
index 0000000..dba00f3
--- /dev/null
+++ b/module
@@ -0,0 +1 @@
+Subproject commit dba00f37f0aa102e57c08b24214553a4f2c3e6ab
```

**+Subproject commit .....**문구에서 해당 프로젝트가 어떤 버전(커밋)과 연결(체크아웃) 되어있는가에 대한 정보를 알림.

1. git log로 확인한 lib의 커밋 버전 - 230ca ... & git diff로 확인한 lib 커밋 버전 - 230ca ...
2. module도 동일

3. 위의 정보를 프로젝트를 공유하는 모든 사람들에게 알리기 - git commit -am "message"
4. .gitmodules 정보와 하위 submodule들의 정보를 가지므로, 연결된 super프로젝트를 가진다

### 하위 submodule에서 super 프로젝트에 반영하기

1. mv 1 2;git add .;git commit -m 2;git push (sub1 레포)
2. super 레포에서 git pull을 진행 -> 안됨. (sub1 레포에서 1->2 되었으니, super에서도 lib이 1->2로 되어야함)
    - 하위 서브모듈 레포가 별도의 독립적인 프로젝트이기 때문
3. cd lib (하위 서브모듈로 이동) -> 독립된 저장소에서 git pull을 진행. -> 정상적으로 됨
4. 다시 super로 이동 후 status로 변경상태 확인

```bash
$ git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   lib (new commits)
```

**modified: lib**상태 확인

5. super에서 git diff 진행. & sub1에서 git log --oneline으로 두 커밋확인

-   super에서 git diff 결과

```bash
diff --git a/lib b/lib
index 230ca38..1f4443e 160000
--- a/lib
+++ b/lib
@@ -1 +1 @@
-Subproject commit 230ca38eded3fcccb1c7c319c5c612b9635e3ebe
+Subproject commit 1f4443e419f87ff7ed59fb9d933521617308b1c8
```

sub1에서 git log --oneline 결과

```bash
$ git log --oneline
1f4443e (HEAD -> main, origin/main) 2
230ca38 1
```

**230ca - 1에서, 1f444 2로 바뀌었음** + **super에서의 커밋 버전도 230ca에서 1f44로 바뀌었음을 확인**
직접 확인한 뒤에 super에서 **git commit -am** 진행하여 커밋 반영.

**git commit -am**

-a옵션을 사용하면 스태이징 절차(add)를 생략하고 바로 add와 commit을 동시에 진행

6. sub1 -> mv 2 3 변경후 커밋&푸시, sub2 -> mv 1 2 변경 후 커밋&푸시
7. 다시 super 프로젝트로 돌아와서, 각 서브모듈로 cd 진입하여 각각 pull? -> 효율성 떨어짐
    - 한 번에 해주는 기능 존재
    - **git submodule update --remote**
    - 커밋의 최신을 원격 저장소의 최신으로 업데이트 하라는 옵션 (--remote)
    - remote 옵션이 없다면? -> super 프로젝트에서 마지막으로 커밋하며 연결된 버전으로 업데이트.

**--remote** 옵션 결과

```bash
$ git submodule update --remote
Submodule path 'lib': checked out 'bf1e2f565e17bd5f62b66824779daacfc58ef9c7'
Submodule path 'module': checked out '34bfea670af4634847cccafef07927fbec2e224f'
```

sub1의 가장 최신커밋 버전 -> bf1e, --remote update lib결과 -> bf1e... 동일

```bash
$ git log --oneline
bf1e2f5 (HEAD -> main, origin/main) 3
1f4443e 2
230ca38 1
```

**정리**
_ git submodule update - lib을 커밋한 시점에서 연결된 버전으로 감 (cd로 이동하여 직접 가져왔던 버전?)
_ git submodule update --remote - lib과 연결된 원격저장소 버전으로 감.

8. git submodule summary

```bash
$ git submodule summary
* lib 1f4443e...bf1e2f5 (1):
  > 3

* module dba00f3...34bfea6 (1):
  > 2
```

lib 서브모듈에서, 1f444 -> bf1e로 버전 업데이트가 되었는데, super 프로젝트에서 커밋되지 않은 3이라는 부분이 존재한다.
module 서브모듈에서, dba00 -> 34bf..로 버전 업데이트가 되었는데, super 프로젝트에서 커밋되지 않는 2라는 부분이 존재.

9. git submodule

```bash
$ git submodule
+bf1e2f565e17bd5f62b66824779daacfc58ef9c7 lib (remotes/origin/HEAD)
+34bfea670af4634847cccafef07927fbec2e224f module (remotes/origin/HEAD)
```

+bf -> sub1에서 log online으로 확인하면, bf 커밋으로 체크아웃 되어있다는 것을 알 수 있음. 이를 알리는 명령어가 git submodule
+34 -> sub2에서 .. \* **+** -> 아직 커밋되지 않았다는 뜻으로 이해

10. git status (super에서)

```bash
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   lib (new commits)
        modified:   module (new commits)

no changes added to commit (use "git add" and/or "git commit -a")
```

**modified상황**

11. git commit -am ....
12. 커밋 이후 다시 git submodule을 실행

```bash
$ git submodule
 bf1e2f565e17bd5f62b66824779daacfc58ef9c7 lib (remotes/origin/HEAD)
 34bfea670af4634847cccafef07927fbec2e224f module (remotes/origin/HEAD)
```

+기호가 사라졌음을 알수 있다.

### git submodule update --remote --recursive

--recursive?

sub1이 또 다시 서브모듈을 가지게 되면, 부모 프로젝트에서 recursive를 통해 일괄적인 명령 가능.

1. git submodule foreach git log --oneline

```bash
$ git submodule foreach git log --oneline
Entering 'lib'
bf1e2f5 (HEAD, origin/main, origin/HEAD) 3
1f4443e (main) 2
230ca38 1
Entering 'module'
34bfea6 (HEAD, origin/main, origin/HEAD) 2
dba00f3 (main) 1
```

-   해당 명령어 중 foreach를 통해 super의 서브모듈 각각에 진입하여 로그를 출력함.
-   여러 명령어 출력시 따옴표 + 세미콜론 이용.

```bash
$ git submodule foreach "git log --oneline;ls -al"
Entering 'lib'
bf1e2f5 (HEAD, origin/main, origin/HEAD) 3
1f4443e (main) 2
230ca38 1
total 5
drwxr-xr-x 1 SONG 197121  0  4월 14 19:53 .
drwxr-xr-x 1 SONG 197121  0  4월 14 16:59 ..
-rw-r--r-- 1 SONG 197121 28  4월 14 16:59 .git
-rw-r--r-- 1 SONG 197121  0  4월 14 19:53 3
Entering 'module'
34bfea6 (HEAD, origin/main, origin/HEAD) 2
dba00f3 (main) 1
total 5
drwxr-xr-x 1 SONG 197121  0  4월 14 19:54 .
drwxr-xr-x 1 SONG 197121  0  4월 14 16:59 ..
-rw-r--r-- 1 SONG 197121 31  4월 14 16:59 .git
-rw-r--r-- 1 SONG 197121  0  4월 14 19:54 2
```

log와 ls명령어를 한 번에 처리했음을 확인

### super프로젝트 완성 이후 다른 사람들이 복제할 경우.

그냥 복제해가면 잘못 동작할 수 있다

code -a . 명령여 -> 해당 폴더에 있는 모든 파일을 사이드 바에서 보고싶을때 (vscode)

그냥 클론하게 되면 git에서는 서브모듈을 지닌 부모 프로젝트를 clone할 때에 **수백 개의 하위 모듈을 지니고 있다고 가정**
따라서 clone한 뒤에도 **내부 파일이 존재하지 않은 상태로 클론하게 된다.**
명시적으로 서브모듈을 클론해야함.

**git submodule init < init하고싶은 서브모듈 이름 >** -> 해당 서브모듈만 클론
**git submodule init** -> 서브모듈 전체 클론

git submodue init lib 이후

```bash
$ cat .git/config
[core]
        repositoryformatversion = 0
        filemode = false
        bare = false
        logallrefupdates = true
        symlinks = false
        ignorecase = true
[remote "origin"]
        url = https://github.com/Parkjju/super.git
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
        remote = origin
        merge = refs/heads/main
[submodule "lib"]
        active = true
        url = https://github.com/Parkjju/sub1.git
```

super2 프로젝트에는 전체 서브모듈의 정보가 저장되어 있음.
**하지만, super2의 .git config파일에는 내가 사용할 서브모듈 lib 에 대한 정보들만 채워짐.**

git submodule update 으로 현재 lib과 연결되어있는 버전으로 클론
