"use client";
import React from "react";

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
import OtherChangesCell from "@/components/table/OtherChangesCell";
import { Table } from "@/components/table/Table";
import TableCell from "@/components/table/champions/ChampionCell";
import { TableHeadCell } from "@/components/table/TableHeadCell";
import TableFabFilter from "@/components/table/table-filters/TableFabFilter";
import { ChampionDataApi } from "@/types";
import TableFilter from "@/components/table/table-filters/TableFilter";

export interface TableWrapperProps {
  ChampionDataApi: ChampionDataApi[];
}

export const ChampionTableWrapper: React.FC<TableWrapperProps> = ({
  ChampionDataApi,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const columnHelper = React.useMemo(
    () => createColumnHelper<ChampionDataApi>(),
    []
  );
  const globalFilterFn = React.useCallback(
    (row: Row<ChampionDataApi>, columnId: string, filterValue: any) => {
      const searchTerm = String(filterValue);
      return row.original.champion
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
    },
    []
  );
  const tabData = React.useMemo(() => [...ChampionDataApi], [ChampionDataApi]);

  const columns = React.useMemo(() => {
    return [
      // Display Column
      columnHelper.accessor((row) => row.champion, {
        id: "champion",
        cell: (props) => <TableCell props={props} />,
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-1/4 px-2 py-2 sm:w-1/5 md:w-1/4"
            title="Champion"
            filter={<TableFilter column={header.column} table={table} />}
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: true,
        filterFn: globalFilterFn,
      }),
      columnHelper.accessor((row) => row.winRate, {
        id: "winRate",
        cell: (info) => {
          const winrate = info.getValue();
          return <td className="p-2 text-center md:p-4">{winrate}%</td>;
        },
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-auto px-2 py-2 md:w-[100px]"
            title="Win %"
            filter={<TableFilter column={header.column} table={table} />}
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: true,
      }),
      columnHelper.accessor((row) => row.damageDealt, {
        id: "damageDealt",
        cell: (info) => {
          const damageDealt = info.getValue();
          return (
            <td
              className={`p-2 text-center md:p-4 ${
                damageDealt
                  ? damageDealt >= 0
                    ? "text-green-400"
                    : "text-red-400"
                  : "inherit"
              }`}
            >
              {damageDealt
                ? damageDealt >= 0
                  ? `+${damageDealt}%`
                  : `${damageDealt}%`
                : "0%"}
            </td>
          );
        },
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-auto px-2 py-2 md:w-[100px]"
            title="Dmg dealt"
            filter={<TableFilter column={header.column} table={table} />}
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: true,
      }),
      columnHelper.accessor((row) => row.damageReceived, {
        id: "damageReceived",
        cell: (info) => {
          const damageReceived = info.getValue();
          return (
            <td
              className={`p-2 text-center md:p-4 ${
                damageReceived
                  ? damageReceived <= 0
                    ? "text-green-400"
                    : "text-red-400"
                  : "inherit"
              }`}
            >
              {damageReceived
                ? damageReceived <= 0
                  ? `${damageReceived}%`
                  : `+${damageReceived}%`
                : "0%"}
            </td>
          );
        },
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-auto px-2 py-2 md:w-[100px]"
            title="Dmg received"
            filter={<TableFilter column={header.column} table={table} />}
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: true,
      }),
      columnHelper.accessor((row) => row, {
        id: "otherChanges",
        cell: (props) => <OtherChangesCell props={props} />,
        header: () => (
          <th
            scope="col"
            className="w-1/4 cursor-default px-2 py-2 text-center md:w-1/3"
          >
            Other changes
          </th>
        ),
        enableColumnFilter: false,
      }),
    ];
  }, [columnHelper]);

  const table = useReactTable({
    data: tabData,
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
      <Table table={table} />
      <TableFabFilter table={table} />
    </>
  );
};
