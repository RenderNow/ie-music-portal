'use client';

import { OCConnect } from '@opencampus/ocid-connect-js';

export default function OCConnectWrapper({ children }) {
  const opts = {
    // Use the environment variable, and provide a fallback for local development
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    referralCode: 'PARTNER6', // Change this if needed
  };

  return (
    <OCConnect opts={opts} sandboxMode={true}>
      {children}
    </OCConnect>
  );
}