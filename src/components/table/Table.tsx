import { TableHead } from "@/components/table/TableHead";
import React from "react";

export interface TableProps {
  children?: React.ReactNode;
}

export const Table = ({ children }: TableProps) => {
  return (
    <table className="h-full table-fixed bg-gray-900 text-left text-sm text-gray-500">
      <TableHead />
      {children}
    </table>
  );
};
