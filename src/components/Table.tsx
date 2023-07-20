"use client";
import React, { useState } from "react";
import { AbilityChanges } from "@/components/AbilityChanges";
import { SearchBar } from "@/components/SearchBar";
import { ChampionDataScrapped } from "@/app/page";
import Image from "next/image";

interface TableProps {
  scrappedData: ChampionDataScrapped;
  winRates: { [key: string]: string };
  version: string;
  icons: {
    [key: string]: {
      icon?: string;
      title?: string;
      spells?: { [spellName: string]: string };
    };
  };
}

export const Table: React.FC<TableProps> = ({
  scrappedData,
  icons,
  version,
  winRates,
}) => {
  const [champNames, setChampNames] = useState<string[]>(Object.keys(icons));
  const [searchQuery, setSearchQuery] = useState("");

  const searchedChampsLen = champNames.length;
  const scrappedChampsLen = Object.keys(scrappedData).length;
  const tBodyHeight = searchedChampsLen === 1 ? "" : "h-[440px]";
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length === 0) {
      return setChampNames(Object.keys(icons));
    }
    if (value.length < 3) {
      return;
    }

    setChampNames(
      Object.keys(icons).filter((champName) =>
        champName.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };
  const flexStyles = scrappedChampsLen > 0 ? "" : "flex items-center";
  return scrappedChampsLen > 0 ? (
    <div
      className={`flex min-h-[567px] w-[928px] flex-col bg-gray-950 px-1 pb-4 pt-3 shadow-lg sm:rounded-lg`}
    >
      <div className="w-4xl container max-w-4xl  ">
        <div className="mb-3 flex items-center justify-between">
          <SearchBar handleSearch={handleSearch} value={searchQuery} />

          <div className="tooltip self-end" data-tip="Leage of Legends version">
            <div className="badge">v{version}</div>
          </div>
        </div>
      </div>
      <div className="w-4xl container flex max-h-[443px] max-w-4xl flex-grow overflow-auto shadow-md sm:rounded-lg">
        {searchedChampsLen === 0 && searchQuery !== "" ? (
          <div
            className={`flex w-full items-center justify-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400`}
          >
            No champions found
          </div>
        ) : (
          <table className="w-full table-fixed text-left text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="w-1/3 px-4 py-3">
                  Champion
                </th>
                <th scope="col" className="w-[100px] px-4 py-3">
                  Win %
                </th>
                <th scope="col" className="w-[100px] px-4 py-3">
                  Damage dealt
                </th>
                <th scope="col" className="w-[100px] px-4 py-3">
                  Damage received
                </th>
                <th scope="col" className="w-1/3 px-4 py-3">
                  Other effects
                </th>
              </tr>
            </thead>

            <tbody className={` w-full min-w-full overflow-y-scroll`}>
              {champNames &&
                scrappedData &&
                champNames.map((champion, index) => {
                  const isOdd = index % 2 === 0;
                  const bgColor = isOdd
                    ? "dark:bg-gray-900"
                    : "dark:bg-gray-700";
                  return (
                    <tr
                      key={index}
                      className={`border-b bg-white ${bgColor}  dark:border-gray-700`}
                    >
                      <th
                        scope="row"
                        className=" whitespace-nowrap px-4 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="w-24 rounded-full">
                              <Image
                                width={96}
                                height={96}
                                src={icons[champion].icon || ""}
                                alt={champion}
                                title={champion}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{champion}</div>
                            <div className="text-sm opacity-50">
                              {icons[champion]?.title}
                            </div>
                          </div>
                        </div>
                      </th>
                      <td className=" px-4 py-4 ">{winRates[champion]}</td>
                      <td className=" px-4 py-4  text-center">
                        {champion in scrappedData
                          ? scrappedData[champion]?.damageDealt
                          : "0%"}
                      </td>
                      <td className=" px-4 py-4  text-center">
                        {champion in scrappedData
                          ? scrappedData[champion]?.damageReceived
                          : "0%"}
                      </td>
                      <td className=" px-4 py-4 ">
                        {champion in scrappedData &&
                        scrappedData[champion].generalChanges ? (
                          <span className="flex flex-col space-y-3 pb-2">
                            {scrappedData[champion]?.generalChanges.map(
                              (generalChange, index) => {
                                return (
                                  <span key={generalChange + champion + index}>
                                    {generalChange}
                                  </span>
                                );
                              }
                            )}
                          </span>
                        ) : null}
                        {champion in scrappedData &&
                        scrappedData[champion].abilityChanges ? (
                          <span className="flex flex-col space-y-3">
                            {scrappedData[champion]?.abilityChanges.map(
                              (abilityChange, index) => {
                                return (
                                  <AbilityChanges
                                    key={
                                      abilityChange.abilityName +
                                      champion +
                                      index
                                    }
                                    spells={icons[champion]?.spells || {}}
                                    {...abilityChange}
                                  />
                                );
                              }
                            )}
                          </span>
                        ) : null}
                        {!(champion in scrappedData) ? (
                          <span className="flex flex-col space-y-3 pb-2">
                            Perfectly balanced, as all things should be
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  ) : (
    <div className="container w-full max-w-4xl ">
      <span className="loading loading-spinner loading-lg text-info"></span>
    </div>
  );
};
