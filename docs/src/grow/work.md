---
title: 애드업 인턴일지
---

## 220103

애드업에서 진행중인 프로젝트 중 하나로 코맥스 사이트가 있다. 코맥스 cms(관리자) 사이트의 이전으로 인해 기획 단계부터 진행중인 프로젝트이다.

금일 진행한 작업의 내역은 다음과 같다.

1. 코맥스 IA와 코맥스 cms사이트의 게시판 관리 파트를 비교하여 xd파일 수정 작업을 진행하였음.
   - IA 순서에 맞게끔 xd 기획서 전체 재배열 진행
   - 각 기획서 페이지마다 사이드바 포커싱 이동 작업 진행
2. [shutterstock에서](https://www.shutterstock.com/ko/explore/korea-stock-images-0814?kw=shutterstock&c3apidt=p67361398787&gclid=Cj0KCQiA_c-OBhDFARIsAIFg3exOJwj7iuXhlK0bzVqftdiKw4nXDo6VpJHzH2gAb7-v99gdFEyV9fwaAtC7EALw_wcB&gclsrc=aw.ds) 거래처의 기획 의도에 맞는 영상 소스 서치

![grow](../.vuepress/assets/grow/list1.png)
![grow](../.vuepress/assets/grow/list2.png)
![grow](../.vuepress/assets/grow/list3.png)

## 220104

1. 코맥스 cms페이지 xd파일 수정 작업 진행
2. cms페이지 드랍다운 데이터 마이그레이션을 위해 추출 및 액셀 저장
   - 드랍다운 셀렉트 박스에서 데이터를 추출하기 위해 기존 cms에 정의된 DOM id값을 이용하였다.

```js
a = document.getElementById("ID값");
textArr = [];
for (i = 0; i < a.childNodes[1].childElementCount; i++) {
  textArr.push(a.childNodes[1].childNodes[2 * i + 1].text);
}

console.log(...textArr);
```

**console.log로 출력시 배열 앞에 ...을 붙이면 배열 형태가 아닌 문자열 형태로 출력해준다.**

다음과 같이 드랍다운 형태로 저장된 데이터를 추출하는 작업이다.
![drop](../.vuepress/assets/grow/drop2.png)
![drop](../.vuepress/assets/grow/drop.png)

수기로 작업하던 부분을 직접 자동화하여 귀찮은 작업을 단순화시켰다는 점에서 성장할 수 있었다.
