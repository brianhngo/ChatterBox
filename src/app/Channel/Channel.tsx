'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
interface ChannelProps {
  streamId: string;
  username: string;
  followers: number;
  sub: number;
  status: boolean;
}

export default function Channel({
  streamId,
  username,
  followers,
  sub,
  status,
}: ChannelProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const isDataFetched = useRef(false);
  // follow
  const followHandler = async (event: any) => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/following/addFollow',
        {
          username: username,
          token: window.localStorage.getItem('token'),
        }
      );
      if (data) {
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // unfollow

  const unfollowHandler = async (event: any) => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/following/unFollow',
        {
          username: username,
          token: window.localStorage.getItem('token'),
        }
      );
      if (data) {
        setIsFollowing(false);
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

  // useEffect to check when page loads, if the user guest stop. if user is another, we need to check if they are following or not
  return (
    <div className="flex flex-col w-full h-full items-center justify-center border border-gray-300 p-4">
      {/* Video */}
      <h1 className="text-2xl text-gray-600 mb-3">
        {username} Stream{' '}
        <span
          className={`text-md ${status ? 'text-green-500' : 'text-red-500'}`}>
          {status ? 'Online' : 'Offline'}
        </span>
      </h1>
      <div className="w-full h-[50vh] bg-gray-200 flex items-center justify-center">
        <p className="text-xl">Video</p>
      </div>
      <div className="flex w-full flex-row justify-between mx-auto items-center mt-4">
        {/* Channel information */}
        <section>
          <h2 className="text-xl font-bold">{username}</h2>
          <div className="flex flex-row justify-between gap-4 mt-2">
            <p className="text-md text-gray-500">Subscribers: {sub}</p>
            <p className="text-md text-gray-500">Followers: {followers}</p>
          </div>
        </section>

        {/* Channel Buttons */}
        <section className="space-x-4">
          <button
            // // cannot follow ur own channel
            disabled={streamId === username}
            className="bg-purple-500  hover:bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg">
            Subscribe
          </button>
          {isFollowing === false ? (
            <button
              onClick={(event) => {
                followHandler(event);
              }}
              disabled={streamId === username}
              className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
              Follow
            </button>
          ) : (
            <button
              onClick={(event) => {
                unfollowHandler(event);
              }}
              disabled={streamId === username}
              className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
              UnFollow
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
