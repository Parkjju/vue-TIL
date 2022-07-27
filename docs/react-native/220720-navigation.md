---
title: React Native Navigation
---

## 설치

리액트 네비게이션 라이브러리는 모바일 앱의 화면에 스택 기능을 적용하여 네비게이션 바 등의 기능을 구현할 수 있게 해줍니다.

```sh
npm install @react-navigation/native
```

CRNA 또는 엑스포 기반의 앱을 제작하는 중이라면 다음 명령어도 실행합니다.

```sh
expo install react-native-screens react-native-safe-area-context
```

Mac OS에서 ios를 개발중이라면 다음 명령어까지 실행합니다.

```sh
npx pod-install ios
```

## 네비게이션 탭 제작

네비게이션 탭을 제작하기 위해서는 먼저 설치부터 진행해야 합니다.

```sh
npm install @react-navigation/bottom-tabs
```

이후 프로젝트 루트 위치에 `navigation`, `screens` 폴더를 생성합니다.

`navigation` 폴더 아래에는 `Tabs.js`로 탭 컴포넌트를 제작하고 `screens` 폴더에서는 각 네비게이션 탭에 해당하는 컴포넌트를 제작하게 됩니다.

```javascript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Movies from '../screens/Movies';
import Search from '../screens/Search';
import TV from '../screens/TV';

const Tab = createBottomTabNavigator();

const Tabs = () => (
    <Tab.Navigator>
        <Tab.Screen name='Movies' component={Movies} />
        <Tab.Screen name='TV' component={Search} />
        <Tab.Screen name='Search' component={TV} />
    </Tab.Navigator>
);

export default Tabs;
```

탭 컴포넌트에서는 `createBottomTabNavigator`를 임포트하여 함수 호출과 함께 컴포넌트를 생성해주게 됩니다. `Tab.Navigator`로 감싸고 각 탭을 `Tab.Screen`으로 표현합니다.

`Tab.Screen`은 `name`, `component` 프롭스를 받습니다. `name`은 탭 클릭 시 스크린 상단 바에 나타나는 텍스트를 나타내고 `component`프롭스는 각 탭 컴포넌트를 나타냅니다.

```javascript
import React from 'react';
import { View, Text } from 'react-native';

const TV = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>TV</Text>
    </View>
);

export default TV;
```

이들 탭 컴포넌트를 렌더링 하기 위해서는 반드시 탭 컴포넌트 위에 `NavigationContainer` 컴포넌트로 감싸야 합니다.

```javascript
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
    // ...
    return (
        <NavigationContainer>
            <Tabs />
        </NavigationContainer>
    );
}
```

각 탭 컴포넌트 제작은 일반 리액트 네이티브 컴포넌트를 활용하여 제작합니다.

:::tip 탭 컴포넌트 props 몇가지

1. initialRouteName : `Tab.Screen`에 등록한 `name` 프롭스의 값들 중 하나를 골라 작성하면 됩니다. 앱 첫 시작 시 해당 탭이 선택되어 나타납니다.
2. screenOptions : `Tab.Navigator` 컴포넌트의 프롭스로 등록합니다. 모든 스크린 및 탭 컴포넌트에 동일하게 적용합니다. 프롭스의 값으로는 객체를 받으며 각 프로퍼티에 대한 내용은 [공식 문서를](https://reactnavigation.org/docs/material-bottom-tab-navigator/#options) 참조해주세요.
3. options : `Tab.Navigator`의 `screenOptions`를 통한 일괄적 적용이 아닌 각 스크린마다 다른 옵션을 적용하고 싶다면 `Tab.Screen` 컴포넌트에 `options` 프롭스를 부여합니다. screenOptions와 동일하게 옵션 프로퍼티에 맞는 객체를 전달합니다.
4. screenOptions / options - tabBarBadge 프로퍼티 : 알람 개수를 나타내줍니다.
5. screenOptions / options - tabBarActiveTintColor / tabBarInactiveTintColor : 탭의 포커스 여부에 따라 컬러를 바꿔줍니다.

더 자세한 내용들은 [다음의 링크](https://reactnavigation.org/docs/material-bottom-tab-navigator/)를 참조하세요.

탭 컴포넌트 내에서 `Tab.Navigator` 컴포넌트를 사용하게 되는데 이때 메모리 관리에 도움을 주는 프롭스가 있습니다. 바로 `unmountOnBlur` 프롭스입니다. 해당 프롭스에 `true` 값을 전달하면 다른 화면으로 전환할 때에 해당 컴포넌트를 언마운트 하게 되어 어플리케이션 내에서 없애게 되고 다시 해당 페이지로 접속하면 초기 상태로 렌더링 되게 됩니다.

메모리 관리를 위해 `unmountOnBlur` 프롭스를 `true`로 설정한 뒤 데이터를 미리 캐싱해두지 않았다면 **API 요청을 다시 진행하게 되어 서버 상에 불필요한 요청을 늘리게 됩니다.** 이를 위해 `React-query`와 같은 라이브러리를 통해 데이터들을 캐싱해두는 것입니다.
:::

## TabBar Icons

tabBarIcon은 탭 바 컴포넌트 스크린 옵션으로 아이콘을 설정하는 함수입니다.

```javascript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TV from '../screens/TV';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name='TV'
                component={TV}
                options={{
                    // here!
                    tabBarIcon: ({ focused, color, size }) => {
                        return (
                            <Ionicons name='film' color={color} size={size} />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};
export default Tabs;
```

`tabBarIcon` 프로퍼티에 전달되는 함수는 인자로 `focused`, `color`, `size`를 받습니다. 각 인자는 포커스 여부, 탭 컴포넌트의 색과 사이즈를 받습니다.

`focused` 프롭스를 통해 아이콘을 아웃라인으로 표현할지 말지를 선택하는 데에 활용할 수 있습니다.

## Stack navigator

스택 네비게이터는 화면 내에서 또 다른 화면을 쌓아 다른 화면을 보일 수 있게 해주는 효과를 갖습니다. 스택 네비게이터의 종류로는 `native stack navigator`와 `stack navigator`가 있습니다.

`native stack navigator`는 네이티브 단에서 제공하는 스택 네비게이터를 활용하게 되며 이에 따라 커스터마이징에 어느 정도 제약이 존재합니다. 하지만 OS에 더 최적화 되어 있기 때문에 성능은 실제 네이티브 스택과 유사한 수준으로 활용됩니다.

그에 반해 `stack navigator`는 완전히 자바스크립트 기반으로 제작된 네비게이터입니다. 커스터마이징의 범위가 더 넓지만 성능적인 부분에 어느 정도 한계점이 존재합니다.

먼저 패키지를 설치해줍니다.

```sh
yarn add @react-navigation/native-stack
```

이후 네비게이터를 정의할 자바스크립트 파일을 생성한 뒤 코드를 아래와 같이 작성합니다.

```javascript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity } from 'react-native';

// createNativeStackNavigator로 생성
const NativeStack = createNativeStackNavigator();

const ScreenOne = ({ navigation: { navigate } }) => (
    <TouchableOpacity onPress={() => navigate('Two')}>
        <Text>One</Text>
    </TouchableOpacity>
);

const ScreenTwo = ({ navigation: { navigate } }) => (
    <TouchableOpacity onPress={() => navigate('Three')}>
        <Text>Two</Text>
    </TouchableOpacity>
);

const Stack = () => (
    <NativeStack.Navigator>
        <NativeStack.Screen name='One' component={ScreenOne} />
        <NativeStack.Screen name='Two' component={ScreenTwo} />
    </NativeStack.Navigator>
);

export default Stack;
```

스택 네비게이터는 탭 네비게이터와 유사한 방식으로 이루어집니다. `createNativeStackNavigator`로 생성한 컴포넌트로 감싼 후 자식 컴포넌트에 스택 스크린들을 작성하면 됩니다.

이때 각 스택 화면에는 `name`, `component` 프롭스를 부여합니다. `name`은 스택 간 상호작용 시 활용되는 아이디값이고 `component`는 해당 스택 화면을 나타내는 컴포넌트입니다.

또한 스택 스크린 컴포넌트는 다양한 프롭스들을 받습니다. `navigation` 옵션 내에서 각 스택 스크린 간의 상호작용을 정의할 수 있습니다.

```javascript
// navigation - navigate
const ScreenOne = ({ navigation: { navigate } }) => (
    <TouchableOpacity onPress={() => navigate('Two')}>
        <Text>One</Text>
    </TouchableOpacity>
);
```

`navigation` 프롭스에는 다양한 함수들이 있습니다.

1. `navigate` - 함수이며, 스크린 `name` 프롭스에 해당하는 화면으로 이동합니다.
2. `goBack` - 함수이며, 이전의 스크린으로 이동합니다.

더 자세한 내용은 [다음의 링크를](https://reactnavigation.org/docs/navigation-prop) 참조해주세요.

또한 스택 네비게이터도 탭 네비게이터와 동일하게 `screenOptions` 프롭스와 `options` 프롭스를 받습니다. `screenOptions`는 `NativeStack.Navigator`컴포넌트의 프롭스이며 하위 스크린 모두에 적용하는 옵션입니다. `options` 프롭스는 각 스크린에 따로 적용하는 옵션입니다.

다양한 옵션들은 [Native Stack - options](https://reactnavigation.org/docs/native-stack-navigator#options)에 자세히 나와있으니 참고하세요.

:::tip 활용할만한 screenOptions 몇 가지

1. `presentation: "modal"` - 스택 방식이 슬라이딩이 아니라 모달 형태로 이루어집니다.

```javascript
const Stack = () => (
    <NativeStack.Navigator
        screenOptions={{
            presentation: 'modal',
        }}
    >
        <NativeStack.Screen name='One' component={ScreenOne} />
        <NativeStack.Screen name='Two' component={ScreenTwo} />
        <NativeStack.Screen name='Three' component={ScreenThree} />
    </NativeStack.Navigator>
);
```

:::

## Stack & Tap

스택 네비게이터와 탭 네비게이터를 함께 활용하는 방법에 대해 정리합니다. 둘을 묶는 데에 있어서는 스택 네비게이터가 탭 네비게이터 종속된다고 생각하면 됩니다.

한 테마에 맞춰 3가지 페이지가 스택되며 이 테마가 바로 탭 네비게이터에 해당하는 것입니다.

한 네비게이터 내에서 스크린 간 이동은 `navigate` 함수에 스크린 `name`프롭스 값을 명시하면 되었습니다.

하지만 탭 - 스택간 이동에서는 탭 컴포넌트 내에서 먼저 **스택 스크린이 아닌 스택 네비게이터로 `navigate` 해야합니다.**

다시 한번 순차적으로 정리를 하면 다음과 같습니다.

0. Stack과 Tab컴포넌트를 한 곳에 묶을 `Root` 컴포넌트를 생성합니다. 이때 `Root`는 탭이 아닌 스택으로 생성합니다.
1. 각 탭에 대해 정의를 해 놓은 `Tab.js`가 있습니다. 이 곳에서 `Tab.Navigator`가 있고 `Tab.Screen`이 있습니다.
2. `Tab.Screen`의 첫 번째 탭을 `Home`이라고 한다면 `Home` 컴포넌트 제작 시 프롭스로 `navigation: {navigate}`로 네비게이트 함수를 전달합니다.
3. `Home` 컴포넌트에서 `onPress` 등의 이벤트 핸들링으로 홈 화면과 관련된 스택 화면이 모여있는 `Stack` 네비게이터로 네비게이트 시킵니다.
4. 이때 스택 네비게이터 내에 존재하는 스크린을 지정하여 네비게이트 해야하는데, `onPress={() => navigate('Stack', {screen: "ScreenOne"}) }`과 같이 작성하면 됩니다. 두 번째 파라미터로 객체를 전달하면서 `screen` 프로퍼티에 스크린 `name` 값을 지정하면 됩니다.
5. 스택 간 상호작용은 위에서 다뤘던 대로 진행하면 됩니다.

:::tip headerShown
탭 스크린 옵션 중 `headerShown`을 false로 지정하면 탭 컴포넌트의 헤더를 숨기게 되어 스택 컴포넌트의 헤더와 겹쳐보이는 문제를 해결할 수 있습니다.
:::

## 스택에 파라미터 전달하기

영화 목록이 있고 영화 클릭 시 상세 정보를 화면상에 표시한다고 가정해보겠습니다. `useNavigation` 훅의 객체 내에 내장된 함수 `navigate`에는 두 번째 파라미터로 객체를 전달합니다. 이때 프로퍼티는 `Stack.Screen` 컴포넌트의 `name`프롭스로 등록했던 `screen`을 지정할 수 있었습니다. `screen` 프로퍼티 외에 `params` 프로퍼티도 정의할 수 있는데 이 프로퍼티를 통해 화면 네비게이션 화면 전환 시 전달할 값들을 보내줄 수 있습니다.

메인페이지 특정 아이템에서 `TouchableOpacity` `onPress` 프롭스를 통해 터치를 감지하고 스크린 이동이 이루어지는 상황입니다.

```javascript
function Parent(props) {
    const navigation = useNavigation();
    const goToDetail = () => {
        navigation.navigate('Stack', {
            screen: 'Detail',
            params: {props.mydata},
        });
    };
    return (
        <TouchableOpacity onPress={goToDetail}>
            <Component></Component>
        </TouchableOpacity>
    );
}
```

Parent 컴포넌트가 받은 프롭스의 `mydata`값을 디테일 페이지로 보내려고 합니다. 스택상에 등록된 screen을 지정해준 후 params를 통해 해당 데이터를 전달하는 함수를 구현합니다. (goToDetail)

이후 onPress가 감지되면 해당 함수를 호출하는 방식으로 구현합니다.

`navigate` 함수의 파라미터로 `params`에 값을 담아 보냈다면 받는 컴포넌트에서 제대로 받아야 합니다. 리액트의 프롭스 문법으로 받을 수 있으며 `route` 프로퍼티를 통해 `params` 값을 받을 수 있습니다.

```javascript
const Detail = ({ navigation: { setOptions }, route: { params } }) => {
    useEffect(() => {
        setOptions({
            title: params.myTitle,
        });
    }, []);

    return (
        <Container>
            <Text>Hello!!!!</Text>
        </Container>
    );
};
```

## Linking API

현재 앱에서 외부 URL을 열어줄 수 있는 API입니다. 리액트 네이티브 자체적으로 제공하는 API이므로 설치는 필요하지 않습니다.

비동기적으로 동작하기 때문에 `async` - `await` 구문을 사용해야 합니다.

```javascript
import {Linking} from "react-native";

function Component(){
    const openYoutube = async () => {
        await Linking.openURL("유튜브 링크");
    }
    <TouchableOpacity onPress{() => openYoutube() }>
        <Child />
    </TouchableOpacity>
}
```

`Linking`에는 `openURL`외에 설정을 열어줄 수 있는 `openSettings` 함수도 제공합니다.

:::tip 앱 내에서 다른 URL열기
Linking API는 URL에 상관 없이 외부 브라우저로 연결하여 페이지를 열게 됩니다. 만약 특정 영상에 대한 유튜브 링크를 앱 환경에 덮어씌워 실행하고 싶다면 `expo-web-browser`를 설치합니다.

```sh
# 설치
expo install expo-web-browser

# ios기준
npx pod-install ios
yarn ios
```

```javascript
import * as WebBrowser from "expo-web-browser";

function Component(){
    const openYoutube = async () => {
        // 여기
        await WebBrowser.openBrowserAsync("유튜브 링크");
    }
    <TouchableOpacity onPress{() => openYoutube() }>
        <Child />
    </TouchableOpacity>
}
```

:::

## Reference

1. [노마드 코더 - 리액트 네이티브 마스터클래스](https://nomadcoders.co/react-native-masterclass/lobby)
