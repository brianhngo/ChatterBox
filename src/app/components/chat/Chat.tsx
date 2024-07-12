import React from 'react';
import Header from './Header';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import Footer from './Footer';

export default function Chat() {
  return (
    <div className="border border-black 2xl:w-[25vw] w-[45vw] 2xl:h-[50vh] h-[80vh] mx-auto flex flex-col justify-center items-center">
      {/* Header Section */}
      <header className=" p-2 w-full border-b border-black border-opacity-100">
        <Header />
      </header>

      {/* Chat messages */}
      <section className="overflow-y-auto p-4 w-full ">
        <ChatBody />
      </section>

      {/* Input for chat */}
      <section className="p-4 w-full border-b border-t border-black border-opacity-100">
        <ChatInput />
      </section>

      {/* Footer at the bottom */}
      <footer className=" p-2 w-full">
        <Footer />
      </footer>
    </div>
  );
}
