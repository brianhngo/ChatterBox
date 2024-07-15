import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfileModalProp {
  toggleProfileModal: () => void;
}

export default function ProfileModal({ toggleProfileModal }: ProfileModalProp) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleAvatarChange = (event) => {
    setAvatar(event.target.value);
  };

  // when modal loads, we extract the users information fromt he db
  const getProfileInfo = async () => {
    try {
      const token = window.localStorage.getItem('token');
      console.log(token);
      const { data } = await axios.put(
        'http://localhost:3001/api/profile/getProfileInformation',
        {
          token: token,
        }
      );

      if (data) {
        setEmail(data[0].email);
        setUsername(data[0].username);
        setPassword(data[0].password);
        setFullName(data[0].fullName);
        setAvatar(data[0].avatar);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // when update button is pressed. update information in DB
  const updateProfileInfo = async (event) => {
    try {
      event.preventDefault();
      const token = window.localStorage.getItem('token');
      const { data } = await axios.put(
        'http://localhost:3001/api/profile/updateProfileInformation',
        {
          token: token,
          email: email,
          password: password,
          username: username,
          fullName: fullName,
          avatar: avatar,
        }
      );

      if (data) {
        console.log('passed toast reaction');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <div
        className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)]"
        onClick={toggleProfileModal}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg max-w-lg min-w-[500px]">
        <h1 className="text-3xl mt-4 font-bold text-center mb-6 text-gray-800">
          Profile
        </h1>

        <form>
          <div className="mb-6">
            <label
              htmlFor="email-input"
              className="block mb-2 text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={handleEmailChange}
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
              onChange={handlePasswordChange}
              hidden
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
              htmlFor="username"
              className="block mb-2 text-lg font-medium text-gray-700">
              Username
            </label>
            <input
              value={username}
              onChange={handleUsernameChange}
              required
              id="username"
              name="username"
              placeholder="Enter your username"
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="FirstName"
              className="block mb-2 text-lg font-medium text-gray-700">
              First Name
            </label>
            <input
              value={fullName}
              onChange={handleFullNameChange}
              required
              id="FirstName"
              name="FirstName"
              placeholder="Enter your FirstName"
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="avatar"
              className="block mb-2 text-lg font-medium text-gray-700">
              Avatar
            </label>
            <input
              value={avatar}
              onChange={handleAvatarChange}
              required
              id="avatar"
              name="avatar"
              placeholder="upload an avatar"
              className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            />
          </div>
        </form>

        <button
          onClick={updateProfileInfo}
          className="w-full mt-5 bg-blue-600 text-white text-lg font-medium py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          Save
        </button>
        <button
          onClick={toggleProfileModal}
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
