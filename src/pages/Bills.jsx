import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ToPrint from "./ToPrint";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";
import { Button, GridData, Input } from "../components";
import { excel, printer, search, trash } from "../ultis/svgs";
import { search as myFilter, toVND } from "../ultis/functions";
import logo from "../assets/logo.svg";
import { loaded, onLoading, onRefreh } from "../redux/systemSlice";
const Bills = () => {
  const currentUser = useSelector((state) => state.user);
  const token = currentUser.currentUser.token;
  const isAdmin = currentUser.currentUser.role === "admin";
  const { loading } = useSelector((state) => state.system);
  const { refresh } = useSelector((state) => state.system);
  const dispatch = useDispatch();
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [dataPrint, setDataPrint] = useState({});
  let componentRef = useRef();
  useEffect(() => {
    dispatch(onLoading());
    const fetch = async () => {
      try {
        const res = await ktsRequest.get("v2/bills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBills(res.data);
        dispatch(loaded());
      } catch (err) {
        dispatch(loaded());
        if (err.response) {
          if (err.response.data.status === 403) {
            dispatch(logout());
          }
        } else {
          toast.error("abc");
        }
      }
    };
    fetch();
  }, [refresh]);
  const handleDelete = async (bill) => {
    if (
      confirm(
        `Bạn chắc chắn muốn xóa đơn hàng: ${bill.orderNumber}?\nSau khi thực hiện sẽ không thể hoàn tác!\nThông tin đơn hàng sẽ thể truy xuất!`
      )
    ) {
      try {
        const res = await ktsRequest.delete(`/bills/${bill._id}`, {
          headers: {
            Authorization: `Beare ${currentUser.currentUser.token}`,
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
  const headers = [
    { title: "Đơn hàng ", size: "w-2/12" },
    { title: "người nhận", size: "w-3/12" },
    { title: "người gửi", size: "w-3/12" },
    { title: "COD", size: "w-1/12 text-end" },
    { title: "cước", size: "w-1/12 text-end" },
    { title: "tổng thu", size: "w-1/12 text-end" },
    { title: "Thao tác", size: "w-1/12 text-end" },
  ];
  const searchByStatus = (q) => {
    return bills.filter((el) =>
      el.status.normalize("NFC").toLowerCase().includes(q)
    ).length;
  };
  return (
    <div className="p-3">
      {showPrint && <ToPrint data={dataPrint} setClose={setShowPrint} />}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <Input
          placehoder={"Số điện thoại người nhận ..."}
          size={"w-1/3"}
          onChange={(e) => setQuery(e.target.value)}
          icon={search}
          padding="sm"
        />
        <div className="text-xs text-start flex justify-start capitalize flex-1 gap-2">
          <span
            className="inline-block bg-white px-2 pt-0.5 pb-1 rounded-md border border-ktsPrimary cursor-pointer hover:bg-ktsPrimary hover:text-white"
            onClick={() => {
              setQuery("");
            }}
          >
            Tất cả ({searchByStatus("")})
          </span>
          <span
            className="inline-block bg-white px-2 pt-0.5 pb-1 rounded-md border border-red-500 cursor-pointer hover:bg-red-500 text-red-500 hover:text-white"
            onClick={() => setQuery("hủy")}
          >
            hủy ({searchByStatus("hủy")})
          </span>
          <span
            className="inline-block bg-white px-2 pt-0.5 pb-1 rounded-md border border-green-500 cursor-pointer hover:bg-green-500 text-green-500 hover:text-white"
            onClick={() => {
              setQuery("thành công");
            }}
          >
            thành công({searchByStatus("thành công")})
          </span>
          <span
            className="inline-block bg-white px-2 pt-0.5 pb-1 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-500 text-blue-500 hover:text-white"
            onClick={() => {
              setQuery("đang giao");
            }}
          >
            đang giao({searchByStatus("đang giao")})
          </span>
        </div>
        {/* <div className="order-3 flex gap-3 lg:order-2">
          <input type="date" name="fromDate" id="fromDate" className="px-2" />
          <span>to</span>
          <input type="date" name="toDate" id="toDate" className="px-2" />
        </div> */}
        <Button type={"outline-primary"} padding={"sm"} title="under construct">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            x="0"
            y="0"
            viewBox="0 0 50 50"
            className="w-5 h-5"
          >
            <path d={excel}></path>
          </svg>
        </Button>
        <Link
          to="/dashboard/bills/new"
          className="order-2 flex items-center bg-white gap-1 rounded border border-primary-600 p-1.5 text-xs text-primary-600 hover:bg-primary-600 hover:text-white md:text-base lg:order-3"
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
      <div className="border border-ktsPrimary rounded-md">
        <GridData headers={headers}>
          <div className="divide-y text-sm divide-dashed divide-ktsPrimary bg-white shadow-lg rounded-md">
            {myFilter(bills, query, ["toPhone", "toName", "status"]).length >
            0 ? (
              myFilter(bills, query, ["toPhone", "toName", "status"]).map(
                (b, i) => {
                  return (
                    <div className="px-2 py-1.5 flex items-center" key={i}>
                      <div className="w-2/12">
                        <span className="bg-primary-200 px-1 inline-block py-0.5 rounded text-primary-700 font-semibold text-xs">
                          {b.status}
                        </span>
                        <span> {b.orderNumber}</span>

                        {/* <div>Mã tra cứu: {b.partnerTrackingId}</div> */}
                      </div>
                      {/* <div className="w-/12 md:grid md:auto-cols-fr md:grid-flow-col"> */}
                      <div className="w-3/12">
                        <span>{b.toName + " - " + b.toPhone}</span>
                        {/* <div>
                          Địa chỉ:{" "}
                          {b.toAddress +
                            ", " +
                            b.toWard +
                            ", " +
                            b.toDistrict +
                            ", " +
                            b.toCity}
                        </div> */}
                      </div>
                      <div className="w-3/12">
                        <span>{b.fromName + " - " + b.fromPhone}</span>
                      </div>
                      <div className="w-1/12 text-end">
                        <span>{toVND(b.cod)}</span>
                      </div>
                      <div className="w-1/12 text-end">
                        <span>{toVND(b.shopAmount)}</span>
                      </div>
                      <div className="w-1/12 text-end">
                        <span className="font-semibold">
                          {toVND(b.shopAmount)}
                        </span>
                      </div>
                      {/* </div> */}
                      <div className="w-1/12 flex justify-between md:justify-end md:gap-2">
                        <Button
                          type="outline-primary"
                          icon={printer}
                          iconSize={"4"}
                          title={"In vận đơn"}
                          padding={"xs"}
                          callback={(e) => {
                            setShowPrint(true);
                            setDataPrint(JSON.stringify(b));
                          }}
                        ></Button>
                        <Button
                          type="outline-danger"
                          icon={trash}
                          iconSize={"4"}
                          title={"Hủy vận đơn"}
                          padding={"xs"}
                        ></Button>
                      </div>
                    </div>
                  );
                }
              )
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

export default Bills;
