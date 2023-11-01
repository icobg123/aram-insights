import React from "react";
import Image from "next/legacy/image";
import logo from "../../../public/logo.jpeg";

interface TableWrapperHeaderProps {
  version: string;
  children?: React.ReactNode;
}

export const TableWrapperHeader = ({
  version,
  children,
}: TableWrapperHeaderProps) => {
  /*Tooltip overflows causing the page to break*/

  return (
    <div className=" relative z-[100] flex items-center justify-between">
      {children}
      <div className="avatar">
        <div className="rounded-full">
          <Image
            src={logo}
            width={64}
            height={64}
            alt="Aram Balance logo"
            placeholder="blur"
            blurDataURL="/transperant-placeholder.png"
          />
        </div>
      </div>
      {/*<div className="tooltip ml-2 self-end" data-tip="League of Legends patch">*/}
      <div className="ml-2 flex flex-grow justify-between md:items-baseline">
        <div className="prose">
          <h1 className="mb-0 font-medium">Aram balance</h1>
        </div>
        <div className="badge badge-neutral ml-2 self-end md:self-baseline">
          <span>
            <a
              target={"_blank"}
              href={
                "https://leagueoflegends.fandom.com/wiki/ARAM#Mode-Specific_Changes"
              }
            >
              {"v" + version}
            </a>
          </span>
        </div>
      </div>
      {/*</div>*/}
    </div>
  );
};
