import Image from "next/legacy/image";
import React from "react";
import noResultsPoro from "@/public/no-results.svg";

export const NoChampionsFoundRow = () => {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex w-full items-center justify-center space-x-2 bg-gray-900 text-sm text-gray-400">
          <span>No champions found!</span>
          <div className="">
            <Image
              src={noResultsPoro}
              width={64}
              height={64}
              alt="A sad poro"
              title="An alert poro"
            />
          </div>
        </div>
      </td>
    </tr>
  );
};
