'use client';
import React, { useEffect } from 'react';

import { messages } from '../ChatBodyUtility';

export default function ChatBody({ messages }) {
  useEffect(() => {}, [messages]);
  return (
    <div className="bg-gray-200 p-3 rounded-lg shadow-md">
      {messages.map((element, index) => (
        <p className="text-sm font-medium text-gray-600 p-2" key={index}>
          <span className="font-bold">{element.username}</span>:{' '}
          {element.message}
        </p>
      ))}
    </div>
  );
}
