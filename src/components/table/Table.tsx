import React from "react";
import { flexRender } from "@tanstack/react-table";
import { Table as TanTable } from "@tanstack/table-core";
import { NoChampionsFoundRow } from "@/components/table/NoChampionsFoundRow";

type TableProps<T> = {
  table: TanTable<T>;
};

export const Table = <T,>({ table }: TableProps<T>) => {
  return (
    <table className="h-full w-full bg-gray-900 text-left text-sm text-gray-500">
      <thead className="sticky top-0 z-10 bg-gray-700 text-xs uppercase text-gray-200">
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
          const isOdd = index % 2 === 0;
          const bgColor = isOdd ? "bg-gray-900 " : "bg-gray-800 ";
          return (
            <tr
              key={row.id}
              className={`${bgColor} border-gray-700 text-gray-400`}
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
