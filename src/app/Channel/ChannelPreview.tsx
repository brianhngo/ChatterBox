'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// This component will be responsible for the preview section, Different than list of channels
export default function ChannelPreview() {
  const [channels, setChannels] = useState([]);
  const isFetched = useRef(false);

  // fetches a list of 4 active channels randomly
  const fetchChannelsList = async () => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/channel/previews'
      );
      if (data) {
        setChannels(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchChannelsList();
      isFetched.current = true;
    }
  }, []);

  return (
    <>
      {channels.length > 0 ? (
        channels.map((channel: any) => (
          <div
            key={channel.id}
            className="flex flex-col w-[20%] h-auto border border-gray-300 p-2 shadow-md cursor-pointer hover:shadow-lg  hover:bg-gray-100">
            <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
              <p className="text-lg">Video Placeholder</p>
            </div>
            <div className="flex flex-row justify-between mx-auto text-center items-center p-2">
              <section className="mt-2">
                <h2 className="text-lg font-bold mt-2 text-gray-600">
                  {channel?.username}
                </h2>
                <p className="text-sm text-gray-600">
                  {channel?.followers} followers
                </p>
              </section>
            </div>
          </div>
        ))
      ) : (
        <p>No channels found</p>
      )}
    </>
  );
}
