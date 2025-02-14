'use client';

// pages/_app.js
import './styles/global.css';

import { useEffect } from 'react';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import LoginButton from '../components/LoginButton'; // Ensure this path is correct

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
          <h1>Achievements</h1>
          {authState.isAuthenticated ? (
            <LoginButton className="login-button" />
          ) : (
            <LoginButton className="login-button" />
          )}
        </div>
      </div>
  );
}
