import React, { useEffect, useState } from "react";
import { userManager } from "../auth/authConfing";

const MainPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    useEffect(()=> {
        console.log(isAuthenticated);

        

        userManager
            .signinRedirectCallback()
            .then(() => {
                // 토큰 처리 완료 후 사용자 정보 가져오기
                userManager.getUser().then((user) => {
                    if (user && !user.expired) {
                        setIsAuthenticated(true);
                        setUsername(user.profile.preferred_username ?? "");
                    }
                });
            })
            .catch((error) => {
                console.error("Error handling redirect callback: ", error);
            });

        const handleUserLoaded = (user: any) => {
            setIsAuthenticated(true);
            setUsername(user.profile.preferred_username ?? "");
        };
    
        const handleUserUnloaded = () => {
            setIsAuthenticated(false);
            setUsername('');
        };

        // 이벤트 리스너 등록
        userManager.events.addUserLoaded(handleUserLoaded);
        userManager.events.addUserUnloaded(handleUserUnloaded);

        return () => {
            // 이벤트 리스너 제거
            userManager.events.removeUserLoaded(handleUserLoaded);
            userManager.events.removeUserUnloaded(handleUserUnloaded);
        }
    },[]);

    const signin = () => {
        userManager.signinRedirect();
    }

    const signout = () => {
        userManager.signoutRedirect();
    }

    return (
        <header>
            {isAuthenticated ? (
                <div>
                <p>Welcome, {username}</p>
                <button onClick={signout}>Logout</button>
                </div>
            ) : (
                <button onClick={signin}>Login</button>
            )}
        </header>
    )
}
export default MainPage;