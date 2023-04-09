import { useState } from "react";
import { Input } from "./components";
import Button from "./components/Button";
import GridData from "./components/GridData";
import Sidebar from "./components/Sidebar";
import { pencil, trash } from "./ultis/svgs";
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
      <Sidebar size="w-72" />
      <div className="flex-1">
        <Button
          type="danger"
          title="nuts"
          size="w-1/2"
          icon={trash}
          // iconSize={5}
          callback={handleClick}
        >
          abc
        </Button>
        <GridData headers={headers}>
          {data.length > 0 ? (
            data.map((d, i) => {
              return <div key={i}>abc</div>;
            })
          ) : (
            <div className="flex justify-center py-2 bg-red-500">
              Không có dữ liệu phù hợp
            </div>
          )}
        </GridData>
        <Input
          type="text"
          placehoder="nhập gì đó..."
          size="w-full"
          icon={pencil}
          disabledBy={false}
        />
      </div>
    </div>
  );
}

export default App;
