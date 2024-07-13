import React from 'react';

// Responsible for the AutoSuggest when user types / , @ , :
export default function AutoSuggest({
  display,
  indicator,
  onClickHandler,
  isFocused,
}: {
  display: [string, string][];
  indicator: string;
  onClickHandler: (word: string) => void;
  isFocused: boolean;
}) {
  return isFocused === true ? (
    <div className="relative mb-3">
      {display.length > 0 && (
        <div className="absolute text-gray-800 w-full bottom-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {display.map((element, index) => (
            <div
              className={`${
                indicator === ':'
                  ? 'flex flex-row gap-1'
                  : 'flex flex-col gap-1'
              } hover:bg-gray-100 text-gray-800 z-10 p-2`}
              key={index}
              onClick={() => onClickHandler(element[0])}>
              {indicator === ':' && element[1] ? (
                <img
                  className="w-[32px] h-[32px]"
                  src={element[1]}
                  alt="suggestion"
                />
              ) : null}

              <div>{element[0]}</div>

              {indicator === '/' && element[1] ? (
                <p className="text-sm">{element[1]}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null;
}
