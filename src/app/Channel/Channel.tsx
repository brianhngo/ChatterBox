'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
}: ChannelProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const followHandler = async (event: any) => {
    try {
      console.log('follow');
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
      console.log('unfollow');
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
  }, [username]);

  useEffect(() => {}, [onlineStatus]);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center border border-gray-300 p-4">
      <h1 className="text-2xl text-gray-600 mb-3">
        {username} Stream
        {onlineStatus === true ? (
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
          <h2 className="text-xl font-bold">{username}</h2>
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
