import React, { useState } from "react";
import { Button } from "../components";
import { excel } from "../ultis/svgs";
const Viettel = () => {
  const [file, setFile] = useState({});
  console.log(file);
  return (
    // content
    <div className="p-3">
      {/* header */}
      <h3 className="uppercase font-semibold py-3 ">Tạo đơn từ file excel</h3>
      <div className="flex justify-between h-full">
        <div className="w-1/2 bg-white p-1 rounded">
          <input
            type="file"
            className="hidden"
            id="myip"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="primary"
            padding={"sm"}
            callback={() => {
              document.getElementById("myip").click();
            }}
          >
            Chọn file
          </Button>
          <span className="px-3">
            {file?.name || "Chưa có file nào được chọn"}
          </span>
        </div>
        {/* <div className="space-x-3"> */}
        <Button>Tải file mẫu</Button>
        {/* <Button>Xuất file</Button>
        </div> */}
      </div>
      {/* main */}
      <h3 className="uppercase font-semibold py-3 ">Tạo đơn lẻ</h3>
    </div>
  );
};

export default Viettel;
