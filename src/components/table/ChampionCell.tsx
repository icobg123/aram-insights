import React from "react";
import { CellContext } from "@tanstack/table-core";
import { APIData } from "@/components/table-wrapper/TableWrapper";
import Image from "next/legacy/image";

interface TableRowProps {
  props: CellContext<APIData, APIData>;
}

const ChampionCell: React.FC<TableRowProps> = ({ props }) => {
  const { champion, title, icon } = props.row.original;

  return (
    <th scope="row" className="px-4 py-4 font-medium  text-white">
      <div className="flex items-center">
        <div className="avatar inline-flex">
          <div className="w-20 rounded-full ring ring-offset-2 ring-offset-gray-900">
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
        <div className="break-normal px-4">
          <div className="font-bold">{champion}</div>
          <span className="text-sm opacity-50">{title}</span>
        </div>
      </div>
    </th>
  );
};

export default ChampionCell;
