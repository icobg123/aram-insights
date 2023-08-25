import React from "react";

export const TableHead = () => {
  return (
    <thead className="sticky top-0 z-10 bg-gray-700 text-xs uppercase text-gray-200">
      <tr>
        <th scope="col" className="w-1/4 px-4 py-3 md:w-1/3">
          Champion
        </th>
        <th scope="col" className="w-auto px-4 py-3 md:w-[100px]">
          Win %
        </th>
        <th scope="col" className="w-auto px-1 py-3 md:w-[100px]">
          Dmg dealt
        </th>
        <th scope="col" className="w-auto px-1 py-3 md:w-[100px]">
          Dmg received
        </th>
        <th scope="col" className="w-1/4 px-4 py-3 md:w-1/3">
          Other effects
        </th>
      </tr>
    </thead>
  );
};
