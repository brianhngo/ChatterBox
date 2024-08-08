import React, { useState } from 'react';
import './CategoriesBanner.css';

const posts = [
  {
    id: 1,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'KevinNguyyeen',
    description:
      'Another Day of grind for FIFA26 for the fam mmmmmmmmmmmmmmm So lets getttitititititit',
    viewing: '1.2k',
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 2,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'KevinNguyyeen',
    description: 'Another Day of grind for FIFA26 for the fam mmmmmmmmmmmmmmm',
    viewing: '1.2k',
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 3,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'KevinNguyyeen',
    description: 'Another Day of grind for FIFA26 for the fam mmmmmmmmmmmmmmm',
    viewing: '1.2k',
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 4,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'KevinNguyyeen',
    description: 'Another Day of grind for FIFA26',
    viewing: '1.2k',
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 5,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'KevinNguyyeen',
    description: 'Another Day of grind for FIFA26',
    viewing: '1.2k',
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 6,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'KevinNguyyeen',
    description: 'Another Day of grind for FIFA26',
    viewing: '1.2k',
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 7,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'KevinNguyyeen',
    description: 'Another Day of grind for FIFA26',
    viewing: '1.2k',
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
];

const ITEMS_PER_PAGE = 4;

export default function StreamersBanner() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage % totalPages) + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(
      (prevPage) => (prevPage - 1 + totalPages) % totalPages || totalPages
    );
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="py-24 w-full">
      <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="pb-16">
          <h2 className="w-full text-left text-gray-900 text-5xl font-bold font-manrope leading-loose pb-2.5">
            Browse through List of Live Streamers
          </h2>
          <p className="w-full text-left text-gray-600 text-xl font-normal leading-8">
            Explore new streamers today!
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
            {currentItems.map((post) => (
              <div
                key={post.id}
                className=" cursor-pointer hover:bg-slate-300 rounded-md border border-neutral-400 shadow-sm dark:border-neutral-700 swiper-slide w-full max-w-[360px]  transition-transform transform hover:scale-105 hover:shadow-lg  grid">
                <img
                  className="hover:bg-slate-300"
                  src={post.pic}
                  alt={post.alt}
                  width={400}
                  height={240}
                  className="w-full   rounded-t-md"
                />

                <div className="px-3 py-8 lg:px-4 lg:py-10">
                  <div className="flex items-center space-x-4">
                    <span className="rounded-lg bg-neutral-200 p-2 text-md font-medium uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {post.game}
                    </span>
                    <p className="text-md flex items-center justify-center text-black">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32px"
                        height="32px"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3 18C3 15.3945 4.66081 13.1768 6.98156 12.348C7.61232 12.1227 8.29183 12 9 12C9.70817 12 10.3877 12.1227 11.0184 12.348C11.3611 12.4703 11.6893 12.623 12 12.8027C12.3107 12.623 12.6389 12.4703 12.9816 12.348C13.6123 12.1227 14.2918 12 15 12C15.7082 12 16.3877 12.1227 17.0184 12.348C19.3392 13.1768 21 15.3945 21 18V21H15.75V19.5H19.5V18C19.5 15.5147 17.4853 13.5 15 13.5C14.4029 13.5 13.833 13.6163 13.3116 13.8275C14.3568 14.9073 15 16.3785 15 18V21H3V18ZM9 11.25C8.31104 11.25 7.66548 11.0642 7.11068 10.74C5.9977 10.0896 5.25 8.88211 5.25 7.5C5.25 5.42893 6.92893 3.75 9 3.75C10.2267 3.75 11.3158 4.33901 12 5.24963C12.6842 4.33901 13.7733 3.75 15 3.75C17.0711 3.75 18.75 5.42893 18.75 7.5C18.75 8.88211 18.0023 10.0896 16.8893 10.74C16.3345 11.0642 15.689 11.25 15 11.25C14.311 11.25 13.6655 11.0642 13.1107 10.74C12.6776 10.4869 12.2999 10.1495 12 9.75036C11.7001 10.1496 11.3224 10.4869 10.8893 10.74C10.3345 11.0642 9.68896 11.25 9 11.25ZM13.5 18V19.5H4.5V18C4.5 15.5147 6.51472 13.5 9 13.5C11.4853 13.5 13.5 15.5147 13.5 18ZM11.25 7.5C11.25 8.74264 10.2426 9.75 9 9.75C7.75736 9.75 6.75 8.74264 6.75 7.5C6.75 6.25736 7.75736 5.25 9 5.25C10.2426 5.25 11.25 6.25736 11.25 7.5ZM15 5.25C13.7574 5.25 12.75 6.25736 12.75 7.5C12.75 8.74264 13.7574 9.75 15 9.75C16.2426 9.75 17.25 8.74264 17.25 7.5C17.25 6.25736 16.2426 5.25 15 5.25Z"
                          fill="#080341"
                        />
                      </svg>
                      <span className="ml-2 text-lg">{post.viewing}</span>
                    </p>
                  </div>
                  <dt className="mt-6">
                    <h3 className="text-2xl font-semibold flex items-center justify-center leading-tight text-black">
                      <img
                        src="/profile.jpg"
                        alt="Streamer"
                        className="w-16 h-16 rounded-full mr-2"
                      />
                      {post.streamName}
                    </h3>
                  </dt>

                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7">
                    <p className="flex-auto text-lg  text-neutral-500 dark:text-neutral-500 mb-4 overflow-hidden line-clamp-2">
                      {post.description}
                    </p>

                    <div className="flex  mx-auto space-x-8">
                      <a className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg">
                        Subscribe
                      </a>

                      <a className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
                        Follow
                      </a>
                    </div>
                  </dd>
                </div>
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
            Browse more streamers....{' '}
          </p>
        </div>
      </div>
    </section>
  );
}
