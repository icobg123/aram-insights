import React from "react";
import { getWikiUrl } from "@/app/fetching/scraping";
import TableImage from "@/components/table-wrapper/TableImage";
import peekingPoro from "@/public/peeking-poro.svg";
import Link from "next/link";

interface TableWrapperHeaderProps {
  version: string;
  mode: "Aram" | "URF" | "Arena";
}

export const TableWrapperHeader = ({
  version,
  mode,
}: TableWrapperHeaderProps) => {
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
        <div className="ml-2 flex flex-grow justify-between md:items-baseline">
          <div className="prose">
            <h1 className="mb-0 font-medium">{mode}</h1>
          </div>
          <div className="z-40 ml-2 badge self-end badge-neutral md:self-baseline">
            <span>
              <Link target={"_blank"} href={getWikiUrl(mode)}>
                {"v" + version}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
