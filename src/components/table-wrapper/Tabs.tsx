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
    <>
      <div className="tabs z-40 flex pb-2">
        {tabLabels.map((label, index) => (
          <a
            href={`#${tabs[index]}`}
            key={index}
            aria-label={tabs[index]}
            className={`tab-bordered tab flex-auto text-gray-200 ${
              activeTab === index ? "tab-active bg-gray-700" : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="container max-w-5xl">
        <div className="max-h-[62svh] w-full overflow-auto rounded-lg shadow-md md:max-h-[66svh]">
          {tabContents[activeTab]}
        </div>
      </div>
    </>
  );
};

export default Tabs;
