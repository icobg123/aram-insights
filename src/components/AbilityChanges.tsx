import { AbilityChanges } from "@/app/aramAdjustments/route";
import React from "react";

type Props = { spells: { [spellName: string]: string } } & AbilityChanges;
export default function AbilityChanges(props: Props) {
  const { abilityName, changes, iconName, spells } = props;

  return (
    <div className="flex items-center space-x-3">
      <div className="avatar w-1/6 flex-shrink-0">
        <div className="rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
          <img src={spells[`${iconName}`]} />
        </div>
      </div>
      <div>
        <div className="font-bold">{abilityName}</div>
        <div className="text-sm opacity-50">{changes}</div>
      </div>
    </div>
  );
}
