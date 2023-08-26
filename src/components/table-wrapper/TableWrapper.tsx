"use client";
import React, { useState } from "react";
import { AbilityChangesScrapped, ChampionDataScrapped } from "@/app/page";
import Image from "next/legacy/image";
import { Table } from "@/components/table/Table";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";
import peekingPoro from "../../../public/peeking-poro.svg";
import { TableBody } from "@/components/table/TableBody";
import { NoChampionsFoundRow } from "@/components/table/NoChampionsFoundRow";
import TableRow from "@/components/table/TableRow";
import { SearchBar } from "@/components/table-wrapper/SearchBar";

export interface APIData {
  [champion: string]: {
    champion: string;
    damageDealt: string;
    damageReceived: string;
    generalChanges: string[];
    abilityChanges: AbilityChangesScrapped[];
    winRate: string;
    icon?: string;
    title?: string;
    spells?: { [spellName: string]: string };
  };
}

export interface TableWrapperProps {
  scrappedData: ChampionDataScrapped;
  version: string;
  apiData: APIData;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
  scrappedData,
  apiData,
  version,
}) => {
  const [champNames, setChampNames] = useState<string[]>(Object.keys(apiData));
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>("championName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedNames = (
    sorted: string[],
    column: string,
    isDifferentColumn: boolean
  ) => {
    return sorted.slice().sort((a, b) => {
      if (column === "winRate") {
        const championA = apiData[a].winRate;
        const championB = apiData[a].winRate;
        const winRateA = parseFloat(championA);
        const winRateB = parseFloat(championB);
        return isDifferentColumn
          ? winRateA - winRateB
          : sortOrder === "asc"
          ? winRateA - winRateB
          : winRateB - winRateA;
      } else if (column === "damageDealt") {
        const damageDealtA = parseFloat(scrappedData[a]?.damageDealt) || 0;
        const damageDealtB = parseFloat(scrappedData[b]?.damageDealt) || 0;
        return isDifferentColumn
          ? damageDealtA - damageDealtB
          : sortOrder === "asc"
          ? damageDealtA - damageDealtB
          : damageDealtB - damageDealtA;
      } else if (column === "damageReceived") {
        const damageReceivedA =
          parseFloat(scrappedData[a]?.damageReceived) || 0;
        const damageReceivedB =
          parseFloat(scrappedData[b]?.damageReceived) || 0;
        return isDifferentColumn
          ? damageReceivedA - damageReceivedB
          : sortOrder === "asc"
          ? damageReceivedA - damageReceivedB
          : damageReceivedB - damageReceivedA;
      } else {
        // Sort by "Champion Name" by default
        return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
      }
    });
  };
  const handleSort = (column?: string) => {
    const newSortOrder =
      column === sortColumn ? (sortOrder === "asc" ? "desc" : "asc") : "asc";

    const sorted = [
      ...sortedNames(
        [...champNames],
        column || "championName",
        column !== sortColumn
      ), // Pass the correct boolean value here
    ];
    setSortColumn(column || "championName");
    setChampNames(sorted);
    setSortOrder(newSortOrder);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length === 0) {
      const sorted = [
        ...sortedNames(
          [...Object.keys(apiData)],
          sortColumn || "championName",
          true
        ),
      ];
      setChampNames(sorted);
    } else if (value.length >= 2) {
      const filteredNames = Object.keys(apiData).filter((champName) =>
        champName.toLowerCase().includes(event.target.value.toLowerCase())
      );
      const sorted = [
        ...sortedNames([...filteredNames], sortColumn || "championName", true),
      ];
      setChampNames(sorted);
    }
    setLoading(false);
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    setChampNames(Object.keys(apiData));
  };

  return (
    <div className="container max-w-4xl p-1">
      <div className="relative min-h-[567px] w-full rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg ">
        <div className="absolute -right-4 top-[-131px]">
          <Image
            className=""
            width={212}
            height={215}
            src={peekingPoro}
            alt="A poro table background"
            title="A poro peeking behind the table"
            placeholder="blur"
            blurDataURL="/transperant-placeholder.png"
          />
        </div>
        {scrappedData && Object.keys(scrappedData).length > 0 ? (
          <>
            <TableWrapperHeader version={version}>
              <SearchBar
                handleSearch={handleSearch}
                value={searchQuery}
                handleClearSearch={handleClearSearch}
              />
            </TableWrapperHeader>

            <div className="max-h-[443px] w-full overflow-auto rounded-lg shadow-md ">
              {!loading ? (
                <Table>
                  <TableBody>
                    {champNames.length === 0 && searchQuery !== "" ? (
                      <NoChampionsFoundRow />
                    ) : (
                      champNames.map((champion, index) => {
                        const isOdd = index % 2 === 0;
                        const bgColor = isOdd ? "bg-gray-900 " : "bg-gray-800 ";

                        return (
                          <TableRow
                            key={index}
                            apiData={apiData}
                            scrappedData={scrappedData}
                            champion={champion}
                            bgColor={bgColor}
                          />
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="container flex w-full max-w-4xl items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-info"></span>
                </div>
              )}
            </div>
          </>
        ) : (
          <span className="loading loading-spinner loading-lg text-info"></span>
        )}
      </div>
    </div>
  );
};
