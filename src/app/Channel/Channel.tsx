'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { socket } from '../components/chat/ChatInput';

interface ChannelProps {
  streamId: string;
  username: string;
  followers: number;
  sub: number;
  status: boolean;
  onlineStatus: boolean;
  host: boolean;
  increaseFollowers: () => void;
  reduceFollowers: () => void;
  title: string;
  setTitle: () => void;
  setDescription: () => void;
  description: string;
  isSuspended: boolean;
  setGame: () => void;
  game: string;
}

export default function Channel({
  streamId,
  username,
  followers,
  sub,
  status,
  onlineStatus,
  host,
  increaseFollowers,
  reduceFollowers,
  setDescription,
  setTitle,
  description,
  title,
  setGame,
  game,
}: ChannelProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewers, setViewers] = useState(0);
  const followHandler = async (event: any) => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/following/addFollow',
        {
          username: username,
          token: window.localStorage.getItem('token'),
          followers: followers,
        }
      );
      if (data) {
        setIsFollowing(true);
        increaseFollowers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const unfollowHandler = async (event: any) => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/following/unFollow',
        {
          username: username,
          token: window.localStorage.getItem('token'),
          followers: followers,
        }
      );
      if (data) {
        setIsFollowing(false);
        reduceFollowers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getFollowStatus = async () => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/following/checkFollowing',
        {
          username: username,
          token: window.localStorage.getItem('token'),
        }
      );

      if (data) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFollowStatus();
  }, []);

  // useEffect(() => {}, [onlineStatus]);

  // change title and description of stream
  useEffect(() => {
    const handleChangeTitle = (message) => {
      toast.success('Title updated!');
    };

    const handleChangeDescription = (message) => {
      toast.success('description updated!');
    };

    socket.on('changedTitle', handleChangeTitle);
    socket.on('changeDescription', handleChangeDescription);

    return () => {
      socket.off('changedTitle', handleChangeTitle);
      socket.off('changeDescription', handleChangeDescription);
    };
  }, []);

  useEffect(() => {
    const handleChangeViewer = (message) => {
      setViewers(message);
    };

    socket.on('viewerCountUpdate', handleChangeViewer);

    return () => {
      socket.off('viewerCountUpdate', handleChangeViewer);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center border border-gray-300 p-4">
      <h1 className="text-3xl text-gray-600 mb-3">
        {username}
        <span className="text-2xl text-gray-600"> {title}</span>
        {status === true ? (
          <span className="text-green-600 text-center text-md"> LIVE </span>
        ) : (
          <span className="text-red-600 text-center text-md"> Offline </span>
        )}
      </h1>
      <div className="w-full h-[50vh] bg-gray-200 flex items-center justify-center">
        <p className="text-xl">Video</p>
      </div>
      <div className="flex w-full flex-row justify-between mx-auto items-center mt-4">
        <section>
          <h2 className="text-2xl text-black font-bold">
            {username}{' '}
            <span className="rounded-lg bg-neutral-200 p-1 text-sm uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {game}
            </span>
            <p className="text-xl font-bold text-black"> {description} </p>
          </h2>
          <p className="text-xl flex flex-row font-bold mt-1 mb-1 text-black">
            {' '}
            <svg
              className=" w-[32px] h-[20px]"
              xmlns="http://www.w3.org/2000/svg"
              fill="BLACK"
              viewBox="0 0 32 32"
              version="1.1">
              <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z" />
            </svg>{' '}
            {viewers}
          </p>
          <div className="flex flex-row justify-between gap-4 mt-2">
            <p className="text-md text-gray-500">Subscribers: {sub}</p>
            <p className="text-md text-gray-500">Followers: {followers}</p>
          </div>
        </section>
        <section className="space-x-4">
          <button
            disabled={streamId === username}
            className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg">
            Subscribe
          </button>
          {!isFollowing ? (
            <button
              onClick={followHandler}
              disabled={host === true}
              className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
              Follow
            </button>
          ) : (
            <button
              onClick={unfollowHandler}
              disabled={host === true}
              className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
              UnFollow
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
