import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Followers() {
  const [followingList, setFollowingList] = useState([]);

  const getFollowingList = async () => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/api/following/getFollowingList',
        {
          token: window.localStorage.getItem('token'),
        }
      );
      if (data) {
        setFollowingList(Object.entries(data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFollowingList();
  }, []);

  return (
    <div className="flex flex-row gap-5 w-full">
      {followingList.map((element, index) => {
        if (element[1] === true) {
          return (
            <div
              key={index}
              className="flex flex-col w-[20%]  h-auto border border-gray-300 p-2 cursor-pointer hover:bg-slate-200">
              {/* Video Placeholder */}
              <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
                <p className="text-lg">Video Placeholder</p>
              </div>

              {/* Channel Information with Link */}
              <div className="flex flex-row justify-between mx-auto items-center p-2">
                <section className="mt-2">
                  <Link href={`/Streams/${element[0]}`}>{element[0]}</Link>
                </section>
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
