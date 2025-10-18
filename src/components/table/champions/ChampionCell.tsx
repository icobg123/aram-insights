import React from "react";
import { CellContext } from "@tanstack/table-core";
import Image from "next/legacy/image";
import { ChampionDataApi } from "@/types";

interface TableRowProps {
  props: CellContext<ChampionDataApi, string>;
}

const ChampionCell = ({ props }: TableRowProps) => {
  const { champion, title, icon } = props.row.original;
  const { src, base64 } = icon;

  return (
    <th scope="row" className="p-2 font-medium md:p-4">
      <div className="flex items-center md:flex-row md:items-center w-full gap-3">
        <div className="avatar flex justify-center md:inline-flex">
          <div className="w-6 rounded-full ring ring-offset-2 ring-offset-base-100 md:w-20">
            <Image
              width={96}
              height={96}
              src={src}
              alt=""
              placeholder="blur"
              blurDataURL={base64}
            />
          </div>
        </div>
        <div className="break-normal text-left flex-1">
          <div className="font-bold">{champion}</div>
          <span className="hidden text-sm opacity-50 md:inline">{title}</span>
        </div>
      </div>
    </th>
  );
};

export default ChampionCell;
