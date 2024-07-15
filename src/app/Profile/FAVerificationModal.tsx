import React, { useState } from 'react';

interface FAVerificationModal {
  generateQRCode: () => void;
  qrCodeUrl: any;
  secret: any;
  status: any;
}
export default function FAVerificationModal({
  generateQRCode,
  qrCodeUrl,
  status,
  secret,
}) {
  const [token, setToken] = useState(''); // This is TOPT Token NOT JWT
  return (
    <div>
      <h2>2FA Verification</h2>
      <input
        type="text"
        placeholder="Enter 2FA Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={generateQRCode(status, qrCodeUrl, secret, token)}>
        Verify
      </button>
    </div>
  );
}
