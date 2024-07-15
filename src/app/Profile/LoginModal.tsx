import React, { useState } from 'react';
import CreateUserModal from './CreateUserModal';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import FAVerificationModal from './FAVerificationModal';
import { auth } from '../server/database/firebase.config';

interface LoginModalProps {
  toggleModal: () => void;
  handleSetHasToken: (state: boolean) => void;
  setHasToken: (state: boolean) => void;
}

export default function LoginModal({
  toggleModal,
  handleSetHasToken,
  setHasToken,
}: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // States for Non Google Login Users.
  const [is2FA, set2FA] = useState(false); // False - ON LOGIN PAGE
  const [isCredentials, setIsCredentials] = useState(false); // FALSE-  ON 2FA Page
  // BOTH TRUE => Profile component

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [status, setStatus] = useState(false);
  const [secret, setSecret] = useState('');

  const emailHandler = (event: any) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event: any) => {
    setPassword(event.target.value);
  };

  // Regular Login Handler - Will Have 2FA
  const submitHandler = async (event: any) => {
    event.preventDefault();
    try {
      if (password.length < 1 || email.length < 1) {
        throw new Error('Email and password are required');
      }

      const { data } = await axios.put(
        'http://localhost:3001/api/profile/loginuser',
        {
          password: password,
          email: email,
        }
      );

      if (data) {
        set2FA(true);
        // setting the states and passing it down to 2FAModal Component
        setStatus(data.status);
        setQrCodeUrl(data.qrCodeUrl);
        setSecret(data.secret);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  // Function to generate QR code for 2FA setup
  // should return a token
  const generateQRCode = async (
    status: boolean,
    qrCodeUrl2: any,
    secret: any,
    token: any
  ) => {
    try {
      if (status) {
        // User Credentials Valid

        const { data } = await axios.put(
          'http://localhost:3001/api/profile/verify2a',
          {
            qrCodeUrl2: qrCodeUrl2,
            secret: secret,
            token: token,
          }
        );
        if (data) {
          // if the token is returned, setIsCredential to true
          setIsCredentials(true);
          if (isCredentials && is2FA) {
            // last safe guard
            localStorage.setItem('token', data);
            toggleModal();
            handleSetHasToken(true);
          }
        }
      } else {
        throw 'Error';
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Google Login Handler - Will Not have 2FA
  const googleHandler = async (event: any) => {
    event.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const email = result.user.email;
        const { data } = await axios.put(
          'http://localhost:3001/api/profile/googleLogin',
          {
            email: email,
          }
        );

        localStorage.setItem('token', data);
        toggleModal();
        handleSetHasToken(true);
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <>
      {!isSignUp ? (
        !is2FA ? ( // Check if 2FA modal is not displayed
          <div className="fixed inset-0 w-screen h-screen">
            <div
              onClick={toggleModal}
              className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)]"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-lg min-w-[500px]">
              <h1 className="text-3xl mt-4 font-bold text-center mb-6 text-gray-800">
                Welcome Back
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Sign into your account
              </p>
              <form onSubmit={submitHandler}>
                <div className="mb-6">
                  <label
                    htmlFor="email-input"
                    className="block mb-2 text-lg font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={emailHandler}
                    required
                    id="email-input"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password-input"
                    className="block mb-2 text-lg font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={passwordHandler}
                    required
                    id="password-input"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  />
                </div>
                <div className="grid justify-items-end">
                  <a className="text-sm font-medium hover:underline text-blue-800 mb-3">
                    Forget Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white text-lg font-medium py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300">
                  Sign In
                </button>
              </form>
              <button
                onClick={() => setIsSignUp(true)}
                className="w-full mt-5 bg-red-600 text-white text-lg font-medium py-2.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300">
                Sign Up
              </button>
              <button
                onClick={toggleModal}
                className="absolute top-4 right-4 hover:bg-gray-400 rounded-lg text-gray-600 hover:text-gray-900 focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <button
                onClick={googleHandler}
                type="button"
                className="w-full mt-5 justify-center align-middle text-white text-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2 h-[52px]">
                <svg
                  className="mr-2 ml-1 w-[40px] h-[20px]"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512">
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        ) : (
          <FAVerificationModal
            generateQRCode={generateQRCode}
            qrCodeUrl={qrCodeUrl}
            status={status}
            secret={secret}
          />
        )
      ) : (
        <CreateUserModal
          toggleModal={toggleModal}
          handleSetHasToken={handleSetHasToken}
          setIsSignUp={setIsSignUp}
        />
      )}
    </>
  );
}
