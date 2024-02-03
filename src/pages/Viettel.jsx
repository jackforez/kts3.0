import React, { useState, useEffect } from "react";
import { Button, Input, Selector } from "../components";
import { download, excel, upload, xMark } from "../ultis/svgs";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import * as XLSX from "xlsx";
import { loaded, onLoading } from "../redux/systemSlice";
import { useDispatch, useSelector } from "react-redux";
import { ktsCurrencyFomat } from "../ultis/functions";
const exceptFileTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csvs",
];
const ExcelDisplay = ({ jsonData, query }) => {
  const headers = jsonData[6];
  const body = jsonData.slice(7);
  return (
    <div className="overflow-auto mt-2 max-h-full">
      <table className="bg-white text-xs rounded-md">
        <thead className="bg-white sticky top-0">
          {headers && (
            <tr className="font-semibold">
              <td className="w-[40px] text-center border border-gray-200">
                {headers[0]}
              </td>
              <td className="w-[160px] text-center border border-gray-200">
                {headers[1]}
              </td>
              <td className="w-[160px] text-center border border-gray-200">
                {headers[2]}
              </td>
              <td className="w-[160px] text-center border border-gray-200">
                {headers[3]}
              </td>
              <td className="w-[340px] text-center border border-gray-200">
                {headers[4]}
              </td>
              <td className="w-[340px] text-center border border-gray-200">
                {headers[5]}
              </td>
              <td className="w-[120px] text-center border border-gray-200">
                {headers[6]}
              </td>
              <td className="w-[160px] text-center border border-gray-200">
                {headers[7]}
              </td>
              <td className="w-[160px] text-center border border-gray-200">
                {headers[8]}
              </td>
              <td className="w-[160px] text-center border border-gray-200">
                {headers[9]}
              </td>
              <td className="w-[120px] text-center border border-gray-200">
                {headers[10]}
              </td>
              <td className="w-[200px] text-center border border-gray-200">
                {headers[11]}
              </td>
              <td className="w-[140px] text-center border border-gray-200">
                {headers[12]}
              </td>
              <td className="w-[120px] text-center border border-gray-200">
                {headers[13]}
              </td>
              <td className="w-[120px] text-center border border-gray-200">
                {headers[14]}
              </td>
              <td className="w-[60px] text-center border border-gray-200">
                {headers[15]}
              </td>
              <td className="w-[60px] text-center border border-gray-200">
                {headers[16]}
              </td>
              <td className="w-[60px] text-center border border-gray-200">
                {headers[17]}
              </td>
              <td className="w-[120px] text-center border border-gray-200">
                {headers[18]}
              </td>
              <td className="w-[160px] text-center border border-gray-200">
                {headers[19]}
              </td>
              <td className="w-[140px] text-center border border-gray-200">
                {headers[20]}
              </td>
            </tr>
          )}
        </thead>
        <tbody className="">
          {body.map((row, rowIndex) => {
            return (
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
                  {}
                  {ktsCurrencyFomat(row[8].toString())}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Viettel = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.system);
  const { token } = currentUser || "";
  const [file, setFile] = useState({});
  const [jsonData, setJsonData] = useState(null);
  const [details, setDetails] = useState(null);
  const [showFail, setShowFail] = useState(false);
  const [myData1, setMyData1] = useState([]); // sucess
  const [myData2, setMyData2] = useState([]); //fail
  const dispatch = useDispatch();

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
      jsonData.slice(7).map((i) => {
        i[2] &&
          (i[1] = res.data.data.info.find((j) => j.id == i[0])?.ktsNumber);
      });
      setDetails({
        s: res.data.data.successNumber,
        f: res.data.data.failNumber,
      });
      setMyData1(res.data.data.s);
      setMyData2(res.data.data.f);
      toast.success(
        <div>
          <div className="text-green-500">
            {res.data.data.successNumber} thành công
          </div>
          <div className="text-red-500">
            {res.data.data.failNumber} thất bại
          </div>
        </div>
      );
      dispatch(loaded());
    } catch (err) {
      console.log(err);
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
    <div className="p-3 flex flex-col">
      {/* header */}
      <h3 className="uppercase font-semibold py-3 ">Tạo đơn từ file excel</h3>
      <div className="flex justify-between h-full">
        <div className="w-1/2 bg-white p-1 rounded flex items-center relative">
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
          {/* {jsonData && (
            <div className="absolute right-2 top-2">
              <Button
                type={"outline-danger"}
                icon={xMark}
                iconSize={3}
                padding={"xs"}
                callback={() => {
                  setJsonData(null);
                }}
              ></Button>
            </div>
          )} */}
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
      {details && (
        <>
          <div className="bg-white rounded p-2 mt-2 text-sm space-x-8">
            <span className="text-ktsPrimary cursor-pointer">
              ({details.s + details.f}) tất cả{" "}
            </span>
            <span className="text-green-500 cursor-pointer">
              ({details.s}) thành công
            </span>
            <span
              className="text-red-500 cursor-pointer"
              onClick={() => {
                console.log(myData2);
                if (details.f > 0) {
                  setShowFail(!showFail);
                }
                showFail &&
                  setMyData2((prev) => {
                    return [...jsonData[6], prev];
                  });
              }}
            >
              ({details.f}) thất bại
            </span>
          </div>
          {showFail && (
            <table className="bg-white text-xs rounded-md">
              <tbody className="">
                {myData2.map((row, rowIndex) => {
                  return (
                    <tr
                      className={`w-full ${
                        row[1] ? "bg-green-200" : "bg-red-100"
                      }`}
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
                      <td className="w-[160px] text-center border border-gray-200"></td>
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
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
      {jsonData && <ExcelDisplay jsonData={jsonData} />}
    </div>
  );
};

export default Viettel;
