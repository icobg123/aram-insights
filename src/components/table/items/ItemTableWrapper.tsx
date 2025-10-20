"use client";
import React, { useEffect, useRef } from "react";

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

import ItemCell from "@/components/table/items/ItemCell";
import { ItemChangesScrapped } from "@/types";
import { TableHeadCell } from "@/components/table/TableHeadCell";
import { Table } from "@/components/table/Table";
import TableFilter from "@/components/table/table-filters/TableFilter";
import TableFabFilter from "@/components/table/table-filters/TableFabFilter";
import { useTableState } from "@/hooks/useTableState";

export interface TableWrapperProps {
  itemData: ItemChangesScrapped[];
}

export const ItemTableWrapper: React.FC<TableWrapperProps> = ({ itemData }) => {
  const { search, setSearch, tab } = useTableState();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => {
      // Initialize column filter from URL search param
      if (search && tab === "items") {
        return [{ id: "itemName", value: search }];
      }
      return [];
    }
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Use ref to prevent infinite loop between the two effects
  const isUpdatingFromUrl = useRef(false);
  const isUpdatingFromFilter = useRef(false);

  // Sync URL search param with item column filter
  useEffect(() => {
    if (isUpdatingFromFilter.current) {
      isUpdatingFromFilter.current = false;
      return;
    }

    if (tab === "items") {
      const itemFilter = columnFilters.find((f) => f.id === "itemName");
      const currentFilterValue = (itemFilter?.value as string) || "";
      const searchValue = search || "";

      if (currentFilterValue !== searchValue) {
        isUpdatingFromUrl.current = true;
        if (searchValue) {
          setColumnFilters([{ id: "itemName", value: searchValue }]);
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

  // Update URL when item column filter changes
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    if (tab === "items") {
      const itemFilter = columnFilters.find((f) => f.id === "itemName");
      const filterValue = (itemFilter?.value as string) || "";
      const searchValue = search || "";

      if (filterValue !== searchValue) {
        isUpdatingFromFilter.current = true;
        void setSearch(filterValue || null);
      }
    }
  }, [columnFilters, tab]);
  const columnHelper = React.useMemo(
    () => createColumnHelper<ItemChangesScrapped>(),
    []
  );
  const globalFilterFn = React.useCallback(
    (row: Row<ItemChangesScrapped>, columnId: string, filterValue: any) => {
      const searchTerm = String(filterValue).toLowerCase();
      return row.original.itemName.toLowerCase().includes(searchTerm);
    },
    []
  );

  const itemsTabData = React.useMemo(() => [...itemData], [itemData]);

  const columns = React.useMemo(() => {
    return [
      columnHelper.accessor((row) => row, {
        id: "itemName",
        cell: (props) => <ItemCell props={props} />,
        header: (header) => (
          <TableHeadCell
            header={header}
            table={header.table}
            className="w-1/4 px-2 py-2 sm:w-1/5 md:w-1/4"
            title="Item"
            filter={
              <TableFilter
                column={header.column}
                table={header.table}
                placeholder="Search items..."
              />
            }
          />
        ),
        enableColumnFilter: true,
        filterFn: globalFilterFn,
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.changes, {
        id: "itemChanges",
        cell: (info) => {
          const itemChanges = info.getValue();
          return (
            <td className={`p-2 text-left md:p-4`}>
              {itemChanges ? (
                <div className="flex flex-col space-y-1 whitespace-pre-wrap">
                  {itemChanges.map((change, index) => (
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
      {itemData && itemData.length > 0 ? (
        <>
          <Table table={table} />
          <TableFabFilter table={table} />
        </>
      ) : (
        <span className="loading loading-lg loading-spinner text-info"></span>
      )}
    </>
  );
};
