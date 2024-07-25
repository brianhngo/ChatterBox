import React, { useState, useEffect } from 'react';
import CreateUserModal from './CreateUserModal';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import FAVerificationModal from './FAVerificationModal';
import { auth } from '../server/database/firebase.config';
import { toast } from 'react-toastify';

interface LoginModalProps {
  toggleModal: () => void;
  handleSetHasToken: (state: boolean) => void;
  setHasToken: (state: boolean) => void;
  isSignUp: boolean;
  toggleSignUpModal: (state: boolean, state2: boolean) => void;
}

export default function LoginModal({
  toggleModal,
  handleSetHasToken,
  setHasToken,
  isSignUp,
  toggleSignUpModal,
}: LoginModalProps) {
  // const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState('');
  const [username, setUsername] = useState('');

  // States for Non Google Login Users.
  const [is2FA, setIs2FA] = useState(false); // False - ON LOGIN PAGE
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

  // error message
  const [errorMessage, setErrorMessage] = useState(false);

  const errorMessageHandler = (value: boolean) => {
    setErrorMessage(value);
    setEmail('');
    setPassword('');
  };

  // show password
  const [showPassword, setShowPassword] = useState(false);

  const showPasswordHandler = (value: boolean) => {
    setShowPassword(value);
  };

  // Regular Login Handler - Will Have 2FA
  const submitHandler = async (event: any) => {
    event.preventDefault();
    try {
      if (password.length < 1 || email.length < 1) {
        errorMessageHandler(true);
      }

      const { data } = await axios.put(
        'http://localhost:3001/api/profile/loginuser',
        {
          password: password,
          email: email,
        }
      );

      if (data) {
        setIs2FA(true);
        // setting the states and passing it down to 2FAModal Component
        setUsername(data.username);
        setStatus(data.status);
        setQrCodeUrl(data.qrCodeUrl);
        setSecret(data.secret);
        setErrorMessage(false);
        setUid(data.uid);
        toast.success('Success!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error!!');
      errorMessageHandler(true);
    }
  };

  // Function to generate QR code for 2FA setup
  // should return a token
  const generateQRCode = async (
    status: boolean,
    event: any,
    secret: any,
    token: any,
    email: string
  ) => {
    try {
      event.preventDefault();
      if (status) {
        // User Credentials Valid

        const { data } = await axios.put(
          'http://localhost:3001/api/profile/verify2fa',
          {
            uid: uid,
            secret: secret,
            token: token,
            email: email,
          }
        );
        if (data) {
          // 2FA tokens is valid, and indeed the correct user

          setIsCredentials(true);
          localStorage.setItem('username', data.username);
          localStorage.setItem('token', data.token);
        }
      } else {
        throw 'Error';
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    if (isCredentials && is2FA) {
      toggleModal();
      handleSetHasToken(true);
    }
  }, [isCredentials]);

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
        localStorage.setItem('username', data.username);
        localStorage.setItem('token', data.token);
        toggleModal();
        handleSetHasToken(true);
        errorMessageHandler(false);
        toast.success('Success!');
      }
    } catch (error) {
      errorMessageHandler(true);
      toast.error('Error');
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
              <p className="text-center text-lg text-gray-600 mb-4">
                Sign into your account
              </p>
              {errorMessage ? (
                <p className="text-center text-md text-red-600 mb-4">
                  {' '}
                  Error. Credentials do not match{' '}
                </p>
              ) : null}

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
                    className={`bg-gray-100 border text-gray-700 ${
                      errorMessage ? 'border-red-500' : 'border-gray-300'
                    } text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5`}
                  />
                </div>
                <div className="mb-6 relative">
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`bg-gray-100 border text-gray-700 ${
                      errorMessage ? 'border-red-500' : 'border-gray-300'
                    } text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-10`}
                  />
                  {showPassword === false ? (
                    <svg
                      onClick={() => setShowPassword(true)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="absolute right-3 top-10 cursor-pointer mt-1">
                      <path
                        d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      onClick={() => setShowPassword(false)}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      className="absolute right-3 top-10 cursor-pointer mt-1"
                      fill="none">
                      <path
                        d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137"
                        stroke="#1C274C"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                        stroke="#1C274C"
                        stroke-width="1.5"
                      />
                    </svg>
                  )}
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
                onClick={() => toggleSignUpModal(true, true)}
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
            email={email}
            toggleModal={toggleModal}
          />
        )
      ) : (
        <CreateUserModal
          toggleModal={toggleModal}
          handleSetHasToken={handleSetHasToken}
          setIsSignUp={toggleSignUpModal}
        />
      )}
    </>
  );
}
