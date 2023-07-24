import React from "react";

export const TableHead = () => {
  return (
    <thead className="sticky top-0 z-10  bg-gray-700 bg-gray-700  text-xs uppercase text-gray-200 text-gray-200">
      <tr>
        <th scope="col" className="w-1/3 px-4 py-3">
          Champion
        </th>
        <th scope="col" className="w-[100px] px-4 py-3">
          Win %
        </th>
        <th scope="col" className="w-[100px] px-1 py-3">
          Dmg dealt
        </th>
        <th scope="col" className="w-[100px] px-1 py-3">
          Dmg received
        </th>
        <th scope="col" className="w-1/3 px-4 py-3">
          Other effects
        </th>
      </tr>
    </thead>
  );
};
