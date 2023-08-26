import React from "react";
import useAutoFocus from "@/components/hooks/useAutoFocus";

export type Props = {
  value: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
};

export const SearchBar = ({
  value,
  handleSearch,
  handleClearSearch,
}: Props) => {
  const champSearch = useAutoFocus();

  return (
    <div className="container w-full max-w-4xl">
      <div className="form-control relative w-full max-w-xs">
        <label className="label" htmlFor="champSearch">
          <span className="label-text text-gray-400">
            Who is your pick for this game?
          </span>
        </label>
        <input
          type="text"
          id="champSearch"
          placeholder="Search for a champion"
          ref={champSearch}
          onChange={handleSearch}
          value={value}
          className="input input-bordered w-full max-w-xs bg-gray-900 text-gray-400 focus:border-gray-400 focus:ring-0"
        />
        {value && (
          <button
            className="btn btn-circle btn-xs absolute right-2 top-[58%] bg-gray-400 text-gray-900 hover:bg-gray-700 hover:text-gray-400"
            onClick={handleClearSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M2.293 2.293a1 1 0 011.414 0L10 8.586l6.293-6.293a1 1 0 111.414 1.414L11.414 10l6.293 6.293a1 1 0 11-1.414 1.414L10 11.414l-6.293 6.293a1 1 0 01-1.414-1.414L8.586 10 2.293 3.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
