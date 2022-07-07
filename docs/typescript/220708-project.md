---
title: Typescript 프로젝트 세팅
---

## 프로젝트 세팅

[why Typescript?](./why.md) 문서에서 `ts-node` 및 전역설치된 타입스크립트를 사용하는 방법에 대해 정리해두었습니다. 하지만 타입스크립트는 하나부터 열까지 직접 타입스크립트로 개발한다기 보다 이미 제공된 node.js 프로젝트를 가져다 쓰거나 라이브러리를 설치할 때에 활용하는 경우가 많습니다.

따라서 타입스크립트 기반의 실질적인 프로젝트 세팅은 다음과 같은 방식으로 진행됩니다.

1. `npm init -y`로 node.js 프로젝트 초기화를 시켜줍니다.
2. `package.json`의 `main`과 `script` 프로퍼티를 우선 지웁니다.
3. `npm install -D typescript`로 devDependencies에 타입스크립트를 설치합니다.
4. `src` 폴더를 생성하고 그 밑에 `index.ts`를 생성합니다.
5. `index.ts`파일을 컴파일하여 자바스크립트 파일을 받기 위해 `tsconfig.json` 파일을 프로젝트 루트 위치에 생성합니다.

## tsconfig.json

타입스크립트 설정파일에는 몇 가지 옵션들이 존재합니다. vscode상에서 `tsconfig.json`을 생성한 뒤 프로퍼티 제작을 하려고 하면 자동완성 기능을 제공하여 편리합니다.

다음은 tsconfig.json의 프로퍼티들에 대한 내용입니다.

1. `"include" : ["src"]` - include 프로퍼티는 타입스크립트 컴파일 시 배열에 전달된 디렉터리 내부의 모든 파일을 확인한다는 의미입니다.
2. `"compilerOptions": {"outDir": "build"}` - `compilerOptions`의 `outDir`은 타입스크립트 컴파일 결과로 생성된 자바스크립트 파일을 모아둘 폴더를 지정합니다. 루트 위치에 `build`라는 폴더가 생성되며 빌드 결과물이 만들어집니다.
3. `"compilerOptions": {"outDir":"build", "target": "ES3"}` - `compilerOptions`의 `target`은 빌드될 자바스크립트의 버전을 지정합니다. (ES3, ES...) 예를 들어 ES3에는 const없이 var만 존재하지만 ES6로 빌드하면 const도 지원하게 되어 빌드가 되어도 const로 선언된 코드가 작성됩니다.
4. `compilerOptions": {"lib": ["ES6", "DOM"]}` - `compilerOptions`의 `lib`은 자바스크립트의 어떤 버전이 어떠한 환경 위에서 실행되는지 선언합니다. 이때 환경에 대한 명시를 해두면 **타입스크립트 코딩을 진행할 때에 해당 환경에 맞게끔 객체에 대한 인식이 자동으로 이루어집니다.** 현재의 예시로 `DOM`이라는 환경이 지정되어 있는데 이는 웹 환경에서 실행된다는 의미이며 타입스크립트 파일에서 `document` 객체를 인식하게 됩니다.
5. `"compilerOptions" : {"strict": true}` - `compilerOptions`의 `strict`는 true로 지정하면 타입스크립트 파일 내에서 위험한 자바스크립트 코드를 작성하는 것에 대해 허용하지 않습니다.

:::tip 선언파일.d.ts
lib 프로퍼티에 DOM을 명시하면 웹 환경에서 실행된다는 것을 타입스크립트에서 인지하게 된다고 했는데, 이런 일들이 벌어질 수 있었던 것이 바로 **타입스크립트 선언파일 때문입니다.** `fileName.d.ts`라는 특별한 확장자를 갖습니다.

타입스크립트 선언파일에서는 자바스크립트에서 쓰일 API들에 대한 타입 명시가 이루어집니다.

`package.js`라는 `node_modules` 패키지가 있다고 가정합니다. 여기서 함수를 import해온 뒤 타입스크립트에서 사용한다고 가정할 때에 `strict` 모드가 지정되어 있으면 package.js에서 가져온 함수에 대한 타입을 지정한 뒤에야 사용할 수 있게 됩니다.

`package.d.ts`라는 이름으로 해당 함수의 타입을 설명합니다.

```javascript
// package.js
export function init(config) {
    return true;
}

export function exit(code) {
    return code + 1;
}
```

```javascript
// package.d.ts
// package.js파일의 함수에 대한 콜 시그니쳐
// 또는 각종 변수들에 대한 타입만 선언하면 된다.
// 구현부는 작성 X
interface Config{
    urls: string;
}

declare module "package" {
    function init(config: Config): boolean;
    function exit(code:number): number;
}
```

:::

타입스크립트 빌드를 위해 `scripts` 명령어를 정의합니다.

```json
{
    // ...
    "scripts": {
        "build": "tsc"
    }
    // ...
}
```

`npm run build`를 실행하면 타입스크립트 파일의 빌드가 진행됩니다.

## JSDoc

자바스크립트 기반 프로젝트에서 타입스크립트로 이전할 때에는 어떤 경우가 발생할까요? 선언파일의 경우 자바스크립트 라이브러리에 대해 `declare module`을 통한 함수 콜 시그니쳐 정의나 타입에 대한 정의가 이루어졌었습니다.

외부 자바스크립트 모듈에 대한 타입 정의 시나리오였는데, 이번에는 **현재 관리중인 자바스크립트 파일을 타입스크립트 내에서 사용해야하는 상황입니다.**

먼저 위와 같은 상황을 연출하기 위해서는 tsconfig.json에 `"allowJs":true` 프로퍼티를 추가해야합니다.

타입스크립트는 프로젝트 내에서 자바스크립트 파일들을 완전히 쳐내는 것이 아니라 `allowJs` 프로퍼티가 설정되어 있다면 부분적으로 타입화를 적용할 수 있습니다.

타입스크립트 프로젝트에서는 자바스크립트도 보호해주는데, 주석에 `@ts-check`라는 내용이 첫 라인에 추가한 뒤 JSDoc 문법을 사용하면 자바스크립트에서도 타입에 대한 체크가 가능합니다.

JSDoc은 타입체크를 진행할 함수 바로 위에 작성합니다.

```javascript
// @ts-check
/**
 * Initializes the project
 * @param {object} config
 * @param {boolean} config.debug
 * @param {string} config.url
 * @returns void
 */
export function init(config) {
    return true; // error!
}
```

타입스크립트는 위의 코멘트를 읽고 **자바스크립트 파일에서 타입체크를 진행합니다.** `@returns {void}`가 init함수의 리턴타입과 맞지 않기 때문에 코드 작성 단계에서 타입스크립트가 에러를 발생시킵니다.

또한 JSDoc으로 타입핑이 이루어진 자바스크립트를 모듈로써 다른 타입스크립트에서 불러오면 **해당 함수에 대한 타입이 이미 인지가 되어 콜 시그니쳐를 띄워준다던가의 기능을 제공하게 됩니다.**
