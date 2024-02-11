import { DebouncedInput } from "@/components/table/DebouncedInput";
import React from "react";
import { Column } from "@tanstack/table-core";

type TextFilterProps = {
  column: Column<any, unknown>;
  columnFilterValue?: string | number | undefined | unknown;
  sortedUniqueValues: any[];
  totalResults: number;
};
export const TextFilter = ({
  column,
  columnFilterValue,
  sortedUniqueValues,
  totalResults,
}: TextFilterProps) => {
  return (
    <>
      <div className="w-7/8 join join-horizontal">
        <div className="join-item  btn-xs flex min-w-[38px] items-center justify-end bg-gray-900 text-gray-400">
          {totalResults}
        </div>
        <DebouncedInput
          type="text"
          id={column.id + "list"}
          value={(columnFilterValue ?? "") as string}
          onChange={(value: string | number) => column.setFilterValue(value)}
          placeholder={`Who's your pick?`}
          className="input join-item input-xs w-full rounded bg-gray-900 font-normal text-gray-400"
          list={column.id + "list"}
          clearInput
          autoFocus
        />
      </div>
    </>
  );
};
