'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Channel from '@/app/Channel/Channel';
import Chat from '@/app/components/chat/Chat';
import ChannelPreview from '@/app/Channel/ChannelPreview';
import { socket } from '@/app/components/chat/ChatInput';
import { toast } from 'react-toastify';
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
    isSuspended: false,
  });
  const [hosting, setHosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goOnlineStatus, setGoOnlineStatus] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const isFetched = useRef(false);
  const [game, setGame] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchUserData = async (username: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/channel/getUserInformation',
        { username: username }
      );
      console.log(data);
      if (data) {
        setChannelData(data);
        setTitle(data.title);
        setDescription(data.description);
        setGame(data.game);
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
      const data = await axios.put('http://localhost:3001/api/channel/goLive', {
        token: window.localStorage.getItem('token'),
      });
      if (data) {
        setGoOnlineStatus(true);
      } else {
        toast.error('You are currently suspended. Please Contact Admin');
      }
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
      } else {
        console.log('hello');
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

  // resonsible for ban of a user
  useEffect(() => {
    const handleMakeBanUser = (message) => {
      toast.success('User is banned');
    };

    const handleFailBanUser = (message) => {
      toast.error('Unable to ban user');
    };

    const handleUserReceiveBan = (message) => {
      setIsBanned(true);
      toast.success('You have been banned');
    };

    socket.on('ban_successful', handleMakeBanUser);
    socket.on('ban_failed2', handleFailBanUser);
    socket.on('receivedUser_ban', handleUserReceiveBan);

    return () => {
      socket.off('ban_successful', handleMakeBanUser);
      socket.off('ban_failed2', handleFailBanUser);
      socket.off('receivedUser_ban', handleUserReceiveBan);
    };
  }, []);

  // resonsible for ban of a user
  useEffect(() => {
    const handleMakeUnBanUser = (message) => {
      toast.success('User is unbanned');
    };

    const handleFailUnBanUser = (message) => {
      toast.error('Unable to ban user');
    };

    const handleUserReceiveUnBan = (message) => {
      setIsBanned(false);
      toast.success('You have been unbanned');
    };

    socket.on('unban_user2', handleMakeUnBanUser);
    socket.on('failed_unban2', handleFailUnBanUser);
    socket.on('receivedUser_unban', handleUserReceiveUnBan);

    return () => {
      socket.off('unban_user2', handleMakeUnBanUser);
      socket.off('failed_unban2', handleFailUnBanUser);
      socket.off('receivedUser_unban', handleUserReceiveUnBan);
    };
  }, []);

  // resonsible for suspension of a user
  useEffect(() => {
    const handleSuspendStream = (message) => {
      toast.success('Streamer is Suspended');
    };

    const handleFailSuspension = (message) => {
      toast.error('Unable to suspend user');
    };

    const handleUserReceiveSuspension = (message) => {
      if (hosting === true) {
        // user is hosting
        setIsSuspended(true);
        toast.success('You have been suspended');
      }
    };

    socket.on('confirmation_suspension', handleSuspendStream);
    socket.on('failedsuspend_streamer2', handleFailSuspension);
    socket.on('receive_suspension', handleUserReceiveSuspension);

    return () => {
      socket.off('confirmation_suspension', handleSuspendStream);
      socket.off('failedsuspend_streamer2', handleFailSuspension);
      socket.off('receive_suspension', handleUserReceiveSuspension);
    };
  }, []);

  // resonsible for removing suspension of a user
  useEffect(() => {
    const handleUnSuspendStream = (message) => {
      toast.success('Streamer is no longer Suspended');
    };

    const handleFailUnSuspension = (message) => {
      toast.error('Unable to remove suspension user');
    };

    const handleUserReceiveUnSuspension = (message) => {
      if (hosting === true) {
        // user is hosting
        setIsSuspended(false);
        toast.success('You have been suspended');
      }
    };

    socket.on('confirmation_unsuspension', handleUnSuspendStream);
    socket.on('failunsuspend_streamer2', handleFailUnSuspension);
    socket.on('receive_unsuspension', handleUserReceiveUnSuspension);

    return () => {
      socket.off('confirmation_unsuspension', handleUnSuspendStream);
      socket.off('failunsuspend_streamer2', handleFailUnSuspension);
      socket.off('receive_unsuspension', handleUserReceiveUnSuspension);
    };
  }, []);

  useEffect(() => {
    const handleTitleChange = (message) => {
      setTitle(message);
    };

    const handleDescriptionChange = (message) => {
      setDescription(message);
    };

    const handleGameChange = (message) => {
      setGame(message);
    };

    const handleFail = (message) => {
      toast.error('Do not have permission');
    };

    socket.on('changeTitle', handleTitleChange);
    socket.on('changeDescription', handleDescriptionChange);
    socket.on('changed_game', handleGameChange);
    socket.on('failed_setgame2', handleFail);
    socket.on('failed_changeTitle2', handleFail);
    socket.on('failed_changeDescription2', handleFail);
    return () => {
      socket.off('changeTitle', handleTitleChange);
      socket.off('changeDescription', handleDescriptionChange);
      socket.on('changed_game', handleGameChange);
      socket.off('failed_setgame2', handleFail);
      socket.on('failed_changeTitle2', handleFail);
      socket.on('failed_changeDescription2', handleFail);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return isBanned ? (
    <div className="flex flex-col min-h-screen justify-center align-middle w-screen bg-white">
      <h1 className="text-black text-2xl text-center">
        {' '}
        You have been banned from viewing the channel{' '}
      </h1>
    </div>
  ) : (
    <div className="flex flex-col min-h-screen justify-center align-middle w-screen bg-white">
      <div className="flex flex-row gap-3 align-middle justify-center mt-5">
        {isSuspended === true ? (
          <p className="text-xl text-red-600 text-center">
            Your channel has been suspended. Please contact support.
          </p>
        ) : null}
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
            isSuspended={channelData.isSuspended}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            game={game}
            setGame={setGame}
          />
        </div>
        <div className="w-2/5">
          <Chat streamId={params.streamsId} />
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
