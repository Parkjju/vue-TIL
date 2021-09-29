---
title: Vue Todo앱 만들기
---

## 1. Todo App 구현

```vue
//TodoHeader.vue
<template>
  ..
</template>

<style scoped></style>
```

싱글 파일 컴포넌트를 통해 CSS의 캐스캐이딩 특성을 무시할 수 있다. `style` 컴포넌트에 스콥드(scoped) 속성을 주면 된다. 파일 내에서만 유효하도록 적용된다.

### TodoInput

데이터 입력의 큰 흐름은 다음과 같다.

1. `input`박스와 할 일 추가 버튼 마련
2. 인풋박스에 입력된 데이터를 투웨이 바인딩을 통해 실시간 업데이트
3. 인풋박스에서 컴포넌트 `data`프로퍼티로 데이터를 받아서 로컬 스토리지에 저장한다.

투웨이 바인딩을 위해서는 `v-model` 디렉티브를 이용하고, 버튼 클릭 이벤트를 감지하여 데이터를 주고받기 위해서는 `v-on:click` 디렉티브를 이용한다.

```vue
<template>
  <div>
    <input type="text" v-model="newTodoItem" />
    <button v-on:click="addTodo">Add</button>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      newTodoItem: "",
    };
  },
  methods: {
    addTodo: function() {
      localStorage.setItem(this.newTodoItem, this.newTodoItem);
      this.newTodoItem = "";
    },
  },
};
</script>

<style></style>
```
