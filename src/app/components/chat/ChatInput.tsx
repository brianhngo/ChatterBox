'use client';
import React, { useState, useRef, useEffect } from 'react';
import { chatTrie, Trie } from './ChatInputUtility';
import AutoSuggest from './AutoSuggest';
import Footer from './Footer';
import { messages } from './ChatBodyUtility';
import io from 'socket.io-client';

export default function ChatInput({
  inputValue,
  setInputValue,

  addMessage,
}) {
  // This will contain the chats input
  // const [inputValue, setInputValue] = useState<string>(''); // user input
  const [chatTrieState, setChatTrieState] = useState<Trie | null>(null); // storing trie Data
  const [display, setDisplay] = useState<string[]>([]); // suggested display
  const [isFocused, setIsFocused] = useState(true); // T/F on when user clicks out of input box. (True => suggested appear, False => suggested disappears , user clicks off Input)

  const [socket, setSocket] = useState(null);

  const socketRef = useRef(null);

  // handles input changes
  const inputValueHandler = (event: any) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (event.target.value.length > 0) {
      filter(newValue);
    } else {
      setDisplay([]);
    }
  };

  const submitHandler = (newMessage: string) => {
    addMessage(inputValue);
    // if (inputValue){
    //   socket.emit('chat message', inputValue);
    // }
    setInputValue('');
  };

  const filter = (word: string) => {
    const lowerCaseWord = word.toLocaleLowerCase();
    const array = chatTrie.search(lowerCaseWord);
    setDisplay(array);
  };

  // When user clicks on suggested, it will be added to input
  const onClickHandler = (word: string) => {
    setInputValue(word + ' ');
    console.log(inputValue);
    setDisplay([]);
  };

  // Handles when the user is focused on the input chat
  const handleInputFocus = () => {
    setIsFocused(true);
  };

  // Handles cases where the user clicks outside of input text and suggestions is still up. Turns of suggested
  const handleInputBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.classList.contains('suggestion-box')) {
        setIsFocused(false);
      }
    }, 300);
  };

  // sets the fake data as a state
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
        <div className="flex p-2 flex-row  w-full justify-between items-center mx-auto my-auto rounded-lg  border-2 border-gray-700  focus-within:border-purple-500">
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
              viewBox="0 0 512 512">
              <path
                fill="#000000"
                d="M122.7 23.32l1.7 21.87-16.7 14.25 21.4 5.17 8.4 20.25L149 66.18l21.8-1.75-14.2-16.71 5.1-21.32-20.3 8.35-18.7-11.43zM464 32a16 16 0 0 0-16 16 16 16 0 0 0 16 16 16 16 0 0 0 16-16 16 16 0 0 0-16-16zM239.8 42.5a16 16 0 0 0-16 16 16 16 0 0 0 16 16 16 16 0 0 0 16-16 16 16 0 0 0-16-16zm183.9 6.84c-9.2 1.74-17.7 7.18-25.9 14.28-7.6 6.53-14.7 14.66-20.7 23.45-18.8 3.01-37.6 10.67-50.2 21.13-16.1 13.2-30.4 35.8-38.2 59.1-7.4 3.1-14.4 6.8-20.1 10.8-15.5 10.9-23.5 31.8-29.4 50-5.9 18.3-8.8 34.3-8.8 34.3l17.8 3.2s2.7-15 8.1-31.9c5.5-16.9 14.8-35.3 22.7-40.8 1.3-.9 3-1.9 4.5-2.8-.6 5.7-.6 11.4.3 16.8 1.8 11.4 8 22.3 19 28.2 7.8 4.2 16.6 3.2 24 .2 7.4-3.1 14-8.2 19.7-14.2 5.7-6 10.4-13.1 13.2-20.6 2.8-7.5 3.8-16 .2-23.9h-.1c-3.9-8.4-11.4-13.8-19.4-16.1-8-2.3-16.6-2.2-25.2-.9-1.5.2-2.9.7-4.4 1 7.4-15.8 18-30.7 27.5-38.6 6.2-5.1 16.6-10 27.7-13.6-1.4 3.8-2.5 7.6-3 11.5-1.6 10.5.7 21.9 9.1 29.7 6.1 5.6 14.3 6.5 21.5 5.3 7.1-1.2 14-4.4 20.2-8.5 6.2-4.2 11.7-9.4 15.6-15.5 3.9-6.1 6.5-13.9 4-21.7v-.1c-3.3-10.07-11.5-16.99-20.6-20.27-3.9-1.4-8-2.19-12.2-2.66 2.9-3.26 5.9-6.31 8.9-8.92 6.8-5.84 13.7-9.5 17.6-10.23l-3.4-17.68zM174.8 84.39l-15.2 9.56 34.5 55.25-56.4 2.9 26.5 57.8 16.4-7.6-15.5-33.6 60.6-3.1-50.9-81.21zm216.4 19.31c6.1-.1 11.5.6 15.5 2.1 5.4 1.9 8.1 4.3 9.5 8.8.4 1.1.2 3.3-1.9 6.6-2.2 3.4-6.1 7.2-10.5 10.2-4.5 3-9.5 5.1-13.2 5.7-3.8.7-5.5 0-6.3-.7-3.5-3.2-4.5-7.2-3.5-13.9.8-5.4 3.3-11.9 7-18.6 1.2 0 2.3-.2 3.4-.2zM94.99 123a16 16 0 0 0-16 16 16 16 0 0 0 16 16A16 16 0 0 0 111 139a16 16 0 0 0-16.01-16zm356.11 37.2l-14.4 16.6-21.8-1.8 11.4 18.8-8.5 20.2 21.4-5 16.6 14.3 1.9-21.9 18.7-11.4-20.2-8.5-5.1-21.3zm-123.5 16.5c2.9.1 5.6.5 7.7 1.1 4.3 1.2 6.6 3 8.2 6.4.9 1.9 1 5.4-.7 10-1.7 4.7-5.2 10.1-9.4 14.6s-9.3 8.1-13.5 9.8c-4.2 1.7-6.8 1.6-8.5.7h-.1c-5.8-3.2-8.6-7.8-9.7-15.2-1-6.3-.3-14.3 1.8-22.9 4.9-1.7 9.8-3.1 14.5-3.8 3.5-.5 6.7-.7 9.7-.7zm-202.4 51.9c-7.2-.2-11.7 1.5-14.5 4.3-2.8 2.8-4.5 7.3-4.3 14.5.2 7.3 2.6 16.9 7.2 27.6 9.2 21.5 27.3 47.4 51.6 71.8 24.3 24.3 50.3 42.3 71.8 51.5 10.6 4.6 20.2 7 27.5 7.2 7.3.3 11.7-1.5 14.5-4.3 2.8-2.8 4.6-7.2 4.3-14.5-.2-7.3-2.6-16.9-7.2-27.6-9.2-21.4-27.2-47.4-51.5-71.7-24.3-24.4-50.3-42.4-71.8-51.6-10.7-4.6-20.3-7-27.6-7.2zm232 31.3l-33 54-29.1-27.9-12.4 13 45.1 43.3 33.8-55.2 38.7 32.3 89.3-38.2-7-16.6-79.3 34-46.1-38.7zM93.43 272.6l-17.64 57.9c41.41 49.1 89.71 76.7 142.11 94.7l21.6-6.6c-3.1-1.1-6.4-2.4-9.7-3.8-24.4-10.4-51.7-29.6-77.3-55.3-25.7-25.7-44.9-53-55.34-77.4-1.41-3.2-2.65-6.4-3.73-9.5zm-23.82 78.2l-14.01 46c28.89 27 59 39.2 90.6 50.2l43.4-13.2c-43.2-17.6-84-43.3-119.99-83zM368 352a16 16 0 0 0-16 16 16 16 0 0 0 16 16 16 16 0 0 0 16-16 16 16 0 0 0-16-16zM49.81 415.9l-20.29 66.6 88.28-26.9c-22.77-9.1-45.78-20.7-67.99-39.7z"
              />
            </svg>
            <svg
              className="hover:bg-gray-300 rounded-lg cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="32px"
              height="32px"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M9 14C9.18131 14.4723 9.47841 14.8915 9.864 15.219C11.0903 16.2483 12.8748 16.2613 14.116 15.25C14.5069 14.9283 14.8109 14.5136 15 14.044"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C13.8565 5 15.637 5.7375 16.9497 7.05025C18.2625 8.36301 19 10.1435 19 12Z"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11V10"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 11V10"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
