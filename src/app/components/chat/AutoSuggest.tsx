import React from 'react';

export default function AutoSuggest({ display }: { display: string[] }) {
  return (
    <div className="relative mb-3">
      {display.length > 0 ? (
        <div className="absolute text-gray-800 w-full bottom-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {display.map((element, index) => (
            <div
              key={index}
              className="p-2 text-gray-800 hover:bg-gray-100 z-10">
              {element}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
