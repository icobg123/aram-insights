import { TableWrapper } from "@/components/table-wrapper/TableWrapper";
import {
  fetchChampionAllData,
  fetchItemsAllData,
  fetchRunesAllData,
  scrapeLoLWikiData,
  fetchLatestDDragonVersion,
  scrapePatchVersion,
  getWikiUrl,
} from "@/app/fetching/scraping";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";
import React from "react";
import { notFound } from "next/navigation";

export const maxDuration = 60;

// This tells Next.js to revalidate the page every 7 days
export const revalidate = 604800;

// This tells Next.js to pre-build these pages at build time
export async function generateStaticParams() {
  return [{ mode: "arena" }, { mode: "ultra-rapid-fire" }];
}

type Mode = "arena" | "ultra-rapid-fire";
type ApiMode = "arena" | "urf";
type WikiMode = "Arena" | "URF";

const modeConfig: Record<
  Mode,
  { apiMode: ApiMode; wikiMode: WikiMode; title: string; description: string }
> = {
  arena: {
    apiMode: "arena",
    wikiMode: "Arena",
    title: "Arena nerfs and buffs - Who's your pick this game?",
    description:
      "Discover Arena Balance: The best source for League of Legends Arena champion nerfs and buffs.",
  },
  "ultra-rapid-fire": {
    apiMode: "urf",
    wikiMode: "URF",
    title: "URF nerfs and buffs - Who's your pick this game?",
    description:
      "Discover URF Balance: The best source for League of Legends URF champion nerfs and buffs.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  const config = modeConfig[mode as Mode];

  if (!config) {
    return {
      title: "Game Mode Not Found",
      description: "The requested game mode does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { title, description } = config;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GameModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  // Validate mode
  const { mode } = await params;
  const config = modeConfig[mode as Mode];

  if (!config) {
    notFound();
  }

  const { apiMode, wikiMode } = config;

  // Use DDragon version API for compatibility with DDragon data
  const ddragonVersion = await fetchLatestDDragonVersion();

  // Get wiki version for display
  const wikiVersion = await scrapePatchVersion(
    "https://wiki.leagueoflegends.com/en-us/Patch"
  );

  const { runeData, championData, itemData } = await scrapeLoLWikiData(
    ddragonVersion,
    getWikiUrl(wikiMode),
    apiMode
  );

  const [championDataApi, itemDataApi, runesDataApi] = await Promise.all([
    fetchChampionAllData(ddragonVersion, championData, apiMode),
    fetchItemsAllData(ddragonVersion, itemData),
    fetchRunesAllData(ddragonVersion, runeData),
  ]);

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-end justify-center md:pb-6">
      <TableWrapper
        championData={championDataApi}
        itemData={itemDataApi}
        runeData={runesDataApi}
      >
        <TableWrapperHeader version={wikiVersion} mode={wikiMode} />
      </TableWrapper>
    </div>
  );
}
