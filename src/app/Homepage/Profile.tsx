'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handleFullNameChange = (event: any) => {
    setFullName(event.target.value);
  };

  const handleAvatarChange = (event: any) => {
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
  const updateProfileInfo = async (event: any) => {
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
    <div className="bg-white p-8 rounded-lg border-black-600 border shadow-lg max-w-lg flex flex-col min-w-[500px]">
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
            htmlFor="FullName"
            className="block mb-2 text-lg font-medium text-gray-700">
            Full Name
          </label>
          <input
            value={fullName}
            onChange={handleFullNameChange}
            required
            id="FullName"
            name="FullName"
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
    </div>
  );
}
