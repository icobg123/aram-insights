import React, { useState } from "react";
import "daisyui/dist/full.css"; // Import DaisyUI styles

type Props = {
  tabOneChildren?: React.ReactNode;
  tabTwoChildren?: React.ReactNode;
  tabThreeChildren?: React.ReactNode;
};

const TabsComponent = ({
  tabOneChildren,
  tabTwoChildren,
  tabThreeChildren,
}: Props) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <>
      <div className="tabs flex pb-2">
        {tabOneChildren && (
          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 0 && "tab-active"
            }`}
            onClick={() => setActiveTab(0)}
          >
            Champions
          </a>
        )}
        {tabTwoChildren && (
          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 1 && "tab-active"
            }`}
            onClick={() => setActiveTab(1)}
          >
            Items
          </a>
        )}
        {tabThreeChildren && (
          <a
            className={`tab tab-bordered flex-auto ${
              activeTab === 2 && "tab-active"
            }`}
            onClick={() => setActiveTab(2)}
          >
            Runes
          </a>
        )}
      </div>
    </>
  );
};

export default TabsComponent;
