---
title: React Native AppLoading
---

## AppLoading

앱로딩 컴포넌트는 어플 실행과 함께 필요한 리소스들을 모두 불러오는 작업을 진행합니다.

AppLoading 컴포넌트가 렌더링 되는 한 다른 요소들은 사용할 수 없게 됩니다. AppLoading에는 세 가지의 중요한 프롭스가 있습니다.

1. `onFinish` - 로딩이 끝난 뒤 실행되는 콜백 함수를 전달합니다.
2. `startAsync` - 앱 로딩이 정상적으로 마무리 되면 fulfilled 상태로 프라미스 객체를 반환해주도록 콜백 함수를 전달해야 하는 프롭스입니다.
3. `onError` - 에러 처리를 위한 프롭스입니다. 에러 발생 시 전달된 콜백 함수에 에러를 인자로 담아 실행합니다.

:::warning deprecated
AppLoading은 현재 deprecated상태입니다. [공식 문서](https://docs.expo.dev/versions/latest/sdk/splash-screen/)를 참조하여 관련 내용에 대해 문서 추가 예정입니다.
:::

## Asset 로딩

앱 개발 시에는 SVG, Font와 같은 것들을 프리로딩 해야 하는 경우가 많습니다. `expo-font`와 `expo-asset`을 설치합니다.

```sh
expo install expo-asset
expo install expo-font
```

먼저 폰트를 프리로딩 해보겠습니다. AppLoading 컴포넌트의 `startAsync` 프롭스에 전달한 함수에서 폰트를 프리로딩 합니다. 폰트는 `@expo/vector-icons`에 위치하며 원하는 폰트를 `Font.loadAsync` 메서드를 통해 불러올 수 있습니다. 이때 `loadAsync`는 기본적으로 객체를 파라미터로 받습니다. `{폰트명 : require("폰트경로/폰트이름.ttf")}`

애셋 프리로딩도 동일하게 작동합니다. `expo-font`로부터 Asset 객체를 임포트 한 후 loadAsync 메서드를 통해 애셋을 불러옵니다.

파일 시스템이 아닌 특정 서버에 애셋을 요청할 수도 있습니다. [공식 문서](https://docs.expo.dev/versions/v45.0.0/react-native/image/#prefetch)를 참조해주세요.

```javascript
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

export default function App() {
    const startLoading = async () => {
        await Font.loadAsync(Ionicons.font);
        await Asset.loadAsync('애셋 경로');
        await Image.prefetch(url);
    };

    if (!ready) {
        return <AppLoading startAsync={startLoading} />;
    }
    return null;
}
```

위와 같이 코드를 직접 작성해도 되지만 이를 대체해줄 `useAssets` 훅이 존재합니다 [다음의 링크를](https://docs.expo.dev/versions/latest/sdk/asset/#useassets) 참조해주세요.

`const [asset] = useAssets([require("파일 경로")])`와 같이 작성하면 되고 파일이 존재하지 않을 시 undefined를 리턴합니다. `useAssets`훅은 임포트가 따로 필요없습니다.

폰트의 경우에도 따로 임포트가 필요하지 않고 `const [loaded] = Font.useFonts(Ionicons.font)` 이 코드의 형식으로 작성하면 됩니다.

프리로딩 시 API요청이나 서버로부터 비동기적인 작업을 하는 것이 아닌 이상 훅을 활용하는 것이 더 편리하고 직관적입니다.

```javascript
const [asset] = useAssets([require('파일 경로')]);
const [loaded] = Font.useFonts(Ionicons.font);

if (!asset || !loaded) {
    return <AppLoading />;
}
```
