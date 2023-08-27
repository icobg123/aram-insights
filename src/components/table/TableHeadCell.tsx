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
  const headerSortObj = (
    header: HeaderContext<APIData, APIData | number | string>
  ) => {
    return {
      className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
      onClick: header.column.getToggleSortingHandler(),
    };
  };

  const sortingArrows = (
    header: HeaderContext<APIData, APIData | string | number>
  ) => {
    /*accessing the arrows object with the array notation*/
    return (
      {
        asc: " ▲",
        desc: " ▼",
      }[header.column.getIsSorted() as string] ?? null
    );
  };

  return (
    <th {...headerSortObj(header)} scope="col" className={className}>
      {title}
      {sortingArrows(header)}
    </th>
  );
};
