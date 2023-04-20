import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { ktsRequest } from "../ultis/connections";

const NewBill = () => {
  //đọc thông số độ rộng màn hình
  const getWindowDimensions = () => {
    const { innerWidth: width } = window;
    return width;
  };
  const [brwidth, setBrwidth] = useState(getWindowDimensions());
  useEffect(() => {
    const handleResize = () => {
      setBrwidth(getWindowDimensions());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cod, setCod] = useState("30000");
  const [note, setNote] = useState("");
  const [itemName, setItemName] = useState("bưu phẩm");
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState("");
  const [partner, setPartner] = useState("VNP");
  const [openSearch, setOpenSearch] = useState(false);
  const [customer, setCustomer] = useState({});

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
  const [loading, setLoading] = useState(false);
  const [forShop, setForShop] = useState(false);
  const [shopPay, setShopPay] = useState(true);

  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isShop = currentUser.currentUser.role === "shop";
  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await ktsRequest.get(`/customers/find?phone=${phone}`, {
        headers: {
          Authorization: `Bearer ${currentUser.currentUser.token}`,
          "Content-Type": "application/json",
        },
      });
      setCustomer(res.data.data);
      if (res.data.success) {
        setOpenSearch(true);
      } else {
        setOpenSearch(false);
      }
    };
    if (phone.length > 4 && phone.length <= 10) {
      fetchCustomers();
    } else {
      setOpenSearch(false);
    }
  }, [phone.length]);
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
        console.log("to ", cityCode);
        console.log("to ", cityName);
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
        console.log("to ", districtCode);
        console.log("to ", districtName);
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
      try {
        console.log("to ", wardCode);
        console.log("to ", wardName);
        const wName = wards.find((w) => w.code === wardCode);
        setWardName(wName.name);
        setWardFullName(wName.name_with_type);
      } catch (error) {
        toast.error(error);
      }
    };
    getWard();
  }, [wardCode]);

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name) {
      toast.warn("Chưa nhập tên người nhận hàng");
      setLoading(false);
      return;
    }
    if (!phone || phone.length != 10) {
      toast.warn("Số điện thoại nhận hàng không hợp lệ");
      setLoading(false);
      return;
    }
    if (!address) {
      toast.warn("Chưa nhập địa chỉ người nhận hàng");
      setLoading(false);
      return;
    }
    if (!weight || weight <= 0) {
      toast.warn("Khối lượng không hợp lệ");
      setLoading(false);
      return;
    }
    if (!itemName) {
      toast.warn("Cần nhập nội dung hàng hóa");
      setLoading(false);
      return;
    }
    if (qty < 1) {
      toast.warn("Số lượng không hợp lệ!");
      setLoading(false);
      return;
    }
    if (!cityName) {
      toast.warn("Chưa có thông tin tỉnh/thành!");
      setLoading(false);
      return;
    }
    if (!districtName) {
      toast.warn("Chưa có thông tin quận/huyện!");
      setLoading(false);
      return;
    }
    if (!wardName) {
      toast.warn("Chưa có thông tin phường/xã!");
      setLoading(false);
      return;
    }
    const config = {
      method: "post",
      url: "/bills",
      headers: {
        Authorization: `Bearer ${currentUser.currentUser.token}`,
        "Content-Type": "application/json",
      },
      data: {
        shopID: currentUser.currentUser._id,
        fromName: currentUser.currentUser.name,
        fromPhone: currentUser.currentUser.phone,
        fromAddress: currentUser.currentUser.address,
        fromCity: currentUser.currentUser.cityName,
        fromDistrict: currentUser.currentUser.districtName,
        fromWard: currentUser.currentUser.wardName,
        toName: name,
        toPhone: phone,
        toAddress: address,
        toCity: cityName,
        toDistrict: districtName,
        toWard: wardName,
        itemName,
        itemQauntity: qty,
        weight,
        cod,
        note,
        partner,
      },
    };

    await ktsRequest(config)
      .then(function (response) {
        toast.success(response.data);
      })
      .catch(function (err) {
        toast.error(err.response ? err.response.data.message : "Network Error");
      });
    setLoading(false);
  };
  return (
    <div className="h-full p-3">
      <div className="flex items-center justify-between border-b-2 pb-3">
        {isShop ? (
          <span className="text-md font-bold uppercase text-gray-900 dark:text-gray-300">
            tạo mới đơn hàng
          </span>
        ) : (
          <label className="relative inline-flex cursor-pointer items-center justify-center">
            <input
              type="checkbox"
              value=""
              class="peer sr-only"
              onChange={(e) => {
                setForShop(!forShop);
              }}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
            <span className="text-md ml-3 font-bold uppercase text-gray-900 dark:text-gray-300">
              {forShop ? "tạo đơn cho shop" : "tạo mới đơn hàng"}
            </span>
          </label>
        )}
        <Link
          to="/dashboard/bills"
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

          <span className="hidden md:block">Quay lại danh sách đơn hàng</span>
        </Link>
      </div>
      <div className="flex flex-col gap-2 md:grid md:auto-cols-fr md:grid-flow-col">
        {forShop && (
          <div className="py-3">
            <h3 className="font-semibold uppercase">người gửi</h3>
            <div className="mt-3 flex flex-col gap-4">
              <div className="relative">
                <label
                  htmlFor="phone"
                  className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder={
                    window.innerWidth < 768
                      ? "Số điện thoại người nhận"
                      : "0123 456 789"
                  }
                  id="phone"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
                <div
                  className={`${
                    openSearch ? "flex " : "hidden "
                  } " absolute mt-1 rounded border border-gray-300 bg-gray-300 p-2`}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setName(customer.name);
                      setAddress(customer.address);
                      setCityFullName(customer.cityFullName);
                      setDistrictFullName(customer.districtFullName);
                      setWardFullName(customer.wardFullName);
                      // setCityCode(customer.cityCode);
                      // setDistrictCode(customer.districtCode);
                      // setWardCode(customer.wardCode);
                      setOpenSearch(false);
                    }}
                    className="hover:text-red-500"
                  >
                    {customer.name ? (
                      <div>
                        <span className="underline">{customer.name}</span>
                        <span> - </span>
                        <span>{customer.phone} - </span>
                        <span>{customer.address}</span>
                      </div>
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
                >
                  Họ tên
                </label>
                <input
                  value={name}
                  type="text"
                  placeholder={
                    window.innerWidth < 768
                      ? "Tên người nhận"
                      : "Nguyễn Văn Tũn"
                  }
                  id="name"
                  className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="address"
                className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
              >
                Địa chỉ
              </label>
              <input
                type="text"
                value={address}
                placeholder={
                  window.innerWidth < 768
                    ? "Địa chỉ người nhận"
                    : "Ở một vũ trụ nào đấy"
                }
                id="address"
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="mt-2 grid grid-cols-3 gap-1">
                <select
                  id="city"
                  class="mb-6 block w-full rounded border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setCityCode(e.target.value)}
                >
                  <option selected disabled hidden>
                    Tỉnh/Thành
                  </option>
                  {cities.map((i) => {
                    return (
                      <option value={i.code} key={i.code}>
                        {i.name_with_type}
                      </option>
                    );
                  })}
                </select>
                <select
                  id="district"
                  class="mb-6 block w-full rounded border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setDistrictCode(e.target.value)}
                >
                  <option selected disabled hidden>
                    Quận/Huyện
                  </option>
                  {districts.map((i) => {
                    return (
                      <option value={i.code} key={i.code}>
                        {i.name_with_type}
                      </option>
                    );
                  })}
                </select>
                <select
                  id="ward"
                  class="mb-6 block w-full rounded border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => {
                    setWardCode(e.target.value);
                  }}
                >
                  <option selected disabled hidden>
                    Phường/Xã
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
            </div>
          </div>
        )}
        <div className="py-3">
          <h3 className="font-semibold uppercase">người nhận</h3>
          <div className="mt-3 flex flex-col gap-4">
            <div className="relative">
              <label
                htmlFor="phone"
                className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder={
                  window.innerWidth < 768
                    ? "Số điện thoại người nhận"
                    : "0123 456 789"
                }
                id="phone"
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
              <div
                className={`${
                  openSearch ? "flex " : "hidden "
                } " absolute mt-1 rounded border border-gray-300 bg-gray-300 p-2`}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setName(customer.name);
                    setAddress(customer.address);
                    setCityFullName(customer.cityFullName);
                    setDistrictFullName(customer.districtFullName);
                    setWardFullName(customer.wardFullName);
                    setCityName(customer.cityName);
                    setDistrictName(customer.districtName);
                    setWardName(customer.wardName);
                    setCityCode(customer.cityCode);
                    setDistrictCode(customer.districtCode);
                    setWardCode(customer.wardCode);
                    setOpenSearch(false);
                  }}
                  className="hover:text-red-500"
                >
                  {customer.name ? (
                    <div>
                      <span className="underline">{customer.name}</span>
                      <span> - </span>
                      <span>{customer.phone} - </span>
                      <span>{customer.address}</span>
                    </div>
                  ) : (
                    <span> Không có kết quả nào</span>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
              >
                Họ tên
              </label>
              <input
                value={name}
                type="text"
                placeholder={
                  window.innerWidth < 768 ? "Tên người nhận" : "Nguyễn Văn Tũn"
                }
                id="name"
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="address"
              className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
            >
              Địa chỉ
            </label>
            <input
              type="text"
              value={address}
              placeholder={
                window.innerWidth < 768
                  ? "Địa chỉ người nhận"
                  : "Ở một vũ trụ nào đấy"
              }
              id="address"
              className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="mt-2 grid grid-cols-3 gap-1">
              <select
                id="city"
                class="mb-6 block w-full rounded border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setCityCode(e.target.value)}
              >
                {cityCode ? (
                  <option selected disabled hidden value={cityCode}>
                    {cityFullName}
                  </option>
                ) : (
                  <option selected disabled hidden>
                    Tỉnh/Thành
                  </option>
                )}
                {cities.map((i) => {
                  return (
                    <option value={i.code} key={i.code}>
                      {i.name_with_type}
                    </option>
                  );
                })}
              </select>
              <select
                id="district"
                class="mb-6 block w-full rounded border border-gray-300 bg-gray-50 p-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setDistrictCode(e.target.value)}
              >
                {districtCode ? (
                  <option selected disabled hidden value={districtCode}>
                    {districtFullName}
                  </option>
                ) : (
                  <option selected disabled hidden>
                    Quận/Huyện
                  </option>
                )}
                {districts.map((i) => {
                  return (
                    <option value={i.code} key={i.code}>
                      {i.name_with_type}
                    </option>
                  );
                })}
              </select>
              <select
                id="ward"
                class="mb-6 block w-full rounded border border-gray-300 bg-gray-50 p-1.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  setWardCode(e.target.value);
                }}
              >
                {wardCode ? (
                  <option selected value={wardCode} disabled hidden>
                    {wardFullName}
                  </option>
                ) : (
                  <option selected disabled hidden>
                    Phường/Xã
                  </option>
                )}
                {wards.map((i) => {
                  return (
                    <option value={i.code} key={i.code}>
                      {i.name_with_type}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="py-3">
          <h3 className="font-semibold uppercase">hàng hóa</h3>
          <div className="mt-3 flex flex-col gap-4">
            <div>
              <label
                htmlFor="itemname"
                className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
              >
                Tên hàng
              </label>
              <input
                type="text"
                placeholder={
                  window.innerWidth < 768 ? "Tên hàng" : "Món quà dành cho bạn"
                }
                id="itemname"
                onChange={(e) => setItemName(e.target.value)}
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
              >
                Số lượng
              </label>
              <div className="flex">
                <button
                  className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900"
                  onClick={() =>
                    qty > 1 ? setQty((qty) => qty - 1) : setQty(1)
                  }
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
                      d="M18 12H6"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  value={qty}
                  id="quantity"
                  className="block w-full border border-gray-300 bg-gray-50 p-2 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setQty(parseInt(e.target.value))}
                />
                <button
                  className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900"
                  onClick={() => setQty((qty) => qty + 1)}
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
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="weight"
                className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
              >
                Trọng lượng (gram)
              </label>
              <input
                type="text"
                placeholder={
                  window.innerWidth < 768 ? "Trọng lượng (gram)" : "100"
                }
                id="weight"
                className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <label
            htmlFor="cost"
            className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
          >
            Tiền thu hộ
          </label>
          <input
            type="text"
            placeholder={window.innerWidth < 768 ? "Tiền thu hộ" : "30.000"}
            id="cost"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="mt-3">
          <label
            htmlFor="note"
            className="mb-2 hidden text-sm font-medium text-gray-900  md:block"
          >
            Ghi chú
          </label>
          <input
            type="text"
            placeholder={
              window.innerWidth < 768
                ? "Ghi chú của người bán"
                : "Hello hơ sờ ly ly "
            }
            onChange={(e) => setNote(e.target.value)}
            id="note"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-between gap-2 md:flex-nowrap">
        <div className="flex w-full gap-2 md:w-1/2">
          {/* <select
            id="3rd"
            class="w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
          >
            <option value="VNP" selected>
              VNPost
            </option>
            <option value="SNP">Snapy</option>
          </select> */}

          <label className="relative inline-flex cursor-pointer items-center justify-center">
            <input
              type="checkbox"
              value=""
              class="peer sr-only"
              onChange={(e) => {
                setShopPay(!shopPay);
              }}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none md:after:top-[12px]"></div>
            <span className="text-md ml-3 text-gray-900 dark:text-gray-300">
              {shopPay ? "Người gửi trả cước" : "Người nhận trả cước"}
            </span>
          </label>
        </div>
        <div className="flex h-11 w-full justify-between md:w-1/2">
          <button
            onClick={handleClick}
            className="flex flex-1 items-center justify-center rounded border-2 bg-primary-600 font-semibold text-white hover:border-primary-600 hover:bg-white hover:text-primary-600"
          >
            {loading ? (
              <svg
                class="h-5  w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <div className="flex items-center justify-center font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="red"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
                Tạo đơn
              </div>
            )}
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default NewBill;
