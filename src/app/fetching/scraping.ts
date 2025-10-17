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

// Fetch the latest version from DDragon API directly
export const fetchLatestDDragonVersion = async (): Promise<string> => {
  try {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json",
      {
        next: {
          revalidate: revalidate,
        },
      }
    );
    const versions: string[] = await response.json();
    // Return the first version (latest) without the .1 suffix
    const latestVersion = versions[0];
    // Remove the .1 suffix if present (e.g., "15.20.1" -> "15.20")
    return latestVersion.replace(/\.1$/, "");
  } catch (error) {
    console.error("Error fetching DDragon version:", error);
    return "15.20"; // Fallback version
  }
};

export const scrapePatchVersion = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      next: {
        revalidate: revalidate,
      },
    });
    const html = await response.text();
    const $ = initializeCheerio(html);

    // Find the first table row in the patch table and extract the patch version
    // The new wiki has a table with patches, first row contains the latest patch
    const patchText = $("table tbody tr")
      .first()
      .find("td")
      .eq(1) // Second column contains the patch version
      .find("a")
      .first()
      .text()
      .trim();

    // Extract version number from format "V25.20" -> "25.20"
    if (patchText.startsWith("V")) {
      return patchText.substring(1);
    }

    // Fallback: try to extract using regex
    const versionMatch = html.match(/V(\d{2}\.\d{2})/);
    if (versionMatch) {
      return versionMatch[1];
    }

    return "";
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
    Aram: `https://wiki.leagueoflegends.com/en-us/ARAM`,
    URF: `https://wiki.leagueoflegends.com/en-us/Ultra_Rapid_Fire`,
    Arena: `https://wiki.leagueoflegends.com/en-us/Arena`,
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

  // Find the table with champion data - look for table with "Champion" header
  const championTable = $("table")
    .filter((i, table) => {
      const headerText = $(table).find("th").first().text().trim();
      return headerText === "Champion";
    })
    .first();

  console.log(`Found champion table: ${championTable.length > 0}`);

  if (championTable.length === 0) {
    console.error("Could not find champion balance table");
    return championData;
  }

  const rows = championTable.find("tbody tr");
  // console.log(`Found ${rows.length} champion rows in balance table`);

  // Process each row (skip header row which is in thead)
  championTable.find("tbody tr").each((index, element) => {
    const $row = $(element);

    // Column 0: Champion name (with icon and link)
    const championCell = $row.find("td").eq(0);
    const champion = championCell.find("a").last().text().trim();

    // Skip header rows or empty rows
    if (!champion || champion === "Champion") {
      return;
    }

    // console.log(`\n=== Processing ${champion} (row ${index}) ===`);

    let damageDealt = 0;
    let damageReceived = 0;
    const generalChanges: string[] = [];
    const abilityChanges: AbilityChangesScrapped[] = [];

    // Column 1: General changes (Special modifiers)
    const generalChangesCell = $row.find("td").eq(1);

    // Look for "Special modifiers" paragraph and its list
    const specialModifiersParagraph = generalChangesCell.find("p").filter((i, el) =>
      $(el).text().trim() === "Special modifiers"
    );

    if (specialModifiersParagraph.length > 0) {
      // Find the ul that follows the "Special modifiers" paragraph
      const modifiersList = specialModifiersParagraph.next("ul");

      modifiersList.find("li").each((i, li) => {
        const text = $(li).text().trim();

        // Parse damage dealt/received from text
        if (text.match(/damage dealt/i)) {
          const match = text.match(/(increased|reduced)\s+by\s+(\d+)%/i);
          if (match) {
            const value = parseInt(match[2]);
            damageDealt =
              match[1].toLowerCase() === "increased" ? value : -value;
          }
        } else if (text.match(/damage (received|taken)/i)) {
          const match = text.match(/(increased|reduced)\s+by\s+(\d+)%/i);
          if (match) {
            const value = parseInt(match[2]);
            damageReceived =
              match[1].toLowerCase() === "reduced" ? value : -value;
          }
        } else if (text) {
          // All other modifiers go to general changes
          generalChanges.push(text);
        }
      });
    }

    // console.log(`  Damage dealt: ${damageDealt}, Damage received: ${damageReceived}`);
    // console.log(`  General changes: ${generalChanges.length}`);

    // Column 2: Abilities changes
    const abilitiesCell = $row.find("td").eq(2);

    // Each ability change is represented by a <p> tag with ability info followed by a <ul> with changes
    abilitiesCell.find("p").each((pIndex, pElement) => {
      const $p = $(pElement);

      // Find ability icon and name
      const abilityIcon = $p.find("img").first();
      const abilityLink = $p.find("a").last();
      const abilityName = abilityLink.text().trim();

      // Get icon name from the alt attribute or from the ability name
      let iconName = "";
      if (abilityIcon.length > 0) {
        const altText = abilityIcon.attr("alt");
        if (altText) {
          // Extract ability name from alt text like "An icon for Akali's ability Assassin's Mark"
          const match = altText.match(/ability (.+)$/i);
          if (match) {
            iconName = match[1].toLowerCase();
          }
        }
      }

      if (!abilityName) {
        return;
      }

      // console.log(`  Processing ability: ${abilityName}`);

      // Find the ul that follows this p element
      const changesList = $p.next("ul");

      if (changesList.length > 0) {
        changesList.find("li").each((liIndex, li) => {
          const changeText = $(li).text().trim();
          if (changeText) {
            abilityChanges.push({
              abilityName,
              changes: changeText,
              iconName,
            });
          }
        });
      }
    });

    // console.log(`  Ability changes: ${abilityChanges.length}`);

    championData[champion] = {
      champion,
      damageDealt,
      damageReceived,
      generalChanges,
      abilityChanges,
    };
  });

  // console.log(`Total champions parsed: ${Object.keys(championData).length}`);
  return championData;
};

const parseItemData = ($: CheerioAPI): ItemDataScrapped => {
  const itemData: ItemDataScrapped = {};

  // Find the Items tab content - look for div with data-title="Items"
  const itemsSection = $('div[data-title="Items"]');

  if (itemsSection.length === 0) {
    console.log("Items section not found");
    return itemData;
  }

  console.log(`Found Items section, searching for items...`);

  // Items structure: First item is in <p>, rest are in <span> elements
  // Pattern: <p> or <span> with item icon/link, followed by <ul> with changes
  itemsSection.children().each((index, element) => {
    const $element = $(element);

    // Check if this is a <p> or <span> tag with an item
    if (element.name === "p" || element.name === "span") {
      // Find item name from the link - use last() to get the text link after the icon
      const itemLink = $element.find("a").last();
      const itemName = itemLink.text().trim();

      // Skip if no item name found
      if (!itemName || itemName.length === 0) return;

      console.log(`Found item: ${itemName}`);

      const changes: string[] = [];

      // Find the <ul> that immediately follows this element
      const nextElement = $element.next();
      if (nextElement.length > 0 && nextElement.prop("tagName") === "UL") {
        nextElement.find("li").each((liIndex, li) => {
          const change = $(li).text().trim();
          if (change) {
            changes.push(change);
          }
        });
      }

      // Only add if we found changes
      if (changes.length > 0) {
        itemData[itemName] = {
          itemName: itemName,
          changes: changes,
        };
      }
    }
  });

  console.log(`Parsed ${Object.keys(itemData).length} items`);
  return itemData;
};

const parseRuneData = ($: CheerioAPI): RunesDataScrapped => {
  const runeData: RunesDataScrapped = {};

  // Find the Runes tab content - look for div with data-title="Runes"
  const runesSection = $('div[data-title="Runes"]');

  if (runesSection.length === 0) {
    console.log("Runes section not found");
    return runeData;
  }

  console.log(`Found Runes section, searching for runes...`);

  // Runes structure: First rune is in <p>, rest are in <span> elements
  // Pattern: <p> or <span> with rune icon/link, followed by <ul> with changes
  runesSection.children().each((index, element) => {
    const $element = $(element);

    // Check if this is a <p> or <span> tag with a rune
    if (element.name === "p" || element.name === "span") {
      // Find rune name from the link - use last() to get the text link after the icon
      const runeLink = $element.find("a").last();
      const runeName = runeLink.text().trim();

      // Skip if no rune name found
      if (!runeName || runeName.length === 0) return;

      console.log(`Found rune: ${runeName}`);

      const changes: string[] = [];

      // Find the <ul> that immediately follows this element
      const nextElement = $element.next();
      if (nextElement.length > 0 && nextElement.prop("tagName") === "UL") {
        nextElement.find("li").each((liIndex, li) => {
          const change = $(li).text().trim();
          if (change) {
            changes.push(change);
          }
        });
      }

      // Only add if we found changes
      if (changes.length > 0) {
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
          };
        }
      }
    }
  });

  console.log(`Parsed ${Object.keys(runeData).length} runes`);
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

    // console.log(`Scraping URL: ${url}`);
    // console.log(`HTML length: ${html.length}`);

    const championData = parseChampionData($);
    // console.log(`Scraped ${Object.keys(championData).length} champions`);

    // Log first champion as example
    // const firstChampion = Object.values(championData)[0];
    // if (firstChampion) {
    //   console.log(`First champion example:`, firstChampion);
    // }

    const itemData = parseItemData($);
    // console.log(`Scraped ${Object.keys(itemData).length} items`);

    const runeData = parseRuneData($);
    // console.log(`Scraped ${Object.keys(runeData).length} runes`);

    return { championData, itemData, runeData };
  } catch (error) {
    // console.error("Error scraping LoL wiki data:", error);
    return { championData: {}, itemData: {}, runeData: {} };
  }
};
