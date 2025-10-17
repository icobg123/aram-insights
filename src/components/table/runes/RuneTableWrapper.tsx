"use client";
import React, { useEffect } from "react";
import { useReactTable } from "@tanstack/react-table";
import RuneCell from "@/components/table/runes/RuneCell";
import { RunesChangesScrapped } from "@/types";
import { Table } from "@/components/table/Table";
import { TableHeadCell } from "@/components/table/TableHeadCell";
import TableFilter from "@/components/table/table-filters/TableFilter";
import TableFabFilter from "@/components/table/table-filters/TableFabFilter";
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
import { useTableState } from "@/hooks/useTableState";

export interface TableWrapperProps {
  runeData: RunesChangesScrapped[];
}

export const RuneTableWrapper: React.FC<TableWrapperProps> = ({ runeData }) => {
  const { search, setSearch, tab } = useTableState();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      // Initialize column filter from URL search param
      if (search && tab === "runes") {
        return [{ id: "runeName", value: search }];
      }
      return [];
    }
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Sync URL search param with rune column filter
  useEffect(() => {
    if (tab === "runes") {
      const runeFilter = columnFilters.find((f) => f.id === "runeName");
      const filterValue = runeFilter?.value as string | undefined;
      if (filterValue !== search) {
        if (filterValue) {
          setColumnFilters([{ id: "runeName", value: search }]);
        } else if (search) {
          setColumnFilters([{ id: "runeName", value: search }]);
        }
      }
    } else {
      // Clear filters when switching away from this tab
      if (columnFilters.length > 0) {
        setColumnFilters([]);
      }
    }
  }, [search, tab]);

  // Update URL when rune column filter changes
  useEffect(() => {
    if (tab === "runes") {
      const runeFilter = columnFilters.find((f) => f.id === "runeName");
      const filterValue = (runeFilter?.value as string) || "";
      if (filterValue !== search) {
        void setSearch(filterValue || null);
      }
    }
  }, [columnFilters, tab, setSearch]);
  const columnHelper = React.useMemo(
    () => createColumnHelper<RunesChangesScrapped>(),
    []
  );
  const globalFilterFn = React.useCallback(
    (row: Row<RunesChangesScrapped>, columnId: string, filterValue: any) => {
      const searchTerm = String(filterValue).toLowerCase();
      return row.original.runeName
        .toLowerCase()
        .includes(searchTerm);
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
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-1/4 px-2 py-2 sm:w-1/5 md:w-1/4"
            title="Rune"
            filter={<TableFilter column={header.column} table={header.table} placeholder="Search runes..." />}
          />
        ),
        enableColumnFilter: true,
        filterFn: globalFilterFn,
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.changes, {
        id: "runeChanges",
        cell: (info) => {
          const runeChanges = info.getValue();
          return (
            <td className={`p-2 text-left md:p-4`}>
              {runeChanges ? (
                <div className="flex flex-col space-y-1 whitespace-pre-wrap">
                  {runeChanges.map((change, index) => (
                    <div key={index + change}>{change}</div>
                  ))}
                </div>
              ) : (
                "No changes"
              )}
            </td>
          );
        },
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-auto px-2 py-2 md:w-[100px]"
            title="Changes"
          />
        ),
        footer: (props) => props.column.id,
      }),
    ];
  }, [columnHelper, globalFilterFn]);

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
        <>
          <Table table={table} />
          <TableFabFilter table={table} />
        </>
      ) : (
        <span className="loading loading-spinner loading-lg text-info"></span>
      )}
    </>
  );
};
