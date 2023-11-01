import React from "react";
import { HeaderContext } from "@tanstack/table-core";
import { RunesChangesScrapped } from "@/app/page";
import { Table as TanTable } from "@tanstack/table-core/build/lib/types";

type TableHeadCellProps = {
  className?: string;
  title?: string;
  header: HeaderContext<
    RunesChangesScrapped,
    RunesChangesScrapped | number | string
  >;
  table: TanTable<RunesChangesScrapped>;
};
export const RuneTableHeadCell = ({
  className,
  title,
  header,
  table,
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
      className={`${className}  text-center hover:bg-gray-600 hover:text-gray-200`}
    >
      <div className="flex h-full flex-col justify-between">
        <div
          onClick={header.column.getToggleSortingHandler()}
          className={
            header.column.getCanSort()
              ? "group cursor-pointer select-none pt-2"
              : "cursor-default"
          }
        >
          {title}
          {arrows}
        </div>
      </div>
    </th>
  );
};
