import React from 'react';
import Public from './components/Public';
import Private from './components/Private';
import useAuth from './hooks/useAuth';
import keycloak from './auth/keyCloak';


function App() {
  const isSignin = useAuth();
  
  return (    
    <div className='flex flex-col bg-slate-500'>
    {isSignin ? (
      <>
        <button onClick={() => keycloak.logout()}>로그아웃</button>
        <button onClick={() => keycloak.accountManagement()}>
            계정 관리
          </button>
      </>
      
    ) : (
        <button onClick={() => keycloak.login()}>로그인</button>
    )}
</div>
  );
}

export default App;