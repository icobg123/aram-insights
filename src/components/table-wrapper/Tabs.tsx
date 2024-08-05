"use client";

import React, { ReactNode, useState } from "react";

interface TabsProps {
  tabLabels: string[];
  tabContents: ReactNode[];
  initialTab: number;
}

const Tabs: React.FC<TabsProps> = ({ tabLabels, tabContents, initialTab }) => {
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  return (
    <>
      <div className="tabs z-40 flex pb-2">
        {tabLabels.map((label, index) => (
          <a
            href={`#${tabLabels[index]}`}
            key={index}
            aria-label={tabLabels[index]}
            className={`tab-bordered tab flex-auto rounded-t-lg text-gray-200 ${
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
