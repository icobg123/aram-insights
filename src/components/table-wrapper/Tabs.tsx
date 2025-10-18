"use client";

import React, { ReactNode, useEffect } from "react";
import { useTableState } from "@/hooks/useTableState";

interface TabsProps {
  tabLabels: string[];
  tabContents: ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ tabLabels, tabContents }) => {
  const { tab, setTab } = useTableState();

  // Determine active tab index from URL
  const activeTab = React.useMemo(() => {
    const normalizedTab = tab.toLowerCase();
    const index = tabLabels.findIndex(
      (label) => label.toLowerCase() === normalizedTab
    );
    return index >= 0 ? index : 0;
  }, [tab, tabLabels]);

  // Set initial tab if not present in URL
  useEffect(() => {
    if (!tab) {
      setTab(tabLabels[0].toLowerCase());
    }
  }, [tab, setTab, tabLabels]);

  const handleTabClick = (index: number) => {
    setTab(tabLabels[index].toLowerCase());
  };

  return (
    <>
      <div className="tabs z-40 flex pb-2">
        {tabLabels.map((label, index) => (
          <button
            key={index}
            aria-label={tabLabels[index]}
            className={`tab-bordered tab flex-auto rounded-t-lg text-gray-200 ${
              activeTab === index ? "tab-active bg-gray-700" : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {label}
          </button>
        ))}
      </div>

        <div className="flex-1 container max-w-5xl max-h-[62svh] w-full overflow-auto rounded-lg shadow-md md:max-h-none">
          {tabContents[activeTab]}
        </div>

    </>
  );
};

export default Tabs;
