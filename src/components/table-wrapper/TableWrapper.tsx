"use client";
import React from "react";
import { ItemTableWrapper } from "@/components/table/items/ItemTableWrapper";
import { ChampionTableWrapper } from "@/components/table/champions/ChampionTableWrapper";
import { RuneTableWrapper } from "@/components/table/runes/RuneTableWrapper";
import {
  ChampionDataApi,
  ItemChangesScrapped,
  RunesChangesScrapped,
} from "@/types";
import Tabs from "@/components/table-wrapper/Tabs";
import { usePathname } from "next/navigation";

export interface TableWrapperProps {
  championData: ChampionDataApi[];
  itemData: ItemChangesScrapped[];
  runeData: RunesChangesScrapped[];
  children: React.ReactNode;
}

export const tabs = ["Champions", "Items", "Runes"];

export const TableWrapper: React.FC<TableWrapperProps> = ({
  championData,
  itemData,
  runeData,
  children,
}) => {
  const pathname = usePathname();
  const hash = pathname.split("#")[1];
  const initialTab = tabs.indexOf(hash);
  return (
    <div className="container max-w-5xl p-1">
      <div className="relative flex h-[81svh] min-h-[81svh] w-full flex-col rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg">
        {children}
        <Tabs
          initialTab={initialTab !== -1 ? initialTab : 0}
          tabLabels={tabs}
          tabContents={[
            <ChampionTableWrapper
              ChampionDataApi={championData}
              key={tabs[0]}
            />,
            <ItemTableWrapper itemData={itemData} key={tabs[1]} />,
            <RuneTableWrapper runeData={runeData} key={tabs[2]} />,
          ]}
        />
      </div>
    </div>
  );
};
