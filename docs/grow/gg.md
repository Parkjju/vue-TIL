---
title: Jun.gg 제작기

---
## Jun.gg

우연한 기회로 자바스크립트 강의를 촬영하게 되어 강의 말미에 완성해볼 최종 프로젝트 주제를 생각해보던 가운데 OP.GG 롤 전적검색 사이트를 클론해보면.. 재밌을 것 같아 시작하게 됩니다. 간단한 프로젝트 진행 현황을 공유하고 발생했던 이슈들에 대해 정리합니다. 

## 프로젝트 세팅

백엔드를 통해 DB관리는 하지 않지만, 이후 서술할 CORS이슈로 인해 `node.js` 서버 구축을 어느정도 해야했습니다.

`babel`관련 패키지, `express`서버와 `morgan`을 통해 미들웨어를 관리합니다.

```json
{
  "name": "Jun.gg",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/Parkjju/Jun.gg.git",
  "author": "Parkjju <rudwns3927@gmail.com>",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon --exec babel-node src/server.js"
  },
  "devDependencies": {
    "@babel/core": "^7.17.8",
    "@babel/node": "^7.16.8",
    "@babel/preset-env": "^7.16.11",
    "@babel/compat-data": "^7.17.7",
    "nodemon": "^2.0.15"
  },
  "dependencies": {
    "express": "^4.17.3",
    "morgan": "^1.10.0"
  }
}
```

`package.json`입니다. `nodemon`을 통해 라이브 서버를 돌리게 됩니다.

`babel-node`로 `node.js`에서 인식하지 못하는 최신 자바스크립트 문법을 자동 컴파일해주는 스크립트입니다. `src/server.js`에는 서버를 돌리는 자바스크립트 파일 경로를 명시하였습니다.

각종 설치 패키지들은 위와 같이 설치하면 되는데, `@babel/compat-data`패키지까지 설치해야 에러가 발생하지 않습니다. 관련 [이슈 깃헙 링크를](https://github.com/laravel-mix/laravel-mix/issues/2383) 첨부합니다.

## ejs

보통 pug와 같은 템플릿 엔진을 설정해야 정상적으로 돌아가는데, 프로젝트 규모 자체가 크지도 않고 애셋 파일을 강의에 제공 시 노드에 대한 내용이 깊어지면 안되기 때문에 **정적 파일만을 렌더링 하고 싶었습니다.**

찾아보니 `ejs` 템플릿 엔진을 통해 각종 html과 같은 정적 파일을 렌더링 할수 있다고 합니다.

## CORS

라이엇 API 테스트를 위해 라이엇 개발자 사이트에 들어가 키 발급 후 테스트를 진행하였습니다. 추후 CORS조사 후 정리할 예정이지만, 간단히 이슈 원인에 대해 나누면 **라이엇은 클라이언트 단의 CORS 요청을 막아둔 상태였습니다.** 크롬 브라우저에서 에러가 발생하여 어쩔 수 없이 로컬서버를 통해 통신하는 방법밖에 없었습니다.

## Reference

1. \[nodeJS 템플릿과 html관한 오류\]