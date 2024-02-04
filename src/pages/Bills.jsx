import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ToPrint from "./ToPrint";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";
import { Button, GridData, Input } from "../components";
import { copy, excel, mapPin, printer, search, trash } from "../ultis/svgs";
import { search as myFilter, toVND } from "../ultis/functions";
import logo from "../assets/logo.svg";
import {
  loaded,
  onLoading,
  onRefreh,
  onOpenModal,
  onCloseModal,
} from "../redux/systemSlice";
import { STATUS } from "../ultis/config";
import { Modal } from "../components";
const Bills = () => {
  const currentUser = useSelector((state) => state.user);
  const token = currentUser.currentUser.token;
  const isShop = currentUser.currentUser.role === "shop";
  const { loading, refresh, openModal } = useSelector((state) => state.system);
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
  const handleDelete = async (id) => {
    try {
      const res = await ktsRequest.delete(`v2/bills/${id}`, {
        headers: {
          Authorization: `Beare ${currentUser.currentUser.token}`,
        },
      });
      toast.success(res.data);
      dispatch(onRefreh());
      dispatch(onCloseModal());
    } catch (error) {
      error.response
        ? toast.error(error.response.data.message)
        : toast.error("Network Error!");
      dispatch(onCloseModal());
    }
  };
  const headers = isShop
    ? [
        { title: "Đơn hàng ", size: "w-3/12" },
        { title: "Ngày tạo đơn", size: "w-2/12" },
        { title: "người gửi/nhận", size: "w-4/12" },
        { title: "shop trả cước", size: "w-1/12 text-end" },
        { title: "COD", size: "w-1/12 text-end" },
        { title: "Thao tác", size: "w-1/12 text-end" },
      ]
    : [
        { title: "Đơn hàng ", size: "w-2/12" },
        { title: "Ngày tạo đơn", size: "w-2/12" },
        { title: "người gửi/nhận", size: "w-3/12" },
        { title: "shop trả cước", size: "w-1/12 text-end" },
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
      {openModal && (
        <Modal>
          <div className="p-3">
            <p>Đơn hàng sau khi huỷ không thể khôi phục</p>
            <p>
              Bạn chắc chắn muốn huỷ đơn hàng{" "}
              <span className="font-semibold">{pID.orderNumber}</span> -{" "}
              <span className="font-semibold">{pID.trackingID}</span>
            </p>
          </div>
          <div className="p-3 flex justify-end gap-2">
            <Button
              type="danger"
              title={"Hủy vận đơn"}
              callback={() => handleDelete(pID.id)}
            >
              Xác nhận xoá
            </Button>
            <Button type="primary" callback={() => dispatch(onCloseModal())}>
              Thoát
            </Button>
          </div>
        </Modal>
      )}
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
                  return isShop ? (
                    <div className="px-2 py-1.5 flex items-center" key={i}>
                      <div className="w-3/12 space-x-1">
                        <span
                          className={`${st.bgColor} px-1 inline-block py-0.5 rounded ${st.textColor} font-semibold text-xs`}
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
                          <Link
                            to={`/dashboard/tracking?order=${b.partnerTrackingId}`}
                            className="text-sm"
                          >
                            {b.partnerTrackingId}
                          </Link>
                        </div>
                      </div>
                      <div className="w-2/12 space-x-1">
                        <span className="bg-white px-1 inline-block py-0.5  text-ktsPrimary font-semibold text-xs">
                          {new Date(b.createdAt).toLocaleTimeString() +
                            " - " +
                            new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="w-4/12">
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
                          callback={() => {
                            setPID({
                              orderNumber: b.orderNumber,
                              trackingID: b.partnerTrackingId,
                            });
                            dispatch(onOpenModal());
                          }}
                        ></Button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-2 py-1.5 flex items-center" key={i}>
                      <div className="w-2/12 space-x-1">
                        <span
                          className={`${st.bgColor} px-1 inline-block py-0.5 rounded ${st.textColor} font-semibold text-xs`}
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
                          <Link
                            to={`/dashboard/tracking?order=${b.partnerTrackingId}`}
                            className="text-sm"
                          >
                            {b.partnerTrackingId}
                          </Link>
                        </div>
                      </div>
                      <div className="w-2/12 space-x-1">
                        <span className="bg-white px-1 inline-block py-0.5  text-ktsPrimary font-semibold text-xs">
                          {new Date(b.createdAt).toLocaleTimeString() +
                            " - " +
                            new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
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
                          callback={() => {
                            setPID({
                              id: b._id,
                              orderNumber: b.orderNumber,
                              trackingID: b.partnerTrackingId,
                            });
                            dispatch(onOpenModal());
                          }}
                        ></Button>
                        {currentUser.name == "anhvan3" && (
                          <Button
                            type="outline-warning"
                            icon={trash}
                            iconSize={"4"}
                            title={"Hủy vận đơn"}
                            padding={"xs"}
                            callback={() => {
                              handleDelete(b._id);
                            }}
                          ></Button>
                        )}
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
