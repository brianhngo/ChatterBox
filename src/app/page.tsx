'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Chat from './components/chat/Chat';
import LoginFeature from './Profile/LoginFeature';
import Channel from './Channel/Channel';
import ChannelPreview from './Channel/ChannelPreview';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center bg-white text-blue-800 justify-between p-24">
      <LoginFeature />
      <div className="flex flex-row justify-center w-full  ">
        <div className="w-3/5 border border-gray-800 ">
          <Channel />
        </div>
        <div className="w-2/5 ">
          <Chat />
        </div>
      </div>
      {/* Preview Section  */}
      <div className="flex flex-col w-full">
        <h1 className="text-2xl bold text-blue-800 underline mb-5 mt-5">
          {' '}
          Other Live Streamers!{' '}
        </h1>
        <div className="flex flex-row gap-5">
          <ChannelPreview />
        </div>
      </div>
    </main>
  );
}
