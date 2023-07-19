import React from "react";
// create a type that takes in the props a value and handlesearch function
type Props = {
  value: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const SearchBar = ({ value, handleSearch }: Props) => {
  return (
    <div className="container mb-2 w-full max-w-4xl ">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Who are we picking this game?</span>
        </label>
        <input
          type="text"
          placeholder="Search for a champion"
          onChange={handleSearch}
          value={value}
          className="input input-bordered w-full max-w-xs dark:bg-gray-900"
        />
      </div>
    </div>
  );
};
