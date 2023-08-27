"use client";
import React from "react";
import { AbilityChangesScrapped, ChampionDataScrapped } from "@/app/page";
import Image from "next/legacy/image";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";
import peekingPoro from "../../../public/peeking-poro.svg";

import {
  ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
} from "@tanstack/table-core";
import { useReactTable } from "@tanstack/react-table";
import { DebouncedInput } from "@/components/table/DebouncedInput";
import OtherChangesCell from "@/components/table/OtherChangesCell";
import { SearchBar } from "@/components/table-wrapper/SearchBar";
import { Table } from "@/components/table/Table";
import ChampionCell from "@/components/table/ChampionCell";
import { TableHeadCell } from "@/components/table/TableHeadCell";

export interface APIData {
  // [champion: string]: {
  champion: string;
  damageDealt: number;
  damageReceived: number;
  generalChanges: string[];
  abilityChanges: AbilityChangesScrapped[];
  winRate: string;
  icon?: string;
  title?: string;
  spells?: { [spellName: string]: string };
  // };
}

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
  const columnHelper = createColumnHelper<APIData>();
  const columns = React.useMemo(() => {
    return [
      // Display Column
      columnHelper.accessor((row) => row.champion, {
        id: "champion",
        cell: (props) => <ChampionCell props={props} />,
        header: (header) => (
          <TableHeadCell
            header={header}
            className="w-1/4 px-4 py-3 sm:w-1/5 md:w-1/4"
            title="Champion"
          />
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.winRate, {
        id: "winRate",
        cell: (info) => {
          const winrate = info.getValue();
          return <td className="p-2 md:p-4">{winrate}%</td>;
        },
        header: (header) => (
          <TableHeadCell
            header={header}
            className="w-auto px-4 py-3 md:w-[100px]"
            title="Win %"
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
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
            className="w-auto px-1 py-3 md:w-[100px]"
            title="Dmg dealt"
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
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
            className="w-auto px-1 py-3 md:w-[100px]"
            title="Dmg received"
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
      }),
      columnHelper.accessor((row) => row, {
        id: "Changes",
        cell: (props) => <OtherChangesCell props={props} />,
        header: () => (
          <th scope="col" className="w-1/4 px-4 py-3 text-center  md:w-1/3">
            Other changes
          </th>
        ),
        enableColumnFilter: false,
        enableResizing: true,
        minSize: 100,
        size: 100,
      }),
    ];
  }, [columnHelper]);
  const globalFilterFn = React.useCallback(
    (row: Row<APIData>, columnId: string, filterValue: any) => {
      const searchTerm = String(filterValue);
      return row.original.champion
        .toLowerCase()
        .startsWith(searchTerm.toLowerCase());
    },
    []
  );
  const table = useReactTable({
    data: apiData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn,
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });
  return (
    <div className="container max-w-5xl p-1">
      <div className="relative w-full rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg md:h-[81svh] md:min-h-[81svh]">
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
            <TableWrapperHeader version={version}>
              <SearchBar>
                <DebouncedInput
                  value={globalFilter ?? ""}
                  onChange={(value) => setGlobalFilter(String(value))}
                  className="input input-bordered w-full max-w-xs bg-gray-900 text-gray-400 focus:border-gray-400 focus:ring-0"
                  placeholder="Search for a champion"
                  type="text"
                  id="champSearch"
                  autoFocus
                  clearInput
                />
              </SearchBar>
            </TableWrapperHeader>

            <div className="max-h-[65svh] w-full overflow-auto rounded-lg shadow-md md:max-h-[68svh] ">
              <Table table={table} />
            </div>
          </>
        ) : (
          <span className="loading loading-spinner loading-lg text-info"></span>
        )}
      </div>
    </div>
  );
};
