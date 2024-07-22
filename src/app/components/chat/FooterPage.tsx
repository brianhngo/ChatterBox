import React from 'react';

export default function FooterPage() {
  return (
    <footer className="bg-white  shadow  dark:bg-gray-800 w-full">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-400 sm:text-center d">
          © 2024{' '}
          <a href="https://flowbite.com/" className="hover:underline">
            Chatterbox
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
