"use client";
import React, { useEffect, useRef } from "react";

import {
  CellContext,
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
import { useTableState } from "@/hooks/useTableState";
import { useMedia } from "react-use";

export interface TableWrapperProps {
  ChampionDataApi: ChampionDataApi[];
}

export const ChampionTableWrapper: React.FC<TableWrapperProps> = ({
  ChampionDataApi,
}) => {
  const { search, setSearch, tab } = useTableState();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      // Initialize column filter from URL search param
      if (search && tab === "champions") {
        return [{ id: "champion", value: search }];
      }
      return [];
    }
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const isLarge = useMedia("(min-width: 768px)", true);

  // Use ref to prevent infinite loop between the two effects
  const isUpdatingFromUrl = useRef(false);
  const isUpdatingFromFilter = useRef(false);

  // Sync URL search param with champion column filter
  useEffect(() => {
    if (isUpdatingFromFilter.current) {
      isUpdatingFromFilter.current = false;
      return;
    }

    if (tab === "champions") {
      // Only update columnFilters if search param changes and differs from current filter
      const championFilter = columnFilters.find((f) => f.id === "champion");
      const currentFilterValue = (championFilter?.value as string) || "";
      const searchValue = search || "";

      if (currentFilterValue !== searchValue) {
        isUpdatingFromUrl.current = true;
        if (searchValue) {
          setColumnFilters([{ id: "champion", value: searchValue }]);
        } else {
          setColumnFilters([]);
        }
      }
    } else {
      // Clear filters when switching away from this tab
      if (columnFilters.length > 0) {
        setColumnFilters([]);
      }
    }
  }, [search, tab]);

  // Update URL when champion column filter changes (user types in filter)
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    if (tab === "champions") {
      const championFilter = columnFilters.find((f) => f.id === "champion");
      const filterValue = (championFilter?.value as string) || "";
      const searchValue = search || "";

      // Only update URL if filter was changed by user input (not by URL sync)
      if (filterValue !== searchValue) {
        isUpdatingFromFilter.current = true;
        void setSearch(filterValue || null);
      }
    }
  }, [columnFilters, tab]);
  const columnHelper = React.useMemo(
    () => createColumnHelper<ChampionDataApi>(),
    []
  );
  const globalFilterFn = React.useCallback(
    (row: Row<ChampionDataApi>, columnId: string, filterValue: any) => {
      const searchTerm = String(filterValue).toLowerCase();
      return row.original.champion.toLowerCase().includes(searchTerm);
    },
    []
  );
  const tabData = React.useMemo(() => [...ChampionDataApi], [ChampionDataApi]);

  const columns = React.useMemo(() => {
    const cols: any[] = [
      // Display Column
      columnHelper.accessor((row) => row.champion, {
        id: "champion",
        cell: (props) => <TableCell props={props} />,
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-1/5 max-w-[100px] px-2 py-2 sm:w-1/5 md:w-1/4"
            title="Champion"
            filter={
              <TableFilter
                column={header.column}
                table={header.table}
                placeholder="Who's your pick?"
              />
            }
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
            filter={<TableFilter column={header.column} table={header.table} />}
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
                    ? "text-success"
                    : "text-error"
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
            filter={<TableFilter column={header.column} table={header.table} />}
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
                    ? "text-success"
                    : "text-error"
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
            filter={<TableFilter column={header.column} table={header.table} />}
          />
        ),
        footer: (props) => props.column.id,
        enableColumnFilter: true,
      }),
    ];
    if (isLarge) {
      const otherChanges = columnHelper.display({
        id: "otherChanges",
        cell: (props) => (
          <OtherChangesCell
            props={props as CellContext<ChampionDataApi, ChampionDataApi>}
          />
        ),
        header: () => (
          <th
            scope="col"
            className="hidden w-1/4 cursor-default px-2 py-2 text-center md:table-cell md:w-1/3"
          >
            Other changes
          </th>
        ),
        enableColumnFilter: false,
      });
      cols.push(otherChanges);
    }

    return cols;
  }, [columnHelper, globalFilterFn, isLarge]);

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
