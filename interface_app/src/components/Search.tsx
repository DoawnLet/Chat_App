"use client";

import { useState } from "react";

const TaskSearch = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative max-w-md mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <form className="relative">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>

        {/* Container with smooth width transition - Thu nhỏ */}
        <div
          className={`relative transition-all duration-300 ease-in-out ${
            isHovered ? "w-full" : "w-9"
          }`}
        >
          {/* Search icon - Thu nhỏ icon */}
          <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none z-10">
            <svg
              className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          {/* Input field - Thu nhỏ height */}
          <input
            type="search"
            id="default-search"
            className={`block h-9 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-300 ease-in-out ${
              isHovered
                ? "w-full pl-8 pr-20 opacity-100"
                : "w-9 pl-8 pr-2 opacity-0 cursor-pointer"
            }`}
            placeholder="Search..."
            required
          />

          {/* Search button - Thu nhỏ */}
          <button
            type="submit"
            className={`text-white absolute end-1.5 top-1/2 -translate-y-1/2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300 ease-in-out ${
              isHovered
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            Search
          </button>
        </div>

        {/* Collapsed state - Thu nhỏ clickable area */}
        {!isHovered && (
          <div
            className="absolute inset-0 w-9 h-9 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
            onClick={() => setIsHovered(true)}
          >
            <svg
              className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        )}
      </form>
    </div>
  );
};

export default TaskSearch;
