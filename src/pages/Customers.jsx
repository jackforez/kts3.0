import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { Button, GridData, Input } from "../components";
import { search as myFilter, toVND } from "../ultis/functions";
import { pencil, trash } from "../ultis/svgs";
import logo from "../assets/logo.svg";
import { logout } from "../redux/userSlice";

const Customers = () => {
  const nagative = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const isAdmin = currentUser.currentUser.role === "admin";
  const [customers, setCustomers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [costName, setCostName] = useState([]);
  const [addCost, setAddCost] = useState(-1);
  const [cost, setCost] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/customers", {
          headers: {
            Authorization: `Bearer ${currentUser.currentUser.token}`,
          },
        });
        setCustomers(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
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
    setRefresh(false);
  }, [refresh]);
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
  const handleDelete = async (customer) => {
    if (
      confirm(
        `Bạn chắc chắn muốn xóa khách hàng ${customer.name}?\n Sau khi thực hiện sẽ không thể hoàn tác!\n Các thông tin đơn hàng cũ cũng không thể truy xuất!`
      )
    ) {
      try {
        const res = await ktsRequest.delete(`/customers/${customer._id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.currentUser.token}`,
          },
        });
        toast.success(res.data);
        setRefresh(true);
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      }
    }
  };
  const handleAddCost = async (customer, cost_name) => {
    const config = {
      method: "post",
      url: "/customers/addcost",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.currentUser.token}`,
      },
      data: {
        customerID: customer._id,
        cost_name,
      },
    };
    await ktsRequest(config)
      .then(function (res) {
        res.status === 200 ? toast.success(res.data) : toast.warn(res.data);
        setRefresh(true);
      })
      .catch(function (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      });
  };
  const headers = [
    { title: "Tên", size: "w-1/6" },
    { title: "Điện thoại", size: "w-1/6" },
    { title: "Địa chỉ", size: "w-1/2" },
    { title: "Thao tác", size: "w-1/6" },
  ];
  const handleRemoveCost = async (customer, cost_name) => {
    const config = {
      method: "post",
      url: "/customers/removecost",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.currentUser.token}`,
      },
      data: {
        customerID: customer._id,
        cost_name,
      },
    };
    await ktsRequest(config)
      .then(function (res) {
        res.status === 200 ? toast.success(res.data) : toast.warn(res.data);
        setRefresh(true);
      })
      .catch(function (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      });
  };
  return (
    <div className="h-full overflow-auto bg-slate-200 p-3">
      <div className="flex items-center justify-between py-3">
        <Input
          placehoder={"Nhập tên/số điện thoại khách hàng...."}
          size={"w-1/3"}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link
          to="/dashboard/customers/new"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          <span className="hidden md:block">Tạo mới</span>
        </Link>
      </div>
      {/* component thông tin khách hàng */}
      <div className="border border-ktsPrimary rounded-md">
        <GridData headers={headers}>
          <div className="divide-y divide-dashed divide-ktsPrimary bg-white shadow-lg">
            {myFilter(customers, query, ["name", "phone"]).length > 0 ? (
              myFilter(customers, query, ["name", "phone"]).map((c, i) => {
                return (
                  <div
                    className="px-2 py-1.5 flex items-center text-sm"
                    key={i}
                  >
                    <div className="w-1/6">{c.name}</div>
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
                    <div className="w-1/6 flex justify-between md:justify-center md:gap-2">
                      <Button
                        type="outline-warning"
                        icon={pencil}
                        iconSize={"4"}
                        title={"Sửa thông tin khách hàng"}
                        callback={(e) => {
                          setShowPrint(true);
                          setDataPrint(JSON.stringify(b));
                        }}
                      ></Button>
                      <Button
                        type="outline-danger"
                        icon={trash}
                        iconSize={"4"}
                        title={"Xóa khách hàng"}
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
