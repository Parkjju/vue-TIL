---
title: JavaScript - JSON
---

## JSON

JSON은 **클라이언트와 서버 간 데이터 교환을 위한 규칙, 데이터 포맷이다.** 객체 리터럴과 형태가 매우 비슷하지만 **순수 텍스트로 이루어져있다.**

본래 JSON은 자바스크립트에서 사용할 목적으로 만들어진 포맷이지만 라이브러리를 통해 타 언어에서도 JSON을 다룰 수 있다. 일례로 파이썬에서 json 라이브러리를 사용하면 파이썬에서도 JSON 데이터 포맷을 활용할 수 있게 된다.

```python
import json

from django.http import HttpResponse

response_data = {}
response_data['result'] = 'error'
response_data['message'] = 'Some error message'
```

```json
{
    "name": "Park",
    "gender": "male",
    "age": 25,
    "alive": true
}
```

JSON에서 사용되는 메서드를 알아보자.

:::tip JSON 필요성
자바스크립트 객체 리터럴 기반으로 작성된 데이터 포맷이라면 자바스크립트 단에서 JSON 내부 메서드를 각각 구현해도 되지 않을까?

```javascript
let user = {
    name: 'Park',
    age: 25,

    toString() {
        return `{name: ${this.name}, age: ${this.age}}`;
    },
};

alert(user);
```

위 코드는 자바스크립트 객체 내에 `toString` 메서드를 오버라이딩 하여 객체를 문자열로 출력할 수 있게 해주는 코드이다. `toString` 코드가 없으면 `alert`시 객체 타입만 출력된다.

문제는 `toString`이 리턴하는 문자열이 **하드코딩의 형태라는 것이다.** `user` 객체에 대해 프로퍼티가 추가될 경우 `toString` 메서드의 리턴 형태도 달라져야 한다. 위와 같은 문제를
해결하기 위해 JSON이라는 데이터 포맷을 하나 두어 내부 메서드들을 JSON 객체마다 상속받게 한 것이다.
:::

## JSON.stringify

`JSON.stringify`는 객체를 JSON으로 바꿔준다. 반대로 `JSON.parse`는 JSON을 객체로 바꿔준다.

```javascript
let user = {
    name: 'Park',
    age: 25,
};

let json = JSON.stringify(user);
console.log(json); // {"name": "Park", "age": 25}
console.log(typeof json); // string

let object = JSON.parse(json);
console.log(object); // 객체 형태, Object프로토타입 프로퍼티와 메서드 상속
console.log(typeof object); // object
```

`JSON.stringify`메서드를 통해 출력된 결과물은 **JSON-encoded, JSON으로 인코딩된, 직렬화 처리된(serialized), 문자열로 변환된(stringified), 결집된(marshalled) 객체** 라고 불린다.

JSON으로 인코딩된 이후에야 서버 측과 데이터를 주고받을 수 있게 되는 것이다.

:::warning
JSON에서는 백틱이나 작은따옴표를 사용할 수 없다. 객체 프로퍼티와 문자열이 모두 쌍따옴표로 감싸진다.
:::

자바스크립트 원시 타입은 `JSON.stringify` 메서드를 적용할 수 있다. **JSON은 언어 종속적이지 않기 때문에, 자바스크립트만의 타입은 인코딩하지 못한다.**

1. 객체 - 인코딩 O
2. 배열 - 인코딩 O
3. 원시 타입(문자열, 숫자, boolean, null) - 인코딩 O
4. 메서드 - 인코딩 X
5. 심볼 타입 프로퍼티 - 인코딩 X
6. `undefined`를 값으로 갖는 프로퍼티 - 인코딩 X

```javascript
const jsonObject = {
    arr: [1, 2],
    none: null,
    num: 1,
    bool: true,
    str: 'Hello',
    method: () => console.log('Hello'),
    symbol: Symbol('Symbol'),
    undefine: undefined,
};

console.log(JSON.stringify(jsonObject));
```

위 코드를 실행하면 `method`, `symbol`, `undefined`는 `JSON.stringify` 메서드의 인코딩에서 무시되어 출력되지 않는 것을 볼 수 있다.

객체의 프로퍼티로 또 다른 객체가 들어갈 경우 **자동으로 해당 객체도 JSON형태로 인코딩해준다.**

```javascript
let jsonObject = {
    park: {
        age: 25,
        stack: 'JavaScript',
    },
};
console.log(JSON.stringify(jsonObject));
// {"park":{"age":25,"stack":"JavaScript"}}
```

:::warning 순환참조 객체
둘 이상의 객체가 있고 특정 객체로부터 시작된 프로퍼티가 돌고 돌아 결국 자기 자신을 가리키게 되는 객체를 순환참조 객체라고 한다.

```javascript
const jsonObject = {
    name: 'park',
    age: 25,
};

const refObject = {
    name: 'Jun',
    age: 24,
};
jsonObject.reference = refObject;
refObject.reference = jsonObject;
```

위 두 객체는 각각 `reference` 프로퍼티를 통해 서로를 가리키고 있다. 둘중 하나의 객체만 콘솔에 출력해봐도 해당 프로퍼티를 통해 참조가 무한대로 이루어지는 것을 볼 수 있다.

위와 같은 순환참조 객체는 **Uncaught TypeError: Converting circular structure to JSON** 에러가 발생한다.
:::

## replacer

`JSON.stringify`는 인코딩 대상 뿐만 아니라 **인코딩할 대상 프로퍼티를 선택하여 두 번째 인자로 넘겨줄 수 있다.** 이를 `replacer`라고 한다.

순환참조 객체에 대한 좋은 예제로 [Javascript info - JSON과 메서드](https://ko.javascript.info/json)를 가져와봤다.

```javascript
let room = {
    number: 23,
};

let meetup = {
    title: 'Conference',
    participants: [{ name: 'John' }, { name: 'Alice' }],
    place: room, // meetup은 room을 참조합니다.
};

room.occupiedBy = meetup; // room references meetup

alert(JSON.stringify(meetup, ['title', 'participants']));
```

위 예제에서 `room` 객체의 `occupiedBy`프로퍼티로 인해 `meetup` 객체가 순환참조 당하고 있다. 따라서 `stringify`메서드의 `replacer`로 해당 프로퍼티는 제외하였다.

또한 `replacer` 선택 시 `participants` 프로퍼티가 배열 형태이고, 배열 내부 각 데이터가 객체 형태로 이루어져 있음에도 `replacer`에 `name`이라는 프로퍼티가 등록되어 있지 않아 `participant` 인코딩 결과는 텅 비어있게 된다.

```javascript
JSON.stringify(meetup, ['title', 'participants', 'place', 'name', 'number']);
```

`replacer`를 활용한 인코딩 시에는 선택할 프로퍼티를 명확히 전달해야한다.

`replacer`에 배열로 직접 프로퍼티를 전달해도 되지만 이 또한 하드코딩이기에 추후 전달할 프로퍼티가 더 추가될 경우 코드 수정의 여지가 존재한다. 함수를 통해 `replacer`를 지정하는 방법도 존재한다. **key, value** 쌍을 갖는 모든 데이터에 대해 `replacer`함수가 호출되며 **인코딩 대상에서 제외하고 싶을 경우 프로퍼티 값을 undefined로 지정하면 된다.**

```javascript
// .. 순환참조 객체
console.log(
    JSON.stringify(meetup, function replacer(key, value) {
        return key == 'occupiedBy' ? undefined : value;
    })
);
// 프로퍼티가 occupiedBy일 경우 undefined
```

## space

`JSON.stringify` 메서드의 세 번째 인자로 **space를** 전달할 수 있다. `space`에 전달한 값만큼 `JSON` 인코딩된 프로퍼티에 들여쓰기가 된다.

```javascript
let user = {
    name: 'Park',
    age: 25,
};

console.log(JSON.stringify(user, null, 2));
// 2칸씩 들여쓰기 된다.
// {
//   "name": "Park",
//   "age": 25
// }
```

## JSON.parse

`JSON.parse`는 JSON 인코딩 객체를 다시 오브젝트로 디코딩 할 수 있다.

주의사항은 다음과 같다.

1. 주석을 지원하지 않는다.
2. 반드시 프로퍼티의 이름과 값은 쌍따옴표로 감싸져 있어야 한다.
3. new 연산자를 사용할 수 없다.
4. 중첩 객체는 JSON포맷만 맞으면 디코딩 가능하다.

주석 허용이 되지 않는다는 것은 JSON 문자열 내부에 `//`로 시작되는 코드가 있는지 여부이다. 주의사항이 지켜지지 않았을 경우 `Unexpected token` 에러가 발생한다.

## reviver

JSON 스트링으로부터 디코딩을 할 때 `new` 연산자로 생성된 자바스크립트 특정 객체였다면 `parse` 메서드가 알아먹지 못한다. 예를 들어 `new Date()` 로 생성된 데이터가 프로퍼티의 값으로 등록되어 있었다면 `parse`시 `reviver`에 키에 대한 값의 형태를 정의해줘야 한다.

```javascript
const dateObject = {
  date: new Date();
};

console.log(dateObject.getDay()); // 정상적으로 메서드가 작동

const jsonDate = JSON.stringify(dateObject);

const decodedObject = JSON.parse(jsonDate);

console.log(decodedObject.getDay()); // 에러 발생, getDay 메서드가 없다고 인식
```

위 코드는 `dateObject`를 `new Date()`를 통해 `date` 프로퍼티에 `Date` 객체를 등록하고, `JSON`으로 인코딩 하였다가 그 결과물을 다시 디코딩하는 코드이다. 동일하게 인코딩하고 디코딩했음에도 `Date` 객체의 내부 메서드가 모두 인식되지 않고 있다.

이때 `JSON.parse`에 `reviver` 를 전달한다.

```javascript
const decodedObjectWithReviver = JSON.parse(jsonDate, (key, value) => {
    if (key == 'date') return new Date(value);

    return value;
});

console.log(decodedObjectWithReviver.date.getDay()); // 정상 출력!
```

## Reference

1. [Javascript info - JSON과 메서드](https://ko.javascript.info/json)
2. [stackoverflow - Creating a JSON response using Django and Python](https://stackoverflow.com/a/71068374)
