---
title: 클린코드
---

클린코드는 **보이스카우트 규칙을** 주된 철학으로 생각한다. 시간을 억지로 내서 과거의 코드를 갈아 엎는 것이 아니라 앞으로 짜게 될 코드를 깨끗하게 작성할 생각을 하라는 것이다.

## 1장 - 의미 있는 이름

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

두 코드를 비교하자면 각 변수는 다음과 같이 맵핑될 수 있다. `NUMBER_OF_TASKS == 34` , `t == taskEstimate` , `realDaysPerIdealDay == 4` , `WORK_DAYS_PER_WEEK == 5` `s == sum`

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

:::details 정적 팩토리 메서드란?
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

:::

`Complex fulcrumPoint = Complex.FromRealNumber(23.0);` 코드가 퍼블릭 생성자를 이용하는 코드보다 좋은 코드이다. 클래스에 미리 정적 팩토리 메서드를 작성해두자. 또한 정적 팩토리 메서드의 이름은 **타입을 명시하는 형태로 명명하자.**

### 기발한 이름은 피하라

농담식으로 변수명을 작성하지 말자. `kill()` 대신 `whack()`, `으악!()` 등으로 정의하면 유머 감각이 맞지 않는 독자가 변수명을 이해하지 못할 수도 있다.

### 한 개념에 한 단어를 사용하라

일례로 값을 **얻는다는 의미의 메서드를** 다양한 클래스에 거쳐 **동음이의어로 작성하게 되면** 독자가 혼란을 겪게 된다. `get == fetch == retrieve` 로 동일한 의미의 단어가 있을때 접근자 메서드를 정의하고자 한다면 (표준에 따라 get으로 하는게 맞겠지만) `fetch` 로만 통일하던지, `retrieve` 로만 통일하던지 해야한다.

단순 의미를 넘어 동작을 묘사하는 단어도 비슷한 의미를 갖는 경우가 많다. `Manager` 와 `Controller` 를 사물에 적용하면 구분하기 쉽지 않다. `DeviceController` , `ProtocolManager` 등 같은 동작에 다른 의미로 작성하면 혼란이 온다.

### 말장난을 하지 마라

**한 개념에 한 단어를 사용하라는** 규칙을 오해하여 **맥락이 전혀 다른 동작을 하는데에도 같은 단어를 사용해서도 안된다.** 기존의 `add` 가 두 수를 더하여 반환하는 동작을 한다고 가정했을 때 배열에 새로운 원소를 추가하는 것도 `add` 메서드로 정의할 것인가? `insert` 나 `append` 로 새롭게 정의하는 것이 맞다.

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

맥락을 부여하여 변수의 이름을 길게 또 명확하게 하려는 시도는 좋지만 이 과정에서 **불필요한 맥락은 버려야한다.** 불필요한 맥락을 판단하는 근거는 **이미 변수의 의미가 명확한지 여부를 체크해보면 된다.**

예를 들어 고급 휘발유 충전소 (GSD, Gas Station Deluxe)라는 애플리케이션을 짜는 시나리오를 생각해보자. GSD에 필요한 다양한 클래스들을 구성함에 있어 접두어로 GSD를 모두 붙이는 것은 부적절하다. 코드를 읽는 독자가 GSD라는 애플리케이션 내에서는 GSD라는 중심 맥락을 잘 잃지 않기 때문에 굳이 명칭에 포함시킬 필요가 없는 것이다.

GSD내에 고객의 주소에 대한 클래스를 정의할 때 `accountAddress`와 `customerAddress` 로 나누어 정의할 필요가 있을까? 이 또한 맥락을 구분지을 필요 없이 `Address`라는 한 맥락 안에서 두 갈래의 인스턴스가 파생된다는 뉘앙스로 생각해보면 될 것이다.

### 마치면서

좋은 이름 선택을 위해서는 설명 능력은 뛰어나면서 문화적 배경이 동일해야한다는 점이 어렵다.

## 2장 - 함수

함수는 어떤 프로그램이든 **가장 기본적인 단위가 된다.** 이번 장에서는 함수를 잘 만드는 법을 배운다.

다음의 복잡한 코드를 살펴보자.

```java
// HtmlUtil.java (20070619)
// 1번 코드
public static String testableHtml(
	PageData pageData,
	boolean includeSuiteSetup
) throws Exception {
	WikiPage wikiPage = pageData.getWikiPage();
	StringBuffer buffer = new StringBuffer();
	if (pageData.hasAttribute("Test")) { // 테스트 페이지라면
		if(includeSuiteSetup) { // 테스트 페이지이면서 셋업?
			WikiPage suiteSetup =
				PageCrawlerImpl.getInheritedPage(
						SuiteResponder.SUITE_SETUP_NAME, wikiPage
				);
			if (suiteSetup != null) { // 셋업이라면
				WikiPagePath pagePath =
					suiteSetup.getPageCrawler().getFullPath(suiteSetup); // 셋업페이지 path확보
				String pagePathName = PathParser.render(pagePath);
				buffer.append("!include -setup .");
							.append(pagePathName)
							.append("\n");
				} // 기존 페이지 경로 저장
		} // includeSuiteSetup 분기 끝
		WikiPage setup =
			PageCrawlerImpl.getInheritedPage("SetUp", wikiPage);
		if(setup != null){
			WikiPagePath setupPath =
				wikiPage.getPageCrawler().getFullPath(setup);
			String setupPathName = PathParser.render(setupPath);
			buffer.append("!include -setup.")
						.append(setupPathName)
						.append("\n"); // 셋업 페이지 경로 추가
			}
		} // 테스트 페이지에 판단 + 끝
		buffer.append(pageData.getContent()); // 셋업 페이지 최종 추가
		if (pageData.hasAttribute("Test")) { // 테스트 페이지라면
			WikiPage teardown = // 해제 페이지 확보
				PageCrawlerImpl.getInheritedPage("TearDown", wikiPage);
			if(teardown != null) {
				WikiPagePath tearDownPath =
					wikiPage.getPageCrawler().getFullPath(teardown);
				String tearDownPathName = PathParser.render(tearDownPath);
				buffer.append("\n")
							.append("!include -teardown.")
							.append(tearDownPathName)
							.append("\n"); // 해제 페이지 경로 추가
			}
			if (includeSuiteSetup) {
				WikiPage suiteTeardown =
					PageCrawlerImpl.getInheritedPage(
						SuiteResponder.SUITE_TEARDOWN_NAME,
						wikiPage
					);
				if (suiteTeardown != null){
					WikiPagePath pagePath =
						suiteTeardown.getPageCrawler().getFullPath(suiteTeardown);
					String pagePathName = PathParser.render(pagePath);
					buffer.append("!include -teardown.")
								.append(pagePathName)
								.append("\n");
				}
			}
		} // 테스트 페이지 판단 + 해제 페이지 추가 완료
		pageData.setContent(buffer.toString());
		return pageData.getHtml(); // 페이지 렌더링과 함께 작업 마무리
}
```

코드 흐름은 주석을 달며 해석을 해보았다.

위 코드를 리팩터링한 다음 코드를 살펴보고 나의 이해를 간략히 적어보겠다.

```java
// 2번 코드
public static String renderPageWithSetupsAndTeardowns(
	PageData pageData, boolean isSuite
) throws Exception {
	boolean isTestPage = pageData.hasAttribute("Test");
	if(isTestPage) {
		WikiPage testPage = pageData.getWikiPage();
		StringBuffer newPageContent = new StringBuffer();
		includeSetupPages(testPage, newPageContent, isSuite);
		newPageContent.append(pageData.getContent());
		includeTeardownPages(testPage, newPageContent, isSuite);
		pageData.setContent(newPageContent.toString());
	}
	return pageData.getHtml();
}
```

1. 4L : 페이지의 속성 중 Test 여부를 판별하는 속성의 값을 `isTestPage` 변수에 저장한다.
2. 5L : 테스트페이지가 맞다면 내부 분기문을 실행한다.
3. 6L ~ 11L : 테스트페이지에 `setup` 페이지와 `teardown` 페이지를 집어넣는다.
4. 13L : HTML로 렌더링한다.

중간중간 등장하는 메서드들이 정확히 어떤 동작을 하는 지에 대해서는 모르지만 의도에 대해서 어느정도 추측이 가는 것은 사실이다.

리팩토링한 코드처럼 처음 코드를 보게 될 독자에게 좋은 함수 코드를 선사하려면 어떻게 해야할까?

### 작게 만들어라!

첫 복잡한 코드를 리팩토링 했음에도 더 작은 크기로 함수를 줄일 수 있다.

```java
// 3번 코드
public static String renderPageWithSetupsAndTeardowns(
	PageData pageData, boolean isSuite) throws Exception {
	if (isTestPage(pageData))
		includeSetupsAndTeardownPages(pageData, isSuite); // includeSetupsAndTeardownPages라는 메서드로 분리하자.
	return pageData.getHtml();
}
```

**if문/else문/while문 등에 들어가는 블록은 한 줄이어야 우아한 코드이다.** 대개 한줄로 이루어진 블럭에서 **함수를 호출하게 된다.** 함수 중첩구조를 최대한 줄이는 것이 좋다.

### 한 가지만 해라!

첫 번쨰 코드는 다양한 일을 한다. (어떤 일을 하는 지는 잘 모르겠다..) 확실한건 리팩토링 두 번의 과정을 거친 마지막 코드는 `pageData`가 테스트 페이지라면 해당 `pageData`에 `setup`페이지와 `teardown`페이지를 집어넣고 렌더링을 진행한다.

해석의 여지에 따라 3번째 코드가 세 가지 일을 한다고 주장할 수 있다.

1. `if(isTestPage(pageData))` : 테스트 페이지인지 판단한다.
2. `includeSetupsAndTeardownPages(...)` : 테스트 페이지이면 설정페이지와 해제 페이지를 삽입한다.
3. `return pageData.getHtml();` : 페이지를 HTML로 렌더링한다.

지정된 함수 이름을 살펴보면 `renderPage ...` 로 명명되어 있음을 볼 수 있다. 함수에 진입한 후의 프로세스를 보면 결과적으로 페이지가 테스팅 페이지던지 아니던지 **페이지 렌더링이라는 동작이 공통적으로 진행된다.**

1번 코드는 함수 내에서 다양한 동작을 처리하고있다. (이해는 못함) 2번 코드는 페이지가 테스트 페이지인지 여부를 판단하는 동작과 페이지 렌더링 동작을 함께 처리하고있다. 3번 코드는 테스트 페이지인지 여부를 판단하는 동작을 바깥으로 빼고 렌더링 동작만 처리하고있다. (코드로 서술을 하는지에 대한 여부를 확인했다.)

**함수 내에서 또 다른 함수를 의미 있는 이름으로 또 다시 추출할 수 있다면 그 함수는 여러 함수를 작업하고 있는 것이다.**

### 함수 당 추상화 수준은 하나로!

[추상화 수준에 대한 글](https://medium.com/@oowgnoj/clean-code%EB%A5%BC-%EC%9D%BD%EA%B3%A0-2-893d73b86b37)

:::details 추상화 예시 문장

김 아무개는 배가 고프면 김치찌개를 먹는다.
**사람은 배가 고프면 음식을 먹는다.** 김 아무개는 사람으로, 김치찌개는 음식으로 추상화된 문장이다.

개미집에는 일정한 비율로 놀고 있는 개미가 없으면, 긴급 사태에 대응할 수 없어서 전멸할 리스크가 높아진다.
**평상시의 업무량에 맞춰 처리 능력을 최적화해버리면 큰 환경 변화가 일어났을 때 대응할 수 없어서 조직은 멸망해버린다.**
(출처 - [https://medium.com/@oowgnoj/clean-code를-읽고-2-893d73b86b37](https://medium.com/@oowgnoj/clean-code%EB%A5%BC-%EC%9D%BD%EA%B3%A0-2-893d73b86b37)

개미집에 일정한 비율로 놀고 있는 개미가 없다는 것은 평상시 업무량에 맞춰 처리 능력을 최적화한 상태, 긴급 사태로 인한 전멸은 큰 환경변화에 대응하지 못하는 모습으로 추상화될 수 있다.

추상화된 문장이라는 것은 각기 다른 사건에 개별성을 낮추어 여러 상황에 적용될 수 있게 한다. **추상화를 거친 문장은 한 뜻을 내포하는 여러 문장을 만들 수 있게 된다.**

:::

> 1번 코드에서 `getHtml()`은 추상화 수준이 아주 높다. 반면, `String pagePathName = PathParser.render(pagepath);`는 추상화 수준이 중간이다. 그리고 `.append(”\n”)`와 같은 코드는 추상화 수준이 아주 낮다.

`getHtml()` 의 추상화 수준이 높은 이유는 `getHtml()`이전에 등장하는 갖가지 if, for루프 등 여러 동작을 하는 구문들로 인해 다양한 경우의 수가 발생할 수 있기 때문이다. `getHtml()`이라는 한 가지의 뜻을 가지고 다양한 형태의 구문들을 만들어낼 수 있다.

이에 비해 `String pagePathName = PathParser.render(pagepath);`은 `pagepath`데이터를 렌더링하는 정보를 `pagePathName`이라는 변수에 저장하는 뜻을 내포하지만 `pagepath`라는 변수로 인해 여러 형태의 구문을 만들 수 있게 된다. `getHtml()`에 비해서는 추상화 수준이 낮다.

`.append("\n");` 동작을 더 쪼갤 수 있을까? 그렇지 않다. 빈 줄 하나를 추가한다는 뜻을 내포한 채 유사하지만 다른 동작을 할 가능성이 전혀 없다. 따라서 `.append(”\n”);`는 추상화 수준이 매우 낮다.

근본이 되는 개념에 세부 사항을 섞은 코드, 즉 추상화 수준이 높은 코드를 작성하면 독자가 이해하기 어려울 뿐더러 이후 **함수에 세부사항을 점점 더 추가하게된다.**

> 위에서 아래로 코드 읽기 : 내려가기 규칙 위에서 아래로 프로그램을 읽으면 **함수 추상화 수준이 한 번에 한 단계씩 낮아지는 것을 말한다.** 쉽게 말해 각 함수는 다른 함수를 같은 `Depth`에서 소개를 하고, 소개된 함수는 또 다른 함수를 소개하는 방식으로 이루어지는 것이다.

```text
Depth1---Depth2---Depth3
  A--------B--------X------.....
  |        |--------Y....
  |
  |--------C--------L
           |--------M
```

### Switch 문

**Switch문은 줄이기 어렵다.** 본질적으로 N가지 방향의 일을 처리하기 위해 만들어진 문법이기 때문이다. 다형성(Polymorphism)을 이용하여 반복하지 않는 방법은 존재한다. (여러 분기를 한번에 처리하기 위한 if-else 구문도 포함)

```java
public Money calculatePay(Employee e)
throws InvalidEmployeeType {
	switch(e.type){
		case COMISSIONED:
			return calculateCommisionedPay(e);
		case HOURLY:
			return calculateHourlyPay(e);
		case SALARIED:
			return calculateSalariedPay(e);
		default:
			throw new InvalidEmployeeType(e.type);
	}
}
```

위 함수가 갖는 문제점을 정리하면 함수가 길고, 한 가지 작업만 하지 않고, SRP를 위반하며, OCP또한 위반한다.

:::details SRP, OCP?

1. SRP(Single Responsibility Principle) : SRP는 OOP에서 단일 책임 원칙을 말한다. 모든 클래스는 하나의 책임만 갖고 그 책임을 **완전히 캡슐화 해야한다는 원칙이다.** 여기서 책임이란 코드를 변경하려는 이유를 뜻한다.

2. OCP(Open Closed Principle) : OCP는 개방-폐쇄원칙을 말한다. **확장에 대해서는 개방, 수정에 대해서는 폐쇄되어 있어야 한다는 것이다.**

:::

SRP, OCP를 알아보았으니 문제에 대한 실제 근거를 분석해보자.

1. 함수가 길다 - 함수 내에서 다양한 일들이 벌어지게 된다.
2. 한 가지 작업만 하지 않는다 - `e.type` 데이터에 따라 서로 다른 동작을 하게 된다.
3. SRP를 위반한다 - 코드 변경에 대한 이유가 다양하다. `case` 추가, 내부 동작의 수정이 이루어지는 등.
4. OCP를 위반한다 - 일례로 직원 유형이 새롭게 추가되면(switch문의 case추가) **수정에 대한 폐쇄 원칙이 깨진다.**

`switch` 문을 깨끗하게 작성하면 다음과 같은 코드로 작성해볼 수 있겠다.

```java
public abstract class Employee {
	public abstract boolean isPayday();
	public abstract Money calculatePay();
	public abstract void deliverPay(Money pay);
}

public interface EmployeeFactory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType;
}

public class EmployeeFactoryImpl implements EmployeeFacory {
	public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
		switch (r.type) {
			case COMISSSIONED:
				return new CommissionedEmployee(r);
			case HOURLY:
				return new HourlyEmployee(r);
			case SALARIED:
				return new SalariedEmployee(r);
			default:
				throw new InvalidEmployeeType(r.type);
		}
	}
}
```

위 코드를 자바 문법에 따라 해석해보면 다음과 같다

1. 직원에 대한 추상 클래스를 선언한다. (`public abstract class Employee`)
2. 직원 생성을 위한 인터페이스를 선언한다. (`public interface EmployeeFactory`), 이 인터페이스 내에는 `makeEmployee`라는 메서드가 선언되어 있고 이 인터페이스를 구현하는 클래스에서 이 메서드를 구현해놓게 된다.
3. 직원 생성 인터페이스를 구현하는 구현클래스를 선언한다. (`EmployeeFactoryImpl`), 이 클래스에서 `makeEmployee` 메서드를 구현하게 된다. 구현클래스 내부에서 역시 `switch`문을 사용하게 되지만 기존에 함수 내에서 사용한 `switch`문과 다른 점이 있다.

기존 함수 내의 `switch`문에서 개선된 점은 바로 **코드가 클래스 내에 숨겨졌다는 것이다.** 이에 따라 SRP, 책임에 대한 원칙이 지켜졌다. 나머지 한계점에서 개선된 것이 있느냐 하면 사실 그렇지는 않아보인다. 저자도 다형적 객체를 생성하는 코드 내에서는 `switch`문을 한 번만 참아준다고 한다.

### 함수 인수

함수에서 이상적인 인수(파라미터)의 개수는 0개이다. (무항 함수) 인수의 개수가 늘어나는 것은 권장되지 않으며 네개 이상의 인수를 갖는 함수부터는 특별한 이유가 필요하게 될 정도이다.

함수 인수는 **인스턴스 변수를 통해 다루는 것이 좋다.** 인수 삽입으로 인해 독자가 굳이 알지 않아도 될 인수 타입까지 직접 찾아봐야 한다는 번거로움이 존재한다. 다양한 함수의 인수에 따른 유형을 나누어 확인해보자.

**1. 단항 함수**

1. 인수에 질문을 던지는 경우 - `boolean fileExists("myFile");` 이 함수는 `myFile`이라는 파일이 존재하는 지를 묻는 함수이다.
2. 인수를 다른 하나로 변환 후 결과를 반환하는 경우 - `InputStream fileOpen("myFile");`이 함수는 String타입의 파일명을 InputStream으로 변환하는 동작을 한다고 한다.
3. 이벤트 처리를 하는 경우 - 함수 호출과 함께 이벤트가 함수의 입력 인수로 변환되어 들어간다. 출력 인수는 없다. **이벤트 함수는 이벤트라는 사실이 코드에 명확히 드러나야 한다.** `EventListener` 라는 식으로 작명에 이벤트를 꼭 표시하자. `EventListener`라는 단어가 꼭 아니더라도 이벤트 행위 자체를 표현하면 된다. `passwordAttemptFailedNtimes(int attempts)` - 패스워드가 N번 실패한 이벤트를 감지하는 함수이다.

:::details 입력인수와 출력인수란?

입력 인수는 **함수에게 작업 대상을 지정하기 위해 전달된다.** 우리가 익히 아는 인수를 생각하면 된다. `plusOne(i)`에서 i라는 작업 대상을 지정하기 위해 입력인수로 이용하는 것이다.

출력 인수는 **함수가 작업한 결과를 돌려 받기 위해 사용된다.** `scanf` 함수를 생각해보면 `scanf("%d, &i);`에 전달되는 변수 i는 `scanf`함수에서 초기화될 필요도 없고 함수 내의 동작을 처리하기 위해 사용되는 것이 아니다. 온전히 `scanf`의 결과로 반환되는 값을 저장하기 위해 사용되는 변수이다.

:::
위와 같은 경우가 아니라면 단항 함수는 피하자.

**2. 플래그 인수(Flag parameter)**

플래그 인수는 자기자신으로 인해 전달받은 함수의 동작이 **여러 경우로 쪼개질 경우를 미리 생각 했음에도** 그대로 사용하는 것이 문제이다. 예를들어 플래그 인수로 특정 직원의 유형을 전달한다고 가정해보자. 아래 코드에서 볼 수 있듯 `Employee` 타입 객체의 유형에 따라 여러 분기로 쪼개지는 `switch`문은 여러 문제를 야기했었다. `Employee e`가 함수에 플래그를 찍어 다양한 동작을 야기하고 있다.

```java
public Money calculatePay(Employee e)
throws InvalidEmployeeType {
	switch(e.type){
		case COMISSIONED:
			return calculateCommisionedPay(e);
		case HOURLY:
			return calculateHourlyPay(e);
		case SALARIED:
			return calculateSalariedPay(e);
		default:
			throw new InvalidEmployeeType(e.type);
	}
}
```

플래그 인수의 논리 구조를 함수로써 표현하고싶다면 각 경우에 맞춰 함수를 분리하도록 하자. `Suite`페이지를 렌더링하는 함수를 `if(page.suite == "Suite")`로 분기시키지 말고 메서드로써 `renderPageForSuite()`로 작성하자.

**3. 이항 함수**

`writeField(name)`과 `writeField(outputStream, name)` 두 함수를 비교해보자. 단항 함수인 전자의 경우가 단숨에 이해하기 쉬우며 후자는 `outputStream`이 어떤 역할을 하는지 생각을 해보게 된다.

이항 함수가 적절한 예시를 보면 `Point(0,0)`함수를 그 예로 제시할 수 있다. 직교 좌표 (0,0)을 표현하는 `Point` 메서드는 오히려 단항함수로 표현하려고 하면 문제가 발생한다. `Point` 메서드를 이항 함수로 선언하는 것이 더 적절한 이유는 **인수 두 개가 한 값을 표현하는 요소이고 x,y라는 자연적인 순서도 존재하기 때문이다.**

이항함수의 자연적인 순서에 대한 예시로 `assertEquals(expected, actual)` 함수를 들 수 있다. `expected` 값을 `actual`값이라고 주장하는가, `actual`값을 `expected`값이라고 주장하는가? 해석의 여지에 따라 라이브 코딩 당시에 실수할 경우가 존재한다. **인위적으로 인수의 순서를 기억해야하는 이항 함수는 좋지 않다.**

삼항함수는 당연하게도 이항함수보다 이해하기 더 어려우며 순서에 대한 고려가 신중해야 한다.

**4. 인수 객체, 인수 목록**

인수가 2-3개 필요할 때 인수의 의미 표현을 맞추어 객체로 묶는 것도 좋은 시도이다.

```java
Circle makeCircle(double x, double y, double radius); // 일반적인 원 객체
Circle makeCircle(Point center, double radius); // 좌표와 반지름
```

때로는 인수의 개수가 가변적인 함수도 필요하다. `String.format`메서드를 생각해보자.

```java
String.format("%s worked %.2f hours.", name, hours);
```

위 코드의 선언부를 보면 `public String format(String format, Object ...args)`로 나타나있는데 이 코드를 이해하기 위해서는 **가변인자**라는 문법을 알아야한다.

:::details 가변인자?

[https://dpdpwl.tistory.com/137](https://dpdpwl.tistory.com/137)

가변인자는 함수 선언시 몇개의 인수를 전달할지 정하지 못했을 때 사용한다. 가변인자 뒤에는 매개변수를 선언할 수 없다.

```java
public class test {
    public static void main(String [] args){
    	test t = new test();
    	t.variable();
    	t.variable("A");
    	t.variable("A", "B");
    }

    public void variable(String ...s){ // String타입의 가변 인자 선언
    	System.out.println(Arrays.toString(s));
    }
}
```

위 코드를 보면 `variable`함수에 따로 인자 수가 고정되어 있지 않음에도 다양한 형태로 해당 함수를 호출하는 것을 볼 수 있다. 바로 `variable` 함수의 인자로 가변인자인 `String ...s` 가 선언되었기 때문이다. 스트링 타입인 s가 여러개 이용될 수 있다는 것을 의미한다.

:::

가변인자를 통해 선언된 여러개의 인수는 사실 하나로 묶여있기 때문에 고정인수인 `%s worked...` 구문을 포함한 두 인자로 쪼개져 최종적으로 **이항함수가 된다.**

가변 인수를 취하는 모든 함수에 같은 원리가 적용되지만 가변 인수를 포함한 전체 인수의 개수가 3개를 넘어서면 문제가 될 것이다.

**5. 동사와 키워드**

- **함수의 의도와 인수의 순서, 의도를 정확히 파악하기 위해서는 좋은 함수의 이름이 중요하다.**
  - `write(name)` → 이름을 쓰는 함수
  - `writeField(name)` → 이름을 **필드에 작성한다.**
  - 인수의 순서를 함수의 이름에 포함시킨다. `assertEquals`보다 `asserExpectedEqualsActual(expected, actual)`가 인수의 순서를 파악하기 쉽다.

### 부수 효과를 일으키지 마라!

함수의 부수 효과는 **다중 동작의 포함이라고 해석할 수 있다.** 예상치 못한 수정이 큰 문제로 이어질 수 있다. 시간적인 결합(Temporal coupling)과 순서 종속성(order dependency)을 초래한다. 다음 코드의 부수 효과를 찾아보자.

```java
public class UserValidator {
	private Cryptographer cryptographer;

	public boolean checkPassword(String userName, String password){
		User user = UserGateway.findByName(userName);
		if(user != User.NULL){
			String codedPhrase = user.getPhraseEncodedByPassword();
			String phrase = cryptographer.decrypt(codedPhrase, password);
			if("Valid Password".equals(phrase)){
				Session.initialize();
				return true;
			}
		}
		return false;
	}
}
```

위 코드는 간단하게 **유저 정보를 확인하는 코드이다.** 인수로 입력된 유저 네임을 서치하여 존재했을 때 내부 인코딩 방식인 `getPhraseEncodedByPassword()`함수를 호출하여 인코딩을 하고, DB에서 유저네임이 현재 갖고있는 패스워드를 비교한 뒤 유효한 패스워드라고 판단 되었을 때 `Session.initialize()`함수를 호출하게 된다.

**위 코드에서 발생하는 부수 효과는 바로 `Session.initialize()`이다.** 누군가 이 함수의 이름만 보고 함수를 호출하게 되면 **기존 세션 정보를 초기화시키는 부수효과를 발생시키는 것이다.**

위와 같은 부수 효과가 **시간적인 결합을 초래한다.** 시간적인 결합이라 함은 프로그램을 너무 순차적인 관점에 가둔다는 것이다. A 흐름 다음에는 무조건 B가 와야되는 식으로 고정하여 **동시성을 구현하지 못하는 상황이다.** (시간적인 결함과 순서 종속성은 동일한 의미를 갖는다.)

위 코드에서 예측하지 못한 상황은 바로 **세션 초기화가 제때 일어나지 못하는 상황이다.** 잘못 호출하여 현재 세션 정보가 날아가면 낭패다. 위 함수 이름보다는 `checkPasswordAndInitializeSession`이라는 이름이 더 어울리지만 **한 가지 동작만 하라는 함수의 원칙을 깬다.**

:::details 출력 인수에 대하여

우리는 일반적으로 함수의 인수에 대해 입력이라고 생각하지, 출력 인수라고 생각하지 않는다. `appendFooter(s)` 함수는 바닥글을 s에 출력하는걸까? s라는 바닥글을 컨텐츠에 붙이는걸까?

OOP에서는 이러한 혼동을 막기 위해 **this**라는 문법을 만들었다. 출력인수를 `StringBuffer`라는 요상한 타입으로 선언하면서까지 활용할 필요가 없다.

:::

### 명령과 조회를 분리하라!

함수에서 조회는 **객체 상태를 변경하는 것이고** 명령은 **객체 상태에 변화를 주는 것이다.**

```java
public boolean set(String attribute, String value); // 무슨 코드인가?
```

위 코드는 `attribute` 속성 값을 `value`로 세팅하고 세팅 성공 여부를 반환한다. 위 코드는 다음의 형태로도 축약될 수 있다.

```java
if(set("myAttribute", "InputValue"))
```

축약된 형태의 `set`함수는 기존의 선언부를 보지 않으면 해석의 여지가 다분해진다. 원래 의도대로 처리될 수도 있겠지만 경우에 따라 **myAttribute가 InputValue로 set 되어있으면..** 과 같은 해석도 가능하다.

근본적인 해결책은 조회와 반환을 구분짓는 것이다.

```java
if(attributeExists("myAttribute")){
	setAttribute("myAttribute", "InputValue");
}
```

### 오류 코드보다 예외를 사용하라!

함수에 대한 입력이 에러를 발생시키는 상황을 매번 처리한다고 가정해보자. 한 오류에 대해 처리하고 다음 프로세스를 진행하는 과정에서 프로그램의 의도는 알게 되지만 코드자체가 너무 지저분해진다. 다음의 코드를 보자.

```java
if(deletePage(page) == E_OK) { // 페이지가 삭제 대상이면
	if(registry.deleteReference(page.name) == E_OK) { // 페이지 참조를 확인하고,
		if(configKeys.deleteKey(page.name.makeKey()) == E_OK){ // 정상적으로 삭제가 되면
			logger.log("page deleted"); // 메시지를 출력한다.
		} else {
			logger.log("configKey not deleted");
		}
	} else {
		logger.log("deleteReference from registry failed");
	}
} else {
	logger.log("delete failed");
	return E_ERROR;
}
```

코드를 천천히 살펴보면 이해는 쉽지만 콜백 지옥과 같은 형태로 if문의 깊이(Depth)가 깊어진다.

위의 코드를 예외처리 구문으로 간단히 정리해보자.

```java
try{
	deletePage(page);
	registry.deleteReference(page.name);
	configKeys.deleteKey(page.name.makeKey();
} catch (Exception e) {
	logger.log(e.getMessage());
}
```

위 코드를 보면 `try` 하는 동작이 세 가지나 된다. 보통 `try~catch`블록은 이러한 형태를 많이 띠기 때문에 블록을 밖으로 분리하는 연습을 많이 하자.

```java
try {
	deletePageAndAllReferences(page);
} catch (Exception e) {
	logError(e);
}

private void deletePageAndAllReferences(Page page) throws Exception {
	deletePage(page);
	registry.deleteReference(page.name);
	configKeys.deleteKey(page.name.makeKey());
}

private void logError(Exception e){
	logger.log(e,getMessage());
}
```

여기서 주목해야 하는 점은 바로 **코드를 실제 읽고 활용하는 독자와 내부적으로 구현을 진행하는 전문 개발자의 영역이 철저히 구분되어야 한다는 것이다.**

> 개발자가 라이브러리 내부 동작을 전부 이해한 뒤에 해당 라이브러리를 활용하는가? 그렇지 않다. 추상화된 기능만을 확인하고 적당한 위치에 적용하는 것이다. 리팩토링한 코드를 보면 일반적인 개발자들이 `try~catch`로 간단해진 코드를 라이브러리로써 가져다 쓸 수 있을 만큼 **기능에 대한 정의만 명확히 하였다.** 내부적인 동작은 코드가 더럽든 안더럽든 `private`하게 감추어져 있기 때문에 큰 의미가 있지는 않다.

**오류 처리도 한 가지 작업이다. 명심하자!** 오류 처리도 작업이라는 의미는 오류 **만** 처리해야된다는 것이다.

:::details 의존성 자석(magenet)

오류 코드를 반환한다는 것은 어디선가 오류 코드를 정의한다는 의미이다.

```java
public enum Error{
    OK,
    INVALID,
    NO_SUCH,
    LOCKED,
    OUT_OF_RESOURCE,
    WAITING_FOR_EVENT;
}
```

에러 코드를 사용할 모든 코드는 `enum`타입 에러 코드를 반드시 `import`시켜줘야한다. 기존 에러코드에 수정사항이 생길 경우 이미 `import`하여 배포되고 있는 클래스 전체를 컴파일시켜야 하기 때문에 번거롭다. 이럴때 **try~catch 예외처리를 통해 확장성을 챙길 수 있게 된다.**

:::

### 반복하지 마라!

함수 이야기를 시작하며 맨 처음 제시된 코드를 살펴보면 주어진 페이지가 테스트 페이지인지 여부를 판단하여 `setup`하거나, `teardown`하는 동작을 확인할 수 있다. 가장 마지막 동작을 제외하고는 테스트 페이지 체킹, 페이지 경로 얻어서 `append` 하는 등의 알고리즘은 동일하다.

중복 제거 코드는 마지막에 소개한다.

### 함수를 어떻게 짜죠?

처음 짜는 함수는 길고 복잡하다. 지금까지 소개한 규칙들을 모두 깰지언정 **그 코드를 하나부터 열까지 모두 테스트하는 단위 테스트케이스를 만들어야 한다.** 모든 테스트 케이스를 통과하면서 리팩토링을 천천히 하는 것이다.

### 결론

> 대가 프로그래머는 시스템을 구현할 프로그램으로 보지 않고 풀어갈 이야기로 여긴다. 단순히 구현이라는 목적에만 매몰되면 어떻게 되겠는가. 함수가 **분명하고 정확한 언어로 같이 맞아떨어져야 이야기를 풀어가기가 쉬워진다는 것을 기억하자.**

```java
package fitnesse.html;

import fitnesse.responders.run.SuiteResponder;
import fitnesse.wiki.*;

public class SetupTeardownIncluder {
	private PageData pageData;
	private boolean isSuite;
	private WikiPage testPage;
	private StringBuffer newPageContent;
	private PageCrawler pageCralwer;

	public static String render(PageData pageData) throws Exception {
		return render(pageData, false); // isSuite 오버로딩 되어있는 render호출
	} // 페이지 데이터를 렌더링한다.

	public static String render(PageData pageData, boolean isSuite)
		throws Exception {
		return new SetupTeardownIncluder(pageData).render(isSuite);
	} // 해제 인클루더를 셋업한다.

	private SetupTeardownIncluder(PageData pageData) {
		this.pageData = pageData;
		testPage = pageData.getWikiPage();
		pageCrawler = testPage.getPageCrawler();
		newPageContent = new StringBuffer();
	} // Teardown 인클루더 데이터들을 초기화시킨다.

	private String render(boolean isSuite) throws Exception {
		this.isSuite = isSuite;
		if (isTestPage())
		includeSetupAndTeardownPages();
		return pageData.getHtml();
	} // isSuite로만 오버로딩 되어있는 render - 셋업과 해제 페이지 포함시킨 뒤 렌더링

	private boolean isTestPage() throws Exception {
		return pageData.hasAttribute("Test");
	} // 테스트 페이지 여부 검사

	private void includeSetupAndTeardownPages() throws Exception {
		includeSetupPages();
		includePageContent();
		includeTeardownPages();
		updatePageContent();
	} // 셋업페이지와 해제페이지 인클루딩. 페이지와 컨텐츠의 알고리즘을 각각 분리했다.

	private void includeSetupPages() throws exception {
		if(isSuite)
			includeSuiteSetupPage();
		includeSetupPage();
	} // Suite 여부가 전달되면 suite셋업 페이지 인클루딩, 아니면 그냥 셋업페이지 인클루딩

	private void includeSuiteSetupPage() throws Exception {
		include(SuiteResponder.SUITE_SETUP_NAME, "-setup");
	} // suite셋업 페이지 인클루딩

	private void includeSetupPage() throws Exception {
		include("SetUp", "-setup");
	} // nonSuite 셋업페이지 인클루딩

	private void includePageContent() throws Exception {
		newPageContent.append(pageData.getContent());
	} // 페이지 컨텐츠 인클루딩 - 전달받은 페이지 데이터를 새 페이지에 옮긴다.

	private void includeTeardownPages() throws Exception {
		includeTeardownPage();
		if(isSuite)
			includeSuiteTeardownPage();
 	} // 해제 페이지 Suite 여부 판단 후 인클루딩

	private void includeTeardownPage() throws Exception {
		include("TearDown", "-teardown");
	}

	private void includeSuiteTeardownPage() throws Exception {
		include(SuiteResponder.SUITE_TEARDOWN_NAME, "-teardown");
	}

	private void updatePageContent() throws Exception {
		pageData.setContent(newPageContent.toString());
	} // includePageContent에서 활용한 newPageContent를 전달받은 페이지 컨텐츠에 세팅(최종)

	private void include(String pageName, String arg) throws Exception {
		WikiPage inheritedPage = findInheritedPage(pageName);
		if(inheritedPage != null) {
			String pagePathName = getPathNameForPage(inheritedPage);
			buildIncludeDirective(pagePathName, arg);
		}
	} // 상속받은 페이지 서치 - 없으면 경로명 작업 시작

	private WikiPage findInheritedPage(String pageName) throws Exception {
		return pageCrawlerImpl.getInheritedPage(pageName, testPage);
	} // 상속페이지 서칭 작업 - 페이지 크롤링

	private String getPathNameForPage(WikiPage page) throws Exception {
		WikiPagePath pagePath = pageCrawler.getFullPath(page);
		return PathParser.render(pagePath);
	} // 페이지 크롤링 후 출력된 경로를 pagePath에 저장 및 파싱, 렌더링

	private void buildIncludeDirective(String pagePathName, String arg) {
		newPageContent
			.append("\n!include ")
			.append(arg)
			.append(" .")
			.append(pagePathName)
			.append("\n");
	} // includeDirective는 지정 파일의 내용을 원본 파일에 삽입하는 동작을 의미.
}
```

위 코드의 중심 동작 코드는 다음과 같다.

```java
private void includeSetupAndTeardownPages() throws Exception {
		includeSetupPages();
		includePageContent();
		includeTeardownPages();
		updatePageContent();
	}
```

이 코드를 추상화 수준에 맞춰 분리하면 위와 같이 디테일한 코드가 등장한다.
