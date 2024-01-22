import React, { useState, useEffect } from "react";
import { Button, Input, Selector } from "../components";
import { download, excel, upload } from "../ultis/svgs";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import * as XLSX from "xlsx";
import { loaded, onLoading } from "../redux/systemSlice";
import { useDispatch, useSelector } from "react-redux";
const exceptFileTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csvs",
];
const ExcelDisplay = ({ jsonData }) => {
  return (
    jsonData && (
      <div className="overflow-auto mt-2 max-h-[60vh]">
        <table className="bg-white text-xs rounded-md">
          <thead className="bg-white sticky top-0">
            {jsonData[6] && (
              <tr className="font-semibold">
                <td className="w-[40px] text-center border border-gray-200">
                  {jsonData[6][0]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {jsonData[6][1]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {jsonData[6][2]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {jsonData[6][3]}
                </td>
                <td className="w-[340px] text-center border border-gray-200">
                  {jsonData[6][4]}
                </td>
                <td className="w-[340px] text-center border border-gray-200">
                  {jsonData[6][5]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {jsonData[6][6]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {jsonData[6][7]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {jsonData[6][8]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {jsonData[6][9]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {jsonData[6][10]}
                </td>
                <td className="w-[200px] text-center border border-gray-200">
                  {jsonData[6][11]}
                </td>
                <td className="w-[140px] text-center border border-gray-200">
                  {jsonData[6][12]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {jsonData[6][13]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {jsonData[6][14]}
                </td>
                <td className="w-[60px] text-center border border-gray-200">
                  {jsonData[6][15]}
                </td>
                <td className="w-[60px] text-center border border-gray-200">
                  {jsonData[6][16]}
                </td>
                <td className="w-[60px] text-center border border-gray-200">
                  {jsonData[6][17]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {jsonData[6][18]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {jsonData[6][19]}
                </td>
                <td className="w-[140px] text-center border border-gray-200">
                  {jsonData[6][20]}
                </td>
              </tr>
            )}
          </thead>
          <tbody className="">
            {jsonData.slice(7).map((row, rowIndex) => (
              <tr
                className={`w-full ${row[1] ? "bg-green-200" : "bg-red-100"}`}
                key={rowIndex}
              >
                <td className="w-[40px] text-center border border-gray-200">
                  {row[0]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {row[1]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {row[2]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {row[3]}
                </td>
                <td className="w-[340px] text-center border border-gray-200">
                  {row[4]}
                </td>
                <td className="w-[340px] text-center border border-gray-200">
                  {row[5]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {row[6]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {row[7]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {row[8]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {row[9]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {row[10]}
                </td>
                <td className="w-[200px] text-center border border-gray-200">
                  {row[11]}
                </td>
                <td className="w-[140px] text-center border border-gray-200">
                  {row[12]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {row[13]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {row[14]}
                </td>
                <td className="w-[60px] text-center border border-gray-200">
                  {row[15]}
                </td>
                <td className="w-[60px] text-center border border-gray-200">
                  {row[16]}
                </td>
                <td className="w-[60px] text-center border border-gray-200">
                  {row[17]}
                </td>
                <td className="w-[120px] text-center border border-gray-200">
                  {row[18]}
                </td>
                <td className="w-[160px] text-center border border-gray-200">
                  {row[19]}
                </td>
                <td className="w-[140px] text-center border border-gray-200">
                  {row[20]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

const Viettel = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.system);
  const { token } = currentUser || "";
  const [file, setFile] = useState({});
  const [jsonData, setJsonData] = useState(null);
  // submit state
  const dispatch = useDispatch();
  console.log(jsonData);
  // useEffect(() => {
  //   jsonData &&
  //     setJsonData(
  //       jsonData.slice(
  //         0,
  //         7 + jsonData.slice(7).indexOf(jsonData.slice(7).find((e) => !e[2]))
  //       )
  //     );
  // }, [file]);
  const handleCreateByExcel = async () => {
    dispatch(onLoading());
    if (!jsonData) {
      toast.warn("Chưa có file nào được chọn!");
      dispatch(loaded());
    }
    try {
      const res = await ktsRequest.post(
        "/v2/bills",
        {
          billsList: jsonData.slice(7),
          shopID: currentUser._id,
          weight: 300,
          cod: 0,
          note: "Test vtp",
          partner: "VTP",
          shopPay: true,
          isBroken: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJsonData((prev) => {
        return prev.map((i) => {
          i[2] && (i[1] = res.data.find((j) => j.id == i[0])?.ktsNumber);
        });
      });
      // console.log(jsonData);
      toast.success("Gửi thông tin thành công!");
      dispatch(loaded());
    } catch (err) {
      toast.error(
        err.response ? (
          <div>
            <p className="font-semibold">{err.response.data.message}</p>
            <p>Vui lòng thông báo cho chúng tôi về lỗi này qua kênh CSKH!</p>
          </div>
        ) : (
          "Network Error"
        )
      );
      dispatch(loaded());
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(e.target.files[0]);
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          // defval: "",
          // blankrows: true,
        });
        setJsonData(
          excelData.slice(
            0,
            7 +
              excelData.slice(7).indexOf(excelData.slice(7).find((e) => !e[2]))
          )
        );
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    // content
    <div className="p-3">
      {/* header */}
      <h3 className="uppercase font-semibold py-3 ">Tạo đơn từ file excel</h3>
      <div className="flex justify-between h-full">
        <div className="w-1/2 bg-white p-1 rounded flex items-center">
          <input
            type="file"
            className="hidden"
            id="myip"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
          />
          <Button
            type="primary"
            padding={"xs"}
            icon={upload}
            callback={() => {
              document.getElementById("myip").click();
            }}
          >
            <span className="px-3 hidden lg:block">Chọn file</span>
          </Button>
          <span className="px-3 truncate">
            {file?.name || "Chưa có file nào được chọn"}
          </span>
        </div>
        <div className="space-x-3 flex">
          <Button
            type="success"
            callback={handleCreateByExcel}
            loading={loading}
            disabledBy={loading}
            animation={true}
            padding={"xs"}
            size="px-4"
          >
            Gửi thông tin
          </Button>
          <a
            href="/Downloads/kts_template.xlsx"
            download
            className="bg-white rounded flex items-center justify-around px-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <span className="px-3 hidden md:block">Tải file mẫu</span>
          </a>
        </div>
      </div>
      <ExcelDisplay jsonData={jsonData} />
      {/* main */}
      {/* <h3 className="uppercase font-semibold py-3 ">Tạo đơn lẻ</h3>
      <div className="rounded border border-gray-300 bg-white p-2">
        <div className="flex justify-between">
          <h3 className="uppercase font-bold">người nhận</h3>
        </div>
        <label className="mt-2 block">Số điện thoại: </label>
        <Input
          placehoder={"Số điện thoại người nhận"}
          type="number"
          name="phone"
          value={getter.phone || ""}
          onChange={handelChangeGetter}
          padding={"sm"}
        />
        <label className="mt-2 block">Họ tên: </label>
        <Input
          placehoder={"Họ tên người nhận"}
          value={getter.name || ""}
          name="name"
          onChange={handelChangeGetter}
          padding={"sm"}
        />
        <label className="mt-2 block">Địa chỉ: </label>
        <Input
          placehoder={"Số nhà,tên đường người nhận"}
          value={getter.address || ""}
          name="address"
          onChange={handelChangeGetter}
          padding={"sm"}
        />
        <div className="grid md:grid-cols-3 gap-1 pt-1">
          <div className="w-full z-30">
            <Selector
              placehoder={getter.cityFullName || "Tỉnh/Thành"}
              data={cities}
              field={["name"]}
              toShow="name_with_type"
              size={"sm"}
              output={setToCity}
            />
          </div>
          <div className="w-full z-20">
            <Selector
              placehoder={getter.districtFullName || "Quận/Huyện"}
              data={districts}
              field={["name_with_type"]}
              toShow="name_with_type"
              size={"sm"}
              output={setToDistrict}
            />
          </div>
          <div className="w-full z-10">
            <Selector
              placehoder={getter.wardFullName || "Phường/Xã"}
              data={wards}
              field={["name_with_type"]}
              toShow="name_with_type"
              size={"sm"}
              output={setToWard}
            />
          </div>
        </div>
        <div className="py-2 text-end">
          <Button type="success" padding={"sm"} size={"px-4"}>
            Tạo đơn
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default Viettel;
