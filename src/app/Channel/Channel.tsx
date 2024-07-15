import React from 'react';

export default function Channel() {
  return (
    <div className="flex flex-col  w-full h-full first:items-center justify-center border border-gray-300 p-4">
      {/* Video */}
      <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
        <p className="text-xl">Video</p>
      </div>
      <div className="flex w-full flex-row justify-between mx-auto items-center">
        <section className="mt-4">
          {/* Channel information */}
          <h2 className="text-xl font-bold mt-4">Account Name</h2>

          <div className="flex flex-row justify-between gap-4">
            <p className="text-md text-gray-500">Subscribers: 1000</p>
            <p className="text-md text-gray-500">Followers: 1000</p>
          </div>
        </section>

        {/* Channel Buttons */}
        <section className="mt-4 space-x-4">
          <button className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg">
            Subscribe
          </button>
          <button className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
            Follow
          </button>
        </section>
      </div>
    </div>
  );
}
