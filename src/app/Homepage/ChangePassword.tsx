import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setEngine } from 'crypto';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword1, setShowNewPassword1] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);

  // Error Message
  const [errorMessage1, setErrorMessage1] = useState(false); // New PW 1 !== New PW2
  const [errorMessage2, setErrorMessage2] = useState(false); // Failed currentPW doesnt match

  const resetInput = () => {
    setCurrentPassword('');
    setNewPassword('');
    setNewPassword1('');
  };

  const handleCurrentPasswordChange = (e: any) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: any) => {
    setNewPassword(e.target.value);
  };

  const handleNewPassword1Change = (e: any) => {
    setNewPassword1(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (newPassword !== newPassword1) {
        setErrorMessage1(true);
        setErrorMessage2(false);
        resetInput();
        console.log("Passwords don't match");
        toast.error('Error!');
        return;
      }

      const { data } = await axios.put(
        'http://localhost:3001/api/profile/changePassword',
        {
          token: window.localStorage.getItem('token'),
          newPassword: newPassword,
          oldPassword: currentPassword,
        }
      );
      toast.success('Success!');
      resetInput();
      setErrorMessage1(false);
      setErrorMessage2(false);
      if (!data) {
        throw 'error';
      }
    } catch (error) {
      toast.error('Error!');
      setErrorMessage1(false);
      setErrorMessage2(true);
      resetInput();
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border-black-600 border shadow-lg max-w-lg flex flex-col min-w-[500px]">
      <h1 className="text-3xl mt-4 font-bold text-center mb-6 text-gray-800">
        Change Password
      </h1>
      {errorMessage1 === true ? (
        <p className="text-sm text-red-600 text-center">
          {' '}
          Error!, New Passwords do not match
        </p>
      ) : null}
      {errorMessage2 === true ? (
        <p className="text-sm text-red-600 text-center">
          {' '}
          Error!, Current Password typed is wrong
        </p>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="mb-6 relative">
          <label
            htmlFor="current-password-input"
            className="block mb-2 text-lg font-medium text-gray-700">
            Current Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            required
            id="current-password-input"
            name="currentPassword"
            placeholder="Enter your current password"
            className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
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
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                stroke="#1C274C"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </div>
        <div className="mb-6 relative">
          <label
            htmlFor="new-password-input"
            className="block mb-2 text-lg font-medium text-gray-700">
            New Password
          </label>
          <input
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            id="new-password-input"
            name="newPassword"
            type={showNewPassword1 ? 'text' : 'password'}
            placeholder="Enter your new password"
            className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
          {showNewPassword1 === false ? (
            <svg
              onClick={() => setShowNewPassword1(true)}
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
              onClick={() => setShowNewPassword1(false)}
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              className="absolute right-3 top-10 cursor-pointer mt-1"
              fill="none">
              <path
                d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137"
                stroke="#1C274C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                stroke="#1C274C"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </div>
        <div className="mb-6 relative">
          <label
            htmlFor="confirm-password-input"
            className="block mb-2 text-lg font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            value={newPassword1}
            onChange={handleNewPassword1Change}
            required
            id="confirm-password-input"
            name="confirmPassword"
            type={showNewPassword2 ? 'text' : 'password'}
            placeholder="Confirm your new password"
            className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
          {showNewPassword2 === false ? (
            <svg
              onClick={() => setShowNewPassword2(true)}
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
              onClick={() => setShowNewPassword2(false)}
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              className="absolute right-3 top-10 cursor-pointer mt-1"
              fill="none">
              <path
                d="M9 4.45962C9.91153 4.16968 10.9104 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C3.75612 8.07914 4.32973 7.43025 5 6.82137"
                stroke="#1C274C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                stroke="#1C274C"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full mt-5 bg-blue-600 text-white text-lg font-medium py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          Save
        </button>
      </form>
    </div>
  );
}
