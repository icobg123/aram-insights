import React from "react";
import Image from "next/image";
import { ChampionDataScrapped } from "@/app/page";
import { APIData } from "@/components/table-wrapper/TableWrapper";
import { AbilityChanges } from "@/components/table/AbilityChanges";

interface TableRowProps {
  champion: string;
  bgColor: string;
  apiData: APIData;
  scrappedData: ChampionDataScrapped;
}

const TableRow: React.FC<TableRowProps> = ({
  champion,
  bgColor,
  apiData,
  scrappedData,
}) => {
  const hasBalanceChanges = champion in scrappedData;
  const hasGeneralChanges =
    hasBalanceChanges && scrappedData[champion].generalChanges.length > 0;
  const hasAbilityChanges =
    hasBalanceChanges &&
    Object.keys(scrappedData[champion].abilityChanges).length > 0;
  console.log(champion);
  console.log(apiData[champion].champion);
  console.log(apiData[champion]);
  return (
    <tr key={champion} className={`${bgColor} border-gray-700 text-gray-400`}>
      <th scope="row" className="px-4 py-4 font-medium  text-white">
        <div className="flex items-center">
          <div className="avatar inline-flex">
            <div className="w-20 rounded-full ring ring-offset-2 ring-offset-gray-900">
              <Image
                width={96}
                height={96}
                src={apiData[champion]?.icon || ""}
                alt={champion}
                placeholder="blur"
                blurDataURL="/champion-placeholder.png"
              />
            </div>
          </div>
          <div className="break-normal px-4">
            <div className="font-bold">{champion}</div>
            <span className="text-sm opacity-50">
              {apiData[champion]?.title}
            </span>
          </div>
        </div>
      </th>
      <td className="px-4 py-4">{apiData[champion]?.winRate}%</td>
      <td
        className={`px-4 py-4 text-center ${
          hasBalanceChanges && scrappedData[champion]?.damageDealt
            ? parseFloat(scrappedData[champion]?.damageDealt) >= 0
              ? "text-green-400"
              : "text-red-400"
            : "inherit"
        }`}
      >
        {hasBalanceChanges && scrappedData[champion]?.damageDealt
          ? scrappedData[champion]?.damageDealt + "%" || "0%"
          : "0%"}
      </td>
      <td
        className={`px-4 py-4 text-center ${
          hasBalanceChanges && scrappedData[champion]?.damageReceived
            ? parseFloat(scrappedData[champion]?.damageReceived) <= 0
              ? "text-green-400"
              : "text-red-400"
            : "inherit"
        }`}
      >
        {hasBalanceChanges && scrappedData[champion]?.damageReceived
          ? scrappedData[champion]?.damageReceived + "%" || "0%"
          : "0%"}
      </td>
      <td className="px-4 py-4">
        {hasGeneralChanges ? (
          <span className="flex flex-col space-y-2">
            {scrappedData[champion]?.generalChanges.map(
              (generalChange, index) => (
                <span key={generalChange + champion + index}>
                  {generalChange}
                </span>
              )
            )}
          </span>
        ) : null}
        {hasAbilityChanges && hasGeneralChanges && (
          <div className="divider my-2 h-2" />
        )}
        {hasAbilityChanges ? (
          <span className="flex flex-col space-y-3">
            {scrappedData[champion]?.abilityChanges.map(
              (abilityChange, index) => (
                <AbilityChanges
                  key={abilityChange.abilityName + champion + index}
                  spells={apiData[champion]?.spells || {}}
                  {...abilityChange}
                />
              )
            )}
          </span>
        ) : null}
        {!hasBalanceChanges ? (
          <>Perfectly balanced, as all things should be</>
        ) : null}
      </td>
    </tr>
  );
};

export default TableRow;
