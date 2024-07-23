'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Channel from '@/app/Channel/Channel';
import Chat from '@/app/components/chat/Chat';
import ChannelPreview from '@/app/Channel/ChannelPreview';

interface Params {
  params: {
    streamsId: string;
  };
}

export default function StreamsDetails({ params }: Params) {
  const [channelData, setChannelData] = useState({
    channelData: '',
    followers: 0,
    sub: 0,
    status: false,
  });

  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [goOnlineStatus, setGoOnlineStatus] = useState(false); // State to track online status
  const isFetched = useRef(false); // storing T/F status to control status b/c fetchUser was being called twice

  // Fetching user's channel information
  const fetchUserData = async (username: string) => {
    setIsLoading(true); // Start loading
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/channel/getUserInformation',
        { username: username }
      );
      if (data) {
        setChannelData(data);
      } else {
        console.log('No data received');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const goOnline = async (event: any) => {
    try {
      await axios.put('http://localhost:3001/api/channel/goLive', {
        token: window.localStorage.getItem('token'),
      });
      setGoOnlineStatus(true);
    } catch (error) {
      console.error(error);
    }
  };

  const goOffline = async (event: any) => {
    try {
      await axios.put('http://localhost:3001/api/channel/goOffline', {
        token: window.localStorage.getItem('token'),
      });
      setGoOnlineStatus(false);
      setChannelData({
        ...channelData,
        status: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const checkOnlineStatus = async () => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/channel/checkStatus',
        {
          token: window.localStorage.getItem('token'),
        }
      );
      setGoOnlineStatus(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkOnlineStatus();
  }, []);

  useEffect(() => {
    if (!isFetched.current) {
      fetchUserData(params.streamsId);
      isFetched.current = true;
    }
  }, [params.streamsId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>{' '}
        {/* You can replace this with any loading spinner or animation */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-center align-middle w-screen bg-white">
      <div className="flex flex-row gap-3 align-middle justify-center mt-5">
        {goOnlineStatus ? (
          <button
            onClick={(event) => goOffline(event)}
            className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
            Go Offline
          </button>
        ) : (
          <button
            onClick={(event) => goOnline(event)}
            className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
            Go Live
          </button>
        )}
      </div>
      <div className="flex flex-row justify-center w-full p-[20px]">
        <div className="w-1/2 border border-gray-800">
          <Channel
            streamId={params.streamsId}
            username={channelData.username}
            followers={channelData.followers}
            sub={channelData.sub}
            status={channelData.status}
          />
        </div>
        <div className="w-2/5">
          <Chat />
        </div>
      </div>
      {/* Preview Section */}
      <div className="flex flex-col w-full">
        <h1 className="text-2xl p-5 bold text-blue-800 underline mb-5 mt-5">
          {' '}
          Other Live Streamers!{' '}
        </h1>
        <div className="flex p-5 flex-row gap-5 mb-2">
          <ChannelPreview />
        </div>
      </div>
    </div>
  );
}
