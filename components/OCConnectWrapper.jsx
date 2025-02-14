'use client';

import { OCConnect } from '@opencampus/ocid-connect-js';

export default function OCConnectWrapper({ children }) {
  const opts = {
    redirectUri: 'http://localhost:3000/redirect', // Redirect after login
    referralCode: 'PARTNER6', // Change this if needed
  };

  return (
    <OCConnect opts={opts} sandboxMode={true}>
      {children}
    </OCConnect>
  );
}