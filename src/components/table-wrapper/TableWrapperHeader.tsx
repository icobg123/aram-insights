import {
  Props as SearchBarProps,
  SearchBar,
} from "@/components/table-wrapper/SearchBar";
import React from "react";

interface TableWrapperHeaderProps extends SearchBarProps {
  version: string;
}
export const TableWrapperHeader = ({
  version,
  value,
  handleSearch,
}: TableWrapperHeaderProps) => {
  return (
    <div className="mb-3 flex items-center justify-between">
      <SearchBar handleSearch={handleSearch} value={value} />
      <div className="tooltip ml-2 self-end" data-tip="Leage of Legends patch">
        <div className="badge badge-neutral">v{version}</div>
      </div>
    </div>
  );
};
