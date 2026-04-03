import { useEffect } from 'react';

function OAuth2Callback({ onLogin }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');
    const role = params.get('role');

    if (token && username && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('role', role);
      onLogin({ token, username, role });
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <div style={{
      color: 'white', textAlign: 'center', marginTop: '80px',
      fontFamily: 'Arial', backgroundColor: '#111217', minHeight: '100vh'
    }}>
      <p>Signing you in with Google...</p>
    </div>
  );
}

export default OAuth2Callback;