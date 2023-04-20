import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";

const Partners = () => {
  const nagative = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const isAdmin = currentUser.currentUser.role === "admin";
  const [customers, setCustomers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [costName, setCostName] = useState([]);
  const [addCost, setAddCost] = useState(-1);
  const [cost, setCost] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/users/children", {
          headers: {
            Authorization: `Bearer ${currentUser.currentUser.token}`,
          },
        });
        setCustomers(res.data);
      } catch (err) {
        if (err.response) {
          if (err.response.data.status === 403) {
            toast.error("Phiên làm việc hêt hạn, vui lòng đăng nhập lại!");
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
  const handleAddCost = async (user, cost_name) => {
    const config = {
      method: "post",
      url: "/users/addcost",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.currentUser.token}`,
      },
      data: {
        partnerID: user._id,
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
  const handleRemoveCost = async (user, cost_name) => {
    const config = {
      method: "post",
      url: "/users/removecost",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.currentUser.token}`,
      },
      data: {
        partnerID: user._id,
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
        <h3 className="text-xl font-semibold">Thông tin đối tác</h3>
        <Link
          to="/dashboard/partners/new"
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
      <div className="flex flex-col gap-2">
        {customers.map((i, k) => {
          return (
            <div className="rounded-md bg-white drop-shadow" key={k}>
              <div className="flex items-center justify-between border-b-2 border-red-300 p-2">
                <div className="flex gap-3 font-semibold">
                  <span>{i.name}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex justify-between gap-1 rounded border border-primary-600 bg-white p-1 px-2 py-1 hover:bg-primary-600 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  <button
                    className="flex justify-between gap-1 rounded border border-red-600 bg-white p-1 px-2 py-1 hover:bg-red-600 hover:text-white"
                    onClick={(e) => handleDelete(i)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-col flex-wrap p-3">
                {isAdmin && <span>ShopID: {i.shopID}</span>}
                <span>Số điện thoại: {i.phone}</span>
                <span>
                  Địa chỉ:{" "}
                  {i.address +
                    ", " +
                    i.wardFullName +
                    ", " +
                    i.districtFullName +
                    ", " +
                    i.cityFullName}
                </span>
                <div className="flex justify-between">
                  <span>
                    Mức giá áp dụng:
                    {i.cost.map((j, i) => {
                      return (
                        <span
                          className="ml-3 rounded-sm bg-gray-300 pb-0.5"
                          key={i}
                        >
                          <button
                            className="mx-2 text-red-500 hover:font-bold"
                            onClick={(e) => {
                              handleRemoveCost(i, j);
                            }}
                          >
                            x
                          </button>
                          <span className="py-0.5 px-1">{j}</span>
                        </span>
                      );
                    })}
                  </span>
                  <button
                    className="rounded border border-green-600 py-0.5 px-1 font-bold text-green-700 hover:bg-green-600 hover:text-white"
                    onClick={(e) => {
                      addCost === k ? setAddCost(-1) : setAddCost(k);
                    }}
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
                        d={
                          addCost === k
                            ? "M6 18L18 6M6 6l12 12"
                            : "M12 4.5v15m7.5-7.5h-15"
                        }
                      />
                    </svg>
                  </button>
                </div>
                {addCost === k && (
                  <div className="mt-2 flex w-full gap-2">
                    <select
                      id="cost"
                      className="block w-full rounded border border-gray-300 bg-gray-50 py-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => {
                        setCostName(e.target.value);
                      }}
                    >
                      <option value="" selected disabled hidden>
                        Chọn mức giá áp dụng
                      </option>
                      {cost.map((c, index) => {
                        return (
                          <option value={c.costName} key={index}>
                            {c.costName}
                          </option>
                        );
                      })}
                    </select>
                    <button
                      className="rounded border border-green-600 py-0.5 px-1 font-bold text-green-700 hover:bg-green-600 hover:text-white"
                      onClick={(e) => {
                        handleAddCost(i, costName);
                      }}
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
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Partners;
