import React from "react";
import { HeaderContext } from "@tanstack/table-core";
import { Table as TanTable } from "@tanstack/table-core/build/lib/types";
import { useMedia } from "react-use";
import { cn } from "@/lib/cn";

type TableHeadCellProps<T, TValue = any> = {
  className?: string;
  title?: string;
  header: HeaderContext<T, TValue>;
  table: TanTable<T>;
  filter?: React.ReactNode;
};

export const TableHeadCell = <T, TValue = any>({
  className,
  title,
  header,
  table,
  filter,
}: TableHeadCellProps<T, TValue>) => {
  const isLarge = useMedia("(min-width: 768px)", true);
  /*accessing the arrows object with the array notation*/
  const arrows: string | null =
    {
      asc: " ▲",
      desc: " ▼",
    }[header.column.getIsSorted() as string] ?? null;
  return (
    <th
      scope="col"
      colSpan={1}
      className={cn(`text-center hover:bg-primary/10`,className)}
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
        {isLarge && header.column.getCanFilter() ? (
          <div className="hidden pt-2 sm:block">{filter && filter}</div>
        ) : null}
      </div>
    </th>
  );
};
