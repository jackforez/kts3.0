import React from "react";

const Sidebar = ({ size }) => {
  return (
    <div
      className={`h-screen overflow-auto ${
        size ? size : ""
      } bg-blue-950 md:block hidden`}
    >
      Sidebar
    </div>
  );
};

export default Sidebar;
