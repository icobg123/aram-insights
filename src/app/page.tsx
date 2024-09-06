import { TableWrapper } from "@/components/table-wrapper/TableWrapper";
import {
  fetchChampionAllData,
  fetchItemsAllData,
  fetchRunesAllData,
  scrapeLoLWikiData,
  scrapePatchVersion,
} from "@/scraping";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";
import React from "react";

export const maxDuration = 60; // This function can run for a maximum of 5 seconds

export async function generateMetadata() {
  return {
    title: "ARAM nerfs and buffs - Who's your pick this game?",
    description: `Discover ARAM Balance: The best source for League of Legends ARAM champion nerfs and buffs.`,
  };
}

export default async function Home() {
  const patchVersion = await scrapePatchVersion(
    "https://leagueoflegends.fandom.com/wiki/ARAM/Patch_history"
  );

  const { runeData, championData, itemData } = await scrapeLoLWikiData(
    patchVersion,
    "https://leagueoflegends.fandom.com/wiki/ARAM"
  );
  const [championDataApi, itemDataApi, runesDataApi] = await Promise.all([
    fetchChampionAllData(patchVersion, championData, "aram"),
    fetchItemsAllData(patchVersion, itemData),
    fetchRunesAllData(patchVersion, runeData),
  ]);
  return (
    <div className={`flex min-h-screen items-end justify-center pb-4 md:pb-6`}>
      <TableWrapper
        championData={championDataApi}
        itemData={itemDataApi}
        runeData={runesDataApi}
      >
        <TableWrapperHeader version={patchVersion} mode="Aram" />
      </TableWrapper>
    </div>
  );
}
