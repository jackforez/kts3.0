import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ktsRequest } from "../ultis/connections";
import { Input, Button, Selector, Ratio } from "../components";
import { add, minus } from "../ultis/svgs";
const NewBill = () => {
  //lấy thông tin user đang đăng nhập
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
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
  //get address
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  // item info
  const [cod, setCod] = useState(30000);
  const [note, setNote] = useState("");
  const [itemName, setItemName] = useState("bưu phẩm");
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(0);

  //sender info
  const [sender, setSender] = useState(currentUser || {});
  //reciver info
  const [getter, setGetter] = useState({});

  const [partner, setPartner] = useState("VNP");
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shopPay, setShopPay] = useState(false);

  const [fromWard, setFromWard] = useState(sender.wardName || "");
  const [fromDistrict, setFromDistrict] = useState(sender.districtName || "");
  const [fromCity, setFromCity] = useState(sender.cityName || "");
  const [toWard, setToWard] = useState("");
  const [toDistrict, setToDistrict] = useState("");
  const [toCity, setToCity] = useState("");
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     const res = await ktsRequest.get(`/customers/find?phone=${phone}`, {
  //       headers: {
  //         Authorization: `Bearer ${currentUser.token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     setGetter(res.data.data);
  //     if (res.data.success) {
  //       setOpenSearch(true);
  //     } else {
  //       setOpenSearch(false);
  //     }
  //   };
  //   if (getter.phone && getter.phone.length > 4 && getter.phone.length <= 10) {
  //     fetchCustomers();
  //   } else {
  //     setOpenSearch(false);
  //   }
  // }, [getter.phone?.length]);
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
      } catch (error) {
        toast.error(error);
      }
    };
    getWard();
  }, [toWard]);

  const handleClick = async () => {
    setLoading(true);
    if (!getter.phone || getter.phone.length != 10) {
      toast.warn("Số điện thoại người nhận hàng không hợp lệ");
      setLoading(false);
      return;
    }
    if (!getter.name) {
      toast.warn("Chưa nhập tên người nhận hàng");
      setLoading(false);
      return;
    }

    if (!getter.address) {
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
    try {
      const res = await ktsRequest.post("/v2/bills", {
        shopID: currentUser._id,
        fromName: sender.displayName,
        fromPhone: sender.phone,
        fromAddress: sender.address,
        fromCity,
        fromDistrict,
        fromWard,
        toName: getter.displayName,
        toPhone: getter.phone,
        toAddress: getter.address,
        toCity,
        toDistrict,
        toWard,
        itemName,
        itemQauntity: qty,
        weight,
        cod,
        note,
        partner,
        shopPay,
      });
      console.log(res.data);
      toast.success(res.data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response ? err.response.data.message : "Network Error");
      setLoading(false);
    }
  };
  const handelChangeSender = (e) => {
    setSender((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handelChangeGetter = (e) => {
    setGetter((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  return (
    <div className="p-2 overflow-auto text-sm">
      <div className="grid md:grid-cols-2 gap-2">
        <div className="">
          <div className="rounded border border-gray-300 bg-white p-2">
            <h3 className="uppercase font-bold">người gửi</h3>
            <label className="mt-3 block">Số điện thoại: </label>
            <Input
              name="phone"
              value={sender.phone}
              placehoder={"Số điện thoại người gửi"}
              type="number"
              disabledBy={true}
              onChange={handelChangeSender}
            />
            <label className="mt-3 block">Họ tên: </label>
            <Input
              name="name"
              value={sender.displayName}
              disabledBy={true}
              placehoder={"Họ tên người gửi người gửi"}
              onChange={handelChangeSender}
            />
            <label className="mt-3 block">Địa chỉ: </label>
            <Input
              name="address"
              value={sender.address}
              placehoder={"Số nhà,tên đường người gửi"}
              onChange={handelChangeSender}
              disabledBy={true}
            />

            <div className="grid md:grid-cols-3 gap-1 pt-1">
              <div className="w-full z-30">
                <Selector
                  placehoder={sender.cityFullName || "Tỉnh/Thành"}
                  data={cities}
                  field={["name"]}
                  toShow="name_with_type"
                  size={"md"}
                  disabled={true}
                  output={setFromCity}
                />
              </div>
              <div className="w-full z-20">
                <Selector
                  placehoder={sender.districtFullName || "Quận/Huyện"}
                  data={districts}
                  field={["name_with_type"]}
                  toShow="name_with_type"
                  size={"md"}
                  disabled={true}
                  output={setFromDistrict}
                />
              </div>
              <div className="w-full z-10">
                <Selector
                  placehoder={sender.wardFullName || "Phường/Xã"}
                  data={wards}
                  field={["name_with_type"]}
                  toShow="name_with_type"
                  size={"md"}
                  disabled={true}
                  output={setFromWard}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="rounded border border-gray-300 bg-white p-2">
            <h3 className="uppercase font-bold">người nhận</h3>
            <label className="mt-3 block">Số điện thoại: </label>
            <Input
              placehoder={"Số điện thoại người nhận"}
              type="number"
              name="phone"
              value={getter.phone}
              onChange={handelChangeGetter}
            />
            <label className="mt-3 block">Họ tên: </label>
            <Input
              placehoder={"Họ tên người gửi người nhận"}
              value={getter.name}
              name="name"
              onChange={handelChangeGetter}
            />
            <label className="mt-3 block">Địa chỉ: </label>
            <Input
              placehoder={"Số nhà,tên đường người nhận"}
              value={getter.address}
              name="address"
              onChange={handelChangeGetter}
            />
            <div className="grid md:grid-cols-3 gap-1 pt-1">
              <div className="w-full z-30">
                <Selector
                  placehoder={"Tỉnh/Thành"}
                  data={cities}
                  field={["name"]}
                  toShow="name_with_type"
                  size={"md"}
                  output={setToCity}
                />
              </div>
              <div className="w-full z-20">
                <Selector
                  placehoder={"Quận/Huyện"}
                  data={districts}
                  field={["name_with_type"]}
                  toShow="name_with_type"
                  size={"md"}
                  output={setToDistrict}
                />
              </div>
              <div className="w-full z-10">
                <Selector
                  placehoder={"Phường/Xã"}
                  data={wards}
                  field={["name_with_type"]}
                  toShow="name_with_type"
                  size={"md"}
                  output={setToWard}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <div className="rounded border border-gray-300 bg-white p-2">
          <h3 className="uppercase font-bold">hàng hóa</h3>
          <label className="mt-3 block">Nội dung hàng hóa: </label>
          <Input placehoder={"nội dung hàng hóa"} />
          <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
            <div>
              <label className="mt-3 block">Trọng lượng: </label>
              <Input
                placehoder="(gram) "
                type="number"
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <label className="mt-3 block">Số lượng: </label>
              <div className="flex gap-1">
                <Button
                  type="primary"
                  icon={minus}
                  callback={() =>
                    qty > 1 ? setQty((qty) => qty - 1) : setQty(1)
                  }
                ></Button>
                <Input
                  placehoder={0}
                  type={"number"}
                  textCenter={true}
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value))}
                />
                <Button
                  type="primary"
                  icon={add}
                  callback={() => setQty((qty) => qty + 1)}
                ></Button>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="mt-3 block">Thu hộ: </label>
              <Input
                placehoder={"0"}
                type="number"
                onChange={(e) => setCod(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mt-3 block">Ghi chú: </label>
            <Input
              placehoder={"Ghi chú của người bán"}
              type="text"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="pt-2 flex justify-between gap-2 w-full">
        <div className="flex items-center">
          <Ratio output={setShopPay} checked={shopPay} />
          <span className="text-md ml-3 text-gray-900 dark:text-gray-300">
            {shopPay ? "Người gửi trả cước" : "Người nhận trả cước"}
          </span>
        </div>
        <div className="flex justify-end gap-2 w-1/2">
          <Button
            type="outline-danger"
            size="w-1/2"
            callback={() => navigate("/dashboard/bills")}
          >
            HỦY BỎ
          </Button>
          <Button
            type="primary"
            size="w-1/2"
            callback={handleClick}
            loading={loading}
            disabledBy={loading}
            animation={true}
          >
            TẠO MỚI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewBill;
