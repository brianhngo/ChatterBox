import React, { useEffect } from 'react';
// Import the renderMessageWithEmojis function
import { renderMessageWithEmojis } from './ChatBodyUtility';

export default function ChatBody({ messages }) {
  useEffect(() => {
    // You can add logic here if needed to handle changes when messages update
  }, [messages]);

  return (
    <div className="bg-gray-200 p-3 rounded-lg shadow-md">
      {messages.map((element, index) => (
        <p className="text-sm font-medium text-gray-600 p-2" key={index}>
          <span className="font-bold">{element.username}</span>:{' '}
          {renderMessageWithEmojis(element.message)}
        </p>
      ))}
    </div>
  );
}
