import React, { useState } from 'react';
import axios from 'axios';
import { passwordStrength } from './ProfileUtility'; // Import the passwordStrength function
import { toast } from 'react-toastify';

interface CreateUserProps {
  toggleModal: () => void;
  setIsSignUp: (value: boolean) => void;
  handleSetHasToken: (value: boolean) => void;
}

export default function CreateUserModal({
  toggleModal,
  setIsSignUp,
  handleSetHasToken,
}: CreateUserProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordStrengthMeter, setPasswordStrengthMeter] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [errorMessage1, setErrorMessge1] = useState(false); // User Already existed (email or username exists)
  const [errorMessage2, setErrorMessge2] = useState(false); // passwords don't match

  const resetFunction = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setPassword2('');
    setUsername('');
    setPasswordStrengthMeter(0);
    getStrengthClass();
    getStrengthClass();
  };

  const errorMessage1Handler = (value: boolean) => {
    setErrorMessge1(value);
    setErrorMessge2(false);
    resetFunction();
  };

  const errorMessage2Handler = (value: boolean) => {
    setErrorMessge2(value);
    setErrorMessge1(false);
    resetFunction();
  };

  // Handlers for each state

  const usernameHandler = (event: any) => {
    setUsername(event.target.value);
  };

  const emailHandler = (event: any) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event: any) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordStrengthMeter(passwordStrength(newPassword));
  };

  const password2Handler = (event: any) => {
    setPassword2(event.target.value);
  };

  // When submit is clicked, we create a user to our db
  const submitHandler = async (event: any) => {
    try {
      event.preventDefault();
      if (password !== password2) {
        // Passwords do not match
        toast.error('Error!');
        errorMessage2Handler(true);
        return;
      } else {
        const { data } = await axios.put(
          'http://localhost:3001/api/profile/createuser',
          {
            username: username,
            password: password,
            email: email,
          }
        );

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        handleSetHasToken(true);
        setErrorMessge1(false);
        setErrorMessge2(false);
        resetFunction();
        toggleModal();
        toast.success('Successful!');
      }
    } catch (error) {
      toast.error('Error!');
      errorMessage1Handler(true);
      console.error(error);
    }
  };

  const getStrengthClass = () => {
    switch (passwordStrengthMeter) {
      case 1:
        return 'w-1/5 bg-red-500';
      case 2:
        return 'w-2/5 bg-yellow-500';
      case 3:
        return 'w-3/5 bg-blue-500';
      case 4:
        return 'w-4/5 bg-purple-500';
      case 5:
        return 'w-full bg-green-500';
      default:
        return 'w-0 bg-gray-200';
    }
  };

  const getStrengthError = () => {
    switch (passwordStrengthMeter) {
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Okay';
      case 4:
        return 'Good';
      case 5:
        return 'Very Good';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <div
        onClick={toggleModal}
        className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-lg min-w-[500px]">
        <h1 className="text-3xl mt-4 font-bold text-center mb-6 text-gray-800">
          Create Account
        </h1>
        {errorMessage1 ? (
          <p className="text-center text-red-600 text-sm">
            {/* Escaped single quote */}
            Error - The Following email/username already exist. Please try a new
            one
          </p>
        ) : null}
        {errorMessage2 ? (
          <p className="text-center text-red-600 text-sm">
            {/* Escaped single quote */}
            Error - The Following Passwords do not match
          </p>
        ) : null}

        <form>
          <div className="mb-6">
            <label
              htmlFor="email-input"
              className="block mb-2 text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              required
              onChange={emailHandler}
              value={email}
              id="email-input"
              name="email"
              type="email"
              placeholder="your@email.com"
              className={`bg-gray-100 border text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 ${
                errorMessage1 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password-input"
              className="block mb-2 text-lg font-medium text-gray-700">
              Password
            </label>
            <input
              onChange={passwordHandler}
              type={showPassword ? 'text' : 'password'}
              value={password}
              required
              id="password-input"
              name="password"
              placeholder="Enter your password"
              className={`bg-gray-100 border text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 ${
                errorMessage1 || errorMessage2
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
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
                  d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.8239 22 12C22 13.1761 21.575 14.1915 20.7251 15.2957C20.3603 15.7703 19.9353 16.2775 19.4596 16.7936M9 4.45962L7.88872 2.98093M9 4.45962C6.9792 5.08289 5.16506 6.3868 3.61364 8.00096C2.76908 8.88447 2.28582 9.83889 2.07285 10.7442M7.88872 2.98093L5.99902 3.5M7.88872 2.98093C6.96022 2.58758 6.01218 2.33024 5.15139 2.16552C4.27192 1.99605 3.45542 1.91754 2.92712 1.9868C2.31962 2.06552 2.06313 2.49814 2.01384 3.05789C1.96551 3.60621 2.08562 4.37695 2.47503 5.1862C3.22199 6.72249 4.82159 8.22682 6.93766 9.32784C8.75314 10.2627 10.7994 10.895 12 10.895C13.2006 10.895 15.2469 10.2627 17.0623 9.32784C19.1784 8.22682 20.778 6.72249 21.525 5.1862C21.9144 4.37695 22.0345 3.60621 21.9862 3.05789C21.9369 2.49814 21.6804 2.06552 21.0729 1.9868C20.5446 1.91754 19.7281 1.99605 18.8486 2.16552C17.9878 2.33024 17.0398 2.58758 16.1113 2.98093M7.88872 2.98093C7.88872 2.98093 9.91153 4.16968 12 4C13.0896 4 15.1113 2.98093 7.88872 2.98093"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="password-input2"
              className="block mb-2 text-lg font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              onChange={password2Handler}
              value={password2}
              type={showPassword2 ? 'text' : 'password'}
              required
              id="password-input2"
              name="password"
              placeholder="Re-enter your password"
              className={`bg-gray-100 border text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 ${
                errorMessage1 || errorMessage2
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {showPassword2 === false ? (
              <svg
                onClick={() => setShowPassword2(true)}
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
                onClick={() => setShowPassword2(false)}
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                className="absolute right-3 top-10 cursor-pointer mt-1"
                fill="none">
                <path
                  d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.8239 22 12C22 13.1761 21.575 14.1915 20.7251 15.2957C20.3603 15.7703 19.9353 16.2775 19.4596 16.7936M9 4.45962L7.88872 2.98093M9 4.45962C6.9792 5.08289 5.16506 6.3868 3.61364 8.00096C2.76908 8.88447 2.28582 9.83889 2.07285 10.7442M7.88872 2.98093L5.99902 3.5M7.88872 2.98093C6.96022 2.58758 6.01218 2.33024 5.15139 2.16552C4.27192 1.99605 3.45542 1.91754 2.92712 1.9868C2.31962 2.06552 2.06313 2.49814 2.01384 3.05789C1.96551 3.60621 2.08562 4.37695 2.47503 5.1862C3.22199 6.72249 4.82159 8.22682 6.93766 9.32784C8.75314 10.2627 10.7994 10.895 12 10.895C13.2006 10.895 15.2469 10.2627 17.0623 9.32784C19.1784 8.22682 20.778 6.72249 21.525 5.1862C21.9144 4.37695 22.0345 3.60621 21.9862 3.05789C21.9369 2.49814 21.6804 2.06552 21.0729 1.9868C20.5446 1.91754 19.7281 1.99605 18.8486 2.16552C17.9878 2.33024 17.0398 2.58758 16.1113 2.98093M7.88872 2.98093C7.88872 2.98093 9.91153 4.16968 12 4C13.0896 4 15.1113 2.98093 7.88872 2.98093"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <div className="relative">
            <div className="w-full h-2 bg-gray-200 rounded-lg">
              <div
                className={`h-2 rounded-lg ${getStrengthClass()}`}
                style={{ transition: 'width 0.3s ease-in-out' }}></div>
            </div>
            <p className="mt-2 text-xs text-gray-600">{getStrengthError()}</p>
          </div>

          {errorMessage1 && (
            <p className="text-red-500 text-xs mt-1">{errorMessage1}</p>
          )}
          {errorMessage2 && (
            <p className="text-red-500 text-xs mt-1">{errorMessage2}</p>
          )}

          <button
            type="submit"
            className="text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4 w-full">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
