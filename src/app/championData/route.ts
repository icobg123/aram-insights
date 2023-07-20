import { NextResponse } from "next/server";

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

/*
 Create a function that will take in a list of champion names and return a list of champion icons as an object with the champion name as the key and the champion icon url as the value.
* */
const fetchChampionAllData = async () => {
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
        const spells = await fetchIndividualChampionData(championName);
        promises.push(spells);
        // console.log(spells);
        return {
          [champName]: {
            icon: `https://ddragon.leagueoflegends.com/cdn/13.14.1/img/champion/${championIcon}`,
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

export async function GET() {
  try {
    const championData = await fetchChampionAllData();

    return NextResponse.json({ ...championData }, { status: 200 });
  } catch (error) {
    console.error("Error while fetching data:", error);
    // Return an error response with an appropriate status code
    return NextResponse.json(
      { error: "Failed to fetch champion icons" },
      { status: 500 }
    );
  }
}
