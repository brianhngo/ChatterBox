import React, { useEffect, useRef, useState } from 'react';
// Import the renderMessageWithEmojis function
import { replaceShortcutsWithEmojis } from './ChatBodyUtility';

interface Message {
  username: string;
  message: string;
}

export default function ChatBody({ messages }) {
  // AutoScroll, when user isn't scrolled. if scrolled change to F
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const chatContainerRef = useRef(null); // We are using to reference size
  const userIsScrolling = useRef(false); // By Default user is in autoscroll mode. when scrollings, change to true
  const timeoutId = useRef(null); // set a timeout if too long scrolled

  // calculates whether or not if we scrolled
  // we are going to calculate the height of our container and subtract it
  // if its equal to the initial clientHeight then we know they are at the bottom.
  // if its not equal then the user scrolled
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 1) {
      //  Have not scrolled (at bottom)
      setIsAutoScrollEnabled(true);
      userIsScrolling.current = false;
    } else {
      // Scrolled
      setIsAutoScrollEnabled(false);
      userIsScrolling.current = true;
    }
  };

  const scrollToBottom = () => {
    if (isAutoScrollEnabled && chatContainerRef.current) {
      chatContainerRef.current.scroll({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // mounts the container to DOM
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const onScroll = () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      handleScroll();
      timeoutId.current = setTimeout(() => {
        userIsScrolling.current = false;
      }, 1000); // Adjust the timeout as needed
    };

    if (chatContainer) {
      chatContainer.addEventListener('scroll', onScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', onScroll);
      }
    };
  }, []);

  // anytime messages is added, we get sent back to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="chat-body bg-gray-200 p-3 rounded-lg h-full  overflow-y-auto shadow-md">
      {messages.map((element, index) => (
        <p className="text-sm font-medium text-gray-600 p-2" key={index}>
          <span className="font-bold">{element.username}</span>:{' '}
          {replaceShortcutsWithEmojis(element.message)}
        </p>
      ))}
    </div>
  );
}
