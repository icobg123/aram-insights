"use client";
import React, { useState } from "react";
import { APIData, ScrappedData } from "@/app/page";
import Image from "next/legacy/image";
import { TableWrapperHeader } from "@/components/table-wrapper/TableWrapperHeader";
import peekingPoro from "../../../public/peeking-poro.svg";
import { ItemTable } from "@/components/table-wrapper/ItemTable";
import { ChampionTable } from "@/components/table-wrapper/ChampionTable";

export interface TableWrapperProps {
  scrappedData: ScrappedData;
  version: string;
  apiData: APIData[];
}

export const TableWrapper: React.FC<TableWrapperProps> = ({
  scrappedData,
  apiData,
  version,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="container max-w-5xl p-1">
      <div className="relative flex h-[81svh] min-h-[81svh] w-full flex-col rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg">
        <div className="absolute right-4 top-[-131px]">
          <Image
            className=""
            width={212}
            height={215}
            src={peekingPoro}
            alt="A poro table background"
            title="A poro peeking behind the table"
            placeholder="blur"
            blurDataURL="/transperant-placeholder.png"
          />
        </div>
        <TableWrapperHeader version={version} />
        <div className="tabs flex pb-2">
          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 0 && "tab-active"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Champions
          </a>

          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 1 && "tab-active"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Items
          </a>
        </div>
        {scrappedData && Object.keys(scrappedData).length > 0 ? (
          <div className="container max-w-5xl">
            <div className="max-h-[62svh] w-full overflow-auto rounded-lg shadow-md md:max-h-[66svh]">
              <div>
                {activeTab === 0 && (
                  <ChampionTable
                    scrappedData={scrappedData}
                    apiData={apiData}
                    version={version}
                  />
                )}
                {activeTab === 1 && <ItemTable scrappedData={scrappedData} />}
                {/*{activeTab === 2 && tabThreeChildren && <div>{tabThreeChildren}</div>}*/}
              </div>
            </div>
          </div>
        ) : (
          <span className="loading loading-spinner loading-lg text-info"></span>
        )}
      </div>
    </div>
  );
};
