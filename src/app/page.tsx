import { TableWrapper } from "@/components/table-wrapper/TableWrapper";
import axios from "axios";
import cheerio from "cheerio";

export const revalidate = 604800; // If you want to revalidate every 10s

export type AbilityChangesScrapped = {
  abilityName: string;
  changes: string;
  iconName: string;
};
export type ChampionDataScrapped = {
  [key: string]: {
    champion: string;
    damageDealt: number;
    damageReceived: number;
    generalChanges: string[];
    abilityChanges: AbilityChangesScrapped[];
  };
};

export interface APIData {
  champion: string;
  damageDealt: number;
  damageReceived: number;
  generalChanges: string[];
  abilityChanges: AbilityChangesScrapped[];
  winRate: number;
  icon?: string;
  title?: string;
  spells?: { [spellName: string]: string };
}

export type ItemChangesScrapped = {
  itemName: string;
  changes: string;
  icon?: string;
};

export type ItemDataScrapped = {
  [key: string]: ItemChangesScrapped;
};
export type ScrappedData = {
  championData: ChampionDataScrapped;
  itemData: ItemDataScrapped;
};
/*create a function similar to the scrapetable function below that finds the first patch version on the same page which has the following format - V13.13*/
const scrapePatchVersion = async (): Promise<string> => {
  try {
    const response = await axios.get(
      "https://leagueoflegends.fandom.com/wiki/ARAM"
    );
    const $ = cheerio.load(response.data);

    return $("h2:has(span#Patch_History)")
      .next("div")
      .find("a")
      .first()
      .text()
      .trim()
      .substring(1);
  } catch (error) {
    console.log(error);
    return "";
  }
};
const scrapeLoLWikiData = async (version: string): Promise<ScrappedData> => {
  try {
    const response = await axios.get(
      "https://leagueoflegends.fandom.com/wiki/ARAM"
      // Replace the URL above with the actual URL of the HTML page containing the table
    );
    const $ = cheerio.load(response.data);

    const championData: ChampionDataScrapped = {};

    $(".article-table tbody tr").each((index, element) => {
      const champion = $(element).find("td").eq(0).text().trim();
      const damageDealt =
        parseInt(
          $(element)
            .find("td")
            .eq(1)
            .text()
            .trim()
            .replace("%", "")
            .replace("+", "")
        ) || 0;
      const damageReceived =
        parseInt(
          $(element)
            .find("td")
            .eq(2)
            .text()
            .trim()
            .replace("%", "")
            .replace("+", "")
        ) || 0;
      const otherEffectsElements = $(element).find("td").eq(3).find("li");
      const generalChanges: string[] = [];
      const abilityChanges: AbilityChangesScrapped[] = [];
      otherEffectsElements.each((index, element) => {
        const text = $(element).text().trim();
        if (text) {
          // Check if the changes are ability-specific
          const abilityElement = $(element).parent().prev("p").find("span");
          if (abilityElement.length) {
            const ability = abilityElement.find("a").text().trim();
            const iconName = abilityElement
              .find("img")
              .attr("alt")
              ?.toLowerCase();

            abilityChanges.push({
              abilityName: ability,
              changes: text,
              iconName: iconName || "",
            });
          } else {
            generalChanges.push(text);
          }
        }
      });

      if (champion !== "") {
        championData[champion] = {
          champion,
          damageDealt,
          damageReceived,
          generalChanges,
          abilityChanges,
        };
      }
      // }
    });
    const itemData: ItemDataScrapped = {};
    $("div.wds-tab__content")
      .eq(1)
      .find("ul li")
      .each((index, element) => {
        const changes = $(element).text().trim();
        const itemName = $(element).parent().prev("p").text().trim();
        itemData[itemName] = {
          itemName: itemName,
          changes: changes,
        } as ItemChangesScrapped;
      });
    return { championData, itemData };
  } catch (error) {
    console.error("Error scraping data:", error);
    return {
      championData: {} as ChampionDataScrapped,
      itemData: {} as ItemDataScrapped,
    };
  }
};

type ChampionData = {
  version: string;
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  partype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
};

/*create a function that scrapes a page using cheerio and returns an object that has champion names as keys and win rate percentages as values
 * from this url https://www.metasrc.com/lol/aram/13.13/stats
 *
 * */
interface ChampionWinRates {
  [key: string]: number;
}

const scrapeWinRate = async (version: string): Promise<ChampionWinRates> => {
  try {
    const response = await axios.get(
      `https://www.metasrc.com/lol/aram/${version}/stats`
    );
    const $ = cheerio.load(response.data);

    const winRateData: { [key: string]: number } = {};

    $(".stats-table tbody tr").each((index, element) => {
      const champion = $(element).find("td").eq(0).find("a").text().trim();
      winRateData[champion] = parseFloat(
        $(element).find("td").eq(6).text().trim().replace("%", "")
      );
    });
    return winRateData;
  } catch (error) {
    console.error("Error scraping data:", error);
    return {};
  }
};
const fetchChampionAllData = async (version: string) => {
  try {
    // Go to the dev.to tags page
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}.1/data/en_US/champion.json`
    );
    // Get the HTML code of the webpage
    const json = await response.json();
    const champions = json.data;
    const championNames = Object.keys(champions);
    const promises = [];
    const winRates = await scrapeWinRate(version);
    const allScrappedData = await scrapeLoLWikiData(version);
    const allChampionData = allScrappedData.championData;
    return await Promise.all(
      championNames.map(async (championName) => {
        const champion = champions[championName] as ChampionData;
        const championIcon = champion.image.full;
        const championTitle = champion.title;
        const champName = champion.name;
        const spells = await fetchIndividualChampionData(championName, version);
        const winRate =
          championName === "Nunu" ? winRates["Nunu"] : winRates[champName];
        promises.push(spells);

        const championObject: APIData = {
          icon: `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/champion/${championIcon}`,
          title: championTitle,
          spells: spells,
          winRate: winRate,
          damageReceived: 0,
          damageDealt: 0,
          generalChanges: [],
          abilityChanges: [],
          champion: champName,
        };
        return {
          ...championObject,
          ...allChampionData[champName],
          champion: champName,
        };
      })
    );
  } catch (error) {
    throw error;
  }
};
type Item = {
  name: string;
  description: string;
  colloq: string;
  plaintext: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  gold: {
    base: number;
    purchasable: boolean;
    total: number;
    sell: number;
  };
  tags: string[];
  maps: {
    [key: string]: boolean;
  };
  stats: {
    FlatMovementSpeedMod: number;
  };
  effect: {
    Effect1Amount: string;
  };
};

type ItemData = {
  [key: string]: Item;
};

const fetchItemsAllData = async (version: string) => {
  try {
    // Go to the dev.to tags page
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}.1/data/en_US/item.json`
    );
    // Get the HTML code of the webpage
    const json = await response.json();
    const items: Item[] = json.data;
    // const itemNames = Object.values(items).map((item: Item) => item.name);

    const allScrappedData = await scrapeLoLWikiData(version);
    const scrappedItemData = allScrappedData.itemData;
    return await Promise.all(
      Object.values(scrappedItemData).map(async (item) => {
        const itemData = Object.values(items).find(
          (itemData) => itemData.name === item.itemName
        );
        const itemName = itemData?.name;
        const itemIcon = itemData?.image.full;
        const itemObject: ItemChangesScrapped = {
          icon: `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/item/${itemIcon}`,
          itemName: itemName || "",
          changes: scrappedItemData[itemName || ""]?.changes,
        };
        return itemObject;
      })
    );
  } catch (error) {
    throw error;
  }
};
const fetchIndividualChampionData = async (
  champName: string,
  version?: string
) => {
  try {
    // Go to the dev.to tags page
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}.1/data/en_US/champion/${champName}.json`
    );
    // Get the HTML code of the webpage
    const json = await response.json();
    const spells = json.data[champName][`spells`];
    const passiveName = json.data[champName][`passive`]["name"]
      .trim()
      .toLowerCase();
    const passiveId = json.data[champName][`passive`]["image"]["full"];

    return spells.reduce(
      (acc: any, spell: any) => {
        const spellId = spell.image.full;
        const spellName = spell.name.toLowerCase();

        return {
          ...acc,
          [`${spellName}`]: `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/spell/${spellId}`,
        };
      },
      {
        [`${passiveName}`]: `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/passive/${passiveId}`,
      }
    );
  } catch (error) {
    throw error;
  }
};

export async function generateMetadata() {
  return {
    title: "ARAM Balance",
    description: `Welcome to ARAM Balance: Your Ultimate Destination for Champion Balance Insights in League of Legends' ARAM Game Mode. Explore in-depth data on champion buffs, nerfs, win rates, and gameplay dynamics, ensuring you stay at the forefront of the ever-evolving ARAM battlefield. Level up your League of Legends experience with ARAM Balance, where data meets strategy.`,
  };
}

export default async function Home() {
  const patchVersion = await scrapePatchVersion();
  const aramChanges = await scrapeLoLWikiData(patchVersion);
  const championDataApi = await fetchChampionAllData(patchVersion);
  const itemDataApi = await fetchItemsAllData(patchVersion);
  const [aramAdjustments, champAssets, itemAssets] = await Promise.all([
    aramChanges,
    championDataApi,
    itemDataApi,
  ]);
  return (
    <div className={`flex min-h-screen items-end justify-center pb-4 md:pb-6`}>
      <TableWrapper
        scrappedData={aramAdjustments}
        apiData={champAssets}
        version={patchVersion}
        itemData={itemAssets}
      />
    </div>
  );
}
