import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

export type AbilityChanges = {
  abilityName: string;
  changes: string;
  iconName: string;
};
export type ChampionData = {
  champion: string;
  damageDealt: string;
  damageReceived: string;
  generalChanges: string[];
  abilityChanges: AbilityChanges[];
};

const scrapeTable = async (): Promise<ChampionData[]> => {
  try {
    const response = await axios.get(
      "https://leagueoflegends.fandom.com/wiki/ARAM"
      // Replace the URL above with the actual URL of the HTML page containing the table
    );
    const $ = cheerio.load(response.data);

    const championData: ChampionData[] = [];

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
      const data: ChampionData = {
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

export async function GET() {
  try {
    const championData = await scrapeTable();
    return NextResponse.json({ championData }, { status: 200 });
  } catch (error) {
    console.error("Error while fetching data:", error);
    // Return an error response with an appropriate status code
    return NextResponse.json(
      { error: "Failed to fetch champion data" },
      { status: 500 }
    );
  }
}
