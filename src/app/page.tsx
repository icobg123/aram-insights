import { TableWrapper } from "@/components/table-wrapper/TableWrapper";
import {
  fetchChampionAllData,
  fetchItemsAllData,
  fetchRunesAllData,
  scrapeLoLWikiData,
  scrapePatchVersion,
} from "@/scraping";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";

export const revalidate = 300; // If you want to revalidate every 10s

export async function generateMetadata() {
  return {
    title: "ARAM Balance - Who's your pick this game?",
    description: `Welcome to ARAM Balance: Your Ultimate Destination for Champion Balance Insights in League of Legends' ARAM Game Mode. Explore in-depth data on champion buffs, nerfs, win rates, and gameplay dynamics, ensuring you stay at the forefront of the ever-evolving ARAM battlefield. Level up your League of Legends experience with ARAM Balance, where data meets strategy.`,
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
        version={patchVersion}
        itemData={itemDataApi}
        runeData={runesDataApi}
      >
        <TableWrapperHeader version={patchVersion} mode="Aram" />
      </TableWrapper>
    </div>
  );
}
