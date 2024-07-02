import React from "react";
import logo from "../assets/logo.svg";
function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center flex-col p-6  rounded-lg">
      <img src={logo} alt="" className="animate-bounce w-20" />
      <div>Đang tải dữ liệu ...</div>
    </div>
  );
}

export default Loading;
