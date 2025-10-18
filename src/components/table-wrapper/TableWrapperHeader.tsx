import React from "react";
import { getWikiUrl } from "@/app/fetching/scraping";
import TableImage from "@/components/table-wrapper/TableImage";
import peekingPoro from "@/public/peeking-poro.svg";

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
    <>
      <TableImage
        src={peekingPoro}
        priority
        alt="A poro table background"
        title="A poro peeking behind the table"
        placeholder="blur"
        blurDataURL="/transperant-placeholder.png"
      />
      <div className="relative flex items-center justify-between">
        {children}
        <div className="ml-2 flex flex-grow justify-between md:items-baseline">
          <div className="prose">
            <h1 className="mb-0 font-medium">{mode}</h1>
          </div>
          <div className="badge badge-neutral z-40 ml-2 self-end md:self-baseline">
            <span>
              <a target={"_blank"} href={getWikiUrl(mode)}>
                {"v" + version}
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
