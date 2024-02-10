import React from "react";
import { getWikiUrl } from "@/scraping";

interface TableWrapperHeaderProps {
  version: string;
  children?: React.ReactNode;
  mode: "Aram" | "URF" | "Arena";
}

export const TableWrapperHeader = ({
  version,
  children,
  mode,
}: TableWrapperHeaderProps) => {
  /*Tooltip overflows causing the page to break*/

  return (
    <div className=" relative z-[100] flex items-center justify-between">
      {children}
      {/*<div className="tooltip ml-2 self-end" data-tip="League of Legends patch">*/}
      <div className="ml-2 flex flex-grow justify-between md:items-baseline">
        <div className="prose">
          <h1 className="mb-0 font-medium">{mode}</h1>
        </div>
        <div className="badge badge-neutral ml-2 self-end md:self-baseline">
          <span>
            <a target={"_blank"} href={getWikiUrl(mode)}>
              {"v" + version}
            </a>
          </span>
        </div>
      </div>
      {/*</div>*/}
    </div>
  );
};
