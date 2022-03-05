---
title: closure

---
## 클로저
클로저 이해를 위해서는 실행 컨텍스트에 대한 선행 지식이 필요하다. 필수적이므로 꼭 다른 자료나 이전에 작성해둔 [문서](https://parkjju.github.io/vue-TIL/js/execution.html#%E1%84%89%E1%85%B5%E1%86%AF%E1%84%92%E1%85%A2%E1%86%BC-%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A6%E1%86%A8%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3)를 참조하자.

클로저 개념의 출발은 **함수의 종료 시점부터 시작된다.** 함수 종료 이후의 일들을 살펴보자.
1. 실행 컨텍스트 스택에서 종료된 함수의 실행 컨텍스트를 제거한다. (pop off)
2. 함수 호출자 실행 컨텍스트에게(calling context) 종료된 함수의 리턴값을 넘긴다. `return`문이 없는 함수라면 `undefined`를 호출자 실행 컨텍스트에게 넘긴다.
3. `pop off`된 함수 실행 컨텍스트가 소멸된다. **소멸된다는 것이 중요한데, 해당 실행 컨텍스트 내부의 각종 변수들이 함께 지워진다.** 

## 함수를 반환하는 함수
다음 코드를 보자.

```javascript
let prefix = 1;

function Calculate(){
  function Add(a,b){
    let result = a+b;
    return result;
  }
  return Add; // Add 함수를 반환한다.
}

let myCalculator = Calculate();
let calculatedResult = myCalculator(prefix, 2);

console.log(calculatedResult); // 3
```

위 코드를 실행 컨텍스트 측면에서 이해해보자. (실행단계까지 진행되었다고 가정)
1. **line 1** - 글로벌 실행 컨텍스트가 생성되고 `prefix` 변수가 VO 프로퍼티로 추가된 후 1로 값이 초기화된다. (`undefined` 초기화 과정은 설명에서 생략한다.)
2. **line 3-9** - 함수 명과 표현식이 VO 프로퍼티에 추가된다.
3. **line 11** - `Calculate`함수 호출 후 새로운 함수 실행 컨텍스트가 생성되고 스택에 쌓인다. 
4. **line 4-7** - 새로 생성된 함수 실행 컨텍스트에 진입한다. 진입 후에 `Add`함수 선언부를 만나게 되는데 현재 함수 실행 컨텍스트의 프로퍼티로 함수명,표현식을 프로퍼티에 추가한다.
5. **line 8** - `Add`함수를 반환하고 `Calculate`함수는 종료된다. `Calculate`함수 실행 컨텍스트는 소멸된다.
6. **line 


## Reference 
1. [Poimeweb - Closure](https://poiemaweb.com/js-closure)
2. [Medium - I never understood Javascript closures](https://medium.com/dailyjs/i-never-understood-javascript-closures-9663703368e8)