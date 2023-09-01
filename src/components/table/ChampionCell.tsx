import React from "react";
import { CellContext } from "@tanstack/table-core";
import Image from "next/legacy/image";
import { APIData } from "@/app/page";

interface TableRowProps {
  props: CellContext<APIData, APIData>;
}

const ChampionCell: React.FC<TableRowProps> = ({ props }) => {
  const { champion, title, icon } = props.row.original;

  return (
    <th scope="row" className="p-2 font-medium text-white  md:p-4">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="avatar flex justify-center md:inline-flex">
          ¡1{" "}
          <div className="mt-2 w-20 rounded-full ring ring-offset-2 ring-offset-gray-900">
            <Image
              width={96}
              height={96}
              src={icon || ""}
              alt={champion}
              placeholder="blur"
              blurDataURL="/champion-placeholder.png"
            />
          </div>
        </div>
        <div className="mt-4 break-normal px-4 text-center md:mt-0 md:text-left">
          <div className="font-bold">{champion}</div>
          <span className="hidden text-sm opacity-50 md:inline">{title}</span>
        </div>
      </div>
    </th>
  );
};

export default ChampionCell;
