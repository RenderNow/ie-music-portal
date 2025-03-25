'use client';

import { useEffect } from 'react';
import { LoginCallBack } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  const loginSuccess = () => {
    console.log("✅ Login successful! Redirecting to dashboard...");
    router.push('/dashboard'); // Redirect to dashboard
  };

  const loginError = (error) => {
    console.error("❌ Login error:", error || "No error details provided");
  };

  useEffect(() => {
    console.log("🚀 Checking login callback...");
  }, []);

  return (
    <LoginCallBack 
      successCallback={loginSuccess} 
      errorCallback={loginError} 
      customLoadingComponent={<div>Processing login...</div>} 
      customErrorComponent={<div>Login Error</div>}
    />
  );
}