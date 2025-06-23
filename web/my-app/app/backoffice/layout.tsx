import React from "react";
import SideBar from "./components/sidebar";

const BackOfficeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen h-screen">
      <SideBar />
      <div className="overflow-y-auto w-full">{children}</div>
    </div>
  );
};

export default BackOfficeLayout;
