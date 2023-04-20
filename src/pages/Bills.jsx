import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ToPrint from "./ToPrint";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";

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
  let componentRef = useRef();
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await ktsRequest.get("/bills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBills(res.data);
      } catch (err) {
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
  return (
    <div className="bg-slate-200 p-3">
      {showPrint && <ToPrint data={dataPrint} setClose={setShowPrint} />}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-red-500 pb-3">
        <h3>Tất cả ({bills.length})</h3>
        <input
          type="text"
          placeholder="Số điện thoại người nhận ..."
          className="order-1 p-2"
          onChange={(e) => setQuery(e.target.value)}
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

      <div className="mt-3 flex flex-col gap-2 text-xs md:text-base">
        {bills
          .filter((i) => i.toPhone.includes(query))
          .map((i) => {
            return (
              <div className="rounded-md bg-white drop-shadow">
                <div className="flex items-center justify-between border-b-2 border-red-300 p-2">
                  <div className="flex gap-3 font-semibold">
                    <span>Mã đơn hàng: {i.orderNumber}</span>
                    <span className="text-primary-600">{i.status}</span>
                    <span>Tiền cước:{i.ktsAmount}</span>
                    <span>COD:{i.cod}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex justify-between gap-1 rounded border border-primary-600 bg-white p-1 px-2 py-1 hover:bg-primary-600 hover:text-white"
                      title="In vận đơn"
                      onClick={(e) => {
                        setShowPrint(true);
                        setDataPrint(JSON.stringify(i));
                      }}
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
                          d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                        />
                      </svg>
                    </button>
                    <button
                      className="flex justify-between gap-1 rounded border border-red-500 bg-white p-1 px-2 py-1 hover:bg-red-500 hover:text-white"
                      onClick={(e) => {
                        handleDelete(i);
                      }}
                      title="Hủy đơn hàng"
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
                <div className="grid auto-cols-max grid-flow-col justify-between gap-2 p-2">
                  {isAdmin && (
                    <div className="flex flex-col">
                      <span>Người gửi: {i.fromName}</span>
                      <span>Số điện thoại: {i.fromPhone}</span>
                      <span>
                        Địa chỉ:{" "}
                        {i.fromAddress +
                          ", " +
                          i.fromWard +
                          ", " +
                          i.fromDistrict +
                          ", " +
                          i.fromCity}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span>Mã tra cứu: {i.partnerTrackingId}</span>
                    <span>Người nhận: {i.toName}</span>
                    <span>Số điện thoại: {i.toPhone}</span>
                    <span>
                      Địa chỉ:{" "}
                      {i.toAddress +
                        ", " +
                        i.toWard +
                        ", " +
                        i.toDistrict +
                        ", " +
                        i.toCity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Bills;
