import { TableWrapper } from "@/components/table-wrapper/TableWrapper";
import {
  fetchChampionAllData,
  fetchItemsAllData,
  fetchRunesAllData,
  scrapeLoLWikiData,
  fetchLatestDDragonVersion,
  scrapePatchVersion,
} from "@/app/fetching/scraping";
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
  // Use DDragon version API for compatibility with DDragon data
  const ddragonVersion = await fetchLatestDDragonVersion();
  // Get wiki version for display
  const wikiVersion = await scrapePatchVersion(
    "https://wiki.leagueoflegends.com/en-us/Patch"
  );
  console.log({ ddragonVersion, wikiVersion });

  const { runeData, championData, itemData } = await scrapeLoLWikiData(
    ddragonVersion,
    "https://wiki.leagueoflegends.com/en-us/ARAM"
  );
  const [championDataApi, itemDataApi, runesDataApi] = await Promise.all([
    fetchChampionAllData(ddragonVersion, championData, "aram"),
    fetchItemsAllData(ddragonVersion, itemData),
    fetchRunesAllData(ddragonVersion, runeData),
  ]);
  return (
    <div className={`flex min-h-screen items-end justify-center pb-4 md:pb-6`}>
      <TableWrapper
        championData={championDataApi}
        itemData={itemDataApi}
        runeData={runesDataApi}
      >
        <TableWrapperHeader version={wikiVersion} mode="Aram" />
      </TableWrapper>
    </div>
  );
}
