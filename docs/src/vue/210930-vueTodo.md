---
title: Vue Todo앱 만들기
---

다음의 글은 [Do it! Vue.js - 장기효 저](http://www.yes24.com/Product/Goods/58206961)와 인프런의 [캡틴판교 - Vuejs 중급강의](https://www.inflearn.com/course/vue-pwa-vue-js-%EC%A4%91%EA%B8%89/dashboard)를 정리한 내용입니다.

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

### TodoList

투두 리스트의 리스트 컴포넌트의 흐름을 정리하면 다음과 같다.

1. 컴포넌트 라이프사이클 중 `created`에 해당하는 훅에 접근하여 리스트 컴포넌트가 생성되자 마자 로컬 스토리지에 접근하여 뷰 데이터 속성에 값들을 저장한다. 값 저장 시 `JSON.parse`메서드를 통해 JSON 형태의 데이터를 배열 형태로 저장한다.
2. 인풋 컴포넌트에서 입력 후 로컬스토리지에 저장된 데이터를 `v-for` 디렉티브를 통해 불러온다.
3. 불러온 리스트의 완료 여부는 리스트의 버튼 클릭 이벤트를 통해 구현한다. `v-on:click` 디렉티브를 통해 클릭 이벤트 리스닝이 가능하다. 삭제 기능 또한 `v-on:click`을 통해 구현한다.

```vue
<template>
  <div>
    <ul>
      <li v-for="(item, index) in todoItems" :key="item.item" class="shadow">
        <i
          class="far fa-check-square checkBtn"
          v-bind:class="{ checkBtnCompleted: item.completed }"
          v-on:click="toggleComplete(item)"
        ></i>
        <span v-bind:class="{ textCompleted: item.completed }">
          {{ item.item }}
        </span>
        <span class="removeBtn" v-on:click="removeTodo(item, index)">
          <i class="fas fa-trash"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      todoItems: [],
    };
  },
  created: function() {
    if (localStorage.length > 0) {
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) !== "loglevel:webpack-dev-server") {
          this.todoItems.push(
            JSON.parse(localStorage.getItem(localStorage.key(i)))
          );
        }
      }
    }
    localStorage.getItem(this.todoItems);
  },
  methods: {
    removeTodo: function(todoItem, index) {
      localStorage.removeItem(todoItem);
      this.todoItems.splice(index, 1);
    },
    toggleComplete: function(item) {
      item.completed = !item.completed;
      localStorage.removeItem(item.item);
      localStorage.setItem(item.item, JSON.stringify(item));
    },
  },
};
</script>
```

### 문제점

현재까지 정의한 컴포넌트는 총 4개로 `TodoHeader`, `TodoInput`, `TodoList`, `TodoFooter`가 있다. 인풋 컴포넌트에서 데이터를 입력하면 로컬 스토리지에 저장이 되고, 리스트 컴포넌트에서는 로컬 스토리지에서 저장된 데이터를 받아서 화면 단에 나열하고 데이터의 수정 작업을 처리한다. 풋터 컴포넌트는 전체 삭제 버튼을 통해 로컬스토리지 데이터를 비우는 작업을 한다.

각 컴포넌트마다 기능이 구현되어 정상적으로 처리가 되지만 흐름 자체가 부드럽지는 않다. 데이터를 로컬 스토리지에 저장하였으면 이를 실시간으로 반영하여 리스트에 뿌려질 수 있도록 리스트 컴포넌트가 작동을 해야하는데 이러한 부분이 구현되어 있지 않다.

프레젠터 컴포넌트간의 통신이 이루어지지 않는 것이 중심 문제점이므로 이를 어떻게 해결할 지가 관건이다.

:::tip
모든 컴포넌트를 모아서 전체적인 앱의 로직을 관리하는 컴포넌트를 **컨테이너 컴포넌트**, 컨테이너 컴포넌트를 통해 데이터를 주고받아 화면 단에 뿌리는 컴포넌트들을 **프레젠터 컴포넌트** 라고 한다.
:::

## 2. 리팩토링

### 프롭스

현재까지는 각 컴포넌트에 정의된 데이터가 서로 다른 컴포넌트에 영향을 미쳐주고 있지 않았다. 첫 번째 리팩토링으로 **리스트 컴포넌트**에 데이터를 받는 작업을 `v-bind` 디렉티브의 **프롭스**를 적용해본다.

먼저, 모든 컴포넌트를 관리하는 부모 컴포넌트 `App.vue`의 `TodoList` 컴포넌트에 프롭스를 적용한다.

```vue
<template>
  <div id="app">
    <TodoList v-bind:propsdata="todoItems"></TodoList>
  </div>
</template>
```

이후 `TodoList.vue` 컴포넌트에서 데이터를 받기 위해 `v-for` 디렉티브를 사용한다.

```vue
<template>
  <ul>
    <li v-for="(item, index) in propsdata"></li>
  </ul>
</template>
```

### v-on

브이온 디렉티브를 활용하면 프롭스와는 반대로 하위 컴포넌트에서 발생한 이벤트를 상위 컴포넌트로 전달하는 작업을 처리할 수 있다.

**부모 컴포넌트**

```vue
<template>
    <child v-on:"하위 컴포넌트에서 발생한 컴포넌트 이름"="현재 컴포넌트의 메서드 이름"></child>
</template>

<script>
import child from ".."
export default{

    methods:{
        현재 컴포넌트 메서드: function(인자1, 인자2 ...){
            // ..scripts
        }
    }
}
</script>
```

**자식 컴포넌트**

```vue
<template>
  <span v-on:click="myFunc"></span>
</template>

<script>
method:{
    myFunc(){
        this.$emit("하위 컴포넌트에서 발생시킨 이벤트 이름", 인자1, 인자2, ...);
    }
}
</script>
```

흐름을 간단히 정리해보면 다음과 같다.

1. 상위 컴포넌트에서 임포트한 하위 컴포넌트 Virtual DOM(`<child></child>`)의 어트리뷰트로 v-on디렉티브와 이벤트를 받을 현재 컴포넌트의 메소드를 지정한다.
2. 하위 컴포넌트에서 메소드를 정의한 뒤 메소드 내에 `this.$emit("event", param1,param2,,,..)`를 통해 이벤트 이름과 인자들을 전달한다.
3. 상위 컴포넌트의 메소드에서 `param1, param2` 인자들을 받은 뒤 로직을 짠다.

프레젠테이션 컴포넌트에서는 이벤트 발생을 정의하고, 로직은 컨테이너 컴포넌트에서 짠다! (중앙 집중식 컴포넌트)

:::warning
컴포넌트에서 데이터를 조작할 때 뷰의 **Anti pattern**이라는 것이 존재한다. 그 중 하나로 부모 컴포넌트에서 받은 데이터를 자식에서 받고, 해당 데이터를 다시 상위 컴포넌트로 보내는 형태를 말한다.
[3 anti patterns to avoid in Vue.js](https://www.binarcode.com/blog/3-anti-patterns-to-avoid-in-vuejs/)
:::
