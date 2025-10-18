import React, { Suspense } from "react";
import { ItemTableWrapper } from "@/components/table/items/ItemTableWrapper";
import { ChampionTableWrapper } from "@/components/table/champions/ChampionTableWrapper";
import { RuneTableWrapper } from "@/components/table/runes/RuneTableWrapper";
import {
  ChampionDataApi,
  ItemChangesScrapped,
  RunesChangesScrapped,
} from "@/types";
import Tabs from "@/components/table-wrapper/Tabs";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

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
  return (
    <div className="container max-w-5xl p-1">
      <div className="relative flex h-[81svh] min-h-[81svh] w-full flex-col rounded-lg bg-base-300 px-4 pb-0 pt-3 shadow-lg">
        {children}
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <span className="loading loading-spinner loading-lg text-info"></span>
            </div>
          }
        >
          <Tabs
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
        </Suspense>
        <div className="mt-auto  py-1">
          <Link href={"https://bsky.app/profile/jointless.bsky.social"} target="_blank" className="flex items-center justify-end ">
            Feedback welcome on&nbsp;  <FaBluesky />
          </Link>
        </div>
      </div>
    </div>
  );
};
