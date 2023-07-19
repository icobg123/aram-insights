"use client";
import React, { useState } from "react";
import { AbilityChanges } from "@/components/AbilityChanges";
import { ChampionData } from "@/app/aramAdjustments/route";
import { SearchBar } from "@/components/SearchBar";

interface TableProps {
  data: ChampionData[];
  icons: {
    [key: string]: {
      icon?: string;
      title?: string;
      spells?: { [spellName: string]: string };
    };
  };
}

export const Table: React.FC<TableProps> = ({ data, icons }) => {
  const [sortedData, setSortedData] = useState<ChampionData[] | []>(data || []);
  const [searchQuery, setSearchQuery] = useState("");
  const tBodyHeight = sortedData.length !== 1 ? `h-[427px]` : "";
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    const filtered = data.filter((item) =>
      item.champion.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSortedData(filtered);
  };

  return data?.length > 0 ? (
    <>
      <SearchBar handleSearch={handleSearch} value={searchQuery} />
      <div className="w-4xl container max-h-[427px] max-w-4xl overflow-auto shadow-md sm:rounded-lg">
        {sortedData.length === 0 && searchQuery !== "" ? (
          <div
            className={`flex ${tBodyHeight} w-full items-center justify-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400`}
          >
            Check your spelling
          </div>
        ) : (
          <table className=" w-full table-fixed text-left text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="w-1/3 px-4 py-3">
                  Champion
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

            <tbody
              className={`${tBodyHeight} w-full min-w-full overflow-y-scroll`}
            >
              {sortedData.map((item, index) => {
                // if (item.champion === "Shaco") {
                const isOdd = index % 2 === 0;
                const bgColor = isOdd ? "dark:bg-gray-900" : "dark:bg-gray-700";
                return (
                  <tr
                    key={item.champion}
                    className={`border-b bg-white ${bgColor} max-h-[129px] dark:border-gray-700`}
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-24 rounded-full">
                            <img
                              src={icons[item.champion]?.icon}
                              alt={item.champion}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.champion}</div>
                          <div className="text-sm opacity-50">
                            {icons[item.champion]?.title}
                          </div>
                        </div>
                      </div>
                    </th>
                    <td className="px-4 py-4">{item.damageDealt}</td>
                    <td className="px-4 py-4">{item.damageReceived}</td>
                    <td className="px-4 py-4">
                      <span className="flex flex-col space-y-3">
                        {item.abilityChanges &&
                          item.abilityChanges.map((abilityChange, index) => {
                            console.log(icons[item.champion]?.spells);
                            return (
                              <AbilityChanges
                                key={
                                  abilityChange.abilityName +
                                  item.champion +
                                  index
                                }
                                spells={icons[item.champion]?.spells || {}}
                                {...abilityChange}
                              />
                            );
                          })}
                      </span>
                    </td>
                  </tr>
                );
                // }
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  ) : (
    <div className="container w-full max-w-4xl ">
      <span className="loading loading-spinner loading-lg text-secondary"></span>
    </div>
  );
};
