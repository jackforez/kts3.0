import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { ktsRequest } from "../ultis/connections";

const NewCustomer = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [cityFullName, setCityFullName] = useState("");
  const [districtFullName, setDistrictFullName] = useState("");
  const [wardFullName, setWardFullName] = useState("");
  const [cost, setCost] = useState([]);
  const [costName, setCostName] = useState("");

  const currentUser = useSelector((state) => state.user);
  useEffect(() => {
    const fetchCost = async () => {
      try {
        const res = await ktsRequest.get("/cost", {
          headers: {
            Authorization: `Bearer ${currentUser.currentUser.token}`,
          },
        });
        setCost(res.data.data);
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      }
    };
    fetchCost();
  }, []);
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
        const resd = await ktsRequest.get(`/cities/districts/${cityCode}`);
        const cName = cities.find((city) => city.code === cityCode);
        const data = Object.values(resd.data);
        setDistricts(data);
        setCityName(cName.name);
        setCityFullName(cName.name_with_type);
      } catch (error) {
        toast.error(error);
      }
    };
    getDistricts();
  }, [cityCode]);
  useEffect(() => {
    const getWards = async () => {
      try {
        const resw = await ktsRequest.get(`cities/wards/${districtCode}`);
        const data = Object.values(resw.data);
        const dName = districts.find((d) => d.code === districtCode);
        setWards(data);
        setDistrictName(dName.name);
        setDistrictFullName(dName.name_with_type);
      } catch (error) {
        toast.error(error);
      }
    };
    getWards();
  }, [districtCode]);
  useEffect(() => {
    const getWard = () => {
      if (wardCode) {
        const wName = wards.find((w) => w.code === wardCode);
        setWardName(wName.name);
        setWardFullName(wName.name_with_type);
      }
    };
    getWard();
  }, [wardCode]);
  const handleClick = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.warn("Tên khách không hợp lệ!");
      return;
    }
    if (!phone || phone.length !== 10) {
      toast.warn("Số điện thoại không hợp lệ");
      return;
    }
    if (!address) {
      toast.warn("Vui lòng nhập địa chỉ, tên đường!");
      return;
    }
    if (!cityCode) {
      toast.warn("Vui lòng chọn Tỉnh/Thành!");
      return;
    }
    if (!districtCode) {
      toast.warn("Vui lòng chọn Quận/Huyện!");
      return;
    }
    if (!wardCode) {
      toast.warn("Vui lòng chọn Phường/Xã!");
      return;
    }
    const config = {
      method: "post",
      url: "/customers",
      headers: {
        Authorization: `Bearer ${currentUser.currentUser.token}`,
        "Content-Type": "application/json",
      },
      data: {
        name,
        address,
        phone,
        cityCode,
        cityName,
        districtName,
        wardName,
        districtCode,
        wardCode,
        cityFullName,
        districtFullName,
        wardFullName,
        cost: costName,
      },
    };
    ktsRequest(config)
      .then(function (response) {
        toast.success(response.data);
      })
      .catch(function (err) {
        toast.error(err.response ? err.response.data.message : "Network Error");
      });
  };
  return (
    <div className="p-3">
      <div className="flex items-center justify-between border-b-2 pb-3">
        <h3 className="text-xl font-semibold">Tạo mới khách hàng </h3>
        <Link
          to="/dashboard/customers"
          className="flex items-center gap-1 rounded border border-primary-600 p-2 text-xs font-semibold text-primary-600 hover:bg-primary-600 hover:text-white md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>

          <span className="hidden md:block">Quay lại</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
        <div className="mt-9 flex flex-col justify-between gap-3">
          <label htmlFor="name" className="font-semibold">
            Họ và tên <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            id="name"
            name="name"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="phone" className="font-semibold">
            Số điện thoại<span className="text-red-600">*</span>
          </label>

          <input
            type="text"
            placeholder="(+84) xxxxxxxxx"
            id="phone"
            name="phone"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            onChange={(e) => setPhone(e.target.value)}
          />
          <label htmlFor="address" className="font-semibold">
            Địa chỉ <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="766 Nguyễn Văn Linh"
            id="address"
            name="address"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="mt-9 flex flex-col justify-between gap-3">
          <label htmlFor="cities" className="font-semibold">
            Tỉnh/Thành <span className="text-red-600">*</span>
          </label>
          <select
            id="cities"
            class="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => setCityCode(e.target.value)}
          >
            <option selected disabled hidden>
              Chọn Tỉnh/Thành
            </option>
            {cities.map((i) => {
              return (
                <option value={i.code} key={i.code}>
                  {i.name_with_type}
                </option>
              );
            })}
          </select>
          <label htmlFor="districts" className="font-semibold">
            Quận/Huyện <span className="text-red-600">*</span>
          </label>
          <select
            id="districts"
            class="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => setDistrictCode(e.target.value)}
          >
            <option selected disabled hidden>
              Chọn Quận/Huyện
            </option>
            {districts.map((i) => {
              return (
                <option value={i.code} key={i.code}>
                  {i.name_with_type}
                </option>
              );
            })}
          </select>

          <label htmlFor="wards" className="font-semibold">
            Phường/Xã <span className="text-red-600">*</span>
          </label>
          <select
            id="wards"
            class="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => setWardCode(e.target.value)}
          >
            <option selected disabled hidden>
              Chọn Phường/Xã
            </option>
            {wards.map((i) => {
              return (
                <option value={i.code} key={i.code}>
                  {i.name_with_type}
                </option>
              );
            })}
          </select>
        </div>
        <label htmlFor="cost" className="font-semibold">
          Chọn mức giá sẽ áp dụng <span className="text-red-600">*</span>
        </label>
        <select
          id="cost"
          class="block w-full rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => {
            setCostName(e.target.value);
          }}
        >
          <option value="" selected disabled hidden>
            Chọn mức giá áp dụng
          </option>
          {cost.map((i, index) => {
            return (
              <option value={i.costName} key={index}>
                {i.costName}
              </option>
            );
          })}
        </select>
      </div>

      <button
        className="mt-9 w-full rounded border-2 border-primary-600 p-3 font-semibold text-primary-600 hover:bg-primary-600 hover:text-white md:w-1/3"
        onClick={handleClick}
      >
        Tạo mới
      </button>
      <ToastContainer />
    </div>
  );
};

export default NewCustomer;
