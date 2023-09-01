"use client";
import React from "react";
import { APIData, ChampionDataScrapped } from "@/app/page";
import Image from "next/legacy/image";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";
import peekingPoro from "../../../public/peeking-poro.svg";

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
import ChampionCell from "@/components/table/ChampionCell";
import { TableHeadCell } from "@/components/table/TableHeadCell";
import TableFabFilter from "@/components/table/TableFilters/TableFabFilter";

export interface TableWrapperProps {
  scrappedData: ChampionDataScrapped;
  version: string;
  apiData: APIData[];
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
  scrappedData,
  apiData,
  version,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const columnHelper = React.useMemo(() => createColumnHelper<APIData>(), []);
  const globalFilterFn = React.useCallback(
    (row: Row<APIData>, columnId: string, filterValue: any) => {
      const searchTerm = String(filterValue);
      return row.original.champion
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
    },
    []
  );
  const tabData = React.useMemo(() => [...apiData], [apiData]);

  const columns = React.useMemo(() => {
    return [
      // Display Column
      columnHelper.accessor((row) => row.champion, {
        id: "champion",
        cell: (props) => <ChampionCell props={props} />,
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-1/4 px-2 py-2 sm:w-1/5 md:w-1/4"
            title="Champion"
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
  }, []);

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
    debugTable: true,
  });
  return (
    <div className="container max-w-5xl p-1">
      <div className="relative flex h-[81svh] min-h-[81svh] w-full flex-col rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg">
        <div className="absolute right-4 top-[-131px]">
          <Image
            className=""
            width={212}
            height={215}
            src={peekingPoro}
            alt="A poro table background"
            title="A poro peeking behind the table"
            placeholder="blur"
            blurDataURL="/transperant-placeholder.png"
          />
        </div>
        {scrappedData && Object.keys(scrappedData).length > 0 ? (
          <>
            <TableWrapperHeader version={version} />

            <div className="max-h-[65svh] w-full overflow-auto rounded-lg shadow-md md:max-h-[73svh] ">
              <Table table={table} />
            </div>
          </>
        ) : (
          <span className="loading loading-spinner loading-lg text-info"></span>
        )}
      </div>
      <TableFabFilter table={table} />
    </div>
  );
};
