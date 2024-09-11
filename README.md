# SpringBoot-keycloak-MongoDB-React 프로젝트

이 프로젝트는 Keycloak을 사용한 인증시스템을 구현한 풀스택 애플리케이션으로
React를 프론트엔드로, Spring Boot를 백엔드로 사용하며, 데이터 저장소는 MongoDB를 사용하고
최종적으로 각 인스턴스를 Docker 컨테이너로 실행하여 통신합니다.

## 기술스택
- **Frontend**: React, Typescript, TailWind CSS, keycloak-js, react-router-dom
- **Backend**: Spring Boot, Spring Security, Keycloak
- **Database**: MongoDB
- **Authentication**: Keycloak (OAuth2, OpenID Connect)
------------------------------------------------------------
실제 진행상황이고 임시파일입니다. 나중에 수정할예정

1. login-required랑 check-sso 적용해보기 페이지 나눠서 
	ㄴ 둘은 공존하지 못한다 그이유
2. 상태관리 끝
	ㄴ keycloak 프로퍼티 전부 호출해서 어떤값을 사용할 수 있는지 테스트
3. 회원가입 창 커스터마이징
	ㄴ firstname, lastname 삭제 nickname 추가
4. A B C 통합 상태관리 app.tsx에서 객체생성하고 부여받기
	ㄴ 각 페이지별로 객체를 생성하면 keycloak객체는 한번만 생성해야한다는 에러메시지가뜸
5.토큰유무랑 토큰 만료랑은 관련없은 토큰만료가 문제임
	ㄴ 토큰은 존재하지만 토큰만료가 뜨면 api호출 인증불가 
6. 세션은 유지되고있는데 토큰이 재발급이안됨
	ㄴ keycloak?.authenticated가 true 에도 서버측에서 로그인상태인지, 세션유지중인지 유무이지
	ㄴ 토큰재발급은 보통 자동으로 처리되지만 여러가지이유 (다른탭, 네트워크, 등등) 으로 재발급못받았을때는
	ㄴ 수동으로 재발급받아야함 
	ㄴ keycloak.updateToken(30)으로 30초 미만일때 재발급을 받을수있는 요청을할수있지만
	ㄴ keycloak.updateToeken(30)은 클라이언트측에서 검사하는것이기때문에 지연이 발생한다기보단
	ㄴ 토큰이 만료기간이 다되었거나 없을경우에만 요청하기때문에 
	ㄴ 토큰 재발급문제를 해결하기위해서 keycloak.updateToken(30)을 요청마다 넣어주는편이 낫다.
7. chrome 시크릿모드, 일반 브라우저에서 다르게 동작되는 이유?
	ㄴ 쿠키 서드파티문제? 크롬은 이제 서드파티를 지원을 안한다?
	ㄴ 해결방법 pkce < 정답
	ㄴ https://keycloak.discourse.group/t/keycloak-cookies-issue-in-chrome-incognito-mode/8292/6
	ㄴ https://skycloak.io/keycloak-how-to-create-a-pkce-authorization-flow-client/
8. 롤설정 A클라이언트 회원가입하는 유저에게 user role을 부여
9. A클라이언트 user롤에 delete accunt 권한 부여
10. api 요청으로 구현하기가 빡세다
	ㄴ keycloak에서는 사용자 계정 삭제 API를 직접적으로 사용하는 방법을 제공하지않는다
	ㄴ 대신 Application Intiated Action(AIA) 기능을 사용하여 민감한 작업을 처리할수있도록
	UI를 제공하고있다.
	ㄴ account-console은 pkce랑 S256이 기본값임 그래서 무조건 호출할때 생성을해야함그거를 
11 이게 더편함. service-client를 account-console과 같은기능을하게한다면? 재인증필요없고 회원탈퇴후에 바로 리디렉션될거잖아
12 리디렉션하는거 homeURL을 localhost/3000으로하면그만이엇어~
13 kc-action 재인증 없애기 못없애 빡세 이거는 그냥 냅두고 그냥 테마만 바꾸면되서
14 비밀번호재설정은 Update Password이고 이것은 Required Action이라서 필수제공이라 권한부여가 필요없음
Delete Account랑 Update Password는 차이점이 존재함 권한에있어서
	ㄴ 성공
15. 페이지를 결국 커스텀해야하긴해 그단계가 일찍왔다하고
	ㄴ 해당페이지 경로의 파일을 내 로컬파일에 마운트시키고 변경해야함

16. docker desktop files readme에 있는 것을 따르는게 맞아보임
딱하나만 변경되면 모든게 수월해지긴함~

17. 커스텀 마운트해보자 페이지 커스텀하기 -> css
18. 한글로 바꾸기 -> message? ko? 

끝 테마변경은 여기서 스탑	
---------------------------------------------------------------

1. 클라이언트 생성
2. 관리자 객체생성 로그인창 회원가입창 잘연동
3. 롤추출완료
	ㄴ client에 admin-only realm에 admin한다음에 admin에 admin-only 넣어주고
		ㄴ 해당사용자에게 admin 넣어주면 끝
4. 회원가입창을 클라이언트 별로 설정할 수 있는지
	ㄴ 해당 클라이언트의 회원가입 폼에 그냥 display none갈기면됌
	ㄴ admin-client 로그인테마바꾸면됌
	ㄴ 마스터관리자가 계정을 생성하는 방식으로 결정 (관리자 페이지, Grafana)
5. 로그인시킨다음에 해당 로그인의 role에 admin이없으면 로그아웃시키기
6. 아예로그인할때 롤을 확인해서 막을수는없는지 < 안될확률 높음 AIA방식으로하는거라 내부로직건드려야댐
	ㄴ 안됨 인증과 권한은 다른문제임
7. admin 롤 부여한 아이디로 로그인
8. 로그아웃 만들기
9. 페이지 연결성확인 
	ㄴ 2.1 Otherpage 제작
	ㄴ 2.2 Otherpage 버튼 만들기
	ㄴ 2.3 homepage 버튼 만들기
10. 크롬시크릿모드도 되는지 확인해야돼

클라이언트 사이드 권한 관리는 끝
--------------------------------------------------------------
1. mongodb 생성후 안에 값을 볼 수 있어야댐 dbeaver로 
2. user-profile 서버를 만든후 postman으로 crud를 확인해야됌
3. 프로필을 그냥 접속했을때 없으면 비워두고 있으면 넣으면그만
	ㄴ 그리고 생성버튼누르면 업데이트든 생성이든 두개다 처리할수있음
4. 회원탈퇴 Keycloak Event Listener SPI?
	ㄴ 방식을 생각해야되긴함
	ㄴ 문구로 때우면됨
		회원 탈퇴 시 작성하신 게시글과 댓글은 삭제되지 않으며, 그대로 유지됩니다. 다른 사용자와의 상호작용을 보존하기 위함이니 양해 부탁드립니다.
5. uuid자체는 고유한 식별자일뿐이고 uuid로 얻는정보에따라서 uuid가 json형태로 숨길지 아닐지 정하는거임
6. api-gateway 생성
7. api-gateway 호출받는곳 생성
8. OAuth2 Resource Server 의존성 주입하면 Spring Security는 자동이라 일단 잠구자
9. 연결성 확인
10. 프론트에서 요청하는거 구현
11. 인증성공, 인증실패 테스트
12. 관리자까지 확인 완료
13.  URL 경로를 기반으로 하는 접근 제어
14. hasRole과 hasAuthority 차이점?
15. 롤 구분 했어 realms_access.roles 까지 들어가서 해당 롤을 추출해오는방식
16. userprofile 서버 로직 분리하자
17. admin에서 admin role로 연결확인
18. 크롬 시크릿모드 성공
서버 사이드 권환관리
--------------------------------------------------------------


















-----------------------------------------------------
## 주요 기능
- JWT 기반 인증 및 권한 관리
- 사용자 역할에 따른 접근 제어 (RBAC)
- 토큰 갱신 및 관리

## Keycloak 설정

keycloak을 이용해 realm과 클라이언트를 설정하고, React 및 Spring Boot 애플리케이션과 통합하였습니다.
- **Realm**: miniblog-realm
- **Client**: service-client
- **Roles**: user, admin

## Keycloak에 대한 심층 탐구
### 1. Keycloak 역할
- keycloak은 인증과 권한 부여를 관리하는 중앙 관리 시스템으로, 한번 객체가 생성되면 애플리케이션관의 지속적인 구독(Subscription) 방식으로 작동하며, 인증 상래틀 관리합니다. 이를 통해 사용자의 세션과 토큰 상태가 유지됩니다.
### 2. Keycloak에서 중요한 프론트엔드 고나리 포인트
- **토큰관리**: 프론트엔드에서 가장 중요한 부분은 토큰입니다. Keycloak은 JWT(JSON Web Token)을 발급하여 사용자의 세션을 유지하고 권한을 관리합니다. 이 토큰을 기반으로 백엔드와의 통신을 처리합니다.
### 3. Keycloak의 onLoad 방식 (login-required vs check-sso)
- Keycloak은 사용자가 애플리케이션에 접근할 때 인증이 필요한지, 아니면 인증된 세션을 확인하는지에 따라 두 가지 onLoad 방식을 지원합니다.
#### 3.1 login-required
- login-required는 사용자가 페이지에 접근하려할 때 반드시 인증이 필요하도록 강제하는 방식입니다.
- 이 방식에서는 페이지가 로드되자마자 사용자의 인증 상태를 확인하며, 인증이 되어 있지 않으면 Keycloak 로그인 페이지로 리디렉션됩니다.
- 마이페이지나 관리자 페이지와 같은 중요한 페이지에서 주로 사용되고, 인증되지 않았을 경우 해당 페이지는 접근이 불가능하고, 자동으로 로그인 페이지로 이동하게 됩니다.
#### 3.2 check-sso
- check-sso는 현재 사용자가 SSO 세션을 가지고 있는지 확인하지만, 만약 세션이 없을 경우 로그인 페이지로 리디렉션하지 않습니다
- 이 방식은 로그인 여부에 상관없이 모든 사용자가 접근할 수 있는 페이지에서 유용합니다
- 메인 페이지는 로그인 사용자와 비로그인 사용자 모두 접근 가능해야 할 경우, check-sso를 사용하여 로그인한 경우에는 추가적인 기능을 제공하고, 로그인하지 않은 경우에는 제한된 정보를 보여줄 수 있습니다.
#### 3.3 Keycloak 객체 생성 및 초기화 코드 
``` typescript
import Keycloak from "keycloak-js";
import { KEYCLOAK_URL } from "../utils/APIUrlUtil/apiUrlUtil";

const keycloak = new Keycloak({
    url: KEYCLOAK_URL(),
    realm: 'miniblog-realm',
    clientId: 'service-client',
})

export default keycloak;
```
- 위 코드를 통해 Keycloak 객체를 생성합니다. 
- 이는 일종의 구독과 비슷한 개념으로 이해하였으며, 해당 객체를 초기화하여 애플리케이션의 인증 상태를 관리합니다.
``` typescript
keycloak.init({
    onLoad: "check-sso",
    checkLoginIframe: true,
    checkLoginIframeInterval: 30,
    silentCheckSsoRedirectUri: undefined,
}).then((authenticated) => {
    setSignin(authenticated ?? false);
    setIsLoading(false);
})
.catch((error) => {
    console.error("useAuth <error> :", error);
    setIsLoading(false);
})
```
- 이 코드는 check-sso 방식을 사용하여 SSO 세션이 있는지 확인하고, 세션이 있으면 인증된 상태로 설정합니다. 
- 만약 네트워크 이슈나 다른 이유로 인증되지 않으면, 로그인 없이 페이지가 로드됩니다. 또한, checkLoginIframe을 통해 주기적으로 사용자의 로그인 상태를 확인하고, 세션 만료 시 자동 로그아웃되도록 설정할 수 있습니다.
### 4. 비로그인 및 로그인 사용자 페이지 구분
#### 4.1 메인페이지
- 메인페이지에서는 로그인하지 않은 사용자도 접근할 수 있도록 check-sso방식을 사용합니다.
- 이를 통해 사용자가 인증되지 않아도 페이지를 볼 수 있으며, 로그인된 경우에는 추가적인 정보를 제공할 수 있습니다.
#### 4.2 마이페이지, 관리자 페이지
- 마이페이지나 관리자 페이지와 같은 중요 페이지에서는 login-required 방식을 사용하여 페이지가 랜더링 되자마자 인증 여부를 확인합니다.
- 인증이 되어 있지 않으면 즉시 로그인 페이지로 리디렉션시킵니다.
- 이를 통해 인증되지 않은 사용자의 접근을 차단하고, 민감한 정보가 보호되도록합니다.
``` typescript
    keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: true,
    checkLoginIframeInterval: 30,
    silentCheckSsoRedirectUri: undefined,
}).then((authenticated) => {
    if (!authenticated) {
        // 인증되지 않은 경우 처리 (예: 로그인 페이지로 리디렉션)
    }
})
.catch((error) => {
    console.error("Authentication error:", error);
});
```
## Keycloak의 `keycloak.authenticated`의 의미와 토큰의 관계
가장 헷갈릴 수 있는 개념인 keycloak.authenticated와 토큰의 관계에 대해서 설명하겠습니다.
- `keycloak.authenticated`는 현재 사용자가 인증되어 있는지를 나타내는 불리언 값입니다.
- keycloak에서 사용자가 로그인하여 인증된 상태가 되면 이 값이 `true`로 설정되며, 이 값이 `false`일 경우 사용자는 인증되지 않은 상태임을 의미합니다.

`keycloak.authenticated`와 **토큰(token)**은 밀접하게 관련되어 있습니다.

- 인증된 사용자는 **엑세스 토큰(access token)**을 발급받아 keycloak에 저장됩니다. 
- 이 토큰은 사용자와 애플리케이션간의 인증 정보를 포함하며, 이후 API 호출이나 백엔드 서비스와의 통신 시 사용됩니다.
- 따라서 `keycloak.authenticated`가 `true`인 경우, 사용자는 인증된 상태이고 토큰이 존재해야 합니다.
- 하지만 특정 예외적인 상황에서는, `authenticated`가 `true`로 남아있으나, 토큰이 만료되었거나 사라진 상태가 발생할 수 있습니다. 

이런 경우 개발자가 직접 예외를 막아야하고 따로 토큰 갱신이 필요합니다.

## 예외적인 상황에서 토큰 재발급 방법
keycloak에서는 토큰이 만료되거나 유효하지 않을 때 이를 자동 갱신하는 기능을 제공합니다.

하지만 예외적인 상황에서는 이 기능이 어떠한 이유에서 작동이 안되었다는것을 가정하겠습니다.

예외적인 상황에서 토큰 재발급을 시도하는 방법은 `updeateToken()` 메서드를 사용하는것입니다.
- `updateToken()`메서드는 주어진 유효성 검사 주기 (예: 30초) 동안 토큰이 만료되지 않았는지 확인하고, 만료되었다면 자동으로 새로운 토큰을 요청합니다.
``` typescript
keycloak.updateToken(30).then(refreshed => {
    if (refreshed) {
        console.log("Token was successfully refreshed");
    } else {
        console.warn("Token is still valid");
    }
}).catch(error => {
    console.error("Failed to refresh token", error);
});
```
- 위 코드는 토큰 만료 30초 전에 갱신을 시도하고, 성공 여부에 따라 적절한 처리를 합니다.
- 만약 갱신에 실패하거나 토큰이 유효하지 않는다면 사용자는 로그아웃되거나 새로 로그인을 요구받게 할 수 있습니다.
## 코드 구조의 의미
위 코드에서 사용된 구조는 사용자가 애플리케이션에 처음 접근 했을 때 또는 페이지가 로드되었을 때 keycloak의 인증상태를 확인하고 처리하는 방식입니다.

즉 1. 처음접속 2. 접속한상태에서 다른 url로 navigate 했을시 3. 장기간사용X 또는 다른탭사용 중에 다시 페이지를 조작했을시

위에 관한 사항에만 적용됩니다.

- 초기 인증 상태 확인: keycloak.authenticated가 false라면, Keycloak에서 SSO 세션을 확인하는 check-sso 방식으로 초기화를 시도합니다. 만약 사용자가 로그인되어 있지 않다면, 인증 절차가 진행됩니다.
- 토큰 갱신 처리: 사용자가 이미 인증된 상태에서 페이지가 로드될 때는 keycloak.updateToken() 메서드를 사용해 토큰을 갱신하고, 만료된 토큰이 있는지 확인합니다.
- 상태 관리: useState와 useEffect 훅을 사용해 사용자 로그인 상태와 로딩 상태를 관리하며, 이를 통해 사용자가 로그인했는지, 그리고 인증 절차가 완료되었는지에 대한 정보를 유지합니다.

## 사용자 이벤트 발생 시 토큰이 없을 경우의 처리 방법
사용자 이벤트는 애플리케이션 내에서 발생하는 다양한 상호작용을 의미합니다. 

사용자 이벤트에는 다음과 같은 활동이 포함될 수 있습니다.
- **API요청**: 페이지에서 버튼을 클릭하여 서버로 데이터를 전송하거나 가져오는 작업
- **백그라운드 작업**: 페이지에서 자동으로 데이터가 갱신되는 작업

이런 상황에서 앞설명처럼 `keycloak.authenticated = true`와 token의 존재유무는 별개로 생각해야합니다.

사용자 경험을 해치지 않으면서 자동으로 토큰을 갱신하는 방법을 고려해야 합니다.
