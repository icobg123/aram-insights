"use client";
import React from "react";
import { RunesChangesScrapped } from "@/app/page";

import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
} from "@tanstack/table-core";
import { useReactTable } from "@tanstack/react-table";
import { RuneTableHeadCell } from "@/components/table/runes/RuneTableHeadCell";
import RuneCell from "@/components/table/runes/RuneCell";
import { RuneTable } from "@/components/table/runes/RuneTable";

export interface TableWrapperProps {
  runeData: RunesChangesScrapped[];
}

export const RuneTableWrapper: React.FC<TableWrapperProps> = ({ runeData }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const columnHelper = React.useMemo(
    () => createColumnHelper<RunesChangesScrapped>(),
    []
  );
  const globalFilterFn = React.useCallback(
    (row: Row<RunesChangesScrapped>, columnId: string, filterValue: any) => {
      const searchTerm = String(filterValue);
      return row.original.runeName
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
    },
    []
  );

  const itemsTabData = React.useMemo(() => [...runeData], [runeData]);

  const columns = React.useMemo(() => {
    return [
      columnHelper.accessor((row) => row, {
        id: "runeName",
        cell: (props) => <RuneCell props={props} />,
        header: (header) => (
          <RuneTableHeadCell
            header={header}
            table={header.table}
            className="w-1/4 px-2 py-2 sm:w-1/5 md:w-1/4"
            title="Item"
          />
        ),
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.changes, {
        id: "itemChanges",
        cell: (info) => {
          const itemChanges = info.getValue();
          return (
            <td className={`p-2 text-left md:p-4`}>
              {itemChanges ? itemChanges : "No changes"}
            </td>
          );
        },
        header: (header) => (
          <RuneTableHeadCell
            header={header}
            table={header.table}
            className="w-auto px-2 py-2 md:w-[100px]"
            title="Changes"
          />
        ),
        footer: (props) => props.column.id,
      }),
    ];
  }, []);

  const table = useReactTable({
    data: itemsTabData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: false,
  });
  return (
    <>
      {runeData && runeData.length > 0 ? (
        <RuneTable table={table} />
      ) : (
        <span className="loading loading-spinner loading-lg text-info"></span>
      )}
    </>
  );
};
