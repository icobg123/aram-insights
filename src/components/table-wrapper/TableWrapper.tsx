"use client";
import React, { useState } from "react";
import { AbilityChanges } from "@/components/table/AbilityChanges";
import { SearchBar } from "@/components/table-wrapper/SearchBar";
import { ChampionDataScrapped } from "@/app/page";
import Image from "next/legacy/image";
import { TableHead } from "@/components/table/TableHead";
import { TableBody } from "@/components/table/TableBody";
import { Table } from "@/components/table/Table";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";

export interface IconData {
  [champion: string]: {
    icon?: string;
    title?: string;
    spells?: { [spellName: string]: string };
  };
}

export interface TableWrapperProps {
  scrappedData: ChampionDataScrapped;
  winRates: { [key: string]: string };
  version: string;
  icons: IconData;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
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
            <TableWrapperHeader
              version={version}
              value={searchQuery}
              handleSearch={handleSearch}
            />

            <div className="max-h-[443px] w-full overflow-auto rounded-lg shadow-md ">
              {!loading ? (
                <Table
                  winRates={winRates}
                  icons={icons}
                  scrappedData={scrappedData}
                  champNames={champNames}
                  searchQuery={searchQuery}
                />
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
