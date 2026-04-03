import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import OAuth2Callback from './components/OAuth2Callback';

function App() {
  const [screen, setScreen] = useState(() => {
    if (window.location.pathname === '/oauth2/callback') return 'oauth2callback';
    const token = localStorage.getItem('token');
    return token ? 'dashboard' : 'login';
  });

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? {
      token,
      role: localStorage.getItem('role'),
      username: localStorage.getItem('username')
    } : null;
  });

  const handleLogin = (data) => { setUser(data); setScreen('dashboard'); };
  const handleLogout = () => { localStorage.clear(); setUser(null); setScreen('login'); };

  if (screen === 'oauth2callback') return <OAuth2Callback onLogin={handleLogin} />;
  if (screen === 'dashboard') return <Dashboard user={user} onLogout={handleLogout} />;
  if (screen === 'preview') return <Dashboard user={null} onLogout={handleLogout} />;
  if (screen === 'register') return <Register onBack={() => setScreen('login')} onRegistered={handleLogin} />;

  return (
    <Login
      onLogin={handleLogin}
      onRegister={() => setScreen('register')}
      onPreview={() => setScreen('preview')}
    />
  );
}

export default App;