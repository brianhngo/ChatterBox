'use client';
import React, { useState, useRef, useEffect } from 'react';
import { chatTrie, Trie } from './ChatInputUtility';
import AutoSuggest from './AutoSuggest';
import Footer from './Footer';
import { messages } from './ChatBodyUtility';
import io from 'socket.io-client';
import { replaceShortcutsWithEmojisInput } from './ChatBodyUtility';

export default function ChatInput({ inputValue, setInputValue, addMessage }) {
  const [chatTrieState, setChatTrieState] = useState<Trie | null>(null);
  const [display, setDisplay] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(true);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  // Handles input changes
  const inputValueHandler = (event: any) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (newValue.length > 0) {
      filter(newValue);
    } else {
      setDisplay([]);
    }
  };

  const submitHandler = (newMessage: string) => {
    addMessage(inputValue);
    setInputValue('');
  };

  const filter = (word: string) => {
    const lowerCaseWord = word.toLowerCase();
    const array = chatTrie.search(lowerCaseWord);
    setDisplay(array);
  };

  // When user clicks on suggested, it will be added to input
  const onClickHandler = (word: string) => {
    setInputValue(word + ' ');
    setDisplay([]);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.classList.contains('suggestion-box')) {
        setIsFocused(false);
      }
    }, 300);
  };

  useEffect(() => {
    setChatTrieState(chatTrie);
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <div>
          <AutoSuggest
            display={display}
            indicator={inputValue.length > 0 ? inputValue[0] : ''}
            onClickHandler={onClickHandler}
            isFocused={isFocused}
          />
        </div>
        <div className="flex p-2 flex-row w-full justify-between items-center mx-auto my-auto rounded-lg border-2 border-gray-700 focus-within:border-purple-500">
          {/* Editable div for additional content */}
          <div
            className="content-editable p-2 border border-gray-300 rounded-lg"
            contentEditable
            role="textbox"
            aria-multiline="true"
            // Handle any input changes if necessary
            onInput={(e) =>
              console.log('Content changed', e.currentTarget.textContent)
            }>
            {/* You can display any additional content here */}
          </div>

          {/* Left Side will contain Star & Input */}
          <div className="flex items-center flex-grow mr-1">
            <svg
              className="hover:bg-gray-300 rounded-lg cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <textarea
              value={inputValue}
              onChange={inputValueHandler}
              className="pl-2 outline-none text-black flex-grow pr-2"
              style={{ resize: 'none' }}
              rows={2}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}></textarea>
          </div>

          {/* Right side contains Cheers & Emoji */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => submitHandler(inputValue)}
              className="bg-purple-600 text-white rounded-md px-4 py-2 hover:bg-purple-700 focus:outline-none">
              Chat
            </button>
            <svg
              className="hover:bg-gray-300 rounded-lg cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M12 2C6.486 2 2 6.486 2 12c0 3.562 1.532 6.731 4.057 8.932l-1.92 2.21a.6.6 0 00.95.75l2.487-1.918A10.933 10.933 0 0012 22c5.514 0 10-4.486 10-10s-4.486-10-10-10zm-.44 10.564a.8.8 0 00-1.12.488L8.52 13.72a.8.8 0 001.12 1.12l2.4-2.4a.8.8 0 00.488-1.12l-2.4-2.4a.8.8 0 00-1.12.488l-.48.96-.48-.96a.8.8 0 00-1.12-.488l-2.4 2.4a.8.8 0 00-.488 1.12l2.4 2.4a.8.8 0 001.12-.488l.48-.96.48.96a.8.8 0 001.12.488l2.4-2.4z"
                fill="#000000"
              />
            </svg>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
