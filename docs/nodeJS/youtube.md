---
title: node JS - setup
---

## What is node js?

크롬 V8 자바스크립트 엔진으로 빌드 된 JS 런타임? -> 브라우저 밖에서 돌아가는 JS!!
브라우저 위에서만 작동하던 JS를 일반 프로그래밍 언어(Python Java,,,)처럼 작동할 수 있게됨

```sh
> node
Type ".help" for more information.
> console.log("hi~")
hi~
undefined
```

## npm

npm is a package manager for the JavaScript programming languange.
JS언어를 위한 패키지 매니저 (pip)
yarn도 있음. 거의 차이가 없다

## SET UP

### Create NodeJS Project

1. 디렉토리 생성.
2. `package.json`파일을 생성

```json
{
    "name": "wetube"
}
```

json : 프로그래머가 파일에 정보를 저장하기 위해 만든 방식 중 하나. nodeJS의 경우 package.json파일을 통해 프로젝트 정보 저장 (only lowercase!!)

직접 생성하지 않아도 됨. `npm init` 명령어를 이용하자
npm init 전에 git repository 연결해놓기

```sh
baggyeongjun-ui-MacBook-Pro:youtubeClone parkgyeongjun$ npm init # !!!!
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (youtubeclone)
version: (1.0.0)
description: The best way to watch videos.
entry point: (index.js)
test command:
git repository: (https://github.com/Parkjju/youtubeClone.git)
keywords:
author: Parkjju
license: (ISC) MIT
About to write to /Users/parkgyeongjun/Desktop/youtubeClone/package.json:
# 파일정보는 중략
Is this OK? (yes)
```

완료 후 package.json파일 생성됨 (입력했던 정보들 기입된 상태)

```json
{
    "main": "index.js"
}
```

main : 프로젝트의 대표파일이 무엇인지 가리킴

## 코드의 실행

package.json 파일을 생성하고, init까지 진행한 뒤에 main파일을 생성한다.

```js
// index.js
console.log('hello world');
```

이후 콘솔에 `node index.js`를 실행하면 index.js파일을 실행한다.

하지만, node를 통해 파일을 실행하지 않을 것임. package.json으로 실행!

### package.json - scripts

package.json파일에 scripts를 추가하여 npm명령어로 원하는 명령을 간단하게 실행할 수 있게 된다.
scripts에 win이라는 명령어가 실행할 코드로 `node index.js`라는 것을 package.json에 저장

```json
{
    "scripts": {
        "win": "node index.js"
    }
}
```

`npm run win`을 통해서 실행할 수 있다. (스크립트 내의 코드 이름은 자유롭게 설정 가능)

```sh
baggyeongjun-ui-MacBook-Pro:youtubeClone parkgyeongjun$ npm run win # !!

> youtubeclone@1.0.0 win /Users/parkgyeongjun/Desktop/youtubeClone
> node index.js

hello!
```

## 서버 만들기

`npm i packageName` or `npm install packageName` 명령어를 통해 패키지를 설치
서버를 만들기 위해 express 패키지 설치 - `npm install express` & express가 의존하는 패키지 -> node_modules/express/package.json의 dependencies 패키지들이 다운로드 됨.
npm install 진행 전에 꼭 package.json 저장 및 종료하고 실행하기!

node_modules 폴더 : npm으로 설치한 모든 패키지가 저장

## Dependencies

npm은 package.json의 **dependencies**를 알아서 찾아 `npm i`만 입력해도 필요한 모두 설치해준다. - 따로 node_modules를 관리할 필요가 없어짐

package-lock.json - 패키지들을 안전하게 보호해줌. 프로젝트를 공유시 패키지 버전으로 인한 충돌을 예방한다.

## babeljs

babeljs.io - Babel is a JavaScript compiler.
아직 nodeJS가 이해하지 못하는 JavaScript 코드가 존재한다. -> nodeJS가 이해하는 자바스크립트만 쓰거나 babel을 사용한다. (최신 자바스크립트를 컴파일해줌.)

@babel/core라는 패키지가 devDependencies로 설치된다.

```json
{
    "dependencies": {
        "express": "^4.17.1"
    },
    "devDependencies": {
        "@babel/core": "^7.14.8"
    }
}
```

devDependencies : 개발에게만 필요한 dependencies (업무 효율상 필요한 extension과 같은 느낌)
어쨌든 dependencies, devDependencies 모두 node_modules에 저장된다.
`npm install --save-dev @babel/core` 를 통해 devDependencies에 저장한다.

### babel 설정파일 만들기

1. `touch babel.config.json`
2. babel.config.json파일에 다음 코드 붙여넣기

```json
{
    "presets": ["@babel/preset-env"]
}
```

다음 명령어 실행

```sh
npm install @babel/preset-env --save-dev
```

여기까지 진행하면 babel setup완료

---

### babel 사용하기

babel로 컴파일하는 scripts 등록하기

1. `npm install @babel/core @babel/node --save-dev`
2. scripts 등록
3. index.js 최신 자바스크립트 코드로 바꾸고 실행.

```js
import express from 'express'; //최신 문법
// const express = require("express");

console.log('HI!');
```

```json
// package.json
{
    "scripts": {
        "dev": "babel-node index.js"
    }
}
```

### nodemon

코드에 대한 수정이 있을 시 매번 저장 및 `npm run dev` 하기가 귀찮다 - nodemon 활용하기
nodemon -> 파일 수정을 자동 감지하여 재시작해줌.

1. `npm i nodemon --save-dev`
2. scripts수정
3. npm run dev

```json
// package.json
{
    "scripts": {
        "dev": "nodemon --exec babel-node index.js"
    }
}
```

```sh
> nodemon --exec babel-node index.js

[nodemon] 2.0.12
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `babel-node index.js`
HI!
[nodemon] clean exit - waiting for changes before restart
```

nodemon 콘솔창이 종료되지 않고 계속 살아있음.
