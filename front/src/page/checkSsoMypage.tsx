import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import axios from 'axios';

interface Props {
    keycloak: Keycloak | null;
}

const CheckSsoMypage:React.FC<Props> = ({keycloak}) => {
    const [userInfo, setUserInfo] = useState<null | Record<string, any>>(null);
    const [isValidToken, setValidToken] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleGetUserProfile = async () => {
        if (keycloak?.authenticated) {
          const userId = keycloak.subject; // Keycloak에서 UUID 추출
          const token = keycloak.token; // Keycloak 토큰 추출
          try {
            const response = await axios.get(`http://localhost:8080/api/user/user-profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log('GET Response:', response.data);
          } catch (error) {
            console.error('GET Error:', error);
          }
        }
    };
    
    const handlePostUserProfile = async () => {
        if (keycloak?.authenticated) {
            const userId = keycloak.subject; // Keycloak에서 UUID 추출
            const token = keycloak.token; // Keycloak 토큰 추출
            try {
                const response = await axios.post(`http://localhost:8080/api/user/user-profile/${userId}`, 
                    { bio: '안녕하세요, 이것은 새로운 bio입니다.' },
                    { headers: { Authorization: `Bearer ${token}` } } // 토큰 추가
                );
                console.log('POST Response:', response.data);
            } catch (error) {
                console.error('POST Error:', error);
            }
        }
    };


    const handleSignout = () => {
        keycloak?.logout();
    }

    const handleMypage = () => {
        navigate("/");
    };
    const handleStatusInfo = () => {
        console.log("" + keycloak?.authenticated);
    };

    async function generateCodeChallenge(codeVerifier: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    const handleDeleteAccount = async () => {
        if (keycloak && keycloak.authenticated) {
            // code_verifier 생성 (임의의 43자 이상의 문자열 생성)
            const codeVerifier = [...Array(43)].map(() => Math.random().toString(36)[2]).join('');
            
            // code_challenge 생성
            const codeChallenge = await generateCodeChallenge(codeVerifier);
    
            // Keycloak URL 설정
            const keycloakBaseUrl = 'http://localhost:8181/';
            const realmName = 'miniblog-realm';
            const keycloakClientId = 'service-client';
            const keycloakRedirectURI = 'http://localhost:3000';
    
            // URL 리디렉트 (delete_account AIA)
            window.location.href = `${keycloakBaseUrl}realms/${realmName}/protocol/openid-connect/auth?response_type=code&client_id=${keycloakClientId}&redirect_uri=${keycloakRedirectURI}&kc_action=delete_account&code_challenge=${codeChallenge}&code_challenge_method=S256`;
        }
    };

    const handleUpdatePassword = async () => {
        if(keycloak && keycloak.authenticated) {
            const codeVerifier = [...Array(43)].map(() => Math.random().toString(36)[2]).join('');
            
            // code_challenge 생성
            const codeChallenge = await generateCodeChallenge(codeVerifier);
    
            // Keycloak URL 설정
            const keycloakBaseUrl = 'http://localhost:8181/';
            const realmName = 'miniblog-realm';
            const keycloakClientId = 'service-client';
            const keycloakRedirectURI = 'http://localhost:3000';
    
            // URL 리디렉트 (update_password AIA)            
            window.location.href = `${keycloakBaseUrl}realms/${realmName}/protocol/openid-connect/auth?client_id=${keycloakClientId}&redirect_uri=${keycloakRedirectURI}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD&code_challenge=${codeChallenge}&code_challenge_method=S256`;
        }
    }

    useEffect(() => {
        if(keycloak?.authenticated){
            keycloak.updateToken(30).then((refreshed) => {
                if(refreshed){
                    console.log("토큰이 갱신되었습니다.");
                    setValidToken(true);
                }
                // 토큰이 유효하면 사용자 정보 로드
                keycloak.loadUserInfo().then(info => {
                    setUserInfo(info);
                }).catch(err => {
                    console.error("사용자 정보 로드 실패:", err);
                });
            }).catch(err => {
                console.error("토큰 갱신 실패:",err);
                keycloak.login();
            })
        } else {
            keycloak?.login();
        }
    }, [keycloak?.authenticated]);

    return (
        <div className="flex flex-col">
        <div className="flex flex-col">
            <button onClick={handleGetUserProfile} className="bg-blue-400 w-24">
            GET UserProfile
            </button>
            <button onClick={handlePostUserProfile} className="bg-green-400 w-24">
            POST UserProfile
            </button>
        </div>
            { isValidToken ? (
                <p>로딩 중...</p>
            ) : (
                <>
                    <h1>CheckSSO MyPage</h1>
                    <button onClick={handleStatusInfo}>Status Info</button>
                    <h1>1 : {keycloak?.authServerUrl}</h1>
                    <h1>2 : {keycloak?.authenticated ? "Yes" : "No"}</h1>
                    <h1>3 : {keycloak?.clientId}</h1>
                    <h1>4 : {keycloak?.flow}</h1>
                    <h1>5 : {keycloak?.idToken ? keycloak.idToken : "No ID token"}</h1>
                    <h1>6 : {keycloak?.loginRequired ? "Yes" : "No"}</h1>
                    <h1>7 : {keycloak?.token ? keycloak.token : "No Access Token"}</h1>
                    <h1>8 : {keycloak?.refreshToken ? keycloak.refreshToken : "No Refresh Token"}</h1>
                    <h1>9 : {keycloak?.realm}</h1>
                    <h1>10 : {userInfo ? JSON.stringify(userInfo) : "Loading user info..."}</h1>
                    <button className="bg-blue-400 w-24" onClick={handleSignout}>
                        로그아웃
                    </button>
                    <button className="bg-red-400 w-24" onClick={handleDeleteAccount}>
                        계정 삭제
                    </button>
                    <button className="bg-green-400 w-24" onClick={handleUpdatePassword}>
                        비밀번호 변경
                    </button>
                    <button className="bg-blue-400 w-24" onClick={handleMypage}>
                        홈페이지
                    </button>
                </>
            )}
        </div>
    );
};

export default CheckSsoMypage;  // 또는 빈 export {} 추가