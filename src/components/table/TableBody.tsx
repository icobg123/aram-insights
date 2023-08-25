import React from "react";

type TableBodyProps = {
  children?: React.ReactNode;
};
export const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className=" w-full min-w-full overflow-y-scroll">{children}</tbody>
  );
};
