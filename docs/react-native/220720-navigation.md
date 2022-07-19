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

## Reference

1. [노마드 코더 - 리액트 네이티브 마스터클래스](https://nomadcoders.co/react-native-masterclass/lobby)
