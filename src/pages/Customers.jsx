import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { Button, GridData, Input, Selector } from "../components";
import { search as myFilter, toVND } from "../ultis/functions";
import { add, pencil, search, trash } from "../ultis/svgs";
import logo from "../assets/logo.svg";
import { logout } from "../redux/userSlice";
import { loaded, onLoading, onRefreh } from "../redux/systemSlice";

const Customers = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.system);
  const { refresh } = useSelector((state) => state.system);
  const isAdmin = currentUser.currentUser.role === "admin";
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [openAddCustomer, setOpenAddCustomer] = useState(false);

  const [inputs, setInputs] = useState({});
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  useEffect(() => {
    const setTitle = () => {
      document.title = "Danh bạ người nhận - KTSCORP.VN";
    };
    setTitle();
  });
  useEffect(() => {
    dispatch(onLoading());
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/customers", {
          headers: {
            Authorization: `Bearer ${currentUser.currentUser.token}`,
          },
        });
        setCustomers(res.data);
        dispatch(loaded());
      } catch (err) {
        dispatch(loaded());
        if (err.response) {
          if (err.response.data.status === 403) {
            toast.warning("Phiên làm việc hêt hạn, vui lòng đăng nhập lại!");
            dispatch(logout());
          }
        } else {
          toast.error("abc");
        }
      }
    };
    fetchData();
  }, [refresh]);
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
        const cName = cities.find((city) => city.name_with_type == cityCode);
        const resd = await ktsRequest.get(`/cities/districts/${cName.code}`);
        const data = Object.values(resd.data);
        setDistricts(data);
        setInputs((prev) => {
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
  }, [cityCode]);
  useEffect(() => {
    const getWards = async () => {
      try {
        const dName = districts.find((d) => d.name_with_type == districtCode);
        const resw = await ktsRequest.get(`cities/wards/${dName.code}`);
        const data = Object.values(resw.data);
        setWards(data);
        setInputs((prev) => {
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
  }, [districtCode]);
  useEffect(() => {
    const getWard = () => {
      try {
        const wName = wards.find((w) => w.name_with_type === wardCode);
        setInputs((prev) => {
          return {
            ...prev,
            wardCode: wName?.code,
            wardName: wName?.name,
            wardFullName: wName?.name_with_type,
          };
        });
      } catch (error) {
        toast.error(error);
      }
    };
    getWard();
  }, [wardCode]);
  const handleDelete = async (customer) => {
    if (
      confirm(
        `Bạn chắc chắn muốn xóa khách hàng ${customer.name}?\n Sau khi thực hiện sẽ không thể hoàn tác!\n Các thông tin đơn hàng cũ cũng (có thể) không thể truy xuất!`
      )
    ) {
      try {
        const res = await ktsRequest.delete(`/customers/${customer._id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.currentUser.token}`,
          },
        });
        toast.success(res.data);
        dispatch(onRefreh());
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      }
    }
  };
  const handleCreate = async () => {
    dispatch(onLoading());
    if (!inputs.name) {
      toast.warn("Tên khách không hợp lệ!");
      dispatch(loaded());
      return;
    }
    if (!inputs.phone || inputs.phone.length !== 10) {
      toast.warn("Số điện thoại không hợp lệ");
      dispatch(loaded());
      return;
    }
    if (!inputs.address) {
      toast.warn("Vui lòng nhập địa chỉ, tên đường!");
      dispatch(loaded());
      return;
    }
    if (!inputs.cityCode) {
      toast.warn("Vui lòng chọn Tỉnh/Thành!");
      dispatch(loaded());
      return;
    }
    if (!inputs.districtCode) {
      toast.warn("Vui lòng chọn Quận/Huyện!");
      dispatch(loaded());
      return;
    }
    if (!inputs.wardCode) {
      toast.warn("Vui lòng chọn Phường/Xã!");
      dispatch(loaded());
      return;
    }
    try {
      const res = await ktsRequest.post("/customers", inputs, {
        headers: {
          Authorization: `Bearer ${currentUser.currentUser.token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data);
      dispatch(loaded());
      dispatch(onRefreh());
    } catch (er) {
      dispatch(loaded());
      toast.error(er.response ? er.response.data : "Network Error");
    }
  };
  const handelChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const headers = [
    { title: "Tên", size: "w-1/4" },
    { title: "Điện thoại", size: "w-1/6" },
    { title: "Địa chỉ", size: "w-1/2" },
    { title: "Thao tác", size: "w-1/12" },
  ];
  return (
    <div className="h-full overflow-auto bg-slate-200 p-3">
      <div className="flex items-center justify-between py-3">
        <Input
          placehoder={"Tìm theo tên/số điện thoại ..."}
          size={"w-1/3"}
          onChange={(e) => setQuery(e.target.value)}
          icon={search}
          padding="sm"
        />
        {openAddCustomer ? (
          <div className="w-1/4 flex gap-2">
            <Button
              Button
              type="outline-danger"
              padding={"xs"}
              size="w-1/2"
              callback={() => setOpenAddCustomer(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              Button
              type="success"
              padding={"xs"}
              size="w-1/2"
              disabledBy={loading}
              animation={true}
              loading={loading}
              callback={handleCreate}
            >
              Lưu
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            padding={"xs"}
            size="w-1/6"
            callback={() => setOpenAddCustomer(true)}
          >
            Tạo mới
          </Button>
        )}
      </div>
      {openAddCustomer && (
        <div className="rounded border border-gray-300 bg-white p-2 flex flex-wrap mb-2">
          <div className="grid md:grid-cols-3 gap-1 pt-1 w-full">
            <div className="w-full">
              <label className="block">Số điện thoại: </label>
              <Input
                name="phone"
                placehoder={"Số điện thoại người nhận"}
                type="number"
                padding={"sm"}
                onChange={handelChange}
              />
            </div>
            <div className="w-full">
              <label className="block">Họ tên: </label>
              <Input
                name="name"
                placehoder={"Họ tên người nhận"}
                onChange={handelChange}
                padding={"sm"}
              />
            </div>
            <div className="w-full">
              <label className="block">Địa chỉ: </label>
              <Input
                name="address"
                placehoder={"Số nhà,tên đường người nhận"}
                onChange={handelChange}
                padding={"sm"}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-1 pt-1 w-full">
            <div className="w-full z-30">
              <Selector
                placehoder={"Tỉnh/Thành"}
                data={cities}
                field={["name"]}
                toShow="name_with_type"
                size={"sm"}
                output={setCityCode}
              />
            </div>
            <div className="w-full z-20">
              <Selector
                placehoder={"Quận/Huyện"}
                data={districts}
                field={["name_with_type"]}
                toShow="name_with_type"
                size={"sm"}
                output={setDistrictCode}
              />
            </div>
            <div className="w-full z-10">
              <Selector
                placehoder={"Phường/Xã"}
                data={wards}
                field={["name_with_type"]}
                toShow="name_with_type"
                size={"sm"}
                output={setWardCode}
              />
            </div>
          </div>
        </div>
      )}
      {/* component thông tin khách hàng */}
      <div className="border border-ktsPrimary rounded-md">
        <GridData headers={headers}>
          <div className="divide-y divide-dashed divide-ktsPrimary bg-white shadow-lg rounded-md">
            {myFilter(customers, query, ["name", "phone"]).length > 0 ? (
              myFilter(customers, query, ["name", "phone"]).map((c, i) => {
                return (
                  <div
                    className="px-2 py-1.5 flex items-center text-sm"
                    key={i}
                  >
                    <div className="w-1/4">{c.name}</div>
                    <div className="w-1/6">{c.phone}</div>
                    <div className="w-1/2">
                      {c.address +
                        ", " +
                        c.wardFullName +
                        ", " +
                        c.districtFullName +
                        ", " +
                        c.cityFullName}
                    </div>
                    <div className="w-1/12 flex justify-between md:justify-center md:gap-2">
                      <Button
                        type="outline-warning"
                        icon={pencil}
                        iconSize={"4"}
                        title={"Sửa thông tin khách hàng"}
                        padding="xs"
                      ></Button>
                      <Button
                        type="outline-danger"
                        icon={trash}
                        iconSize={"4"}
                        title={"Xóa khách hàng"}
                        padding="xs"
                        callback={() => handleDelete(c)}
                      ></Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-3 text-center">
                {loading ? (
                  <div className="flex h-full w-full items-center justify-center flex-col">
                    <img src={logo} alt="" className="animate-bounce w-20" />
                    <div>Đang tải dữ liệu ...</div>
                  </div>
                ) : (
                  "Không có dữ liệu"
                )}
              </div>
            )}
          </div>
        </GridData>
      </div>
    </div>
  );
};

export default Customers;
