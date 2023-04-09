import { useState } from "react";

import { pencil, trash } from "./ultis/svgs";
import Home from "./pages/Home";
const handleClick = (e) => {
  e.preventDefault();
  console.log("click");
};
function App() {
  const headers = [
    { title: "sản phẩm", size: "w-4/12" },
    { title: "giá bán", size: "w-2/12" },
    { title: "danh mục", size: "w-2/12" },
    { title: "trạng thái", size: "w-2/12" },
    { title: "thao tác", size: "w-2/12" },
  ];
  const data = [];
  return (
    <div className="flex">
      <Home />
    </div>
  );
}

export default App;
