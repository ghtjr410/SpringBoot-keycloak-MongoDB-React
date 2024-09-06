# SpringBoot-keycloak-MongoDB-React 프로젝트

이 프로젝트는 Keycloak을 사용한 인증시스템을 구현한 풀스택 애플리케이션으로
React를 프론트엔드로, Spring Boot를 백엔드로 사용하며, 데이터 저장소는 MongoDB를 사용하고
최종적으로 각 인스턴스를 Docker 컨테이너로 실행하여 통신합니다.

## 기술스택
- **Frontend**: React, Typescript, TailWind CSS, keycloak-js, react-router-dom
- **Backend**: Spring Boot, Spring Security, Keycloak
- **Database**: MongoDB
- **Authentication**: Keycloak (OAuth2, OpenID Connect)

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
