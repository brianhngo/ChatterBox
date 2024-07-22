'use client';
import React from 'react';
import { useRouter } from 'next/router';
import LoginFeature from '@/app/Profile/LoginFeature';

export default function Navbar() {
  return (
    <nav className="bg-slate-800 border-blue-200 mb-5">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4 pl-[20px] pr-[20px]">
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="h-16 w-16">
            <g id="live-streaming-04">
              <path
                fill="#605491"
                d="M33.272,41.094c11.33,0,20.547-9.218,20.547-20.547S44.601,0,33.272,0C21.941,0,12.723,9.218,12.723,20.547S21.941,41.094,33.272,41.094z M33.272,2.472c9.967,0,18.075,8.108,18.075,18.075s-8.108,18.075-18.075,18.075s-18.077-8.108-18.077-18.075S23.304,2.472,33.272,2.472z M27.554,29.325c0.194,0.116,0.413,0.174,0.631,0.174c0.203,0,0.407-0.05,0.59-0.15l14.183-7.716c0.398-0.217,0.646-0.633,0.646-1.086s-0.247-0.869-0.646-1.086l-14.183-7.716c-0.381-0.208-0.846-0.2-1.221,0.024c-0.375,0.223-0.605,0.626-0.605,1.062v15.432C26.949,28.699,27.179,29.103,27.554,29.325z M29.421,14.911l10.361,5.636l-10.361,5.636V14.911z M10.755,61.517h8.124V64H7.644V46.103h3.11V61.517z M21.448,46.103h3.097V64h-3.097V46.103z M39.222,46.103h3.417L36.197,64h-3.011L26.77,46.103h3.405l4.5,14L39.222,46.103z M56.356,61.517V64H44.654V46.103H56.27v2.507h-8.505v4.941h7.35v2.459h-7.35v5.507H56.356z"
              />
              <path
                fill="#D4C3F7"
                d="M33.273,2.471c-9.974,0-18.082,8.108-18.082,18.082c0,9.962,8.108,18.069,18.082,18.069c9.962,0,18.069-8.108,18.069-18.069C51.343,10.578,43.235,2.471,33.273,2.471z M42.963,21.627l-14.188,7.725c-0.185,0.099-0.383,0.148-0.593,0.148c-0.21,0-0.433-0.062-0.63-0.173c-0.371-0.222-0.606-0.63-0.606-1.063V12.828c0-0.433,0.235-0.84,0.606-1.063c0.383-0.222,0.84-0.222,1.224-0.025l14.188,7.725c0.396,0.21,0.643,0.63,0.643,1.088C43.606,20.997,43.359,21.417,42.963,21.627z"
              />
            </g>
          </svg>
          <span className="self-center text-2xl font-semibold text-white whitespace-nowrap">
            ChatterBox
          </span>
        </a>

        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto"
          id="navbar-search">
          <ul className="flex flex-col p-4 md:p-0 mt-4 text-xl border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-300 text-xl underline rounded md:bg-transparent md:p-0"
                aria-current="page">
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded text-xl hover:text-gray-300 hover:underline cursor-pointer md:p-0">
                Browse
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4 w-[20%] rtl:space-x-reverse">
          <div className="relative hidden w-full md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
          <button
            type="button"
            data-collapse-toggle="navbar-search"
            aria-controls="navbar-search"
            aria-expanded="false"
            className="md:hidden text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5 me-1">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-search"
            aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto">
          <LoginFeature />
        </div>
      </div>
    </nav>
  );
}
