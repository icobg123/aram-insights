import React from "react";
import useAutoFocus from "@/components/hooks/useAutoFocus";
// create a type that takes in the props a value and handlesearch function
type Props = {
  value: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export const SearchBar = ({ value, handleSearch }: Props) => {
  const champSearch = useAutoFocus();

  return (
    <div className="container  w-full max-w-4xl ">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Who is your pick for this game?</span>
        </label>
        <input
          type="text"
          placeholder="Search for a champion"
          ref={champSearch}
          onChange={handleSearch}
          value={value}
          className="input input-bordered w-full max-w-xs dark:bg-gray-900"
        />
      </div>
    </div>
  );
};
