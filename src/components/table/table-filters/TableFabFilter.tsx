"use client";
import React from "react";
import TableFilter from "@/components/table/table-filters/TableFilter";
import { Table as TanTable } from "@tanstack/table-core/build/lib/types";
import { useTableState } from "@/hooks/useTableState";
import { Filter } from "lucide-react";
import { cn } from "@/lib/cn";

declare global {
  interface Window {
    filterModal: any; // Change 'any' to the actual type if available
  }
}
type TableFabFilterProps<T = any> = {
  table: TanTable<T>;
};
//declare const object that has key strings and string values

const tableHeaderTitles: { [key: string]: string } = {
  champion: "Champion",
  winRate: "Win %",
  damageDealt: "Dmg Dealt",
  damageReceived: "Dmg Received",
  otherChanges: "Other Changes",
  itemName: "Item",
  itemChanges: "Changes",
  runeName: "Rune",
  runeChanges: "Changes",
};
const TableFabFilter = ({ table }: TableFabFilterProps) => {
  const { tab, setTab } = useTableState();
  return (
    <>
      <button
        className={cn(
          "btn fixed right-7 bottom-10 btn-circle btn-primary md:hidden",
          tab !== "champions" && "hidden"
        )}
        aria-label="Open filters"
        onClick={() => window.filterModal.showModal()}
      >
        <Filter size={16} />
      </button>
      <dialog id="filterModal" className="modal modal-bottom">
        <form method="dialog" className="modal-box bg-base-200">
          <button className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
            ✕
          </button>
          <h2 className="text-lg font-bold">Filters</h2>
          {table.getHeaderGroups().map((headerGroup) => (
            <React.Fragment key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <React.Fragment key={header.id}>
                  {header.column.getCanFilter() ? (
                    <div className="flex flex-col space-y-3 pt-2">
                      <span>{`${tableHeaderTitles[header.column.id]}`}</span>
                      <TableFilter column={header.column} table={table} />
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default TableFabFilter;
