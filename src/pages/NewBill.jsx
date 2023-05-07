import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ktsRequest } from "../ultis/connections";
import { Input, Button, Selector, Ratio } from "../components";
import { add, minus, search } from "../ultis/svgs";
import { loaded, onLoading, setCurrentPage } from "../redux/systemSlice";
const NewBill = () => {
  //lấy thông tin user đang đăng nhập
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const { loading } = useSelector((state) => state.system);
  const dispatch = useDispatch();
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
  const [cod, setCod] = useState(0);
  const [note, setNote] = useState("");
  const [itemName, setItemName] = useState("bưu phẩm");
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(1);
  const [isBroken, setIsBroken] = useState(false);

  //sender info
  const [sender, setSender] = useState(currentUser || {});
  const [senders, setSenders] = useState([]);
  //reciver info
  const [getter, setGetter] = useState({});
  const [getters, setGetters] = useState([]);

  const [partner, setPartner] = useState("VNP");
  const [openSearchGetter, setOpenSearchGetter] = useState(false);
  const [openSearchSender, setOpenSearchSender] = useState(false);
  const [getterSearchQuery, setGetterSearchQuery] = useState("");
  const [senderSearchQuery, setSenderSearchQuery] = useState("");
  // const [loading, setLoading] = useState(false);
  const [shopPay, setShopPay] = useState(false);
  const [saveGetterInfo, setSaveGetterInfo] = useState(false);

  const [fromWard, setFromWard] = useState(sender.wardName || "");
  const [fromDistrict, setFromDistrict] = useState(sender.districtName || "");
  const [fromCity, setFromCity] = useState(sender.cityName || "");
  const [toWard, setToWard] = useState("");
  const [toDistrict, setToDistrict] = useState("");
  const [toCity, setToCity] = useState("");
  useEffect(() => {
    dispatch(setCurrentPage("tạo mới đơn hàng"));
  }, []);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await ktsRequest.post(
          `/v2/customers/find/${getterSearchQuery}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGetters(res.data);
      } catch (error) {
        toast.error(error);
      }
    };
    getterSearchQuery.length > 3 && fetchCustomers();
  }, [getterSearchQuery.length]);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await ktsRequest.get(`/v2/customers/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGetters(res.data);
        console.log(getters);
      } catch (error) {
        toast.error(error);
      }
    };
    openSearchGetter && fetchCustomers();
  }, [openSearchGetter]);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await ktsRequest.post(
          `/v2/users/find/${senderSearchQuery}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSenders(res.data);
      } catch (error) {
        toast.error(error);
      }
    };
    senderSearchQuery.length > 3 && fetchShop();
  }, [senderSearchQuery.length]);
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
    dispatch(onLoading());
    if (!getter.phone || getter.phone.length != 10) {
      toast.warn("Số điện thoại người nhận hàng không hợp lệ");
      dispatch(loaded());
      return;
    }
    if (!getter.name) {
      toast.warn("Chưa nhập tên người nhận hàng");
      dispatch(loaded());
      return;
    }

    if (!getter.address) {
      toast.warn("Chưa nhập địa chỉ người nhận hàng");
      dispatch(loaded());
      return;
    }
    if (!weight || weight <= 0) {
      toast.warn("Khối lượng không hợp lệ");
      dispatch(loaded());
      return;
    }
    if (!itemName) {
      toast.warn("Cần nhập nội dung hàng hóa");
      dispatch(loaded());
      return;
    }
    if (qty < 1) {
      toast.warn("Số lượng không hợp lệ!");
      dispatch(loaded());
    }
    try {
      const res = await ktsRequest.post(
        "/v2/bills",
        {
          userID: currentUser._id,
          shopID: sender._id,
          fromName: sender.displayName,
          fromPhone: sender.phone,
          fromAddress: sender.address,
          fromCity,
          fromDistrict,
          fromWard,
          toName: getter.name,
          toPhone: getter.phone,
          toAddress: getter.address,
          toCity,
          toDistrict,
          toWard,
          itemName,
          itemQauntity: qty,
          weight,
          cod: cod || 0,
          note,
          partner,
          shopPay,
          isBroken,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      toast.success(res.data);
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
        <div className="relative">
          <div className="rounded border border-gray-300 bg-white p-2">
            <div className="flex justify-between">
              <h3 className="uppercase font-bold">người gửi</h3>
              <div className="space-x-3">
                <span
                  className="underline underline-offset-4 cursor-pointer hover:text-primary-600"
                  onClick={() => {
                    setSender(currentUser);
                  }}
                >
                  Xóa
                </span>
                <span
                  className="underline underline-offset-4 cursor-pointer hover:text-primary-600"
                  onClick={() => setOpenSearchSender(true)}
                >
                  Thay đổi
                </span>
              </div>
            </div>
            <label className="mt-2 block">Số điện thoại: </label>
            <Input
              name="phone"
              value={sender.phone}
              placehoder={"Số điện thoại người gửi"}
              type="number"
              disabledBy={true}
              padding={"sm"}
              onChange={handelChangeSender}
            />
            <label className="mt-2 block">Họ tên: </label>
            <Input
              name="name"
              value={sender.displayName}
              disabledBy={true}
              placehoder={"Họ tên người gửi"}
              onChange={handelChangeSender}
              padding={"sm"}
            />
            <label className="mt-2 block">Địa chỉ: </label>
            <Input
              name="address"
              value={sender.address}
              placehoder={"Số nhà,tên đường người gửi"}
              onChange={handelChangeSender}
              disabledBy={true}
              padding={"sm"}
            />

            <div className="grid md:grid-cols-3 gap-1 pt-1">
              <div className="w-full z-30">
                <Selector
                  placehoder={sender.cityFullName || "Tỉnh/Thành"}
                  data={cities}
                  field={["name"]}
                  toShow="name_with_type"
                  size={"sm"}
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
                  size={"sm"}
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
                  size={"sm"}
                  disabled={true}
                  output={setFromWard}
                />
              </div>
            </div>
          </div>
          {openSearchSender && (
            <div className="overflow-hidden absolute space-y-1 h-full w-full z-30 top-0 rounded border border-gray-300 bg-white p-2">
              <div className="h-[15%]">
                <Input
                  placehoder={"Nhập số điện thoại của shop cần gửi hàng"}
                  padding={"sm"}
                  icon={search}
                  onChange={(e) => setSenderSearchQuery(e.target.value)}
                />
              </div>
              <div className="rounded border border-gray-300 h-[85%] overflow-auto divide-y divide-dashed divide-ktsPrimary">
                {senders.length > 0 ? (
                  senders.map((s, i) => {
                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 hover:bg-slate-300"
                      >
                        <div className="flex gap-2">
                          <div>
                            <p className="font-semibold">{s.phone}</p>
                            <p className="capitalize">{s.displayName}</p>
                          </div>
                          <span>
                            {s.address +
                              ", " +
                              s.wardFullName +
                              ", " +
                              s.districtFullName +
                              ", " +
                              s.cityFullName}
                          </span>
                        </div>
                        <Button
                          type={"outline-primary"}
                          padding={"xs"}
                          size={"px-2"}
                          callback={() => {
                            setSender(s);
                            setFromCity(s.cityName);
                            setFromDistrict(s.districtName);
                            setToWard(s.wardName);
                            setSenders([]);
                            setOpenSearchSender(false);
                          }}
                        >
                          chọn
                        </Button>
                        {/* <button
                          onClick={() => {
                            setSender(s);
                            setFromCity(s.cityName);
                            setFromDistrict(s.districtName);
                            setToWard(s.wardName);
                            setGetters([]);
                            setOpenSearchSender(false);
                          }}
                          className="px-2 py-1 rounded border border-primary-600 active:scale-90 duration-500 hover:bg-primary-600 hover:text-white"
                        >
                          chọn
                        </button> */}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <span className="font-bold">Không có dữ liệu</span>
                    <button
                      className="underline underline-offset-4 hover:text-primary-600"
                      onClick={() => setOpenSearchSender(false)}
                    >
                      Đóng
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="rounded border border-gray-300 bg-white p-2">
            <div className="flex justify-between">
              <h3 className="uppercase font-bold">người nhận</h3>
              <span
                className="underline underline-offset-4 cursor-pointer hover:text-primary-600"
                onClick={() => setOpenSearchGetter(true)}
              >
                Danh sách người nhận
              </span>
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
              placehoder={"Họ tên người gửi người nhận"}
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
          </div>
          {openSearchGetter && (
            <div className="overflow-hidden absolute space-y-1 h-full w-full z-30 top-0 rounded border border-gray-300 bg-white p-2">
              <div className="h-[15%]">
                <Input
                  placehoder={"Nhập số điện thoại khách hàng"}
                  padding={"sm"}
                  icon={search}
                  onChange={(e) => setGetterSearchQuery(e.target.value)}
                />
              </div>
              <div className="rounded border border-gray-300 h-[85%] overflow-auto divide-y divide-dashed divide-ktsPrimary">
                {getters.length > 0 ? (
                  getters.map((g, i) => {
                    return (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 hover:bg-gray-200"
                      >
                        <div className="flex gap-2">
                          <div>
                            <p className="font-semibold">{g.phone}</p>
                            <p className="capitalize">{g.name}</p>
                          </div>
                          <span>
                            {g.address +
                              ", " +
                              g.wardFullName +
                              ", " +
                              g.districtFullName +
                              ", " +
                              g.cityFullName}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setGetter(g);
                            setToCity(g.cityName);
                            setToDistrict(g.districtName);
                            setToWard(g.wardName);
                            setGetters([]);
                            setOpenSearchGetter(false);
                          }}
                          className="px-2 py-1 rounded border border-primary-600 active:scale-90 duration-500 hover:bg-primary-600 hover:text-white"
                        >
                          chọn
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <span className="font-bold">Không có dữ liệu</span>
                    <button
                      className="underline underline-offset-4 hover:text-primary-600"
                      onClick={() => setOpenSearchGetter(false)}
                    >
                      Nhập thủ công
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pt-2">
        <div className="rounded border border-gray-300 bg-white p-2">
          <h3 className="uppercase font-bold">hàng hóa</h3>
          <label className="mt-2 block">Nội dung hàng hóa: </label>
          <Input
            placehoder={"nội dung hàng hóa"}
            padding={"sm"}
            onChange={(e) => setItemName(e.target.value)}
          />
          <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
            <div>
              <label className="mt-2 block">Trọng lượng (gram): </label>
              <Input
                placehoder={weight}
                type="number"
                padding={"sm"}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <label className="mt-2 block">Số lượng: </label>
              <div className="flex gap-1">
                <Button
                  type="primary"
                  icon={minus}
                  padding={"sm"}
                  callback={() =>
                    qty > 1 ? setQty((qty) => qty - 1) : setQty(1)
                  }
                ></Button>
                <Input
                  placehoder={0}
                  type={"number"}
                  textCenter={true}
                  value={qty}
                  padding={"sm"}
                  onChange={(e) => setQty(parseInt(e.target.value))}
                />
                <Button
                  type="primary"
                  icon={add}
                  callback={() => setQty((qty) => qty + 1)}
                  padding={"sm"}
                ></Button>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="mt-2 block">Thu hộ: </label>
              <Input
                placehoder={"0"}
                type="number"
                padding={"sm"}
                onChange={(e) => setCod(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mt-2 block">Ghi chú: </label>
            <Input
              placehoder={"Ghi chú của người bán"}
              type="text"
              onChange={(e) => setNote(e.target.value)}
              padding={"sm"}
            />
          </div>
        </div>
      </div>
      <div className="pt-2 flex justify-between flex-wrap w-full rounded border border-gray-300 bg-white p-2 mt-2">
        <div className="flex items-center w-1/3 md:w-1/4 py-2">
          <Ratio output={setShopPay} checked={shopPay} />
          <span className="text-xs ml-3 text-gray-900 dark:text-gray-300">
            {shopPay ? "Người gửi trả cước" : "Người nhận trả cước"}
          </span>
        </div>
        <div className="flex items-center w-1/3 md:w-1/4 py-2">
          <Ratio output={setSaveGetterInfo} checked={saveGetterInfo} />
          <span className="text-xs ml-3 text-gray-900 dark:text-gray-300">
            {saveGetterInfo
              ? "Lưu thông tin người nhận"
              : "Không lưu thông tin người nhận"}
          </span>
        </div>
        <div className="flex items-center w-1/3 md:w-1/4 py-2">
          <Ratio output={setIsBroken} checked={isBroken} />
          <span className="text-xs ml-3 text-gray-900 dark:text-gray-300">
            {isBroken ? "Hàng dễ vỡ" : "Hàng thường"}
          </span>
        </div>
        <div className="flex justify-end gap-2 md:w-1/4 w-full">
          <Button
            type="outline-danger"
            size="w-1/2"
            padding={"sm"}
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
            padding={"sm"}
          >
            TẠO MỚI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewBill;

// CCBM0a0WqkVPAvIDw3ph+6ljzpcAfUhyeDfGjA+KIj+z4UzD0j72uj3ye2K9cJ1rYrshNjZ4fCWDIrC8Ee2QnFoTQnUVim7iQjUOpm30QIQilUKqHNa5bhFrs6ayPHPaJdY3jlQNFmz33SOsFcL5jA==
// CCBM0a0WqkVPAvIDw3ph+6ljzpcAfUhyeDfGjA+KIj+z4UzD0j72uj3ye2K9cJ1rYrshNjZ4fCWDIrC8Ee2QnFoTQnUVim7iQjUOpm30QIQilUKqHNa5bhFrs6ayPHPaJdY3jlQNFmz33SOsFcL5jA==
// CCBM0a0WqkVPAvIDw3ph+6ljzpcAfUhyeDfGjA+KIj+z4UzD0j72uj3ye2K9cJ1rYrshNjZ4fCWDIrC8Ee2QnFoTQnUVim7iQjUOpm30QIQilUKqHNa5bhFrs6ayPHPaJdY3jlQNFmz33SOsFcL5jA==
// CCBM0a0WqkVPAvIDw3ph+6ljzpcAfUhyeDfGjA+KIj+z4UzD0j72uj3ye2K9cJ1rYrshNjZ4fCWDIrC8Ee2QnFoTQnUVim7iQjUOpm30QIQilUKqHNa5bhFrs6ayPHPaJdY3jlQNFmz33SOsFcL5jA==
