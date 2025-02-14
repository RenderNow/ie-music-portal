import { useState } from 'react';

export default function TestAPI() {
  const [OCId, setOCId] = useState("rendernow.edu");

  return (
    <div>
      <h1>Test API</h1>
      <div>
        <label htmlFor="ocid">OCId:</label>
        <input
          type="text"
          id="ocid"
          value={OCId}
          onChange={(e) => setOCId(e.target.value)}
        />
      </div>
      <iframe
        src={`https://id.sandbox.opencampus.xyz/public/credentials?username=${OCId}`}
        width="100%"
        height="600px"
        style={{ border: "none" }}
        title="Open Campus Credentials"
      ></iframe>
    </div>
  );
}