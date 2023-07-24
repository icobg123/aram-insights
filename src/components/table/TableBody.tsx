import React from "react";
import { TableProps } from "@/components/table/Table";
import { NoChampionsFoundRow } from "@/components/table/NoChampionsFoundRow";
import TableRow from "@/components/table/TableRow";

export const TableBody: React.FC<TableProps> = ({
  champNames,
  searchQuery,
  icons,
  winRates,
  scrappedData,
}) => {
  return (
    <tbody className=" w-full min-w-full overflow-y-scroll">
      {champNames.length === 0 && searchQuery !== "" ? (
        <NoChampionsFoundRow />
      ) : (
        champNames.map((champion, index) => {
          const isOdd = index % 2 === 0;
          const bgColor = isOdd ? "bg-gray-900 " : "bg-gray-800 ";

          return (
            <TableRow
              key={index}
              icons={icons}
              scrappedData={scrappedData}
              winRates={winRates}
              champion={champion}
              bgColor={bgColor}
            />
          );
        })
      )}
    </tbody>
  );
};
