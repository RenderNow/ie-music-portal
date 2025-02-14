'use client';
import { useOCAuth } from '@opencampus/ocid-connect-js';

export default function LoginButton({ className = "login-button", style }) {
  const { ocAuth } = useOCAuth();

  const handleLogin = async () => {
    try {
      await ocAuth.signInWithRedirect({ state: 'dashboard' }); // Redirects after login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <button className={`login-button ${className}`} style={style} onClick={handleLogin}>
      Login with OCID
    </button>
  );
}