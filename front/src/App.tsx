import React from 'react';
import Public from './components/Public';
import Private from './components/Private';
import useAuth from './hooks/useAuth';


function App() {
  const isLogin = useAuth();
  return (    
      isLogin ? <Private /> : <Public/>
  );
}

export default App;
