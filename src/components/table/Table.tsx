import { TableHead } from "@/components/table/TableHead";
import { TableBody } from "@/components/table/TableBody";
import React from "react";
import { IconData } from "@/components/table-wrapper/TableWrapper";
import { ChampionDataScrapped } from "@/app/page";

export interface TableProps {
  champNames: string[];
  searchQuery: string;
  icons: IconData;
  winRates: { [key: string]: string };
  scrappedData: ChampionDataScrapped;
}

export const Table = ({
  champNames,
  icons,
  winRates,
  searchQuery,
  scrappedData,
}: TableProps) => {
  return (
    <table className="h-full w-full table-fixed bg-gray-900 bg-gray-900 text-left  text-sm text-gray-400 text-gray-500">
      <TableHead />

      <TableBody
        champNames={champNames}
        searchQuery={searchQuery}
        icons={icons}
        winRates={winRates}
        scrappedData={scrappedData}
      />
    </table>
  );
};
