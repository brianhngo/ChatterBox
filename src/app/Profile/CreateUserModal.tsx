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

  const [errorMessage1, setErrorMessge1] = useState(false); // User Already existeed ( email or username exists)
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

        localStorage.setItem('token', data);
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
            {' '}
            Error - The Following email/username already exist. Please try a new
            one
          </p>
        ) : null}
        {errorMessage2 ? (
          <p className="text-center text-red-600 text-sm">
            {' '}
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
            <div className="h-2 w-full bg-gray-200 rounded mt-2">
              <div className={`h-full ${getStrengthClass()} rounded`}></div>
            </div>
            <div className="w-full text-right">
              <p>{`${getStrengthError()}`}</p>
            </div>
          </div>
          <div className="text-red-500 text-sm mb-2">
            <p>
              We recommend meeting the following criteria, but isn't required:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Length greater than 7 characters</li>
              <li>At least one special character</li>
              <li>At least one number</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
            </ul>
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="confirm-password-input"
              className="block mb-2 text-lg font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showPassword2 ? 'text' : 'password'}
              onChange={password2Handler}
              value={password2}
              required
              id="confirm-password-input"
              name="confirm-password"
              placeholder="Confirm your password"
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
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block mb-2 text-lg font-medium text-gray-700">
              Username
            </label>
            <input
              onChange={usernameHandler}
              value={username}
              required
              id="username"
              name="username"
              placeholder="Enter your username"
              className={`bg-gray-100 border text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 ${
                errorMessage1 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        </form>

        <p
          onClick={() => setIsSignUp(false)}
          className="mt-5 text-indigo-600 text-lg font-medium italic cursor-pointer hover:text-indigo-700 hover:underline focus:outline-none focus:ring-4 focus:ring-indigo-300 text-center">
          Back to Login page
        </p>

        <button
          onClick={submitHandler}
          className="w-full mt-5 bg-blue-600 text-white text-lg font-medium py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          Create Account
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
      </div>
    </div>
  );
}
