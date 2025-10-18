import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table as TanTable } from "@tanstack/table-core";
import { NoChampionsFoundRow } from "@/components/table/NoChampionsFoundRow";
import { cn } from "@/lib/cn";

type TableProps<T> = {
  table: TanTable<T>;
};

export const Table = <T,>({ table }: TableProps<T>) => {
  return (
    <table className="h-full w-full bg-base-100 text-left text-sm text-base-content/70">
      <thead className="sticky top-0 z-10 bg-base-200 text-xs uppercase">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <React.Fragment key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.length === 0 && <NoChampionsFoundRow />}
        {table.getRowModel().rows.map((row, index) => {
          const isEven = index % 2 === 1;
          return (
            <tr
              key={row.id}
              className={cn("border-base-300", isEven && "bg-base-200")}
            >
              {row.getVisibleCells().map((cell) => (
                <React.Fragment key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </React.Fragment>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
