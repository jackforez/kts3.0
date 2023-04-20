import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ToPrint from "./ToPrint";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";
import { Button, GridData, Input } from "../components";
import { printer, search, trash } from "../ultis/svgs";
import { search as myFilter, toVND } from "../ultis/functions";
import logo from "../assets/logo.svg";
const Bills = () => {
  const currentUser = useSelector((state) => state.user);
  const token = currentUser.currentUser.token;
  const isAdmin = currentUser.currentUser.role === "admin";
  const dispatch = useDispatch();
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [dataPrint, setDataPrint] = useState({});
  const [loading, setLoading] = useState(false);
  let componentRef = useRef();
  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      try {
        const res = await ktsRequest.get("/bills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBills(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response) {
          if (err.response.data.status === 403) {
            dispatch(logout());
          }
        } else {
          toast.error("abc");
        }
      }
    };
    setRefresh(false);
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
        setRefresh(true);
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      }
    }
  };
  const headers = [
    { title: "Đơn hàng ", size: "w-1/3" },
    { title: "Người nhận", size: "w-1/2" },
    { title: "Thao tác", size: "w-1/6" },
  ];
  return (
    <div className="p-3">
      {showPrint && <ToPrint data={dataPrint} setClose={setShowPrint} />}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <h3>Tất cả ({bills.length})</h3>
        <Input
          placehoder={"Số điện thoại người nhận ..."}
          size={"w-1/3"}
          onChange={(e) => setQuery(e.target.value)}
          icon={search}
        />
        <div className="order-3 flex gap-3 lg:order-2">
          <input type="date" name="fromDate" id="fromDate" className="px-2" />
          <span>to</span>
          <input type="date" name="toDate" id="toDate" className="px-2" />
        </div>
        <Link
          to="/dashboard/bills/new"
          className="order-2 flex items-center gap-1 rounded border border-primary-600 p-2 text-xs font-semibold text-primary-600 hover:bg-primary-600 hover:text-white md:text-base lg:order-3"
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
          <div className="divide-y divide-dashed divide-ktsPrimary bg-white shadow-lg">
            {myFilter(bills, query, ["toPhone", "toName"]).length > 0 ? (
              myFilter(bills, query, ["toPhone", "toName"]).map((b, i) => {
                return (
                  <div className="px-2 py-1.5 flex items-center" key={i}>
                    <div className="w-1/3">
                      <div className="space-x-3">
                        <span>{b.orderNumber}</span>
                        <span className="bg-primary-200 px-2 py-0.5 rounded text-primary-600">
                          {" "}
                          {b.status}
                        </span>
                      </div>
                      <div>Mã tra cứu: {b.partnerTrackingId}</div>
                      <div className="font-semibold">
                        Tiền cước: {toVND(b.ktsAmount)}
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div>Tên: {b.toName}</div>
                      <div>Điện thoại: {b.toPhone}</div>
                      <div>
                        Địa chỉ:{" "}
                        {b.toAddress +
                          ", " +
                          b.toWard +
                          ", " +
                          b.toDistrict +
                          ", " +
                          b.toCity}
                      </div>
                    </div>
                    <div className="w-1/6 flex justify-between md:justify-center md:gap-2">
                      <Button
                        type="outline-primary"
                        icon={printer}
                        iconSize={"4"}
                        title={"In vận đơn"}
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

export default Bills;
