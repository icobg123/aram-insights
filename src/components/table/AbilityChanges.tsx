import {
  AbilityChanges as AbilityChangesProps,
  ChampionDataApi,
} from "@/types";
import React from "react";
import Image from "next/legacy/image";

type Props = Pick<ChampionDataApi, "spells"> & AbilityChangesProps;

export const AbilityChanges = ({
  abilityName,
  changes,
  iconName,
  spells,
}: Props) => {
  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-3 md:space-y-0">
      <div className="avatar flex-shrink-0">
        <div className="rounded-full ring ring-offset-2 ring-offset-gray-900">
          <Image
            width={44}
            height={44}
            src={spells[`${iconName}`]?.src || ""}
            alt={""}
            placeholder="blur"
            blurDataURL={
              spells[`${iconName}`]?.base64 || "/ability-placeholder.png"
            }
          />
        </div>
      </div>
      <div className="">
        <div className="font-bold">{abilityName}</div>
        <div className="self-start text-sm">{changes}</div>
      </div>
    </div>
  );
};
