import { TableWrapper } from "@/components/table-wrapper/TableWrapper";
import {
  fetchChampionAllData,
  fetchItemsAllData,
  fetchRunesAllData,
  scrapeLoLWikiData,
  scrapePatchVersion,
} from "@/scraping";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";
import TableImage from "@/components/table-wrapper/TableImage";
import peekingPoro from "@/public/peeking-poro.svg";
import React from "react";

export async function generateMetadata() {
  return {
    title: "ARAM nerfs and buffs - Who's your pick this game?",
    description: `Discover ARAM Balance: The best source for League of Legends ARAM champion nerfs and buffs.`,
  };
}

export default async function Home() {
  const patchVersion = await scrapePatchVersion(
    "https://leagueoflegends.fandom.com/wiki/ARAM"
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
        <TableImage
          className=""
          width={212}
          height={215}
          src={peekingPoro}
          alt="A poro table background"
          title="A poro peeking behind the table"
          placeholder="blur"
          blurDataURL="/transperant-placeholder.png"
        />
        <TableWrapperHeader version={patchVersion} mode="Aram" />
      </TableWrapper>
    </div>
  );
}
