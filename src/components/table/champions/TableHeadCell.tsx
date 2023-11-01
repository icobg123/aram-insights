import React from "react";
import { HeaderContext } from "@tanstack/table-core";
import TableFilter from "@/components/table/TableFilters/TableFilter";
import { APIData } from "@/app/page";
import { Table as TanTable } from "@tanstack/table-core/build/lib/types";

type TableHeadCellProps = {
  className?: string;
  title?: string;
  header: HeaderContext<APIData, APIData | number | string>;
  table: TanTable<APIData>;
};
export const TableHeadCell = ({
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
        {header.column.getCanFilter() ? (
          <div className="hidden pt-2 md:block">
            <TableFilter column={header.column} table={table} />
          </div>
        ) : null}
      </div>
    </th>
  );
};
