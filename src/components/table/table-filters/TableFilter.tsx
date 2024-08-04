import { Column, Table } from "@tanstack/table-core";
import { DebouncedInput } from "@/components/table/DebouncedInput";
import React from "react";
import { TextFilter } from "@/components/table/table-filters/TextFilter";

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
    const uniqueValues = table
      .getFilteredRowModel()
      .rows.map((row) => row.getValue("champion"));
    return typeof firstValue === "number" ? [] : uniqueValues;
  }, [firstValue, table]);

  const uniqueValues = table
    .getFilteredRowModel()
    .rows.map((row) => row.getValue("champion"));
  /*const sortedUniqueValues = React.useMemo(() => {
        const uniqueValues = Array.from(
          column.getFacetedUniqueValues().keys()
        ).sort();
        return typeof firstValue === "number" ? [] : uniqueValues;
      }, [column, firstValue]);*/
  const noArrowsClasses =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  //TODO: Make number input change color based on value. e.g. green if positive, red if negative for dmg dealt and opposite for dmg received
  const numberInputColours = (columnFilterValue as [number, number])?.[0]
    ? (columnFilterValue as [number, number])?.[0] >= 0
      ? "text-green-400"
      : "text-red-400"
    : "text-gray-400";

  return typeof firstValue === "number" ? (
    <div className="join">
      <DebouncedInput
        label={column.id}
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
        className={`input input-xs join-item w-1/2 bg-gray-900 font-normal text-gray-400 ${noArrowsClasses}`}
      />
      <DebouncedInput
        label={column.id}
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
        className={`input input-xs join-item w-1/2 bg-gray-900 font-normal text-gray-400 ${noArrowsClasses}`}
      />
    </div>
  ) : (
    <TextFilter
      sortedUniqueValues={typeof firstValue === "number" ? [] : uniqueValues}
      column={column}
      columnFilterValue={columnFilterValue}
      totalResults={table.getFilteredRowModel().rows.length}
    />
  );
}
