import React from "react";
import { HeaderContext } from "@tanstack/table-core";
import { APIData } from "@/components/table-wrapper/TableWrapper";

type TableHeadCellProps = {
  className?: string;
  title?: string;
  header: HeaderContext<APIData, APIData | number | string>;
};
export const TableHeadCell = ({
  className,
  title,
  header,
}: TableHeadCellProps) => {
  /*accessing the arrows object with the array notation*/
  const arrows: string | null =
    {
      asc: " ▲",
      desc: " ▼",
    }[header.column.getIsSorted() as string] ?? null;
  return (
    <th
      scope="col"
      onClick={header.column.getToggleSortingHandler()}
      className={`${className} text-center ${
        header.column.getCanSort()
          ? "cursor-pointer select-none hover:bg-gray-600 hover:text-gray-200"
          : "cursor-default"
      }`}
    >
      {title}
      {arrows}
    </th>
  );
};
