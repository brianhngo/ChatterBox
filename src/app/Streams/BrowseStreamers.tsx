'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const posts = [
  {
    id: 1,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'StreamMaster1',
    description:
      'Another Day of grind for FIFA26 for the fam mmmmmmmmmmmmmmm So lets getttitititititit',
    viewing: 1400,
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 2,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'StreamMaster2',
    description: 'Another Day of grind for FIFA26 for the fam mmmmmmmmmmmmmmm',
    viewing: 2000,
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 3,
    game: 'Dota2',
    pic: '/dota2.png',
    streamName: 'StreamMaster3',
    description: 'Another Day of grind for Dota2 for the fam mmmmmmmmmmmmmmm',
    viewing: 1800,
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 4,
    game: 'Fortnite',
    pic: '/dota2.png',
    streamName: 'StreamMaster4',
    description: 'Another Day of grind for Fortnite',
    viewing: 1000,
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 5,
    game: 'League of Legends',
    pic: '/dota2.png',
    streamName: 'StreamMaster5',
    description: 'Another Day of grind for League of Legends',
    viewing: 900,
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 6,
    game: 'Apex Legends',
    pic: '/dota2.png',
    streamName: 'StreamMaster6',
    description: 'Another Day of grind for Apex Legends',
    viewing: 1100,
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
  {
    id: 7,
    game: 'FIFA',
    pic: '/dota2.png',
    streamName: 'StreamMaster7',
    description: 'Another Day of grind for FIFA26',
    viewing: 9000,
    imgSrc: '/profile.jpg',
    alt: 'Image',
  },
];

const games = [
  {
    id: 1,
    name: 'Dota2',
    image: '/dota2.png',
  },
  {
    id: 2,
    name: 'Fortnite',
    image: '/fortnite.jpeg',
  },
  {
    id: 3,
    name: 'League of Legends',
    image: '/LeagueOfLegends.jpg',
  },
  {
    id: 4,
    name: 'Heartstone',
    image: '/heartstone.jpg',
  },
  {
    id: 5,
    name: 'Overwatch2',
    image: '/Overwatch2.webp',
  },
  {
    id: 6,
    name: 'World of Warcraft',
    image: '/wow.jpg',
  },
  {
    id: 7,
    name: 'Call of Duty',
    image: '/cod.jpg',
  },
  {
    id: 8,
    name: 'Apex Legends',
    image: '/apex.jpg',
  },
  {
    id: 8,
    name: 'Podcasting',
    image: '/podcasting.png',
  },
];

export default function BrowseStreamers({ selectedGame, setSelectedGame }) {
  console.log(selectedGame);
  const [isLoading, setIsLoading] = useState(true);
  const [streamersData, setStreamersData] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [sortedPosts, setSortedPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [filter, setFilter] = useState(selectedGame);
  const router = useRouter();
  const [dataFetched, setDataFetched] = useState(false);

  const handleGameChange = (event) => {
    const selected = event.target.value;
    setSelectedGame(selected);
    filterPosts(selected);
  };

  const filterPosts = (game) => {
    if (game) {
      const filteredPosts = streamersData.filter(
        (post) => post.Game.toLowerCase() === game.toLowerCase()
      );
      console.log(filteredPosts, 'filtered data');
      setSortedPosts(filteredPosts);
    } else {
      setSortedPosts(streamersData); // Reset to all posts if no game is selected
    }
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortOption(value);
  };

  const sortPosts = (option) => {
    let sorted = [...originalPosts];
    switch (option) {
      case 'most-viewers':
        // Assuming you have a `viewing` field in your data
        sorted.sort((a, b) => b.viewing - a.viewing);
        break;
      case 'a-z':
        sorted.sort((a, b) =>
          a.Profile.username.localeCompare(b.Profile.username)
        );
        break;
      case 'z-a':
        sorted.sort((a, b) =>
          b.Profile.username.localeCompare(a.Profile.username)
        );
        break;
      case '':
        sorted = [...originalPosts]; // Reset to original
        break;
      default:
        sorted = [...originalPosts]; // Default sorting, reset to original
    }
    setSortedPosts(sorted);
  };

  const getDataHandler = async () => {
    try {
      const { data } = await axios.put(
        'http://localhost:3001/getBrowseDataStreamer'
      );

      if (data) {
        setStreamersData(data);
        setOriginalPosts(data);
        setSortedPosts(data);
        setDataFetched(true); // Mark data as fetched
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataHandler().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (dataFetched) {
      // Only run when data has been fetched
      filterPosts(selectedGame);
      setFilter(selectedGame);
    }
  }, [dataFetched, selectedGame]); // Depend on dataFetched and selectedGame

  useEffect(() => {
    sortPosts(sortOption);
  }, [sortOption]);

  const handlePostClick = (streamName) => {
    router.push(`/Streams/${streamName}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center text-center mx-auto items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-6xl underline text-black text-center mt-5 mb-5">
        {' '}
        Browse by Streamer{' '}
      </h1>
      <div className="relative mx-auto w-[30%] hidden  md:block">
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
      <form className="max-w-sm mx-auto">
        <label
          htmlFor="games"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select Game
        </label>
        <select
          value={selectedGame}
          onChange={handleGameChange}
          id="games"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Select a Game</option>
          <option value="Dota2">Dota 2</option>
          <option value="League of Legends">League of Legends</option>
          <option value="Heartstone"> Heartstone</option>
          <option value="World of Warcraft">Warcraft</option>
          <option value="Apex Legends">Apex Legends</option>
          <option value="Fortnite">Fortnite</option>
          <option value="Podcasting">Podcasting</option>
          <option value="Overwatch2">Overwatch 2</option>
          <option value="Call of Duty">Call of Duty</option>
          <option value="pubg">PUBG</option>
        </select>
      </form>
      <form className="max-w-sm mx-auto">
        <label
          htmlFor="years"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Sort By
        </label>
        <select
          value={sortOption}
          onChange={handleSortChange}
          id="years"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="">Default</option>
          <option value="most-viewers">Most Viewers</option>
          <option value="most-subscribers">Most Subscribers</option>
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-5 gap-6 p-10">
        {sortedPosts.map((post) => (
          <div
            onClick={() => handlePostClick(post.streamName)}
            key={post.Profile.username}
            className=" cursor-pointer hover:bg-slate-300 rounded-md border border-neutral-400 shadow-sm dark:border-neutral-700 swiper-slide w-full max-w-[400px]  transition-transform transform hover:scale-105 hover:shadow-lg ">
            <img
              className="hover:bg-slate-300"
              src={post.image}
              alt={post.username}
              width={'300px'}
              height={'300px'}
              className="w-full h-[300px]  rounded-t-md"
            />
            <div className="px-3 py-8 lg:px-4 lg:py-10">
              <div className="flex items-center space-x-4">
                <span className="rounded-lg bg-neutral-200 p-2 text-md font-medium uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {post.Game}
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
                      d="M3 18C3 15.3945 4.66081 13.1768 6.98156 12.348C7.61232 12.1227 8.29183 12 9 12C9.70817 12 10.3877 12.1227 11.0184 12.348C11.3611 12.4703 11.6893 12.623 12 12.8027C12.3107 12.623 12.6389 12.4703 12.9816 12.348C13.6123 12.1227 14.2918 12 15 12C15.7082 12 16.3877 12.1227 17.0184 12.348C19.3392 13.1768 21 15.3945 21 18V21H15.75V19.5H19.5V18C19.5 15.5147 17.4853 13.5 15 13.5C14.4029 13.5 13.833 13.6163 13.3116 13.8275C14.3568 14.9073 15 16.3785 15 18V21H3V18ZM9 11.25C8.31104 11.25 7.66548 11.0642 7.11068 10.74C5.9977 10.0896 5.25 8.88211 5.25 7.5C5.25 5.42893 6.92893 3.75 9 3.75C11.0711 3.75 12.75 5.42893 12.75 7.5C12.75 8.88211 12.0023 10.0896 10.8893 10.74C10.3345 11.0642 9.68896 11.25 9 11.25ZM9 5.25C7.75548 5.25 6.75 6.25548 6.75 7.5C6.75 8.74452 7.75548 9.75 9 9.75C10.2445 9.75 11.25 8.74452 11.25 7.5C11.25 6.25548 10.2445 5.25 9 5.25Z"
                      fill="#000000"
                    />
                  </svg>
                  {post.viewing}
                </p>
              </div>
              <h5 className="text-xl flex items-center justify-center text-center font-medium text-gray-900 dark:text-black">
                <img
                  src="/profile.jpg"
                  alt="/profile.jpg"
                  className="w-16 h-16 rounded-full mr-2 mt-4 mb-4"
                />
                {post.Title}
              </h5>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                {post.Description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
