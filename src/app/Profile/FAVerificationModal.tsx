import React, { useState } from 'react';

interface FAVerificationModal {
  generateQRCode: (status: boolean, secret: any, token: any) => void;
  qrCodeUrl: string;
  secret: any;
  status: any;
  email: string;
  toggleModal: () => void;
}
export default function FAVerificationModal({
  generateQRCode,
  qrCodeUrl,
  status,
  secret,
  email,
  toggleModal,
}) {
  const [token, setToken] = useState(''); // This is TOPT Token NOT JWT
  return (
    <div className="fixed inset-0 w-screen h-screen">
      <div
        onClick={toggleModal}
        className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-lg min-w-[500px]">
        <h1 className="text-3xl mt-4 font-bold text-center mb-6 text-gray-800">
          2FA Verification
        </h1>
        <p className="text-center text-gray-600 mb-8">
          1. Please download the{' '}
          <span className="text-red-500 bold">Google Authenticator App </span>{' '}
          on your mobile device
        </p>
        <p className="text-center text-gray-600 mb-8">
          2. Scan the QR code and enter the code below
        </p>
        <p className="text-red-500 text-center mb-8">
          {' '}
          If you are an existing user, please delete the saved QR Code on Google
          Authenticator and Rescan.
        </p>
        <p className="text-red-500 text-center mb-8">
          {' '}
          The code resets every 30secs. The timer can be seen on app after
          scanning
        </p>
        <img className="mx-auto justify-center" src={qrCodeUrl} alt="QR Code" />
        <form>
          <div className="mb-6">
            <label
              htmlFor="email-input"
              className="block mb-2 text-lg font-medium text-gray-700">
              2FA Code
            </label>
            <input
              type="text"
              placeholder="Enter 2FA Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <button
            onClick={(event) =>
              generateQRCode(status, event, secret, token, email)
            }
            type="submit"
            className="w-full bg-indigo-600 text-white text-lg font-medium py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
