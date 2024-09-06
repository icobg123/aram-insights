import { CheerioAPI, load } from "cheerio";
import {
  AbilityChangesScrapped,
  ChampionData,
  ChampionDataApi,
  ChampionDataScrapped,
  ChampionWinRates,
  Item,
  ItemChangesScrapped,
  ItemDataScrapped,
  RuneData,
  RunesChangesScrapped,
  RunesDataScrapped,
  ScrappedData,
} from "@/types";
import { getImage } from "@/utils";

const revalidate = 604800; // If you want to revalidate every 10s

const initializeCheerio = (html: string) => load(html);

export const scrapePatchVersion = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      next: {
        revalidate: revalidate,
      },
    });
    const html = await response.text();
    const $ = initializeCheerio(html);

    // Check if the first table exists
    const wrappingDivExists = $("h2:has(span#Patch_History) + div").length > 0;
    if (wrappingDivExists) {
      // If the wrapping div exists, assume the first table structure
      return $("h2:has(span#Patch_History)")
        .next("div")
        .find("a")
        .first()
        .text()
        .trim()
        .substring(1);
    } else {
      // If the first table doesn't exist, assume the second table structure
      return $("h2:has(span#Patch_History)")
        .next("dl")
        .find("a")
        .first()
        .text()
        .trim()
        .substring(1);
    }
  } catch (error) {
    console.error("Error scraping patch version:", error);
    return "";
  }
};

/*create a function that scrapes a page using cheerio and returns an object that has champion names as keys and win rate percentages as values
 * from this url https://www.metasrc.com/lol/aram/13.13/stats
 *
 * */

export const scrapeWinRate = async (
  version: string,
  url: string
): Promise<ChampionWinRates> => {
  try {
    const response = await fetch(url, { next: { revalidate: revalidate } });
    const html = await response.text();
    const $ = load(html);
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
const metaSrcWinRateUrls = (
  mode: "aram" | "arena" | "urf",
  version: string
) => {
  return `https://www.metasrc.com/lol/${mode}/${version}/stats`;
};
export const getWikiUrl = (mode: "Aram" | "Arena" | "URF") => {
  const urls = {
    Aram: `https://leagueoflegends.fandom.com/wiki/ARAM#Mode-Specific_Changes`,
    URF: `https://leagueoflegends.fandom.com/wiki/Ultra_Rapid_Fire#Mode-Specific_Changes`,
    Arena: `https://leagueoflegends.fandom.com/wiki/Arena_(League_of_Legends)#Mode-Specific_Changes`,
  };
  return urls[mode];
};
export const fetchChampionAllData = async (
  version: string,
  allChampionData: ChampionDataScrapped,
  mode: "aram" | "arena" | "urf"
): Promise<ChampionDataApi[]> => {
  try {
    // Fetch champion data and win rates concurrently
    const [championResponse, winRates] = await Promise.all([
      fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version}.1/data/en_US/champion.json`,
        { next: { revalidate: revalidate } }
      ),
      scrapeWinRate(version, metaSrcWinRateUrls(mode, version)),
    ]);

    const championJson = await championResponse.json();
    const champions = championJson.data;
    const championNames = Object.keys(champions);

    const results = await Promise.all(
      championNames.map(async (championName) => {
        const champion = champions[championName] as ChampionData;
        const championIcon = champion.image.full;
        const championTitle = champion.title;
        const champName = champion.name;

        // Fetch champion spells and icon concurrently
        const [spells, { base64, img }] = await Promise.all([
          fetchIndividualChampionData(championName, version),
          getImage(
            `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/champion/${championIcon}`
          ),
        ]);

        const winRate =
          championName === "Nunu" ? winRates["Nunu"] : winRates[champName];

        // Build champion data object
        const championObject: ChampionDataApi = {
          icon: { base64, ...img },
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

    return results;
  } catch (error) {
    console.error("Error fetching champion all data:", error);
    throw error;
  }
};

export const fetchItemsAllData = async (
  version: string,
  itemData: ItemDataScrapped
): Promise<ItemChangesScrapped[]> => {
  try {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}.1/data/en_US/item.json`,
      { next: { revalidate: revalidate } }
    );

    const json = await response.json();
    const items: Record<string, Item> = json.data;

    const itemObjects = await Promise.all(
      Object.values(itemData).map(async (scrappedItem) => {
        const itemData = Object.values(items).find(
          (itemData) => itemData.name === scrappedItem.itemName
        );

        if (itemData) {
          const { name, image } = itemData;
          const itemIcon = image.full;
          const { base64, img } = await getImage(
            `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/item/${itemIcon}`
          );
          return {
            icon: { base64, ...img },
            itemName: name || "",
            changes: scrappedItem.changes,
          };
        }

        return null;
      })
    );

    // Filter out null values
    return itemObjects.filter(
      (itemObject): itemObject is ItemChangesScrapped => itemObject !== null
    );
  } catch (error) {
    // @ts-ignore
    console.error(`Error fetching items data: ${error.message}`);
    throw error;
  }
};

export const fetchRunesAllData = async (
  version: string,
  runeData: RunesDataScrapped
): Promise<RunesChangesScrapped[]> => {
  try {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}.1/data/en_US/runesReforged.json`,
      { next: { revalidate: revalidate } }
    );

    const runesData: RuneData[] = await response.json();

    const runeObjects = await Promise.all(
      Object.values(runeData).map(async (scrappedRune) => {
        const matchingRune = runesData
          .flatMap((runeData) =>
            runeData.slots.flatMap((runeSlot) => runeSlot.runes)
          )
          .find((rune) => rune.name === scrappedRune.runeName);

        if (matchingRune) {
          const { name, icon } = matchingRune;
          const { base64, img } = await getImage(
            `https://ddragon.canisback.com/img/${icon}`
          );

          return {
            icon: { base64, ...img },
            runeName: name || "",
            changes: scrappedRune.changes,
          };
        }

        return null;
      })
    );

    return runeObjects.filter(
      (runeObject): runeObject is RunesChangesScrapped => runeObject !== null
    );
  } catch (error) {
    // @ts-ignore
    console.error(`Error fetching runes data: ${error.message}`);
    throw error;
  }
};

export const fetchIndividualChampionData = async (
  champName: string,
  version: string
) => {
  try {
    // Fetch the champion data from the API
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}.1/data/en_US/champion/${champName}.json`,
      { next: { revalidate: revalidate } }
    );
    const json = await response.json();
    const spells = json.data[champName].spells;
    const passiveName = json.data[champName].passive.name.trim().toLowerCase();
    const passiveId = json.data[champName].passive.image.full;

    // Fetch passive image data
    const { base64: passiveBase64, img: passiveImg } = await getImage(
      `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/passive/${passiveId}`
    );

    // Fetch spells' images using Promise.all with map
    const spellsData = await Promise.all(
      spells.map(async (spell: any) => {
        const spellId = spell.image.full;
        let spellName = spell.name.split("/")[0].trim().toLowerCase();

        // Handling edge case for spell names with specific formatting
        if (spellName.includes("h-28 g")) {
          spellName = spellName.replace("h-28 g", "h-28g");
        }

        // Fetch the spell image
        const { base64, img } = await getImage(
          `https://ddragon.leagueoflegends.com/cdn/${version}.1/img/spell/${spellId}`
        );

        return {
          [spellName]: { base64, ...img },
        };
      })
    );

    // Reduce the spells data into a single object
    const spellsObject = spellsData.reduce((acc, spellObj) => {
      return { ...acc, ...spellObj };
    }, {});

    // Combine passive and spell data into a single object
    return {
      [passiveName]: { base64: passiveBase64, ...passiveImg },
      ...spellsObject,
    };
  } catch (error) {
    console.error(`Error fetching data for champion ${champName}:`, error);
    throw error;
  }
};

const parseChampionData = ($: CheerioAPI): ChampionDataScrapped => {
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
  });
  return championData;
};

const parseItemData = ($: CheerioAPI): ItemDataScrapped => {
  const itemData: ItemDataScrapped = {};
  $("div.wds-tab__content").each((index, contentElement) => {
    $(contentElement)
      .find("p")
      .each((index, pElement) => {
        const itemName = $(pElement)
          .find("span.inline-image")
          .attr("data-item");
        if (!itemName) return; // Skip if itemName is not found

        const changes: string[] = [];

        // Find the <ul> element(s) containing the changes for the current item
        $(pElement)
          .nextUntil("p", "ul")
          .each((index, ulElement) => {
            // Extract each change from the <ul> element
            $(ulElement)
              .find("li")
              .each((index, liElement) => {
                const change = $(liElement).text().trim();
                changes.push(change);
              });
          });

        itemData[itemName] = {
          itemName: itemName,
          changes: changes,
        } as ItemChangesScrapped;
      });
  });

  return itemData;
};

const parseRuneData = ($: CheerioAPI): RunesDataScrapped => {
  const runeData: RunesDataScrapped = {};
  $("div.wds-tab__content").each((index, contentElement) => {
    $(contentElement)
      .find("p")
      .each((index, pElement) => {
        const runeName = $(pElement)
          .find("span.inline-image")
          .attr("data-rune");
        if (!runeName) return; // Skip if runeName is not found

        const changes: string[] = [];

        // Find the <ul> element(s) containing the changes for the current rune
        $(pElement)
          .nextUntil("p", "ul")
          .each((index, ulElement) => {
            // Extract each change from the <ul> element
            $(ulElement)
              .find("li")
              .each((index, liElement) => {
                const change = $(liElement).text().trim();
                changes.push(change);
              });
          });

        // Check if the rune already exists in the runeData object
        if (runeData[runeName]) {
          // If the rune already exists, append the changes to its existing array
          runeData[runeName].changes =
            runeData[runeName].changes.concat(changes);
        } else {
          // If the rune doesn't exist, create a new entry in the runeData object
          runeData[runeName] = {
            runeName: runeName,
            changes: changes,
          } as RunesChangesScrapped;
        }
      });
  });

  return runeData;
};

export const scrapeLoLWikiData = async (
  version: string,
  url: string
): Promise<ScrappedData> => {
  try {
    const response = await fetch(url, { next: { revalidate: revalidate } });
    const html = await response.text();
    const $ = initializeCheerio(html);
    const championData = parseChampionData($);
    const itemData = parseItemData($);
    const runeData = parseRuneData($);
    return { championData, itemData, runeData };
  } catch (error) {
    console.error("Error scraping LoL wiki data:", error);
    return { championData: {}, itemData: {}, runeData: {} };
  }
};
