import React, { useState } from 'react';
import axios from 'axios';
interface CreateUserProps {
  toggleModal: () => void;
  setIsSignUp: any;
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

  // Handlers for each state

  const usernameHandler = (event: any) => {
    setUsername(event.target.value);
  };

  const emailHandler = (event: any) => {
    setEmail(event.target.value);
  };

  const passwordHandler = (event: any) => {
    setPassword(event.target.value);
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
        throw 'Error';
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
        toggleModal();
      }
    } catch (error) {
      console.error(error);
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
              onChange={passwordHandler}
              value={password}
              required
              id="password-input"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm-password-input"
              className="block mb-2 text-lg font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              onChange={password2Handler}
              value={password2}
              required
              id="confirm-password-input"
              name="confirm-password"
              type="password"
              placeholder="Confirm your password"
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
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
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        </form>
        <p
          onClick={() => setIsSignUp(false)}
          className="mt-5 text-indigo-600 text-lg font-medium italic cursor-pointer hover:text-indigo-700 hover:underline focus:outline-none focus:ring-4 focus:ring-indigo-300 text-center">
          Back to Login page
        </p>
        <button
          onClick={(event) => submitHandler(event)}
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
