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
    <div className="relative z-[100] mb-3 flex items-center justify-between">
      {children}
      {/*<div className="tooltip ml-2 self-end" data-tip="League of Legends patch">*/}
      <div className="ml-2 flex self-end md:flex-shrink-0 md:items-center">
        <h1 className="">Aram balance</h1>
        <div className="badge badge-neutral ml-2 self-end md:self-baseline">
          <span>{"v" + version}</span>
        </div>
      </div>
      {/*</div>*/}
    </div>
  );
};
