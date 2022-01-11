---
title: 클린코드
---
# 클린코드 1장

## 의미 있는 이름

### 의도를 분명히 밝혀라

`int d; // 경과 시간(단위: 날짜)` 처럼 변수 명은 의미없이 짓고 주석을 추가하는 코드는 좋지 않은 코드이다.

**측정하려는 값과 단위를 표현하는 이름으로 작명한다.**

```java
int elapsedTimeInDays;
int daySinceCreation;
int daysSinceModification;
int fileAgeInDays;
```

의도가 드러나는 코드는 이해가 쉽고 **변경또한 쉽다.**

```java
public List<int[]> getThem() {
	List<int[]> list1 = new ArrayList<int[]>();
	for (int[] x : theList)
		if (x[0] == 4)
			list1.add(x);
	return list1;
}
```

위 코드가 단숨에 이해하기 쉽지 않은 이유는 변수명이 코드를 읽는 독자 입장에서 어느 정도 흐름을 알고 있다고 가정하여 작명되었기 때문이다. 이러한 문제를 **코드의 함축성이라고 한다.**

```java
public List<int[]> getFlaggedCells() {
	List<int[]> flaggedCells = new ArrayList<int[]>();
	for (int[] cell : gameBoard)
		if (cell[STATUS_VALUE] == FLAGGED)
			flaggedCells.add(cell);
	return flaggedCells;
}
```

위의 지뢰찾기 코드를 보면 `flaggedCells` 라는 배열 리스트를 선언하고 for문 내에서 셀이 지뢰이면 `flaggedCells`에 지뢰 셀을 추가하는 코드라는 흐름을 쉽게 이해할 수 있다.

### 그릇된 정보를 피하라

1. 널리 쓰이는 단어를 다른 의미로 사용하지 않아야한다. (사용 언어의 키워드는 물론 `hp`, `aix`, `sco` 같이 개발 세계에서 자주 사용되는 단어들도 포함된다. )
2. 여러 계정(Account)을 그룹으로 묶을 때 실제 리스트가 아니라면 **accountGroup, bunchOfAccounts** 등으로 명명한다.
3. 서로 흡사한 이름을 사용하지 않도록 한다. (`XYZControllerForEfficientHandlingOfStrings` vs `XYZControllerForEfficientStorageStrings` )
4. 유사 개념은 유사한 표기법을 사용한다. (`get...()` `set...()` 등)
5. 소문자 l과 숫자 1, 대문자 O와 숫자 0은 헷갈리므로 표기에 주의한다.

### 의미 있게 구분하라

연속된 숫자를 덧붙인 이름은 **전혀 의미가 없는 이름이다.**

```java
public static void copyChars(char a1[], char a2[]){
	for (int i=0; i < a1.length; i++){
		a2[i] = a1[i];
	}
} // 의미 없는 구분

public static void copyChars(char source[], char destination[]){
	for (int i=0; i < a1.length; i++){
		destination[i] = source[i];
	}
} // 의미 있는 구분
```

불용어를 추가한 이름도 정보를 제공하지 못한다.

- 불용어(stopwords)란?
    
    언어 분석 시 의미가 없는 것들을 의미한다. 예를 들어 “Family is not an important thing. It’s everything.” 이라는 문장이 있을 때 Family, Important, thing, everything은 의미가 있다고 보고 나머지는 의미가 없다 판단하여 불용어로 정의한다.
    

작자가 말하는 불용어는 단순히 접두어에 대한 금기가 아니라 실제 의미를 갖는 지에 대한 여부를 명확히 판단하라는 것이다. 기준은 그때그때 달라질 수 있다.

지역변수로 `theZork` 라는 변수를 선언해도 되지만 그 이유가 **같은 스코프에 zork**라는 변수가 있기 때문이었다면 이는 의미없는 구분이 되는 것이다.

이와 동일한 이유로 `Name` 이라는 변수가 있다고 할때 `NameString` 이라는 변수를 선언하는 것은 의미가 없다.

다양한 예시로 `money` vs `moneyAmount` , `customerInfo` vs `customer` 등이 있다.

### 발음하기 쉬운 이름을 사용하라

책의 예시로 `genymdhms` (generate year, year, month, day, hour, minute, second)라는 변수를 사용했다. (실제 예시고 발음을 “젠 야 무다 힘즈” 라고 했다고한다.)

다음 두 코드의 차이를 비교해보자.

```java
class DtaRcrd102 {
	private Date genymdhms;
	private Date modymdhms;
	private final String pszqint = "102";
//...
};

class Customer {
	private Date generationTimeStamp;
	private Date modificationTimeStamp;
	private final String recordId = "102";
// ...
};
```

### 검색하기 쉬운 이름을 사용하라

문자 하나만 사용하는 이름과 상수는 검색하기 쉽지 않으므로 사용을 자제한다. 상수에 대한 선언도 최대한 긴 이름으로 작성하자. `MAX_CLASSES_PER_STUDENT = 7;` 과 같은 상수 이름을 예시로 들 수 있겠다.

변수명의 길이는 **스코프 범위크기에 비례하도록 하자.** 

```java
for(int j=0; j<34; j++){
	s += (t[j]*4)/5;
} // 상수에 이름을 씌우지 않은 코드

int realDaysIdealDay = 4;
const int WORK_DAYS_PER_WEEK = 5;
int sum = 0;

for (int j=0; j < NUMBER_OF_TASKS; j++){
	int realTaskDays = taskEstimate[j] * realDaysPerIdealDay;
	int realTaskWeeks = (realTaskDays / WORK_DAYS_PER_WEEK);
	sum += realTaskWeeks;
} // 상수에 이름을 씌운 코드
```

두 코드를 비교하자면 각 변수는 다음과 같이 맵핑될 수 있다. `NUMBER_OF_TASKS == 34` , `t == taskEstimate` , `realDaysPerIdealDay == 4` , `WORK_DAYS_PER_WEEK == 5`  `s == sum` 

상수에 이름을 씌우지 않은 상태에서 34를 검색한다고 가정해보자. 또 계산값을 총 더한 결과값을 검색하기 위해 `s` 를 검색한다고 해보자. 일의 능률에 대해 다시 생각해볼 수 있을 것이다.

### 인코딩을 피하라

헝가리안 표기법을 굳이 익힐 필요가 없다. 헝가리안 표기법은 변수명 앞에 변수의 타입을 간단한 형태로 표기해두는 것을 말한다. 

`Boolean` 타입의 값을 선언한 뒤 이후 사용한다고 가정하면 `bmyBooolean` 과 같이 b라는 접두어를 붙여 사용해야하는 방식인데 IDE의 발달로 인해 위의 방식은 사용할 필요가 없어졌다.

인코딩이 필요한 경우도 있다. 자바 구현클래스의 경우 `ShapeFactory` 를 `ShapeFactoryImp` 로 사용하는 방식도 존재하지만 굳이? 라는 느낌이 더 큰 것 같다.

### 자신의 기억력을 자랑하지 마라

반복문의 전통적인 반복 변수인 `i, j, k` 를 제외한 `a,b,c` 등을 사용하는 것은 명쾌하지 못하다. 코드를 읽는 독자가 `a,b,c` 변수명을 읽고 `i,j,k` 로 변환하는 프로세스를 한번 더 거쳐야 하기 때문이다.

### 클래스이름과 메서드 이름

**클래스 이름은** 명사 또는 명사구가 적절하다. `Customer`, `WikiPage`, `Account` 등이 예시가 되고 동사는 사용하지 않도록 하자. `Processor`, `Data`, `Info` 같은 단어도 피하자. 같은 명사이더라도 의미가 불분명한, 대상이 불분명한 단어는 피하자.

**메서드 이름은** 동사나 동사구를 사용한다. `postPayment` , `deletePage` , `save` 등이 좋은 예시이며 **접근자, 변경자, 조건자는 javabean표준에 따라** `get, set, is` 를 붙인다.

```java
string name = employee.getName(); // 명사구로 이루어진 클래스명, 접근자 get메서드
customer.setName("mike"); // 명사 customer 클래스, 변경자 set메서드
if(paycheck.isPosted()); // 명사 paycheck 클래스, 조건자 is메서드
```

생성자 오버로딩 시에는 **정적 팩토리 메서드를 사용한다.**

- 정적 팩토리 메서드란?
    
    [정적 팩토리 메서드](https://devlog-wjdrbs96.tistory.com/256)
    
    객체 인스턴스를 얻는 방법으로 `public` 생성자를 사용하는 방법도 있지만 정적 팩토리 메서드를 통해서도 얻을 수 있다.
    
    ```java
    // public 생성자를 이용하기
    public class Test {
    	private String name;
    	
    	public Test(String name){
    		this.name = name;
    	}
    
    	public static void main(String[] args){
    		Test test = new Test("Park Gyeong Jun");
    	}
    }
    
    // 정적 팩토리 메서드 이용하기
    public class Test{
    	private String name;
    	
    	public Test(String name) {
    		this.name = name;
    	}
    
    	public static Test withName(String name){
    		return new Test(name);
    	}
    
    	public static void main(String[] args){
    		Test test = Test.withName("Park Gyeong Jun");
    }
    ```
    
    	
    

`Complex fulcrumPoint = Complex.FromRealNumber(23.0);` 코드가 퍼블릭 생성자를 이용하는 코드보다 좋은 코드이다. 클래스에 미리 정적 팩토리 메서드를 작성해두자. 또한 정적 팩토리 메서드의 이름은 **타입을 명시하는 형태로 명명하자.**

### 기발한 이름은 피하라

농담식으로 변수명을 작성하지 말자. `kill()` 대신 `whack()`, `으악!()` 등으로 정의하면 유머 감각이 맞지 않는 독자가 변수명을 이해하지 못할 수도 있다.

### 한 개념에 한 단어를 사용하라

일례로 값을 **얻는다는 의미의 메서드를** 다양한 클래스에 거쳐 **동음이의어로 작성하게 되면** 독자가 혼란을 겪게 된다. `get == fetch == retrieve` 로 동일한 의미의 단어가 있을때 접근자 메서드를 정의하고자 한다면 (표준에 따라 get으로 하는게 맞겠지만) `fetch` 로만 통일하던지, `retrieve` 로만 통일하던지 해야한다.

단순 의미를 넘어 동작을 묘사하는 단어도 비슷한 의미를 갖는 경우가 많다. `Manager` 와 `Controller` 를 사물에 적용하면 구분하기 쉽지 않다. `DeviceController` , `ProtocolManager` 등 같은 동작에 다른 의미로 작성하면 혼란이 온다. 

### 말장난을 하지 마라

**한 개념에 한 단어를 사용하라는** 규칙을 오해하여 **맥락이 전혀 다른 동작을 하는데에도 같은 단어를 사용해서도 안된다.** 기존의 `add` 가 두 수를 더하여 반환하는 동작을 한다고 가정했을 때 **배열에 새로운 원소를 추가하는 것도 `add` 메서드로 정의할 것인가? `insert` 나 `append` 로 새롭게 정의하는 것이 맞다.

### 의미 있는 맥락을 추가하라

특정 사람의 정보와 집주소를 값으로 저장하는 시나리오를 생각해보자. 다음의 변수들이 만들어질 수 있다. `firstName` , `lastName`, `street`, `houseNumber`, `city`, `state`, `zipcode` 등 위의 변수들이 글로벌로 선언된 이후 로컬 스코프 함수가 위의 변수 중 하나를 차용하여 사용하게 된다면 과연 그 메서드의 의미가 명확해질까?

특정 접두어를 통해 **변수들의 맥락을 만들어주는 것이 바람직하다.** 위의 예시의 경우에 `addr` 이라는 접두어를 붙이게 되면 `addrFirstName`, `addrLastName`, `addrStreet` 등 주소라는 맥락으로 묶여 독자가 이해하기 쉬워진다.

다음의 긴 코드들을 비교해보자.

```java
// 맥락이 불분명한 변수

private void printGuessStatistics(char candidate, int count){
	String number;
	String verb;
	String pluralModifier;
	if ( count == 0 ) {
		number = "no";
		verb = "are";
		pluralModifier = "s";
	} else if ( count == 1 ) {
		number = "1";
		verb = "is";
		pluralModifier = "";
	} else {
		number = Integer.toString(count);
		verb = "are";
		pluralModifier = "s";
	}
}
```

여기까지만 보고 위 코드가 어떤 동작을 하는 지 유추할 수 있는가?

```java

private void printGuessStatistics(char candidate, int count){
	String number;
	String verb;
	String pluralModifier;
	if ( count == 0 ) {
		number = "no";
		verb = "are";
		pluralModifier = "s";
	} else if ( count == 1 ) {
		number = "1";
		verb = "is";
		pluralModifier = "";
	} else {
		number = Integer.toString(count);
		verb = "are";
		pluralModifier = "s";
	}
		String guessMessage = String.format(
		"There %s %s %s%s", verb, number, candidate, pluralModifier
	);
	print(guessMessage);
}
```

위 코드는 `guessMessage` 에서 그 동작과 맥락이 완성지어진다는 점에서 한계점이 존재하는 코드이다. **코드에 맥락을 추가한다는 법칙을 반영하면 코드가 다음과 같아진다.**

```java
public class GuessStaticsMessage {
	private String number;
	private String verb;
	private String pluralModifier;
	
	public String make(char candidate, int count) {
		createPluralDependentMessageParts(count);
		return String.format(
			"There %s %s %s%s",
			verb, number, candidate, pluralModifier );
	}
	
	private void createPluralDependentMessageParts(int count) {
		if(count == 0) {
			thereAreNoLetters();
		} else if (count == 1){
			thereIsOneLetter();
		} else {
			thereAreManyLetters(count);
		}
	}

	private void thereAreManyLetters(int count) {
		number = Integer.toString(count);
		verb = "are";
		pluralModifier = "s";
	}

	private void thereIsOneLetter() {
		number = "1";
		verb = "is";
		pluralModifier = "";
	}

	private void thereAreNoLetters() {
		number = "no";
		verb = "are";
		pluralModifier = "s";
	}
}
```

위 코드의 맥락을 이해해보면 다음과 같은 과정으로 생각해볼 수 있다.

1. `printGuessMessage` 라는 클래스로 정의된 것이 아니라 `GuessStaticMessage` 로 **Guess해야한다는 맥락이 중심으로 선정되었음을 확인할 수 있다.** 이전에는 `print` 라는 맥락이 중심을 이루는지 `guess`라는 맥락이 주를 이루는지 정확히 파악하기가 어려웠다.
2. `String make()`메서드를 통해 **문자열을 만드는 동작을 명확히 정의하였다.**
3. 기존에 `if-else` 구문으로 엮여있던 동작들을 각각 메서드로 분리하여 **맥락을 명확히 하였다.** (글자 개수에 따라 달라지는 맥락으로 알고리즘의 흐름을 정의한 것)

### 불필요한 맥락을 없애라