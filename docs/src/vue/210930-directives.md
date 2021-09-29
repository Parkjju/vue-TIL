---
title: vue 디렉티브 정리
---

# 문서 작성 규칙

[vue directives](https://vuejs.org/v2/api/#Directives)

1. vue 도큐먼트 원서를 참조하여 번역
2. 데이터의 흐름 정리
3. 예제 코드 첨부, 없으면 직접 제작

작성 양식

```markdown
- 용도
- 각종 특성들
- 예시코드
```

## v-model

**Usage**

폼 인풋 요소나 해당 컴포넌트에 투웨이 바인딩을 생성한다.

**Limited to**

`<input>`, `<select>`, `<textarea>`, `components`에만 사용된다.

**Modifiers**

모디파이어는 디렉티브의 속성이라고 보면 된다. 적용하는 방법은 `v-model.lazy = ""` 로 작성하면 된다.

1. `.lazy` - 인풋 박스에서 포커싱이 빠졌을 때 변화를 감지하여 데이터가 반영된다.
2. `.number` - 숫자만 입력시 스트링이 아닌 넘버 타입으로 인식된다.
3. `.trim` - 좌우 블랭크 삭제하여 데이터를 받는다.

**Example**
싱글파일 컴포넌트 체제에서 작성한 예제이다.

```vue
<template>
  <div>
    <input type="text" v-model="newTodoItem" />
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      newTodoItem: "",
    };
  },
};
</script>
```

## v-on

**Usage**

엘리먼트에 이벤트 리스너를 추가한다. 이벤트의 타입(클릭, 엔터 등)은 인자로 전달된다. 이벤트 감지 이후의 동작은 인라인으로 작성하거나, 작성한 메소드의 이름을 전달하거나, 모디파이어가 추가되면 생략될 수도 있다.

일반적인 DOM 엘리먼트에 브이 온 디렉티브를 이용하면 **네이티브 돔 이벤트만 추가할 수 있다.** 커스텀 컴포넌트에 브이 온 디렉티브를 추가하면 자식 요소에서 발생한 이벤트를 수신한다. (? 이해 안됨.)

인라인 방식으로 메소드를 전달할 시 `$event` 프로퍼티를 통해 이벤트를 전달한다.

`v-on:click="handle('ok', $event)"`

**Argument**

인자로 이벤트를 전달하며 전달 방식은 콜론을 통해 전달하게 된다. `v-on:click="methodName"`

**Modifiers**

정리 예정

**Example**

```html
<button v-on:click="methodName"></button>

<!-- inline style -->
<button v-on:click="methodName('some stuff', $event)"></button>
```

:::warning
인라인 방식 서치 후 정리하기
:::

## v-for

**Usage**

뷰 컴포넌트에서의 반복문이라고 생각하면 된다. **반드시 다음의 형태를 따라야한다.** `alias in expressions`

```html
<div v-for="item in items">
  {{ item.text }}
</div>
```

앨리어스와 인덱스를 전달하면 `v-for`에 내장하는 해당 리스트의 인덱스값을 부여할 수 있다.

```html
<div v-for="(item, index) in items"></div>
```

[Maintaining State](https://vuejs.org/v2/guide/list.html#Maintaining-State)

[Why you should use the key directive in Vue.js with v-for](https://deepsource.io/blog/key-attribute-vue-js/)

[v-for key](https://v3.ko.vuejs.org/api/special-attributes.html#key)

`v-for`를 사용할 때에는 키값을 지정하는 것이 권장된다. 명확한 이유는 아직 모르겠음

```html
<div v-for="item in items" :key="item.id">
  {{ item.text }}
</div>
```

## v-bind

추가 예정
