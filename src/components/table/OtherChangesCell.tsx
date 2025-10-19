import React from "react";
import { CellContext } from "@tanstack/table-core";
import { AbilityChanges } from "@/components/table/AbilityChanges";
import { ChampionDataApi } from "@/types";

interface TableRowProps {
  props: CellContext<ChampionDataApi, ChampionDataApi>;
}

const OtherChangesCell: React.FC<TableRowProps> = ({ props }) => {
  const {
    champion,
    generalChanges,
    spells,
    abilityChanges,
    damageDealt,
    damageReceived,
  } = props.row.original;

  const hasGeneralChanges = generalChanges.length > 0;
  const hasAbilityChanges = abilityChanges.length > 0;

  return (
    <td className="hidden p-2 md:table-cell md:p-4">
      {hasGeneralChanges && (
        <div className="flex flex-col space-y-1">
          {generalChanges.map((generalChange, index) => (
            <div key={index + champion}>{generalChange}</div>
          ))}
        </div>
      )}
      {hasAbilityChanges && hasGeneralChanges && (
        <div className="divider my-2 h-2" />
      )}
      {hasAbilityChanges && (
        <span className="flex flex-col space-y-3">
          {abilityChanges.map((abilityChange, index) => (
            <AbilityChanges
              key={index + champion}
              spells={spells || {}}
              {...abilityChange}
            />
          ))}
        </span>
      )}
      {!hasGeneralChanges &&
        !hasAbilityChanges &&
        damageDealt === 0 &&
        damageReceived === 0 && (
          <>Perfectly balanced, as all things should be</>
        )}
    </td>
  );
};

export default OtherChangesCell;
