import React from "react";

export type Props = {
  children?: React.ReactNode;
};

export const SearchBar = ({ children }: Props) => {
  return (
    <div className="container w-full max-w-4xl">
      <div className="form-control relative w-full max-w-xs">
        <label className="label" htmlFor="champSearch">
          <span className="label-text text-gray-400">
            Who is your pick for this game?
          </span>
        </label>
        {children}
      </div>
    </div>
  );
};
