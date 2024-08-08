import React, { useState } from 'react';
import './CategoriesBanner.css';

const gameData = [
  { src: '/dota2.png', alt: 'Dota2' },
  { src: '/LeagueOfLegends.jpg', alt: 'League of Legends' },
  { src: '/fortnite.jpeg', alt: 'Fortnite' },
  { src: '/heartstone.jpg', alt: 'Heartstone' },
  { src: '/Overwatch2.webp', alt: 'Overwatch2' },
  { src: 'wow.jpg', alt: 'World of Warcraft' },
  { src: '/cod.jpg', alt: 'Call of Duty' },
  { src: '/pubg.png', alt: 'PUBG' },
  { src: 'podcasting.png', alt: 'Podcasting' },
];

const ITEMS_PER_PAGE = 5;

export default function CategoriesBanner() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(gameData.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage % totalPages) + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1 || totalPages);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = gameData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="py-24 w-full">
      <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="pb-16">
          <h2 className="w-full text-left text-gray-900 text-5xl font-bold font-manrope leading-loose pb-2.5">
            Browse by Game
          </h2>
          <p className="w-full text-left text-gray-600 text-xl font-normal leading-8">
            Explore the wide variety of games being streamed
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className="mx-auto w-auto relative">
          <button
            onClick={handlePrevPage}
            className="swiper-button-prev w-11 h-11 p-3 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] items-center justify-center border border-gray-300 rounded-lg group hover:bg-gray-900 transition-all duration-700 ease-in-out">
            <svg
              className="text-gray-900 group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none">
              <path
                d="M12.5002 14.9999L7.50005 9.99973L12.5032 4.99658"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="swiper-container gallery-top w-full mx-auto xl:overflow-hidden pt-6 pb-6 flex justify-center gap-4">
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="swiper-slide max-w-[319px] cursor-pointer grid hover:bg-slate-300  transition-transform transform hover:scale-105 hover:shadow-lg">
                <img
                  className="grow shrink basis-0 w-[285px] h-[380px] rounded-xl"
                  src={item.src}
                  alt={item.alt}
                />
                <p className="text-center text-lg text-black mt-3">
                  {' '}
                  {item.alt}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            className="swiper-button-next w-11 h-11 p-3 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] items-center justify-center border border-gray-300 rounded-lg group hover:bg-gray-900 transition-all duration-700 ease-in-out">
            <svg
              className="text-gray-900 group-hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none">
              <path
                d="M7.50005 14.9999L12.5002 9.99973L7.49705 4.99658"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <p className="text-right text-blue-600 hover:cursor-pointer hover:underline text-xl">
            {' '}
            Browse more games....{' '}
          </p>
        </div>
      </div>
    </section>
  );
}
