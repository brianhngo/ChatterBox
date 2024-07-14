import React, { useState } from 'react';
import CreateUserModal from './CreateUserModal';

interface LoginModalProps {
  toggleModal: () => void;
}

export default function LoginModal({ toggleModal }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <>
      {!isSignUp ? (
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
            <form>
              <div className="mb-6">
                <label
                  htmlFor="email-input"
                  className="block mb-2 text-lg font-medium text-gray-700">
                  Email
                </label>
                <input
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
                  Forgot password?
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
          </div>
        </div>
      ) : (
        <CreateUserModal toggleModal={toggleModal} setIsSignUp={setIsSignUp} />
      )}
    </>
  );
}
