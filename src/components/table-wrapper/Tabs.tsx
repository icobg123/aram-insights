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
      <div role="tablist" className="tabs tabs-lift z-40">
        {tabLabels.map((label, index) => (
          <a
            key={index}
            role="tab"
            aria-label={tabLabels[index]}
            className={`tab flex-auto ${
              activeTab === index ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="container  w-full max-w-5xl flex-1 overflow-auto rounded-lg shadow-md md:max-h-none">
        {tabContents[activeTab]}
      </div>
    </>
  );
};

export default Tabs;
