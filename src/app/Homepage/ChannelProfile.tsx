'use client';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ChannelProfile() {
  const [username, setUsername] = useState('');
  const isFetched = useRef(false);
  const goLiveHandler = async () => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/channel/goLive',
        {
          token: window.localStorage.getItem('token'),
        }
      );

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      goLiveHandler();
      isFetched.current = true;
    }
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Channel Profile
      </h1>
      <p className="text-lg text-gray-700 mb-4 text-center">
        Oh, interested in being a streamer? Click the button below to go online.
      </p>
      <div className="flex justify-center">
        <Link
          className="bg-blue-600 text-white text-lg font-medium py-2.5 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          href={`/Streams/${username}`}>
          Click here to go online
        </Link>
      </div>
    </div>
  );
}
