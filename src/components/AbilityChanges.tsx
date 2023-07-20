import { AbilityChanges as AbilityChangesProps } from "@/app/aramAdjustments/route";
import React from "react";
import Image from "next/image";
type Props = { spells: { [spellName: string]: string } } & AbilityChangesProps;
export const AbilityChanges = (props: Props) => {
  const { abilityName, changes, iconName, spells } = props;

  return (
    <div className="mt-3 flex items-center space-x-3">
      <div className="avatar w-1/6 flex-shrink-0">
        <div className="rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
          <Image
            width={44}
            height={44}
            src={spells[`${iconName}`] || ""}
            alt={abilityName}
            title={abilityName}
            placeholder="blur"
            blurDataURL="/ability-placeholder.png"
          />
        </div>
      </div>
      <div>
        <div className="font-bold">{abilityName}</div>
        <div className="text-sm">{changes}</div>
      </div>
    </div>
  );
};
