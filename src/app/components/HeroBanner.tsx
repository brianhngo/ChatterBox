import React from 'react';

export default function HeroBanner() {
  return (
    <section className="w-[100%] min-w-screen mt-5 p-10 md:mt-[100px]">
      <div className="w-full flex flex-row justify-center align-middle mt-20 lg:mt-16">
        <div className="container flex flex-col lg:flex-row items-center justify-center gap-x-24">
          <div className="flex flex-1 flex-col mx-auto items-center justify-center lg:items-start">
            <h1 className="text-black font-bold text-4xl mb-5 text-center underline">
              Streamer Spotlight
            </h1>
            <div className="flex flex-row items-center space-x-4 p-4">
              <div>
                <img
                  src="/profile.jpg"
                  alt="Streamer"
                  className="w-20 h-20 rounded-full"
                />
              </div>
              <div className="flex flex-col w-full justify-center align-middle ">
                <p className="text-3xl font-semibold">KevinNguyen</p>
                <p className="flex justify-center items-center text-gray-700 text-xl text-center">
                  {/* Game Logo  */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32px"
                    height="32px"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mr-2">
                    <path
                      d="M7.99999 8.5C7.99999 7.94772 7.55227 7.5 6.99999 7.5C6.4477 7.5 5.99999 7.94772 5.99999 8.5V9H5.49999C4.9477 9 4.49999 9.44771 4.49999 10C4.49999 10.5523 4.9477 11 5.49999 11H5.99999V11.5C5.99999 12.0523 6.4477 12.5 6.99999 12.5C7.55227 12.5 7.99999 12.0523 7.99999 11.5V11H8.49999C9.05227 11 9.49999 10.5523 9.49999 10C9.49999 9.44771 9.05227 9 8.49999 9H7.99999V8.5Z"
                      fill="#0F1729"
                    />
                    <path
                      d="M18 8C18 8.55229 17.5523 9 17 9C16.4477 9 16 8.55229 16 8C16 7.44772 16.4477 7 17 7C17.5523 7 18 7.44772 18 8Z"
                      fill="#0F1729"
                    />
                    <path
                      d="M17 13C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11C16.4477 11 16 11.4477 16 12C16 12.5523 16.4477 13 17 13Z"
                      fill="#0F1729"
                    />
                    <path
                      d="M16 10C16 10.5523 15.5523 11 15 11C14.4477 11 14 10.5523 14 10C14 9.44771 14.4477 9 15 9C15.5523 9 16 9.44771 16 10Z"
                      fill="#0F1729"
                    />
                    <path
                      d="M19 11C19.5523 11 20 10.5523 20 10C20 9.44771 19.5523 9 19 9C18.4477 9 18 9.44771 18 10C18 10.5523 18.4477 11 19 11Z"
                      fill="#0F1729"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 3C10.1879 3 7.96237 3.25817 6.21782 3.5093C3.94305 3.83676 2.09096 5.51696 1.60993 7.7883C1.34074 9.05935 1.07694 10.5622 1.01649 11.8204C0.973146 12.7225 0.877981 13.9831 0.777155 15.1923C0.672256 16.4504 1.09148 17.7464 1.86079 18.6681C2.64583 19.6087 3.88915 20.2427 5.32365 19.8413C6.24214 19.5842 6.97608 18.9387 7.5205 18.3026C8.07701 17.6525 8.51992 16.9124 8.83535 16.3103C9.07821 15.8467 9.50933 15.5855 9.91539 15.5855H14.0846C14.4906 15.5855 14.9218 15.8467 15.1646 16.3103C15.4801 16.9124 15.923 17.6525 16.4795 18.3026C17.0239 18.9387 17.7578 19.5842 18.6763 19.8413C20.1108 20.2427 21.3541 19.6087 22.1392 18.6681C22.9085 17.7464 23.3277 16.4504 23.2228 15.1923C23.122 13.9831 23.0268 12.7225 22.9835 11.8204C22.923 10.5622 22.6592 9.05935 22.39 7.7883C21.909 5.51696 20.0569 3.83676 17.7821 3.5093C16.0376 3.25817 13.8121 3 12 3ZM6.50279 5.48889C8.22744 5.24063 10.3368 5 12 5C13.6632 5 15.7725 5.24063 17.4972 5.4889C18.965 5.70019 20.1311 6.77489 20.4334 8.20267C20.6967 9.44565 20.9332 10.8223 20.9858 11.9164C21.0309 12.856 21.1287 14.1463 21.2297 15.3585C21.2912 16.0956 21.0342 16.8708 20.6037 17.3866C20.1889 17.8836 19.7089 18.0534 19.2153 17.9153C18.8497 17.8129 18.4327 17.509 17.9989 17.0021C17.5771 16.5094 17.2144 15.9131 16.9362 15.3822C16.4043 14.3667 15.3482 13.5855 14.0846 13.5855H9.91539C8.65178 13.5855 7.59571 14.3667 7.06374 15.3822C6.78558 15.9131 6.42285 16.5094 6.00109 17.0021C5.56723 17.509 5.15027 17.8129 4.78463 17.9153C4.29109 18.0534 3.81102 17.8836 3.39625 17.3866C2.96576 16.8708 2.70878 16.0956 2.77024 15.3585C2.87131 14.1463 2.96904 12.856 3.01418 11.9164C3.06675 10.8223 3.30329 9.44565 3.56653 8.20267C3.86891 6.77489 5.03497 5.70019 6.50279 5.48889Z"
                      fill="#0F1729"
                    />
                  </svg>
                  FIFA 24
                </p>
                <p className="text-xl text-center text-gray-500">
                  1.2k viewing
                </p>
                <div className="flex flex-col space-y-1">
                  <div className="text-xs text-center rounded-xl bg-slate-400 text-white p-1.5">
                    Sports
                  </div>
                  <div className="text-xs text-center  rounded-xl bg-slate-400 text-white p-1.5">
                    FIFA
                  </div>
                </div>
              </div>
            </div>
            <p>
              {' '}
              Hi my name is Matt. I'm an avid sports follower, meaning sports
              game all day am i right? Kickoff the incoming football season as
              we play the newly releases FIFA 24{' '}
            </p>
            <div className="text-center mx-auto justify-center align-middle">
              <button className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg">
                Subscribe
              </button>
              <button className="bg-blue-500 hover:bg-blue-300 text-white px-4 py-2 rounded-lg">
                Follow
              </button>
            </div>
          </div>

          <div className="flex flex-1 justify-center z-10 mb-10 lg:mb-0">
            <img className="h-[480px] w-[720px] max-w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
