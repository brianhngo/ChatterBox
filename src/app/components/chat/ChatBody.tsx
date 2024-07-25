import React, { useEffect, useRef, useState } from 'react';
import { replaceShortcutsWithEmojis } from './ChatBodyUtility';

interface Message {
  username: string;
  message: string;
}

export default function ChatBody({ messages }: { messages: Message[] }) {
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const userIsScrolling = useRef(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current!;
    if (scrollHeight - scrollTop - clientHeight < 1) {
      setIsAutoScrollEnabled(true);
      userIsScrolling.current = false;
      setShowNotification(false);
    } else {
      setIsAutoScrollEnabled(false);
      userIsScrolling.current = true;
      setShowNotification(true);

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        userIsScrolling.current = false;
        setShowNotification(false);
      }, 1000); // Adjust the timeout as needed
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

  useEffect(() => {
    const chatContainer = chatContainerRef.current;

    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className=" h-full max-h-full">
      {showNotification && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-200 text-yellow-800 text-center p-2 z-20">
          Chat is paused. Scroll to the bottom to resume auto-scroll.
        </div>
      )}
      <div
        ref={chatContainerRef}
        className="chat-body bg-gray-200 p-3 rounded-lg h-full max-h-full overflow-y-auto shadow-md">
        {messages.map((element, index) => (
          <p className="text-sm font-medium text-gray-600 p-2" key={index}>
            <span className="font-bold">{element.username}</span>:{' '}
            {replaceShortcutsWithEmojis(element.message)}
          </p>
        ))}
      </div>
    </div>
  );
}
