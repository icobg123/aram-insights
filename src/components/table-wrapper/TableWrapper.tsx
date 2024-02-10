"use client";
import React, { useState } from "react";

import Image from "next/legacy/image";
import peekingPoro from "@/public/peeking-poro.svg";
import { ItemTableWrapper } from "@/components/table/items/ItemTableWrapper";
import { ChampionTableWrapper } from "@/components/table/champions/ChampionTableWrapper";
import { RuneTableWrapper } from "@/components/table/runes/RuneTableWrapper";
import {
  ChampionDataApi,
  ItemChangesScrapped,
  RunesChangesScrapped,
} from "@/types";

export interface TableWrapperProps {
  championData: ChampionDataApi[];
  itemData: ItemChangesScrapped[];
  runeData: RunesChangesScrapped[];
  children: React.ReactNode;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
  championData,
  itemData,
  runeData,
  children,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <div className="container max-w-5xl p-1">
      <div className="relative flex h-[81svh] min-h-[81svh] w-full flex-col rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg">
        <div className="absolute right-4 top-[-131px]">
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
        {children}

        <div className="tabs flex pb-2">
          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 0 && "tab-active"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Champions
          </a>
          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 1 && "tab-active"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Items
          </a>
          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 2 && "tab-active"
            }`}
            onClick={() => setActiveTab(2)}
          >
            Runes
          </a>
        </div>
        <div className="container max-w-5xl">
          <div className="max-h-[62svh] w-full overflow-auto rounded-lg shadow-md md:max-h-[66svh]">
            <div className="flex h-full w-full items-center justify-center">
              {activeTab === 0 && (
                <ChampionTableWrapper ChampionDataApi={championData} />
              )}
              {activeTab === 1 && <ItemTableWrapper itemData={itemData} />}
              {activeTab === 2 && <RuneTableWrapper runeData={runeData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
