import React from 'react';

export default function CategoriesBanner() {
  return (
    <section className="w-screen h-[50%] p-10">
      <h1 className="text-black text-6xl font-bold text-center pb-10">
        Why youll love QuickCrave
      </h1>

      <div className="flex flex-row gap-10 justify-center align-middle">
        <div className="flex flex-col gap-2 justify-center align-middle w-[450px]">
          <img className="w-[350px] h-[350px] mx-auto" />
          <h2 className="text-black font-bold text-3xl text-center">
            Something for everyone
          </h2>
          <p className="text-light text-gray-700 text-xl text-center text-wrap">
            We have a variety of meals to suit everyones taste and more.
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center align-middle w-[450px]">
          <img className="w-[350px] h-[350px] mx-auto" />
          <h2 className="text-black font-bold text-3xl text-center">
            Delivery
          </h2>
          <p className="text-light text-gray-700 text-xl text-center text-wrap">
            Sit back and relax, and have us deliver to you
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center align-middle w-[450px]">
          <img className="w-[350px] h-[350px] mx-auto" />
          <h2 className="text-black font-bold text-3xl text-center">
            Order Takeout
          </h2>
          <p className="text-light text-gray-700 text-xl text-center text-wrap">
            Skip the line with easy pickup.
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-center align-middle w-[450px]">
          <img className="w-[350px] h-[350px] mx-auto" />
          <h2 className="text-black pt-[20px] font-bold text-3xl text-center">
            Earn during your free time
          </h2>
          <p className="text-light text-gray-700 text-xl text-center text-wrap">
            Join as a driver, set your own schedule, and work on your terms.
          </p>
        </div>
      </div>
    </section>
  );
}
