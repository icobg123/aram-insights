import React from "react";

interface TableWrapperHeaderProps {
  version: string;
  children?: React.ReactNode;
}

export const TableWrapperHeader = ({
  version,
  children,
}: TableWrapperHeaderProps) => {
  /*Tooltip overflows causing the page to break*/

  return (
    <div className="mb-3 flex items-center justify-between">
      {children}
      {/*<div className="tooltip ml-2 self-end" data-tip="League of Legends patch">*/}
      <div className="badge badge-neutral ml-2 self-end">
        <span>{"v" + version}</span>
      </div>
      {/*</div>*/}
    </div>
  );
};
