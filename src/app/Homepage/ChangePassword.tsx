import React, { useState } from 'react';
import axios from 'axios';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');

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
        console.log("Passwords don't match");
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

      if (!data) {
        throw 'error';
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border-black-600 border shadow-lg max-w-lg flex flex-col min-w-[500px]">
      <h1 className="text-3xl mt-4 font-bold text-center mb-6 text-gray-800">
        Change Password
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="current-password-input"
            className="block mb-2 text-lg font-medium text-gray-700">
            Current Password
          </label>
          <input
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            required
            id="current-password-input"
            name="currentPassword"
            type="password"
            placeholder="Enter your current password"
            className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
        </div>
        <div className="mb-6">
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
            type="password"
            placeholder="Enter your new password"
            className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
        </div>
        <div className="mb-6">
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
            type="password"
            placeholder="Confirm your new password"
            className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
          />
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
