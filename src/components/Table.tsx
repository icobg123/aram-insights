"use client";
import React, { useState } from "react";
import { AbilityChanges } from "@/components/AbilityChanges";
import { SearchBar } from "@/components/SearchBar";
import { ChampionDataScrapped } from "@/app/page";
import Image from "next/legacy/image";

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
  // create a loading state
  const [loading, setLoading] = useState(false);
  const searchedChampsLen = champNames.length;
  const scrappedChampsLen = Object.keys(scrappedData).length;
  const tBodyHeight = searchedChampsLen === 1 ? "" : "h-[440px]";
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length === 0) {
      setChampNames(Object.keys(icons));
      setLoading(false);
    }
    if (value.length < 2) {
      return;
    }

    setChampNames(
      Object.keys(icons).filter((champName) =>
        champName.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setLoading(false);
  };
  const flexStyles = scrappedChampsLen > 0 ? "" : "flex items-center";
  return (
    <div
      className={`flex min-h-[567px] w-[890px]  flex-col rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg`}
    >
      {scrappedChampsLen > 0 ? (
        <>
          <div className="w-4xl container max-w-4xl  ">
            <div className="mb-3 flex items-center justify-between">
              <SearchBar handleSearch={handleSearch} value={searchQuery} />

              <div
                className="tooltip self-end"
                data-tip="Leage of Legends patch"
              >
                <div className="badge">v{version}</div>
              </div>
            </div>
          </div>
          <div className="w-4xl container flex max-h-[443px] max-w-4xl flex-grow overflow-auto rounded-lg shadow-md">
            {searchedChampsLen === 0 && searchQuery !== "" ? (
              <div
                className={`flex w-full items-center justify-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400`}
              >
                No champions found
              </div>
            ) : !loading ? (
              <table className="w-full table-fixed text-left text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
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
                            className=" px-4 py-4 font-medium text-gray-900 dark:text-white"
                          >
                            <div className="flex items-center">
                              <div className="avatar">
                                <div className="w-24 rounded-full ring  ring-offset-2 ring-offset-base-100">
                                  <Image
                                    width={96}
                                    height={96}
                                    src={icons[champion].icon || ""}
                                    alt={champion}
                                    title={champion}
                                    placeholder="blur"
                                    blurDataURL="/champion-placeholder.png"
                                  />
                                </div>
                              </div>
                              <div className="break-normal	px-4">
                                <div className="font-bold">{champion}</div>
                                <span className="text-sm opacity-50">
                                  {icons[champion]?.title}
                                </span>
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
                                      <span
                                        key={generalChange + champion + index}
                                      >
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
                              <>Perfectly balanced, as all things should be</>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <div className="container flex w-full max-w-4xl items-center justify-center ">
                <span className="loading loading-spinner loading-lg text-info"></span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="container w-full max-w-4xl ">
          <span className="loading loading-spinner loading-lg text-info"></span>
        </div>
      )}
    </div>
  );
};
