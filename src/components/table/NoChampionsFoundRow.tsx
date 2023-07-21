import Image from "next/legacy/image";
import React from "react";

export const NoChampionsFoundRow = () => {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex w-full items-center justify-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <span>No champions found!</span>
          <div className="">
            <Image
              src="/no-results.png"
              width={64}
              height={64}
              alt="A sad poro"
            />
          </div>
        </div>
      </td>
    </tr>
  );
};
