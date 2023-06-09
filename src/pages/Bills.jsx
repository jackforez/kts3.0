import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ToPrint from "./ToPrint";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";
import { Button, GridData, Input } from "../components";
import { copy, excel, mapPin, printer, search, trash } from "../ultis/svgs";
import { search as myFilter, toVND } from "../ultis/functions";
import logo from "../assets/logo.svg";
import { loaded, onLoading, onRefreh } from "../redux/systemSlice";
import axios from "axios";
import { STATUS } from "../ultis/config";
import { stringify } from "postcss";
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
  const [pID, setPID] = useState("");
  let componentRef = useRef();
  useEffect(() => {
    const setTitle = () => {
      document.title = "Đơn hàng - KTSCORP.VN";
    };
    setTitle();
  });
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
          toast.error("Network Error!");
        }
      }
    };
    fetch();
  }, [refresh]);
  // const deleteP = async () => {
  //   try {
  //     const res = await axios.get(
  //       `https://connect-my.vnpost.vn/customer-partner/deleteOrderByDraft?type=2&code=1683441836`,
  //       {
  //         headers: {
  //           token:
  //             "CCBM0a0WqkVPAvIDw3ph+6ljzpcAfUhyeDfGjA+KIj+z4UzD0j72uj3ye2K9cJ1rYrshNjZ4fCWDIrC8Ee2QnFoTQnUVim7iQjUOpm30QIQilUKqHNa5bhFrs6ayPHPaJdY3jlQNFmz33SOsFcL5jA==",
  //         },
  //       }
  //     );
  //     // {
  //     //   OriginalId: pID,
  //     // },

  //     toast.success(res.data);
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // };
  const handleDelete = async (bill) => {
    try {
      const res = await ktsRequest.delete(`v2/bills/${bill._id}`, {
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
  };
  const headers = [
    { title: "Đơn hàng ", size: "w-2/12" },
    { title: "Ngày tạo đơn", size: "w-2/12" },
    { title: "người gửi/nhận", size: "w-3/12" },
    { title: "chịu cước", size: "w-1/12 text-end" },
    { title: "COD", size: "w-1/12 text-end" },
    { title: "cước shop", size: "w-1/12 text-end" },
    { title: "cước KTS", size: "w-1/12 text-end" },
    { title: "Thao tác", size: "w-1/12 text-end" },
  ];
  const searchByStatus = (q) => {
    return bills.filter((el) =>
      el.status
        .normalize("NFC")
        .toLowerCase()
        .includes(q.normalize("NFC").toLowerCase())
    ).length;
  };
  const getStatus = (_status) => {
    return (
      STATUS.find((item) =>
        item.name.toLocaleLowerCase().includes(_status.toLocaleLowerCase())
      ) || STATUS[0]
    );
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
          {STATUS.map((st, i) => {
            return (
              <span
                key={i}
                className={`inline-block bg-white px-2 pt-0.5 pb-1 rounded-md border ${st.bdColor}   ${st.textColor} cursor-pointer ${st.hover} hover:text-white`}
                onClick={() => setQuery(st.name.toString().toLowerCase())}
              >
                {st.name} ({searchByStatus(st.name.toString())})
              </span>
            );
          })}
        </div>
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
                  const st = getStatus(b.status);
                  return (
                    <div className="px-2 py-1.5 flex items-center" key={i}>
                      <div className="w-2/12 space-x-1">
                        <span
                          className={`${st.bgColor} px-1.5 inline-block py-0.5 rounded ${st.textColor} font-semibold text-xs`}
                        >
                          {b.status}
                        </span>

                        <span> {b.orderNumber}</span>
                        <div className="flex items-center">
                          <span className="px-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="#081A51"
                              className={`w-4 h-4 text-primary inline`}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={mapPin}
                              />
                            </svg>
                          </span>
                          <span className="text-sm">{b.partnerTrackingId}</span>
                          {/* <span className="px-2" title="sao chép mã tra cứu">
                            <Button
                              icon={copy}
                              padding={"xs"}
                              iconSize={"4"}
                            ></Button>
                          </span> */}
                        </div>
                      </div>
                      <div className="w-2/12 space-x-1">
                        <span className="bg-white px-1 inline-block py-0.5  text-ktsPrimary font-semibold text-xs">
                          {new Date(b.createdAt).toLocaleTimeString() +
                            " - " +
                            new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {/* <div className="w-/12 md:grid md:auto-cols-fr md:grid-flow-col"> */}
                      <div className="w-3/12">
                        <div>
                          <span className="font-semibold">Từ: </span>{" "}
                          <span>{b.fromName + " - " + b.fromPhone}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Tới: </span>{" "}
                          <span>{b.toName + " - " + b.toPhone}</span>
                        </div>
                      </div>
                      <div className="w-1/12 text-end">
                        <span>{toVND(b.shopPay ? b.costP : 0)}</span>
                      </div>
                      <div className="w-1/12 text-end">
                        <span>{toVND(b.cod)}</span>
                      </div>
                      <div className="w-1/12 text-end">
                        <span>{toVND(b.costP)}</span>
                      </div>
                      <div className="w-1/12 text-end">
                        <span className="font-semibold">{toVND(b.costK)}</span>
                      </div>
                      {/* </div> */}
                      <div className="w-1/12 flex flex-col md:flex-row justify-between md:justify-end gap-2">
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
                          callback={() => handleDelete(b)}
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
