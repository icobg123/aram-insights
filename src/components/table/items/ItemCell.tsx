import React from "react";
import { CellContext } from "@tanstack/table-core";
import Image from "next/legacy/image";
import { ItemChangesScrapped } from "@/types";

interface TableRowProps {
  props: CellContext<ItemChangesScrapped, ItemChangesScrapped>;
}

const ItemCell = ({ props }: TableRowProps) => {
  const { itemName, icon } = props.row.original;
  const { src, base64 } = icon;
  return (
    <th scope="row" className="p-2 font-medium text-white md:p-4">
      <div className="flex items-center md:flex-row md:items-center">
        <div className="avatar ml-2 flex justify-center md:inline-flex">
          <div className="mt-2 w-12 rounded-full ring ring-offset-2 ring-offset-gray-900 md:w-20">
            <Image
              width={96}
              height={96}
              src={src}
              alt={`Item icon for ${itemName}`}
              placeholder="blur"
              blurDataURL={base64}
            />
          </div>
        </div>
        <div className="break-normal px-4 text-left md:text-left">
          <div className="font-bold">{itemName}</div>
        </div>
      </div>
    </th>
  );
};

export default ItemCell;
