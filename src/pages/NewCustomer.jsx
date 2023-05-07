import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { ktsRequest } from "../ultis/connections";
import { Input, Selector } from "../components";
import { setCurrentPage } from "../redux/systemSlice";

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
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(setCurrentPage("tạo mới đơn hàng"));
  }, []);
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
  const handelChangeSender = () => {
    console.log("change");
  };
  return (
    <div className="rounded border border-gray-300 bg-white p-2 flex flex-wrap">
      <div className="w-1/3 px-0.5">
        <label className="mt-2 block">Số điện thoại: </label>
        <Input
          name="phone"
          placehoder={"Số điện thoại người gửi"}
          type="number"
          disabledBy={true}
          padding={"sm"}
          onChange={handelChangeSender}
        />
      </div>
      <div className="w-1/3 px-0.5">
        <label className="mt-2 block">Họ tên: </label>
        <Input
          name="name"
          disabledBy={true}
          placehoder={"Họ tên người gửi"}
          onChange={handelChangeSender}
          padding={"sm"}
        />
      </div>
      <div className="w-1/3 px-0.5">
        <label className="mt-2 block">Địa chỉ: </label>
        <Input
          name="address"
          placehoder={"Số nhà,tên đường người gửi"}
          onChange={handelChangeSender}
          disabledBy={true}
          padding={"sm"}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-1 pt-1 w-full">
        <div className="w-full z-30">
          <Selector
            placehoder={"Tỉnh/Thành"}
            data={cities}
            field={["name"]}
            toShow="name_with_type"
            size={"sm"}
            disabled={true}
          />
        </div>
        <div className="w-full z-20">
          <Selector
            placehoder={"Quận/Huyện"}
            data={districts}
            field={["name_with_type"]}
            toShow="name_with_type"
            size={"sm"}
            disabled={true}
          />
        </div>
        <div className="w-full z-10">
          <Selector
            placehoder={"Phường/Xã"}
            data={wards}
            field={["name_with_type"]}
            toShow="name_with_type"
            size={"sm"}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
