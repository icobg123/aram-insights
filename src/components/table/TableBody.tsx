import Image from "next/legacy/image";
import { AbilityChanges } from "@/components/table/AbilityChanges";
import React from "react";
import { TableProps } from "@/components/table/Table";
import { NoChampionsFoundRow } from "@/components/table/NoChampionsFoundRow";
import TableRow from "@/components/table/TableRow";

export const TableBody: React.FC<TableProps> = ({
  champNames,
  searchQuery,
  icons,
  winRates,
  scrappedData,
}) => {
  return (
    <tbody className=" w-full min-w-full overflow-y-scroll">
      {champNames.length === 0 && searchQuery !== "" ? (
        <NoChampionsFoundRow />
      ) : (
        champNames.map((champion, index) => {
          const isOdd = index % 2 === 0;
          const bgColor = isOdd ? "dark:bg-gray-900" : "dark:bg-gray-700";

          return (
            <TableRow
              key={index}
              icons={icons}
              scrappedData={scrappedData}
              winRates={winRates}
              champion={champion}
              bgColor={bgColor}
            />
            /* <tr
                       key={index}
                       className={`bg-white ${bgColor} dark:border-gray-700`}
                     >
                       <th
                         scope="row"
                         className="px-4 py-4 font-medium text-gray-900 dark:text-white"
                       >
                         <div className="flex items-center">
                           <div className="avatar hidden md:inline-flex">
                             <div className="w-20 rounded-full ring ring-offset-2 ring-offset-base-100">
                               <Image
                                 width={96}
                                 height={96}
                                 src={icons[champion]?.icon || ""}
                                 alt={champion}
                                 title={champion}
                                 placeholder="blur"
                                 blurDataURL="/champion-placeholder.png"
                               />
                             </div>
                           </div>
                           <div className="break-normal px-4">
                             <div className="font-bold">{champion}</div>
                             <span className="text-sm opacity-50">
                               {icons[champion]?.title}
                             </span>
                           </div>
                         </div>
                       </th>
                       <td className="px-4 py-4">{winRates[champion]}</td>
                       <td className="px-4 py-4 text-center">
                         {hasBalanceChanges
                           ? scrappedData[champion]?.damageDealt || "0%"
                           : "0%"}
                       </td>
                       <td className="px-4 py-4 text-center">
                         {hasBalanceChanges
                           ? scrappedData[champion]?.damageReceived || "0%"
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
                                   spells={icons[champion]?.spells || {}}
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
                     </tr>*/
          );
        })
      )}
    </tbody>
  );
};
