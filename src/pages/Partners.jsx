import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";
import { Button, GridData, Input, Modal, Selector } from "../components";
import { search as myFilter, toVND } from "../ultis/functions";
import { pencil, search, trash } from "../ultis/svgs";
import logo from "../assets/logo.svg";
import {
  loaded,
  onLoading,
  onOpenModal,
  onRefreh,
  onCloseModal,
} from "../redux/systemSlice";
const Partners = () => {
  const nagative = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const { loading, openModal, refresh } = useSelector((state) => state.system);
  const [customers, setCustomers] = useState([]);
  const [costName, setCostName] = useState([]);
  const [addCost, setAddCost] = useState(-1);
  const [cost, setCost] = useState([]);
  const [query, setQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState({});
  useEffect(() => {
    const setTitle = () => {
      document.title = "Đối tác - KTSCORP.VN";
    };
    setTitle();
  });
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
  const handleDelete = async () => {
    dispatch(onLoading());
    try {
      const res = await ktsRequest.delete(`/users/${userToDelete?._id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.currentUser.token}`,
        },
      });
      toast.success(res.data);
      dispatch(loaded());
      dispatch(onRefreh());
    } catch (error) {
      dispatch(loaded());
      toast.error(
        error.response ? error.response.data.message : "Network Error!"
      );
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
        dispatch(onRefreh());
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
        dispatch(onRefreh());
      })
      .catch(function (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      });
  };
  const headers = [
    { title: "Đối tác", size: "w-2/12" },
    { title: "điện thoại", size: "w-2/12" },
    { title: "Địa chỉ", size: "w-3/12" },
    { title: "Mức giá áp dụng", size: "w-3/12" },
    { title: "Thao tác", size: "w-2/12 text-center" },
  ];
  console.log(openModal);
  return (
    <div className="h-full overflow-auto bg-slate-200 p-3">
      {openModal && (
        <Modal>
          <div className="p-2">
            Sau khi thực hiện sẽ không thể hoàn tác. Các thông tin đơn hàng cũ
            cũng không thể truy xuất! <br />
            Bạn chắc chắn muốn xóa đối tác
            <span className="font-semibold italic bg-gray-300 mx-1 px-1 pb-0.5 rounded-md">
              {" " + userToDelete?.displayName + " "}
            </span>
            ?
          </div>
          <div className="flex justify-end gap-2 p-2">
            <Button
              type="outline-primary"
              size="w-1/4"
              padding={"xs"}
              callback={() => dispatch(onCloseModal())}
            >
              Hủy bỏ
            </Button>
            <Button
              type="danger"
              size="w-1/4"
              callback={handleDelete}
              loading={loading}
              disabledBy={loading}
              animation={true}
              padding={"xs"}
            >
              Xác nhận xóa
            </Button>
          </div>
        </Modal>
      )}
      <div className="flex items-center justify-between py-3">
        <Input
          placehoder={"Nhập tên/số điện thoại đối tác...."}
          size={"md:w-1/2 w-3/4"}
          onChange={(e) => setQuery(e.target.value)}
          icon={search}
        />
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
      <div className="border border-ktsPrimary rounded-md">
        <GridData headers={headers}>
          <div className="divide-y divide-dashed divide-ktsPrimary bg-white shadow-lg rounded-b">
            {myFilter(customers, query, ["name", "phone"]).length > 0 ? (
              myFilter(customers, query, ["name", "phone"]).map((c, k) => {
                return (
                  <div
                    className="px-2 py-1.5 flex items-center text-sm "
                    key={k}
                  >
                    <div className="w-1/6">{c.displayName}</div>
                    <div className="w-1/6">{c.phone}</div>
                    <div className="w-1/4">
                      {c.address +
                        ", " +
                        c.wardFullName +
                        ", " +
                        c.districtFullName +
                        ", " +
                        c.cityFullName}
                    </div>
                    <div className="w-1/4 relative">
                      {c.cost.map((j, i) => {
                        return (
                          <span
                            className="rounded-sm bg-gray-300 pb-0.5 inline-flex m-0.5 text-xs items-center"
                            key={i}
                          >
                            <button
                              className="text-black font-semibold hover:text-red-500 px-1 pt-0.5"
                              onClick={(e) => {
                                handleRemoveCost(c, j);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                            <span className="px-1">{j}</span>
                          </span>
                        );
                      })}
                      {addCost === k && (
                        <div className="mt-2 flex w-full gap-2 absolute -top-2 z-10">
                          <Selector
                            placehoder={"Thêm mức giá"}
                            data={cost}
                            field={["costName"]}
                            toShow="costName"
                            size={"sm"}
                            output={setCostName}
                          />
                          <button
                            className="rounded border border-green-600 py-0.5 px-1.5 font-bold text-green-700 hover:bg-green-600 hover:text-white"
                            onClick={(e) => {
                              handleAddCost(c, costName);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="682.667"
                              height="682.667"
                              version="1"
                              viewBox="0 0 512 512"
                              className="h-4 w-4"
                            >
                              <path
                                d="M466 4949c-62-15-153-68-197-116-22-24-55-74-72-111l-32-67V464l37-76c45-91 103-147 196-191l67-32h4191l76 37c91 45 147 103 191 196l32 67 3 1905 2 1904-343 343-342 343-1885-1c-1096-1-1901-5-1924-10zm654-805c0-486 3-667 12-698 16-55 99-138 154-154 32-9 336-12 1276-12 1397 0 1294-6 1371 80 24 26 49 66 55 88 9 29 12 218 12 696v656h205l298-298 297-297V2366c0-1414-3-1848-12-1880-16-55-99-138-154-154-23-7-67-12-97-12h-57l-2 1047-3 1048-32 67c-44 93-100 151-191 196l-76 37H944l-76-37c-91-45-147-103-191-196l-32-67-3-1048-2-1047h-57c-30 0-74 5-97 12-55 16-138 99-154 154-18 60-18 4088 0 4148 15 51 99 137 148 153 22 7 148 11 338 12l302 1v-656zm2720 1v-656l-25-24-24-25H1329l-24 25-25 24v1311h2560v-655zm314-1597c55-16 138-99 154-154 9-31 12-289 12-1058V320H800v1016c0 769 3 1027 12 1058 15 51 99 137 148 153 53 17 3138 17 3194 1z"
                                transform="matrix(.1 0 0 -.1 0 512)"
                              ></path>
                              <path
                                d="M3065 4615l-25-24v-942l25-24 24-25h542l24 25 25 24v942l-25 24-24 25h-542l-24-25zm455-495v-360h-320v720h320v-360zM1305 1975c-16-15-25-36-25-55s9-40 25-55l24-25h2462l24 25c33 32 33 78 0 110l-24 25H1329l-24-25zM1305 1495c-16-15-25-36-25-55s9-40 25-55l24-25h2462l24 25c33 32 33 78 0 110l-24 25H1329l-24-25zM1305 1015c-16-15-25-36-25-55s9-40 25-55l24-25h2462l24 25c33 32 33 78 0 110l-24 25H1329l-24-25z"
                                transform="matrix(.1 0 0 -.1 0 512)"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="w-1/6 flex justify-between md:justify-center md:gap-2">
                      <Button
                        type="outline-success"
                        icon={"M6 18L18 6M6 6l12 12"}
                        iconSize={`4 ${addCost !== k && "rotate-45"}`}
                        title={"Thêm mức giá"}
                        padding="xs"
                        callback={() => {
                          addCost === k ? setAddCost(-1) : setAddCost(k);
                        }}
                      ></Button>
                      <Button
                        type="outline-warning"
                        icon={pencil}
                        iconSize={"4"}
                        title={"Sửa thông tin khách hàng"}
                        padding="xs"
                        callback={(e) => {}}
                      ></Button>

                      <Button
                        type="outline-danger"
                        icon={trash}
                        iconSize={"4"}
                        title={"Xóa đối tác"}
                        padding="xs"
                        callback={() => {
                          console.log("open modal");
                          setUserToDelete(c);
                          console.log(userToDelete);
                          dispatch(onOpenModal());
                        }}
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

export default Partners;
