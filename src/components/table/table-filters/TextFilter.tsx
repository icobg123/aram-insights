import { TableInput } from "@/components/table/TableInput";
import React from "react";
import { Column } from "@tanstack/table-core";
import { useMedia } from "react-use";

type TextFilterProps = {
  column: Column<any, unknown>;
  columnFilterValue?: string | number | undefined | unknown;
  totalResults: number;
  placeholder?: string;
};
export const TextFilter = ({
  column,
  columnFilterValue,
  totalResults,
  placeholder = "Search...",
}: TextFilterProps) => {
  const isLarge = useMedia("(min-width: 768px)", true);
  return (
    <>
      <div className="join w-full flex-1 md:w-7/8">
        <div className="btn join-item flex min-w-[38px] items-center justify-center text-base-content/70 md:btn-xs">
          {totalResults}
        </div>
        <TableInput
          label={`${column.id} search`}
          type="text"
          id={column.id + "list"}
          value={(columnFilterValue ?? "") as string}
          onChange={(value: string | number) => column.setFilterValue(value)}
          placeholder={placeholder}
          className="input-md join-item w-full md:input-xs"
          list={column.id + "list"}
          clearInput
          autoFocus={isLarge}
        />
      </div>
    </>
  );
};
