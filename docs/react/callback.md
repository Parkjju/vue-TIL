---
title: React useMemo, useCallback
---

## useMemo

리액트 컴포넌트는 상태값 변경에 따라서 또는 부모 컴포넌트의 리 렌더링에 따라서 컴포넌트 재평가가 이루어집니다. 이때 컴포넌트 재평가가 리렌더링이라고 착각할 수 있는데, 둘은 엄연히 다른 개념입니다.

재평가 이후 리액트에서 컴포넌트 리렌더링 대상이라고 인식하고 나서 리렌더링이 이루어 지는 것입니다.

컴포넌트는 자바스크립트 함수이고 이를 재평가 한다는 것은 먼저 함수를 실행한다는 것입니다. 컴포넌트 내에 `console.log`를 넣어두면 프롭스 변화나 부모 컴포넌트 재평가 등의 상황에 매번 문구가 출력되는 것을 볼 수 있습니다.

연결된 모든 컴포넌트가 재실행된다면 이는 성능적인 이슈가 발생할 수 있게 되며 이러한 상황 속에 `useMemo` 훅을 사용하게 됩니다.

```javascript
function Parent() {
    // 1. prop값 수정 로직
    // 2. Parent 컴포넌트 내부 상태값 변경로직
    return <Child prop={myProps} />;
}
// ...
function Child({ prop }) {
    console.log('Child component running...');
    return <p>{prop}</p>;
}

export default Child;
// export default React.memo(Child);
```

위와 같이 `Parent`와 `Child` 두 컴포넌트가 존재한다고 가정하겠습니다. 이때 Parent로부터 prop값이 수정되면 Child 컴포넌트는 재평가 되며 컴포넌트 함수가 실행됩니다.

또한 Parent 컴포넌트 내에서 상태값 수정 로직을 통해 상태값이 수정되어도 Child 컴포넌트가 함께 재평가 되게 됩니다. 실질적인 Child 컴포넌트의 변화가 없는데도 굳이 재평가가 이루어지는 것입니다.

이때 리액트의 `memo`로 Child 컴포넌트를 감싸 익스포트 하게 되면 Child 컴포넌트로 전달되는 프롭값의 변화가 있을 때에만 함수 재실행 및 재평가가 이루어지게 됩니다.

React.memo가 성능 최적화에는 좋지만 모든 컴포넌트에 사용하지 않는 이유는 **리액트 내에서 기존 프롭값을 저장할 공간이 필요하며 기존 프롭값과 새로운 프롭값에 대한 비교를 진행해야 한다는 비용이 발생하기 때문입니다.**

따라서 `React.memo`의 비용과 컴포넌트 재평가 비용을 서로 비교하여 더 좋은 성능을 발휘하도록 선택해야합니다.

:::warning 참조 값 vs 원시타입 값
특정 상수를 컴포넌트에서 생성하여 자식 컴포넌트의 프롭값으로 전달합니다. 이때 자식 컴포넌트는 `React.memo`를 적용해둔 상태입니다.

생성했던 상수 값(const)이 먼저 원시 타입 값일때 자식 컴포넌트로 전달된 후 부모 컴포넌트에서 일련의 과정으로 재평가가 이루어질때 자식 컴포넌트는 `React.memo`로 익스포트 되었기 때문에 재평가가 이루어지지 않습니다.

여기서 주요한 점은 아무리 원시 타입의 상수 값이라고 해도 컴포넌트 재평가가 이루어질 때에는 함수 재실행과 함께 완전히 다른 값으로 생성된다는 것입니다. 동일한 불리언 값이라고 해도 React.memo에 의해 `false === false`로 비교하게 되는 것입니다.

함수 재평가로 상수 값이 재생성된다는 관점으로 참조 타입에 대해 보면 컴포넌트 재평가 시 **새롭게 생성된 참조 값이 새로운 메모리 값에 할당되었기 때문에 원천적으로 서로 다른 값이라는 결과가 나타납니다.** 따라서 아무리 `React.memo`로 익스포트한 자식 컴포넌트라지만 참조 타입 값에 대해서는 프롭값이 달라졌다고 인식되어 자식 컴포넌트까지 재평가가 이루어지게 됩니다. (원시타입이 아닌 타입은 참조 타입입니다. 객체 및 배열, 함수 등이 이에 해당합니다.)

원시타입과 참조 타입에 대한 글은 [다음의 글을](https://velog.io/@nomadhash/Java-Script-%EA%B9%8A%EC%9D%80-%EB%B3%B5%EC%82%AC%EC%99%80-%EC%96%95%EC%9D%80-%EB%B3%B5%EC%82%AC) 참조해주세요.
:::

## useCallback

`React.memo`의 한계점으로 원시타입이 아닌 참조 타입에 대해서는 컴포넌트 재평가가 이루어진다는 것이 있었습니다.

이때 함수 역시 참조타입으로 분류가 되는데 `useCallback` 훅을 사용하게 되면 메모리의 동일한 위치에 함수가 저장되어 컴포넌트 재평가 작업에서 제외될 수 있습니다.

이를 사용하기 위해서는 해당 함수를 `useCallback`으로 래핑하면 됩니다.

```javascript
function Parent() {
    const func = useCallback(() => {
        // ...
    }, []);

    return <Child onClick={func} />;
}
```

`Child` 컴포넌트의 `onClick`프롭스로 `func` 함수를 전달했는데, 이때 `Child` 컴포넌트가 `React.memo`로 래핑되었더라도 `func`함수가 `useCallback`으로 래핑되지 않았다면 `Parent` 컴포넌트 재평가에 따라 `Child` 컴포넌트 함수도 실행되게 될 것입니다.

하지만 위의 코드는 `func` 함수를 `useCallback` 훅으로 래핑하여 프롭스로 전달하였기 때문에 `Parent` 컴포넌트 재평가 시에 리액트 내의 다른 저장 공간에 저장되어 있던 `func`함수를 불러와 재사용 하게 됩니다.

이때 `useCallback` 훅은 `useEffect`훅과 마찬가지로 두 번째 파라미터로 의존성을 주입할 수 있습니다. 의존성 변화에 따라 `Parent` 컴포넌트의 재평가가 이루어지면서 `useCallback`훅이 다시 호출되어 이전에 저장되어 있던 함수와 다른 주소값으로 저장되게 되는 것입니다.

`useCallback` 훅에 의존성을 주입하는 이유가 무엇일까요?

```javascript
function Parent() {
    const [state, setState] = useState('');
    const [isValid, setIsValid] = useState(false);

    // isValid 변경 로직... 어딘가에 구현이 되어 있는 상태!

    const func = useCallback(() => {
        if (isValid) {
            setState('Hello');
        }
    }, []);

    return <Child onClick={func} />;
}
```

위의 코드를 보면 `func`함수가 의존성 주입이 되어 있지 않은 상태로 `useCallback`으로 래핑된 후 `Child`컴포넌트의 프롭스로 전달되고 있습니다.

이때 `React.memo`로 감싸져 익스포트된 `Child`컴포넌트는 `Parent` 재평가에 따라 프롭스로 전달된 함수를 기존 함수와 비교하게 되는데 `useCallback`으로 래핑된 함수는 참조값이 동일하므로 `Child` 컴포넌트가 재평가에서 제외되게 됩니다.

여기서 발생하는 문제는 `func`함수가 `Parent`의 `isValid`라는 상태값을 클로저 형태로 관리하는 상황에서 함수 재생성이 막히게 된 것입니다.

`Parent` 컴포넌트 어딘가에서 `isValid` 상태값이 다른 값으로 변경되는 로직이 구현되어 있음에도 불구하고 `Child` 컴포넌트의 `func`함수는 이전에 전달되었던 `isValid`라는 상태값을 클로저로 인해 유지하게 되는 것입니다.

이러한 점 때문에 `useCallback`에 의존성을 주입하여 때에 맞게 함수의 재생성을 해야하는 것입니다.

## useMemo

`useCallback`은 참조 타입 중 함수에 대해 재생성을 막아주는 기능을 합니다. 그렇다면 함수 외의 객체, 배열등과 같은 참조 타입에 대해서 재생성을 막아주는 훅이 있을까요?

위와 같은 기능을 하는 것이 바로 `useMemo` 훅입니다.

`useMemo`는 첫 번째 파라미터로 어떻게 연산할지 정의하는 함수를 넣어주고 두 번째 파라미터에는 의존성 배열을 넣어줍니다.

```javascript
function Parent() {
    // ..
    // [1,2,3,4]라는 값을 기억하여 재사용한다.
    const listItems = useMemo(() => [1, 2, 3, 4], []);

    return <Child items={listItems} />;
}
```

위와 같이 `useMemo` 훅을 사용하게 되면 `Parent` 컴포넌트에 대해 재평가가 이루어져도 `Child` 라는 컴포넌트에 전달되는 `[1,2,3,4]`배열이 리액트 내부 메모리에 저장되어 있다가 재사용됩니다.

## Reference

1. [JavaScript 원시타입과 참조타입](https://velog.io/@nomadhash/Java-Script-%EA%B9%8A%EC%9D%80-%EB%B3%B5%EC%82%AC%EC%99%80-%EC%96%95%EC%9D%80-%EB%B3%B5%EC%82%AC)
2. [Mozilla - Closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#closure)
3. [ACADEMIND - Reference vs Primitive Values](https://academind.com/tutorials/reference-vs-primitive-values)
4. [velopert - useMemo를 사용하여 연산한 값 재사용하기](https://react.vlpt.us/basic/17-useMemo.html)
