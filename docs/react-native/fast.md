---
title: React Native 개념
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

이후 프로젝트 설치를 위해 다음 명령어를 실행합니다. 몇 가지 옵션들이 등장하는데 이때 첫 번째 선택지를 선택합니다.

```sh
expo init 어플리케이션이름
```

터미널 상에서 `expo`에 로그인을 해줍니다.

```sh
expo login
```

계정명 또는 이메일 / 패스워드 입력 후 로그인을 진행하게 됩니다.

설치가 됐으면 VSC에서 해당 폴더를 열어 `npm start` 명령어를 입력해줍니다. 이때 **로컬 서버 위에서 어플리케이션이 동작하기 때문에 동일한 네트워크에서 두 기기를 작동하고 있어야 한다.**

## 구성요소

React Native는 기본적으로 리액트와 유사하지만 **웹 개발이 아니므로 `div`, `span` 등의 일반 HTML 태그들이 사용되지 않습니다.** 대신 어플리케이션에서 사용되는 `View`, `Text` 등의 컴포넌트가 있습니다. 스타일 프로퍼티들도 유사하지만 다른 부분이 많습니다.

스타일 정의 시 객체를 정의해도 되고 `StyleSheet.create`메서드에 스타일 객체를 전달해도 됩니다. `StyleSheet`을 활용하면 자동완성이 지원됩니다.

```javascript
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
    },
});

// or

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
    },
};
```

:::warning
모든 텍스트는 `Text` 컴포넌트 안에 들어가야 합니다.
:::

또한 써드파티 컴포넌트들이 존재하는데, 웹에서의 리액트는 함수형 컴포넌트 `return`에 담긴 컴포넌트 요소들이 한 스크린에 표기되게 되지만 리액트 네이티브에서는 **return되는 스크린과 별개로 OS 자체적으로 소통하는 컴포넌트가 존재합니다.** `StatusBar` 컴포넌트가 그 예시입니다.

리액트 네이티브에서는 다양한 API들이 있습니다. 핸드폰 자체에 진동을 준다던가 하는 기능들을 제공하는데 `Async Storage`라고 하는 API는 현재 `deprecated`되어 리액트 네이티브 팀에서 관리하고 있지 않습니다. 이러한 API들은 리액트 네이티브 **커뮤니티에서 찾을 수 있는데,** 같은 기능을 갖는 다양한 선택지가 제공되고 있어서 장점이자 단점으로 꼽힌다.

이러한 점에서 **Expo 팀 자체적으로 제공하는 API들이 더 순도높은 RN 어플리케이션 제작에 더 유용하다고 할 수 있다.**
