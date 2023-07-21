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
  const [loading, setLoading] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length === 0) {
      setChampNames(Object.keys(icons));
      setLoading(false);
    }
    if (value.length < 2) {
      setLoading(false);
      return;
    }

    setChampNames(
      Object.keys(icons).filter((champName) =>
        champName.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setLoading(false);
  };

  return (
    <div className="container max-w-4xl">
      <div className="relative min-h-[567px] w-full rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg ">
        <div className="absolute -right-4 top-[-131px]">
          <Image
            className=""
            width={212}
            height={215}
            src="/peeking-poro.png"
            alt="A poro table background"
            title="A poro peeking behind the table"
            placeholder="blur"
            blurDataURL="/transperant-placeholder.png"
          />
        </div>
        {scrappedData && Object.keys(scrappedData).length > 0 ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <SearchBar handleSearch={handleSearch} value={searchQuery} />
              <div
                className="tooltip ml-2 self-end"
                data-tip="Leage of Legends patch"
              >
                <div className="badge">v{version}</div>
              </div>
            </div>

            <div className="max-h-[443px] w-full overflow-auto rounded-lg shadow-md ">
              {!loading ? (
                <table className="table h-full w-full text-left text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
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

                  <tbody className=" w-full min-w-full overflow-y-scroll">
                    {champNames.length === 0 && searchQuery !== "" ? (
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
                    ) : (
                      champNames.map((champion, index) => {
                        const isOdd = index % 2 === 0;
                        const bgColor = isOdd
                          ? "dark:bg-gray-900"
                          : "dark:bg-gray-700";
                        return (
                          <tr
                            key={index}
                            className={`bg-white ${bgColor} dark:border-gray-700`}
                          >
                            <th
                              scope="row"
                              className="px-4 py-4 font-medium text-gray-900 dark:text-white"
                            >
                              <div className="flex items-center">
                                <div className="avatar hidden md:inline-flex">
                                  <div className="w-20 rounded-full ring ring-offset-2 ring-offset-base-100">
                                    <Image
                                      width={96}
                                      height={96}
                                      src={icons[champion]?.icon || ""}
                                      alt={champion}
                                      title={champion}
                                      placeholder="blur"
                                      blurDataURL="/champion-placeholder.png"
                                    />
                                  </div>
                                </div>
                                <div className="break-normal px-4">
                                  <div className="font-bold">{champion}</div>
                                  <span className="text-sm opacity-50">
                                    {icons[champion]?.title}
                                  </span>
                                </div>
                              </div>
                            </th>
                            <td className="px-4 py-4">{winRates[champion]}</td>
                            <td className="px-4 py-4 text-center">
                              {champion in scrappedData
                                ? scrappedData[champion]?.damageDealt || "0%"
                                : "0%"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {champion in scrappedData
                                ? scrappedData[champion]?.damageReceived || "0%"
                                : "0%"}
                            </td>
                            <td className="px-4 py-4">
                              {champion in scrappedData &&
                              scrappedData[champion].generalChanges.length >
                                0 ? (
                                <span className="flex flex-col space-y-3 pb-2">
                                  {scrappedData[champion]?.generalChanges.map(
                                    (generalChange, index) => (
                                      <span
                                        key={generalChange + champion + index}
                                      >
                                        {generalChange}
                                      </span>
                                    )
                                  )}
                                </span>
                              ) : null}
                              {champion in scrappedData &&
                              Object.keys(scrappedData[champion].abilityChanges)
                                .length > 0 ? (
                                <span className="flex flex-col space-y-3">
                                  {scrappedData[champion]?.abilityChanges.map(
                                    (abilityChange, index) => (
                                      <AbilityChanges
                                        key={
                                          abilityChange.abilityName +
                                          champion +
                                          index
                                        }
                                        spells={icons[champion]?.spells || {}}
                                        {...abilityChange}
                                      />
                                    )
                                  )}
                                </span>
                              ) : null}
                              {!(champion in scrappedData) ? (
                                <>Perfectly balanced, as all things should be</>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
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
