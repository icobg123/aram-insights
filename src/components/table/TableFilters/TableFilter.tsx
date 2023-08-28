import { Column, Table } from "@tanstack/table-core";
import { DebouncedInput } from "@/components/table/DebouncedInput";
import React from "react";
import { TextFilter } from "@/components/table/TableFilters/TextFilter";

export default function TableFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(() => {
    const uniqueValues = Array.from(
      column.getFacetedUniqueValues().keys()
    ).sort();
    return typeof firstValue === "number" ? [] : uniqueValues;
  }, [column, firstValue]);
  const noArrowsClasses =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  return typeof firstValue === "number" ? (
    <div className="join ">
      <DebouncedInput
        type="number"
        debounce={500}
        // min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        // max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ""
        }`}
        className={`
          "input focus:ring-0"  join-item input-xs w-1/2 bg-gray-900 text-gray-400 focus:border-gray-400
        ${noArrowsClasses}`}
      />
      <DebouncedInput
        type="number"
        debounce={500}
        // min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
        // max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ""
        }`}
        className={`
          "input focus:ring-0"  join-item input-xs w-1/2 bg-gray-900 text-gray-400 focus:border-gray-400
        ${noArrowsClasses}`}
      />
    </div>
  ) : (
    <TextFilter
      sortedUniqueValues={sortedUniqueValues}
      column={column}
      columnFilterValue={columnFilterValue}
      totalResults={table.getFilteredRowModel().rows.length}
    />
  );
}
