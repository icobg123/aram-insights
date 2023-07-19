import { Table } from "@/components/Table";
import { getURL } from "@/utils";

const fetchAramChanges = async () => {
  const url = getURL("/aramAdjustments");
  const response = await fetch(url);
  return await response.json();
};

/* Create a function that uses the championIcons api endpoint to get the champion icons*/
const fetchChampionData = async () => {
  const url = getURL("/championData");
  const response = await fetch(url);
  return await response.json();
};

export default async function Home() {
  const aramChanges = fetchAramChanges();
  const championData = fetchChampionData();
  const [changes, data] = await Promise.all([aramChanges, championData]);

  // console.log(champions[0])
  // console.log(icons)
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="min-h-[473px] w-[928px]">
          <Table data={changes.championData} icons={data} />
        </div>
      </div>
    </div>
  );
}
