import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Selector } from "../components";
import { download, excel, upload } from "../ultis/svgs";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import * as XLSX from "xlsx";
const exceptFileTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csvs",
];
const ExcelDisplay = ({ jsonData }) => {
  // console.log(jsonData[6]);
  // console.log(jsonData[7]);
  return (
    jsonData && (
      <div className="bg-white mt-2 rounded-md overflow-hidden ta">
        <div className="bg-green-300  p-2 ">
          {jsonData.slice(0, 6).map((header, index) => (
            <span key={index}>{header}</span>
          ))}
        </div>
        <div className="max-h-[50vh] overflow-auto p-2 divide-y divide-gray-400 bg-red-300 relative w-full">
          {jsonData.slice(6).map(
            (row, rowIndex) =>
              row[1] && (
                <div className="flex flex-nowrap w-full" key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <span className="px-2" key={cellIndex}>
                      {cell || ""}
                    </span>
                  ))}
                </div>
              )
          )}
        </div>
      </div>
    )
  );
};

const Viettel = () => {
  const [file, setFile] = useState({});
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [toWard, setToWard] = useState("");
  const [toDistrict, setToDistrict] = useState("");
  const [toCity, setToCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [getter, setGetter] = useState({});
  const [jsonData, setJsonData] = useState(null);
  // submit state
  const [excelData, setExcelData] = useState(null);

  const handelChangeGetter = (e) => {
    setGetter((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleCreateByExcel = () => {
    toast.success("Gửi thông tin thành công!");
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
          defval: "",
          blankrows: true,
        });

        setJsonData(excelData);
      };

      reader.readAsBinaryString(file);
    }
  };
  useEffect(() => {
    const getCities = async () => {
      try {
        const res = await ktsRequest.get("/cities");
        const data = Object.values(res.data);
        setCities(data);
      } catch (error) {
        toast.error(error);
      }
    };
    getCities();
  }, []);
  useEffect(() => {
    const getDistricts = async () => {
      try {
        const cName = cities.find((city) => city.name_with_type == toCity);
        const resd = await ktsRequest.get(`/cities/districts/${cName.code}`);
        const data = Object.values(resd.data);
        setDistricts(data);
        setCityName(cName.name_with_type);

        data.findIndex((el) => el.name_with_type.includes(toDistrict)) < 0 &&
          setToDistrict(data[0].name_with_type);
        setGetter((prev) => {
          return {
            ...prev,
            cityCode: cName.code,
            cityName: cName.name,
            cityFullName: cName.name_with_type,
          };
        });
      } catch (error) {
        toast.error(error);
      }
    };
    getDistricts();
  }, [toCity]);
  useEffect(() => {
    const getWards = async () => {
      try {
        const dName = districts.find((d) => d.name_with_type == toDistrict);
        const resw = await ktsRequest.get(`cities/wards/${dName.code}`);
        const data = Object.values(resw.data);
        setWards(data);
        setDistrictName(dName.name_with_type);
        data.findIndex((el) => el.name_with_type.includes(toWard)) < 0 &&
          setToWard(data[0].name_with_type);
        setGetter((prev) => {
          return {
            ...prev,
            districtCode: dName.code,
            districtName: dName.name,
            districtFullName: dName.name_with_type,
          };
        });
      } catch (error) {
        toast.error(error);
      }
    };
    getWards();
  }, [toDistrict]);
  useEffect(() => {
    const getWard = () => {
      try {
        const wName = wards.find((w) => w.name_with_type === toWard);
        setWardName(wName.name);
        setGetter((prev) => {
          return {
            ...prev,
            wardCode: wName.code,
            wardName: wName.name,
            wardFullName: wName.name_with_type,
          };
        });
      } catch (error) {
        toast.error(error);
      }
    };
    getWard();
  }, [toWard]);
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
            padding={"sm"}
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
          <Button type="success" callback={handleCreateByExcel}>
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
      <h3 className="uppercase font-semibold py-3 ">Tạo đơn lẻ</h3>
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
      </div>
    </div>
  );
};

export default Viettel;
