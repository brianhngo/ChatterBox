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
import HeroBanner from './components/HeroBanner';
import CategoriesBanner from './components/CategoriesBanner';
import StreamersBanner from './components/StreamersBanner';

export default function Home() {
  return (
    <main className="flex min-h-screen w-screen flex-col items-center bg-white text-blue-800 justify-between ">
      <div>
        <HeroBanner />
      </div>
      <div className="w-4/5 flex flex-col mx-auto justify-center align-middle">
        <CategoriesBanner />
      </div>
      <div className="w-4/5 flex flex-col mx-auto justify-center align-middle">
        <StreamersBanner />
      </div>
    </main>
  );
}
