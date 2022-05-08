---
title: React Native 속성 정리
---

앱 개발에 필요한 React Native 필수 요소들을 정리합니다.

## 설치

`expo-cli`를 설치해줍니다. `expo`는 리액트 네이티브 개발을 도와줍니다. [snack.expo.dev](https://snack.expo.dev/)에서는 웹 상에서 리액트 네이티브를 통한 어플리케이션 개발을 진행할 수 있습니다.

```sh
npm install --global expo-cli
```

이후 `homebrew`를 통해 `watchman`을 설치해줍니다.

```sh
brew update
brew install watchman
```

## 구성요소

React Native는 기본적으로 리액트와 유사하지만 **웹 개발이 아니므로 `div`, `span` 등의 일반 HTML 태그들이 사용되지 않습니다.** 대신 어플리케이션에서 사용되는 `View`, `Text` 등의 컴포넌트가 있습니다. 스타일 프로퍼티들도 유사하지만 다른 부분이 많습니다.
