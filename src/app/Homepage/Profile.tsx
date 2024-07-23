'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { storage } from '../server/database/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState('');
  const [loading, setLoading] = useState(true);

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
    setAvatar(event.target.files[0]);
  };

  const uploadProfilePicture = async (file, userId) => {
    const storageRef = ref(storage, `profile_pictures/${userId}/${file.name}`); // creates the reference to firebase storage
    await uploadBytes(storageRef, file); // saving it to DB
    const downloadURL = await getDownloadURL(storageRef); //extracting URL

    return downloadURL;
  };

  // when modal loads, we extract the users information from the db
  const getProfileInfo = async () => {
    try {
      const token = window.localStorage.getItem('token');

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
        setAvatarURL(data[0].avatar);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  // when update button is pressed. update information in DB
  const updateProfileInfo = async (event) => {
    event.preventDefault();
    try {
      const token = window.localStorage.getItem('token');

      let avatarDownloadURL = avatarURL;

      if (avatar) {
        const userId = email; // Use the email as the user ID
        avatarDownloadURL = await uploadProfilePicture(avatar, userId);
      }

      const { data } = await axios.put(
        'http://localhost:3001/api/profile/updateProfileInformation',
        {
          token: token,
          email: email,
          password: password,
          username: username,
          fullName: fullName,
          avatar: avatarDownloadURL,
        }
      );

      if (data) {
        toast.success('Updated!');
        setAvatarURL(avatarDownloadURL); // Update the avatar URL state
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg border-black-600 border shadow-lg max-w-lg flex flex-col min-w-[500px]">
      <h1 className="text-3xl mt-4 font-bold text-center mb-6 text-gray-800">
        Profile
      </h1>
      <h1 className="text-black text-2xl text-center mb-2 mt-2">
        {' '}
        Welcome back {username}
      </h1>
      <div className="flex justify-center items-center mt-2 mb-4">
        <img
          src={avatarURL || '/path-to-your-default-profile-image.jpg'}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
        />
      </div>

      <form onSubmit={updateProfileInfo}>
        <div className="mb-6">
          <label
            htmlFor="email-input"
            className="block mb-2 text-lg font-medium text-gray-700">
            Email
          </label>
          <input
            disabled
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
            required
            disabled
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
            disabled
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
            type="file"
            onChange={handleAvatarChange}
            id="avatar"
            name="avatar"
            placeholder="upload an avatar"
            className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-5 bg-blue-600 text-white text-lg font-medium py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          Save
        </button>
      </form>
    </div>
  );
}
