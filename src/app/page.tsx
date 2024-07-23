'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Chat from './components/chat/Chat';
import LoginFeature from './Profile/LoginFeature';
import Channel from './Channel/Channel';
import ChannelPreview from './Channel/ChannelPreview';
import Link from 'next/link';
import Navbar from './components/chat/Navbar';
import FooterPage from './components/chat/FooterPage';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center bg-white text-blue-800 justify-between ">
      <div className="w-full">{/* <Navbar /> */}</div>

      <h1 className="text-blue-800 underline text-4xl pb-5">
        {' '}
        Streamer Spotlight{' '}
      </h1>
      <p className="text-blue-800  text-md pb-5 pt-5">
        Welcome to the Streamer Spotlight, where we randomly select and feature
        an amazing streamer each week to showcase their unique content and
        connect with a broader audience.{' '}
      </p>

      <div className="flex flex-row justify-center w-full pl-10 pr-24  ">
        <div className="w-1/2 border border-gray-800 ">
          <Channel />
        </div>
        <div className="w-2/5 ">
          <Chat />
        </div>
      </div>
      {/* Preview Section  */}
      <h1 className="text-4xl bold text-blue-800 underline mb-5 mt-5">
        {' '}
        Other Live Streamers!{' '}
      </h1>
      <div className="flex flex-col w-full">
        <div className="flex flex-row gap-5 pl-5">
          <ChannelPreview />
        </div>
      </div>
      {/* Footer */}
      <div className="flex flex-row w-full pt-5">{/* <FooterPage /> */}</div>
    </main>
  );
}
