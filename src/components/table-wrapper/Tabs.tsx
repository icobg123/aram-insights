"use client";

import React, { ReactNode, useState } from "react";
import { tabs } from "@/components/table-wrapper/TableWrapper";

interface TabsProps {
  tabLabels: string[];
  tabContents: ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ tabLabels, tabContents }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="container max-w-5xl p-1">
      <div className="relative flex h-[81svh] min-h-[81svh] w-full flex-col rounded-lg bg-gray-950 px-4 pb-4 pt-3 shadow-lg">
        <div className="tabs flex pb-2">
          {tabLabels.map((label, index) => (
            <div
              key={index}
              aria-label={tabs[index]}
              className={`tab-bordered tab flex-auto ${
                activeTab === index && "tab-active"
              }`}
              onClick={() => setActiveTab(index)}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="container max-w-5xl">
          <div className="max-h-[62svh] w-full overflow-auto rounded-lg shadow-md md:max-h-[66svh]">
            {tabContents[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
