import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ktsRequest } from "../ultis/connections";

const NewPartner = () => {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [repassword, setRepassword] = useState("");
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
  const [address, setAddress] = useState("");
  const [cost, setCost] = useState([]);
  const [costName, setCostName] = useState("");

  const currentUser = useSelector((state) => state.user);
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
        const resw = await ktsRequest.get(`/cities/wards/${districtCode}`);
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
  const handleClick = (e) => {
    e.preventDefault();
    if (!name) {
      toast.warn("Vui lòng chọn Tên đăng nhập!");
      return;
    }
    if (!password) {
      toast.warn("Mật khẩu không hợp lệ!");
      return;
    }
    if (repassword !== password) {
      toast.warn("Xác nhận mật khẩu không khớp");
      return;
    }
    if (!phone) {
      toast.warn("Vui lòng cung cấp số điện thoại!");
      return;
    }
    if (!address) {
      console.log(address);
      toast.warn("Vui lòng nhập địa chỉ");
      return;
    }
    if (!cityCode) {
      toast.warn("Vui lòng chọn tỉnh thành!");
      return;
    }
    if (!districtCode) {
      toast.warn("Vui lòng chọn quận huyện!");
      return;
    }
    if (!wardCode) {
      toast.warn("Vui lòng chọn phường xã!");
      return;
    }
    const data = JSON.stringify({
      name,
      password,
      phone,
      displayName,
      cityCode,
      districtCode,
      wardCode,
      cityName,
      districtName,
      wardName,
      cityFullName,
      districtFullName,
      wardFullName,
      address,
      parentUser: currentUser.currentUser._id,
      cost: costName,
    });

    const config = {
      method: "post",
      url: "/auth/signup",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    ktsRequest(config)
      .then(function (response) {
        toast.success("Đăng ký thành công!");
        setName("");
        setDisplayName("");
        setPassword("");
        setRepassword("");
        setPhone("");
        setCityCode("");
        setDistrictCode("");
        setWardCode("");
        setAddress("");
      })
      .catch(function (error) {
        toast.error("Tên đăng nhập đã có người sử dụng!");
      });
  };

  return (
    <div className="h-full bg-slate-200 p-3">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-xl font-semibold">Tạo mới đối tác </h3>
        <Link
          to="/dashboard/partners"
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
      <div className="mx-auto w-full lg:w-2/3">
        <div className=" flex flex-col gap-2">
          <span className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <input
              type="text"
              placeholder="User name ..."
              name="name"
              value={name}
              className="border-grey-light w-full rounded border p-2  focus:border-sky-500 focus:outline-none"
              required="abc"
              onChange={(e) => setName(e.target.value)}
            />
          </span>
          <div className="pr-2.5 pl-2">
            <input
              type="text"
              placeholder="Shop name ..."
              name="displayname"
              value={displayName}
              className="border-grey-light block w-full rounded border p-2 focus:border-sky-500 focus:outline-none"
              required="abc"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <input
              type="password"
              placeholder="Password ..."
              name="password"
              value={password}
              className="border-grey-light block w-full rounded border p-2 focus:border-sky-500 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <input
              type="password"
              placeholder="Confirm Password ..."
              name="repassword"
              value={repassword}
              className="border-grey-light block w-full rounded border p-2 focus:border-sky-500 focus:outline-none"
              onChange={(e) => setRepassword(e.target.value)}
            />
          </div>
          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <input
              type="text"
              placeholder="Số điện thoại ..."
              name="phone"
              value={phone}
              className="border-grey-light block w-full rounded border p-2 focus:border-sky-500 focus:outline-none"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <select
              id="cities"
              class="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => setCityCode(e.target.value)}
            >
              <option selected>Tỉnh/Thành</option>
              {cities.map((i) => {
                return (
                  <option value={i.code} key={i.code}>
                    {i.name_with_type}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <select
              id="districts"
              class="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => setDistrictCode(e.target.value)}
            >
              <option selected>Quận/Huyện</option>
              {districts.map((i) => {
                return (
                  <option value={i.code} key={i.code}>
                    {i.name_with_type}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <select
              id="wards"
              class="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => setWardCode(e.target.value)}
            >
              <option selected>Phường/Xã</option>
              {wards.map((i) => {
                return (
                  <option value={i.code} key={i.code}>
                    {i.name_with_type}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
            <input
              type="text"
              placeholder="Số nhà, tên đường ..."
              name="displayname"
              value={address}
              className="border-grey-light block w-full rounded border p-2 focus:border-sky-500 focus:outline-none"
              required="abc"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex pl-2 after:ml-1 after:text-red-500 after:content-['*']">
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
        </div>

        <div className="px-2.5">
          <button
            type="submit"
            className="mt-3 w-full rounded bg-primary-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={handleClick}
          >
            Tạo mới đối tác
          </button>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default NewPartner;
