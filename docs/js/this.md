---
title: this

---
## 자바 this
자바스크립트 `this`는 인스턴스 자신을 가리키는 의미의 `this`가 아니다. 
```java
public class Person{
	private String name;
    
    public Person(String name){
    	this.name = name;
    }
}
```
자바에서의 `this`는 객체 인스턴스 자신을 가리킨다. 

## 자바스크립트 this
> 자바스크립트의 경우 함수 호출 방식에 의해 `this`에 바인딩할 어떤 객체가 동적으로 결정된다. 다시 말해, 함수를 선언할 때 this에 바인딩할 객체가 정적으로 결정되는 것이 아니고, **함수를 호출할 때 함수가 어떻게 호출되었는지에 따라** this에 바인딩할 객체가 동적으로 결정된다. - [Poimeweb - javascript this](https://poiemaweb.com/js-this)

바인딩은 요소와 데이터를 묶는 행위라고 보면 된다. `this` 결정 방식은 렉시컬 스코프와 반대이다. 렉시컬 스코프는 선언과 동시에 변수의 스코프가 정해지는 **정적 방식** 이라면 `this`의 경우 호출 방식에 따라 그때그때 달라지기 때문에 **동적 방식이다.**

함수를 호출하는 방식이라는 것이 어떻게 나누어질까?
1. 함수 호출
2. 메서드 호출
3. 생성자 함수 호출
4. `apply/call/bind` 호출


## Reference
1. [Poimeweb - javascript this](https://poiemaweb.com/js-this)