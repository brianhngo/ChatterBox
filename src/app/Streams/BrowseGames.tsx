import React from 'react';

const games = [
  {
    id: 1,
    name: 'Dota2',
    image: '/dota2.png',
    genre: ['Multiplayer', 'MOBA'],
    viewing: 1200,
  },
  {
    id: 2,
    name: 'Fortnite',
    image: '/fortnite.jpeg',
    genre: ['Battle Royal', 'FPS', 'Multiplayer'],
    viewing: 1200,
  },
  {
    id: 3,
    name: 'League of Legends',
    image: '/LeagueOfLegends.jpg',
    genre: ['Multiplayer', 'MOBA'],
    viewing: 1200,
  },
  {
    id: 4,
    name: 'Heartstone',
    image: '/heartstone.jpg',
    genre: ['PvP', 'Strategy'],
    viewing: 1200,
  },
  {
    id: 5,
    name: 'Overwatch2',
    image: '/Overwatch2.webp',
    genre: ['Arena', 'Multiplayer'],
    viewing: 1200,
  },
  {
    id: 6,
    name: 'World of Warcraft',
    image: '/wow.jpg',
    genre: ['MMO', 'Multiplayer'],
    viewing: 1200,
  },
  {
    id: 7,
    name: 'Call of Duty',
    image: '/cod.jpg',
    genre: ['Battle Royal', 'FPS', 'Multiplayer'],
    viewing: 1200,
  },
  {
    id: 8,
    name: 'Apex Legends',
    image: '/apex.jpg',
    genre: ['Battle Royal', 'FPS', 'Multiplayer'],
    viewing: 1200,
  },
  {
    id: 8,
    name: 'Podcasting',
    image: '/podcasting.png',
    genre: ['Single', 'Listening'],
    viewing: 1200,
  },
];

export default function BrowseGames() {
  return (
    <>
      <h1 className="text-6xl underline text-black text-center mt-5 mb-5">
        {' '}
        Browse by Game{' '}
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
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-5 gap-6 p-10">
        {games.map((game) => (
          <a
            key={game.id}
            href="#"
            className="flex flex-col bg-white border shadow-md rounded-xl hover:shadow-lg focus:outline-none focus:shadow-lg transition">
            <img
              className="w-full h-[320px] rounded-t-xl"
              src={game.image}
              alt={`Cover for ${game.name}`}
            />
            <div className="p-4 md:p-5">
              <h3 className="text-4xl text-center font-bold text-gray-800 mb-4">
                {game.name}
              </h3>
              <p className="text-md flex mt-5 mb-5 items-center justify-center text-black">
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
                <span className="ml-2 text-lg">{game.viewing}</span>
              </p>
              <div className="flex flex-row flex-wrap justify-center mx-auto gap-3">
                {game.genre.map((category, index) => (
                  <div
                    key={index}
                    className="text-sm text-center rounded-xl bg-slate-400 text-white p-2">
                    {category}
                  </div>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
