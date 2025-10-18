import React from "react";
import TableFilter from "@/components/table/table-filters/TableFilter";
import { Table as TanTable } from "@tanstack/table-core/build/lib/types";

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
  return (
    <>
      <button
        className="btn btn-circle btn-primary fixed bottom-10 right-7 md:hidden"
        aria-label="Open filters"
        onClick={() => window.filterModal.showModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
        </svg>
      </button>
      <dialog id="filterModal" className="modal">
        <form method="dialog" className="modal-box bg-base-200">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>
          <h2 className="text-lg font-bold">Filters</h2>
          {table.getHeaderGroups().map((headerGroup) => (
            <React.Fragment key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <React.Fragment key={header.id}>
                  {header.column.getCanFilter() ? (
                    <div className="flex flex-col space-y-3 pt-2">
                      <span>{`${
                        tableHeaderTitles[header.column.id]
                      }`}</span>
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
