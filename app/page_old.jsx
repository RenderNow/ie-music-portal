'use client';

import { useEffect } from 'react';
import { useOCAuth } from '@opencampus/ocid-connect-js';

export default function LoginPage() {
  const { authState, login } = useOCAuth() || {};

  console.log("Auth State:", authState); // Debugging log

  useEffect(() => {
    console.log("AuthState updated:", authState);
  }, [authState]);

  if (!authState) return <div className="loading">Loading auth...</div>;
  if (authState.isLoading) return <div className="loading">Loading authentication...</div>;
  if (authState.error) return <div className="error">Error: {authState.error.message}</div>;

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="https://ie-music.co.uk/wp-content/uploads/2022/02/1.png" alt="Logo" className="logo" />
        <h1>Welcome Back</h1>
        {authState.isAuthenticated ? (
          <p className="redirecting">Redirecting...</p>
        ) : (
          <button className="login-button" onClick={login}>IE Music Login</button>
        )}
      </div>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #ffffff;
          color: #000000;
        }
        .login-card {
          background: #ffffff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 10px #141beb;
          text-align: center;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 1rem;
        }
        h1 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }
        .redirecting {
          font-size: 1.2rem;
          color: #00008b;
        }
        .loading, .error {
          color: #ff5757;
          text-align: center;
          font-size: 1.2rem;
        }
        .login-button {
          padding: 10px 10px;
          background-color: #ffffff;
          color:rgb(0, 0, 0);
          border: 1.5px solid #141beb;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;
        }
        .login-button:hover {
          box-shadow: 0 0 10px  #141beb;
        }
      `}</style>
    </div>
  );
}
