'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoginFeature from '@/app/Profile/LoginFeature';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Use usePathname hook

  const navigateTo = (url: string) => {
    router.push(url);
  };

  // Define classes for active and inactive states
  const linkClasses = 'block py-2 px-3 text-gray-300 text-xl rounded md:p-0';
  const activeLinkClasses =
    'block py-2 px-3 text-white text-xl font-semibold underline md:p-0 cursor-pointer';
  return (
    <nav className="bg-slate-800 border-blue-200">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4 pl-[20px] pr-[20px]">
        <div
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
          onClick={() => navigateTo('/')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="h-16 w-16">
            {/* SVG paths */}
          </svg>
          <span className="self-center text-2xl font-semibold text-white whitespace-nowrap">
            ChatterBox
          </span>
        </div>

        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto"
          id="navbar-search">
          <ul className="flex flex-col p-4 md:p-0 mt-4 text-xl border border-gray-100 rounded-lg md:space-x-8 cursor-pointer rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <button
                onClick={() => navigateTo('/')}
                className={pathname === '/' ? activeLinkClasses : linkClasses}
                aria-current={pathname === '/' ? 'page' : undefined}>
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('/Streams')}
                className={
                  pathname === '/Streams' ? activeLinkClasses : linkClasses
                }
                aria-current={pathname === '/Streams' ? 'page' : undefined}>
                Browse
              </button>
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
