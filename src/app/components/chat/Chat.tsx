'use client';

import React, { useState } from 'react';
import Header from './Header';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import Footer from './Footer';
import Link from 'next/link';

interface Message {
  username: string;
  message: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState<string>('');

  const addMessage = (newMessage: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { username: 'user1', message: newMessage },
    ]);
  };

  return (
    <div className="border border-black 2xl:w-[40vw] w-[55vw] 2xl:h-[100%] h-full mx-auto flex flex-col justify-none items-center">
      {/* Header Section */}
      <header className=" p-2 w-full border-b border-black border-opacity-100">
        <Header />
      </header>

      {/* Chat messages */}
      <section className="overflow-y-auto p-4 h-full w-full">
        <ChatBody messages={messages} />
      </section>

      {/* Input for chat */}
      <section className="p-4 w-full border-b border-t border-black border-opacity-100">
        <ChatInput
          addMessage={addMessage}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </section>

      <footer className="p-2  w-full">
        <Footer />
      </footer>
    </div>
  );
}
