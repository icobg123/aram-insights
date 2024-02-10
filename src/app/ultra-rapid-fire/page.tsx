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
    title: "URF Balance - Who's your pick this game?",
    description: `URF nerfs and buffs`,
  };
}

export default async function Home() {
  const patchVersion = await scrapePatchVersion(
    "https://leagueoflegends.fandom.com/wiki/Ultra_Rapid_Fire/Patch_and_Buff_History"
  );
  const { runeData, championData, itemData } = await scrapeLoLWikiData(
    patchVersion,
    "https://leagueoflegends.fandom.com/wiki/Ultra_Rapid_Fire"
  );
  const [championDataApi, itemDataApi, runesDataApi] = await Promise.all([
    fetchChampionAllData(patchVersion, championData, "urf"),
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
        <TableWrapperHeader version={patchVersion} mode="URF" />
      </TableWrapper>
    </div>
  );
}
