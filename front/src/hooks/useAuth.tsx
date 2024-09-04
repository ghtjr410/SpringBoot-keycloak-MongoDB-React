import React, { useEffect, useState } from "react";
import keycloak from "../auth/keyCloak";

const useAuth = () => {
    const [isSignin, setSignin] = useState<boolean>(false);

    useEffect(()=>{
        if(!keycloak.authenticated){
            keycloak.init({
                onLoad: "login-required"
            }).then((authenticated) => setSignin(authenticated))
            .catch((error) => {
                console.error("Keycloak 초기화 중 오류 발생:", error);
            });
        }        
    },[]);


    return isSignin;
}

export default useAuth;