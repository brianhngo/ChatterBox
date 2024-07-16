'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import ChannelProfile from './ChannelProfile';
import Followers from './Followers';

export default function Homepage() {
  const [tab, setTab] = useState('profile');

  const tabHandler = (selectedTab: string) => {
    setTab(selectedTab);
  };

  return (
    <>
      <main className="flex min-h-screen w-screen flex-col items-center bg-white text-blue-800 p-24">
        {/* Horizontal NavBar */}
        <nav className="items-center justify-between w-full md:flex md:w-auto mb-8">
          <ul className="flex border-b-2 text-xl">
            <li className="-mb-px mr-1">
              <a
                onClick={() => tabHandler('profile')}
                className={`bg-white inline-block  rounded-t py-3 px-6 text-blue-500 hover:text-blue-800 font-semibold ${
                  tab === 'profile'
                    ? 'border-b-2 border-l border-t border-r text-blue-800 hover:text-blue-500'
                    : ''
                }`}>
                Profile
              </a>
            </li>
            <li className="mr-1">
              <a
                onClick={() => tabHandler('password')}
                className={`bg-white inline-block  rounded-t py-3 px-6 text-blue-500 hover:text-blue-800 font-semibold ${
                  tab === 'password'
                    ? 'border-b-2 border-l border-t border-r text-blue-800 hover:text-blue-500'
                    : ''
                }`}>
                Change Password
              </a>
            </li>
            <li className="mr-1">
              <a
                onClick={() => tabHandler('channel')}
                className={`bg-white inline-block  rounded-t py-3 px-6 text-blue-500 hover:text-blue-800 font-semibold${
                  tab === 'channel'
                    ? 'border-b-2 border-l border-t border-r text-blue-800 hover:text-blue-500'
                    : ''
                }`}>
                Channel
              </a>
            </li>
            <li className="mr-1">
              <a
                onClick={() => tabHandler('followers')}
                className={`bg-white inline-block  rounded-t py-3 px-6 text-blue-500 hover:text-blue-800 font-semibold${
                  tab === 'followers'
                    ? 'border-b-2 border-l border-t border-r text-blue-800 hover:text-blue-500'
                    : ''
                }`}>
                Followers
              </a>
            </li>
          </ul>
        </nav>

        {/* Conditional Rendering of Components */}
        {tab === 'profile' && <Profile />}
        {tab === 'password' && <ChangePassword />}
        {tab === 'channel' && <ChannelProfile />}
        {tab === 'followers' && <Followers />}
      </main>
    </>
  );
}
