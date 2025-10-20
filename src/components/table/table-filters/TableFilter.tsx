import { Column, Table } from "@tanstack/table-core";
import { TableInput } from "@/components/table/TableInput";
import React from "react";
import { TextFilter } from "@/components/table/table-filters/TextFilter";
import { cn } from "@/lib/cn";

export default function TableFilter({
  column,
  table,
  placeholder,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
  placeholder?: string;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();
  const noArrowsClasses =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const minMaxClasses = cn(
    `input input-md join-item font-normal md:input-xs`,
    noArrowsClasses
  );
  //TODO: Make number input change color based on value. e.g. green if positive, red if negative for dmg dealt and opposite for dmg received
  const numberInputColours = (columnFilterValue as [number, number])?.[0]
    ? (columnFilterValue as [number, number])?.[0] >= 0
      ? "text-success"
      : "text-error"
    : "";

  return typeof firstValue === "number" ? (
    <div className="join">
      <TableInput
        label={column.id}
        type="number"
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
        className={minMaxClasses}
      />
      <TableInput
        label={column.id}
        type="number"
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
        className={minMaxClasses}
      />
    </div>
  ) : (
    <TextFilter
      column={column}
      columnFilterValue={columnFilterValue}
      totalResults={table.getFilteredRowModel().rows.length}
      placeholder={placeholder}
    />
  );
}
