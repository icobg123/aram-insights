import { TableWrapper } from "@/components/table-wrapper/TableWrapper";
import axios from "axios";
import cheerio from "cheerio";

export type AbilityChangesScrapped = {
  abilityName: string;
  changes: string;
  iconName: string;
};
export type ChampionDataScrapped = {
  [key: string]: {
    champion: string;
    damageDealt: string;
    damageReceived: string;
    generalChanges: string[];
    abilityChanges: AbilityChangesScrapped[];
  };
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
const scrapeTable = async (): Promise<ChampionDataScrapped> => {
  try {
    const response = await axios.get(
      "https://leagueoflegends.fandom.com/wiki/ARAM"
      // Replace the URL above with the actual URL of the HTML page containing the table
    );
    const $ = cheerio.load(response.data);

    const championData: ChampionDataScrapped = {};

    $(".article-table tbody tr").each((index, element) => {
      const champion = $(element).find("td").eq(0).text().trim();
      const damageDealt = $(element).find("td").eq(1).text().trim();
      const damageReceived = $(element).find("td").eq(2).text().trim();
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

    return championData;
  } catch (error) {
    console.error("Error scraping data:", error);
    return {};
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
const scrapeWinRate = async (
  version: string
): Promise<{ [key: string]: string }> => {
  try {
    const response = await axios.get(
      `https://www.metasrc.com/lol/aram/${version}/stats`
    );
    const $ = cheerio.load(response.data);

    const winRateData: { [key: string]: string } = {};

    $(".stats-table tbody tr").each((index, element) => {
      const champion = $(element).find("td").eq(0).find("a").text().trim();
      const winRate = $(element).find("td").eq(6).text().trim();
      winRateData[champion] = winRate;
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
      "https://ddragon.leagueoflegends.com/cdn/13.14.1/data/en_US/champion.json"
    );
    // Get the HTML code of the webpage
    const json = await response.json();
    const champions = json.data;
    const championNames = Object.keys(champions);
    const promises = [];

    const data = await Promise.all(
      championNames.map(async (championName) => {
        const champion = champions[championName] as ChampionData;
        const championIcon = champion.image.full;
        const championTitle = champion.title;
        const champName = champion.name;
        const spells = await fetchIndividualChampionData(championName, version);
        promises.push(spells);
        // console.log(spells);
        return {
          [champName]: {
            icon: `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/champion/${championIcon}`,
            title: championTitle,
            spells: spells,
          },
        };
      })
    );
    return Object.assign({}, ...data);
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
          [`${spellName}`]: `https://ddragon.leagueoflegends.com/cdn/13.14.1/img/spell/${spellId}`,
        };
      },
      {
        [`${passiveName}`]: `https://ddragon.leagueoflegends.com/cdn/13.14.1/img/passive/${passiveId}`,
      }
    );
  } catch (error) {
    throw error;
  }
};

export async function generateMetadata() {
  return {
    title: "ARAM Balance",
    description: `ARAM Balance: Champion balance changes for League of Legends' ARAM game mode.`,
  };
}

export default async function Home() {
  const patchVersion = await scrapePatchVersion();
  const winRates = await scrapeWinRate(patchVersion);
  const aramChanges = await scrapeTable();
  const championData = await fetchChampionAllData(patchVersion);
  const [aramAdjustments, champAssets] = await Promise.all([
    aramChanges,
    championData,
  ]);
  return (
    <div className={`flex min-h-screen items-center justify-center`}>
      <TableWrapper
        scrappedData={aramAdjustments}
        icons={champAssets}
        winRates={winRates}
        version={patchVersion}
      />
    </div>
  );
}
