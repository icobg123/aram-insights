import React from "react";
import { HeaderContext } from "@tanstack/table-core";
import { Table as TanTable } from "@tanstack/table-core/build/lib/types";

type TableHeadCellProps<T> = {
  className?: string;
  title?: string;
  header: HeaderContext<T, T | number | string>;
  table: TanTable<T>;
  filter?: React.ReactNode;
};

export const TableHeadCell = <T,>({
  className,
  title,
  header,
  table,
  filter,
}: TableHeadCellProps<T>) => {
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
            {/* You can render the filter component here */}
            {filter && filter}
          </div>
        ) : null}
      </div>
    </th>
  );
};
