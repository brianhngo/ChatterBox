'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function StreamsList() {
  const router = useRouter();
  const id = 1;

  // Click handler function
  const handleClick = (username: string) => {
    console.log(`Navigating to /Streams/${id}`);
    // Navigate to /streams/:id when div box is clicked
    router.push(`/Streams/${id}`);
  };

  const channels = [
    { id: 1, username: 'Channel One', followers: 10 },
    { id: 2, username: 'Channel Two', followers: 20 },
    { id: 3, username: 'Channel Three', followers: 30 },
    { id: 4, username: 'Channel Four', followers: 40 },
  ];

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      <h1 className="text-center mt-5 text-2xl text-blue-600 bold underline mb-5">
        {' '}
        List of Active Streamers{' '}
      </h1>
      <div className="flex flex-row  gap-5 min-h-screen w-screen p-5 bg-white">
        {channels.map((channel, id) => (
          <div
            key={channel.id}
            className="flex flex-col w-[calc(25%-20px)] border h-[20%] border-gray-300 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-gray-100 "
            onClick={() => handleClick(channel.username)}>
            {/* Video Placeholder */}
            <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center rounded-lg mb-4">
              <p className="text-xl text-gray-700">Video </p>
            </div>

            {/* Channel Information */}
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-bold text-gray-800">
                {channel.username}
              </h2>
              <p className="text-lg text-gray-600">
                {channel.followers} followers
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
