import { Table } from "@/components/Table";
import axios from "axios";
import cheerio from "cheerio";

export type AbilityChanges = {
  abilityName: string;
  changes: string;
  iconName: string;
};
export type ChampionDataScrapped = {
  champion: string;
  damageDealt: string;
  damageReceived: string;
  generalChanges: string[];
  abilityChanges: AbilityChanges[];
};

const scrapeTable = async (): Promise<ChampionDataScrapped[]> => {
  try {
    const response = await axios.get(
      "https://leagueoflegends.fandom.com/wiki/ARAM"
      // Replace the URL above with the actual URL of the HTML page containing the table
    );
    const $ = cheerio.load(response.data);

    const championData: ChampionDataScrapped[] = [];

    $(".article-table tbody tr").each((index, element) => {
      const champion = $(element).find("td").eq(0).text().trim();
      const damageDealt = $(element).find("td").eq(1).text().trim();
      const damageReceived = $(element).find("td").eq(2).text().trim();
      const otherEffectsElements = $(element).find("td").eq(3).find("li");
      const generalChanges: string[] = [];
      const abilityChanges: AbilityChanges[] = [];

      // if (champion === "Akshan") {
      otherEffectsElements.each((index, element) => {
        const text = $(element).text().trim();
        console.log(text);
        if (text) {
          // Check if the changes are ability-specific
          const abilityElement = $(element).parent().prev("p").find("span");
          if (abilityElement.length) {
            const ability = abilityElement.find("a").text().trim();
            const iconName = abilityElement
              .find("img")
              .attr("alt")
              ?.toLowerCase();

            console.log(iconName);
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
      const data: ChampionDataScrapped = {
        champion,
        damageDealt,
        damageReceived,
        generalChanges,
        abilityChanges,
      };
      if (champion !== "") {
        championData.push(data);
      }
      // }
    });

    return championData;
  } catch (error) {
    console.error("Error scraping data:", error);
    return [];
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

const fetchChampionAllData = async () => {
  try {
    // Go to the dev.to tags page
    const response = await fetch(
      "http://ddragon.leagueoflegends.com/cdn/13.14.1/data/en_US/champion.json"
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
        const spells = await fetchIndividualChampionData(championName);
        promises.push(spells);
        // console.log(spells);
        return {
          [champName]: {
            icon: `http://ddragon.leagueoflegends.com/cdn/13.14.1/img/champion/${championIcon}`,
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

const fetchIndividualChampionData = async (champName: string) => {
  try {
    // Go to the dev.to tags page
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/13.14.1/data/en_US/champion/${champName}.json`
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

export default async function Home() {
  const aramChanges = await scrapeTable();
  const championData = await fetchChampionAllData();
  const [changes, data] = await Promise.all([aramChanges, championData]);

  // console.log(champions[0])
  // console.log(icons)
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="min-h-[473px] w-[928px]">
          <Table data={changes} icons={data} />
        </div>
      </div>
    </div>
  );
}
