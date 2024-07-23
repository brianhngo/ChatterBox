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
    username: '',
    followers: 0,
    sub: 0,
    status: false,
  });
  const [hosting, setHosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goOnlineStatus, setGoOnlineStatus] = useState(false);
  const isFetched = useRef(false);

  const fetchUserData = async (username: string) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const reduceFollowers = () => {
    setChannelData((prevData) => ({
      ...prevData,
      followers: prevData.followers > 0 ? prevData.followers - 1 : 0, // Ensure followers don't go below 0
    }));
  };

  const increaseFollowers = () => {
    setChannelData((prevData) => ({
      ...prevData,
      followers: prevData.followers + 1, // Ensure followers don't go below 0
    }));
  };

  const goOnline = async () => {
    try {
      await axios.put('http://localhost:3001/api/channel/goLive', {
        token: window.localStorage.getItem('token'),
      });
      setGoOnlineStatus(true);
    } catch (error) {
      console.error(error);
    }
  };

  const goOffline = async () => {
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
          streamsId: params.streamsId,
        }
      );
      if (data) {
        setGoOnlineStatus(data.statusLive);
        setHosting(data.hosting);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      fetchUserData(params.streamsId);
      isFetched.current = true;
    }
    checkOnlineStatus();
  }, [params.streamsId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-center align-middle w-screen bg-white">
      <div className="flex flex-row gap-3 align-middle justify-center mt-5">
        {hosting ? (
          goOnlineStatus ? (
            <button
              onClick={goOffline}
              className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
              Go Offline
            </button>
          ) : (
            <button
              onClick={goOnline}
              className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
              Go Live
            </button>
          )
        ) : null}
      </div>
      <div className="flex flex-row justify-center w-full p-[20px]">
        <div className="w-1/2 border border-gray-800">
          <Channel
            streamId={params.streamsId}
            username={channelData.username}
            followers={channelData.followers}
            sub={channelData.sub}
            status={channelData.status}
            host={hosting}
            onlineStatus={goOnlineStatus}
            increaseFollowers={increaseFollowers}
            reduceFollowers={reduceFollowers}
          />
        </div>
        <div className="w-2/5">
          <Chat />
        </div>
      </div>
      <div className="flex flex-col w-full">
        <h1 className="text-2xl p-5 bold text-blue-800 underline mb-5 mt-5">
          Other Live Streamers!
        </h1>
        <div className="flex p-5 flex-row gap-5 mb-2">
          <ChannelPreview />
        </div>
      </div>
    </div>
  );
}
