(window.webpackJsonp=window.webpackJsonp||[]).push([[125],{651:function(v,_,l){"use strict";l.r(_);var o=l(6),c=Object(o.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h2",{attrs:{id:"tcp-기반의-half-close"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#tcp-기반의-half-close"}},[v._v("#")]),v._v(" TCP 기반의 Half-close")]),v._v(" "),_("p",[v._v("연결 종료라는 개념은 애초에 UDP 소켓에서는 존재할 수 없다. 연결 개념이 존재하지 않기 때문이다.")]),v._v(" "),_("p",[v._v("리소스는 반환 대상이다. 소켓 역시 운영체제 관점에서 리소스이기 때문에, 반환 혹은 해제가 필수적이다. 리눅스 기반에서는 소켓이 파일로 관리되기 때문에 "),_("code",[v._v("close")]),v._v(" 함수를 호출해야 한다.")]),v._v(" "),_("p",[_("code",[v._v("close")]),v._v("함수의 기능은 다음과 같다.")]),v._v(" "),_("ol",[_("li",[v._v("소켓의 완전 소멸을 의미한다.")]),v._v(" "),_("li",[v._v("소켓이 소멸되므로 더 이상 입출력이 불가능하다.")]),v._v(" "),_("li",[v._v("상대방의 상태를 모른 채로 "),_("code",[v._v("close")]),v._v("하기 때문에 상대방의 송수신이 완료되지 않은 경우 문제가 발생할 여지가 존재한다.")]),v._v(" "),_("li",[v._v("이러한 문제 대안으로 "),_("code",[v._v("Half-close")]),v._v("기법이 존재한다.")])]),v._v(" "),_("p",[v._v("소켓 입장에서 데이터를 다 보냈다는 확신은 할 수 있지만, 수신할 데이터가 더 남아있다는 것은 확신할 수 없다. 이러한 문제점을 위한 규약으로 "),_("code",[v._v("close")]),v._v("호출 시 상대에게 "),_("code",[v._v("EOF")]),v._v("를 전달하게 된다. 수신자가 EOF를 읽어들이면 상대가 나에게 보낼 데이터가 더 없다고 인식하게 된다.")]),v._v(" "),_("p",[v._v("고려할 상황을 정리해보면 다음과 같다.")]),v._v(" "),_("ol",[_("li",[v._v("A에서 B로 데이터를 전송할 것이 더 없음. "),_("code",[v._v("close")]),v._v("호출과 함께 EOF 전달")]),v._v(" "),_("li",[v._v("B에서 EOF를 받아 수신 종료")])]),v._v(" "),_("p",[_("code",[v._v("close")]),v._v("는 호출과 동시에 입력 스트림이 끊기게 된다. 데이터 송수신 흐름이 단절되기 때문에 위의 상황에서 A가 B로부터 데이터를 송신할 것이 남아있는지 여부와 상관없이 연결이 종료되는 것은 문제가 된다. 이 문제를 해결하기 위해 "),_("code",[v._v("Half-close")]),v._v(" 기법이 종료된다.")]),v._v(" "),_("p",[_("code",[v._v("Half-close")]),v._v("는 데이터 송신만 불가능하게 만들고 수신 스트림은 열어두는 것을 의미한다. "),_("code",[v._v("read")]),v._v("만 가능하도록 한다. "),_("code",[v._v("Half-close")]),v._v("는 실질적인 소켓의 소멸을 의미하는 것이 아닌, 데이터 송수신 흐름을 어떻게 처리하느냐에 대한 이야기이다.")]),v._v(" "),_("div",{staticClass:"custom-block tip"},[_("p",{staticClass:"custom-block-title"},[v._v("4-way 핸드셰이킹 vs half-close")]),v._v(" "),_("p",[v._v("4-way 핸드셰이킹과 half-close는 모두 TCP 연결 종료와 관련된 이야기이다. A -> B로 "),_("code",[v._v("FIN")]),v._v(", B -> A로 "),_("code",[v._v("ACK")]),v._v(", B -> A로 "),_("code",[v._v("FIN")]),v._v(", A -> B로 "),_("code",[v._v("ACK")]),v._v("를 주고받는 것이 4-way 핸드셰이킹이다. half-close는 수신 스트림은 열어두고 송신 스트림을 닫는 기법을 의미한다.")]),v._v(" "),_("p",[v._v("가만 보면 Half-close가 4-way 핸드셰이킹의 부분집합인것처럼 보인다.")]),v._v(" "),_("p",[v._v("하지만 4-way 핸드셰이킹이 이루어지는 주체는 각 소켓의 "),_("strong",[v._v("버퍼에 해당한다.")]),v._v(" 여러 네트워크 상의 트래픽으로 인해 송신할 데이터가 소켓 버퍼 내에서 대기중인 상황에 상대에게 핸드셰이킹 요청이 왔을 때 남은 데이터 처리를 하고 FIN을 나중에 보내야 한다.")]),v._v(" "),_("p",[v._v("4-way handshaking이 완료되면 데이터 송신 스트림도 막혀버리기 때문에 버퍼에 남은 데이터 송신이 불가능해지기 때문에, half-close를 이때 적용하여 남은 데이터를 버퍼에서 비우고 최종 FIN 메시지를 송신하게 되는 것이다.")])])])}),[],!1,null,null,null);_.default=c.exports}}]);