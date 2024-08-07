import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ToPrint from "./ToPrint";
import { ktsRequest } from "../ultis/connections";
import { logout } from "../redux/userSlice";
import { Button, DataTable, GridData, Input } from "../components";
import {
  _3dot,
  add,
  copy,
  excel,
  filter,
  mapPin,
  printer,
  search,
  trash,
  upload,
} from "../ultis/svgs";
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
import DatePicker from "react-datepicker";

const Bills = () => {
  const currentUser = useSelector((state) => state.user);
  const token = currentUser.currentUser.token;
  const isShop = currentUser.currentUser.role === "shop";
  const { loading, refresh, openModal } = useSelector((state) => state.system);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [query, setQuery] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [dataPrint, setDataPrint] = useState({});
  const [pID, setPID] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [openFilter, setOpenFilter] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const oneWeekAgo = new Date(endDate);
    oneWeekAgo.setDate(endDate.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);
    return oneWeekAgo;
  });
  const [queryObj, setQueryObj] = useState({
    orderId: "",
    address: "",
    name: "",
    phone: "",
  });
  const [pagiCofig, setPagiCofig] = useState({
    rpp: 20,
    crp: 0,
    actp: 1,
  });
  const keys = ["toPhone", "toName", "orderNumber", "status"];
  let componentRef = useRef();
  useEffect(() => {
    const setTitle = () => {
      document.title = "Đơn hàng - KTSCORP.VN";
    };
    setTitle();
  });
  const Row = ({ b, st }) => {
    const [openActions, setOpenActions] = useState(false);
    return isShop ? (
      <div className="px-2 py-1.5 flex items-center">
        <div className="w-2/12 space-x-1">
          <span
            className={` px-2 pt-0.5 pb-1 rounded border ${st.bdColor}   ${st.textColor}`}
          >
            {b.orderNumber}
          </span>
        </div>
        <div className="w-2/12 space-x-1">
          <span className="px-1 inline-block py-0.5  text-ktsPrimary font-semibold text-xs">
            {new Date(b.createdAt).toLocaleTimeString() +
              " - " +
              new Date(b.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center">
            <span className="px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="#081A51"
                className={`w-3 h-3 text-primary inline`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={mapPin} />
              </svg>
            </span>
            <Link to={`/dashboard/tracking?order=${b.partnerTrackingId}`}>
              {b.partnerTrackingId}
            </Link>
          </div>
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
        <div className="w-2/12 text-end">
          <span>{toVND(b.shopPay ? b.costP : 0)}</span>
        </div>
        <div className="w-1/12 text-end">
          <span>{toVND(b.cod)}</span>
        </div>
        <div className="w-1/12 flex flex-col md:flex-row justify-center pl-16 relative">
          <Button
            icon={_3dot}
            iconSize={"5"}
            padding={"xs"}
            callback={() => {
              setOpenActions(!openActions);
            }}
          ></Button>
          {openActions && (
            <div className="absolute border border-gray-300  bg-white top-6 right-0 z-20 rounded-md space-y-2 p-2">
              <Button
                type="outline-primary"
                icon={printer}
                iconSize={"3"}
                title={"In vận đơn"}
                padding={"xs"}
                size={"w-32 space-x-2"}
                callback={(e) => {
                  setShowPrint(true);
                  setDataPrint(JSON.stringify(b));
                }}
              >
                <span className="px-2">In vận đơn</span>
              </Button>

              <Button
                type="outline-danger"
                icon={trash}
                iconSize={"3"}
                title={"Hủy vận đơn"}
                padding={"xs"}
                size={"w-32 space-x-2"}
                callback={() => {
                  setPID({
                    id: b._id,
                    orderNumber: b.orderNumber,
                    trackingID: b.partnerTrackingId,
                  });
                  dispatch(onOpenModal());
                }}
              >
                <span className="px-1">Hủy vận đơn</span>
              </Button>
            </div>
          )}
          {/* <Button
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
          ></Button> */}
        </div>
      </div>
    ) : (
      <div className="px-2 py-1.5 flex items-center hover:bg-gray-200">
        <div className="w-2/12 space-x-1">
          <span
            className={`px-2 pt-0.5 pb-1 rounded border ${st.bdColor}   ${st.textColor}`}
          >
            {b.orderNumber}
          </span>
        </div>
        <div className="w-2/12 space-x-1">
          <span className="px-1 inline-block py-0.5  text-ktsPrimary font-semibold text-xs">
            {new Date(b.createdAt).toLocaleTimeString() +
              " - " +
              new Date(b.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center">
            <span className="px-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="#081A51"
                className={`w-3 h-3 text-primary inline`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={mapPin} />
              </svg>
            </span>
            <Link to={`/dashboard/tracking?order=${b.partnerTrackingId}`}>
              {b.partnerTrackingId}
            </Link>
          </div>
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
        <div className="w-1/12 flex flex-col md:flex-row justify-center pl-16 relative">
          <Button
            icon={_3dot}
            iconSize={"5"}
            title={"In vận đơn"}
            padding={"xs"}
            callback={() => {
              setOpenActions(!openActions);
            }}
          ></Button>
          {openActions && (
            <div className="absolute border border-gray-300  bg-white top-6 right-0 z-20 rounded-md space-y-2 p-2">
              <Button
                type="outline-primary"
                icon={printer}
                iconSize={"3"}
                title={"In vận đơn"}
                padding={"xs"}
                size={"w-32 space-x-2"}
                callback={(e) => {
                  setShowPrint(true);
                  setDataPrint(JSON.stringify(b));
                }}
              >
                <span className="px-2">In vận đơn</span>
              </Button>

              <Button
                type="outline-danger"
                icon={trash}
                iconSize={"3"}
                title={"Hủy vận đơn"}
                padding={"xs"}
                size={"w-32 space-x-2"}
                callback={() => {
                  setPID({
                    id: b._id,
                    orderNumber: b.orderNumber,
                    trackingID: b.partnerTrackingId,
                  });
                  dispatch(onOpenModal());
                }}
              >
                <span className="px-1">Hủy vận đơn</span>
              </Button>
            </div>
          )}

          {/* {currentUser.name == "anhvan3" && (
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
          )} */}
        </div>
      </div>
    );
  };
  const fetchBills = async (queryObj) => {
    const { orderId, phone, name, address } = queryObj;
    if (startDate > endDate) {
      return;
    }
    try {
      dispatch(onLoading());
      const res = await ktsRequest.get(
        `v2/bills?from=${startDate}&to=${endDate}&orderId=${orderId}&phone=${phone}&address=${address}&name=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
  useEffect(() => {
    fetchBills(queryObj);
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
        { title: "Đơn hàng ", size: "w-2/12" },
        { title: "Ngày tạo đơn", size: "w-2/12" },
        { title: "người gửi/nhận", size: "w-4/12" },
        { title: "shop trả cước", size: "w-2/12 text-end" },
        { title: "COD", size: "w-1/12 text-end" },
        { title: "Thao tác", size: "w-1/12 text-end" },
      ]
    : [
        { title: "Đơn hàng ", size: "w-2/12" },
        { title: "Ngày tạo đơn", size: "w-2/12" },
        { title: "người gửi/nhận", size: "w-2/12" },
        { title: "shop trả cước", size: "w-2/12 text-end" },
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
    <div className="p-3 space-y-2 flex flex-col flex-1">
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
      <div className="flex justify-between">
        <div className="flex justify-start gap-2">
          <Button
            type="outline-primary"
            icon={search}
            iconSize={"4"}
            title={"Tìm kiếm"}
            padding={"xs"}
            size="w-28"
            disabledBy={loading}
            callback={() => {
              dispatch(onLoading());
              fetchBills(queryObj);
            }}
          ></Button>
          <div className="">
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              dateFormat="dd/MM/yyyy"
              className="bg-gray-50 px-2 py-[5px] border-gray-300 rounded border text-center text-xs focus:outline-none w-28"
            />
          </div>

          <div className="">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="bg-gray-50 px-2 py-[5px] border-gray-300 rounded border text-center text-xs focus:outline-none w-28"
            />
          </div>

          <Button
            type={openFilter ? "primary" : "outline-primary"}
            icon={filter}
            iconSize={"4"}
            title={"Tạo bill mới"}
            padding={"xs"}
            size="w-10"
            callback={() => setOpenFilter(!openFilter)}
          ></Button>
        </div>

        <div className="flex gap-2">
          {/* <div className="w-full justify-center">
            <Button
              type="outline-primary"
              icon={upload}
              iconSize={"4"}
              title={"Xuất ra file excel"}
              padding={"xs"}
              size="w-28"
              disabledBy={bills.length < 1}
            ></Button>
          </div> */}

          <div className="w-full justify-center">
            <Button
              type="outline-success"
              icon={add}
              iconSize={"4"}
              title={"Tạo bill mới"}
              padding={"xs"}
              size="w-28"
              callback={() => navigate("/dashboard/bills/new")}
            ></Button>
          </div>
        </div>
      </div>
      {openFilter && (
        <div className={`grid grid-cols-2 space-x-2 w-full text-xs`}>
          <div className="rounded-md border p-2 border-gray-300 space-y-1 bg-white">
            <div className="flex ">
              <span className="w-1/3">Số phiếu gửi</span>
              <Input
                placeholder
                padding={"xs"}
                value={queryObj.orderId}
                onChange={(e) =>
                  setQueryObj({ ...queryObj, orderId: e.target.value })
                }
              />
            </div>
            <div className="flex ">
              <span className="w-1/3">Địa chỉ nhận</span>
              <Input
                placeholder
                padding={"xs"}
                value={queryObj.address}
                onChange={(e) =>
                  setQueryObj({ ...queryObj, address: e.target.value })
                }
              />
            </div>
          </div>
          <div className="rounded-md border p-2 border-gray-300 space-y-1 bg-white">
            <div className="flex ">
              <span className="w-1/3">Tên người nhận</span>
              <Input
                placeholder
                padding={"xs"}
                value={queryObj.name}
                onChange={(e) =>
                  setQueryObj({ ...queryObj, name: e.target.value })
                }
              />
            </div>
            <div className="flex ">
              <span className="w-1/3">Số điện thoại</span>
              <Input
                placeholder
                padding={"xs"}
                value={queryObj.phone}
                onChange={(e) =>
                  setQueryObj({ ...queryObj, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between bg-white p-2 rounded-md border border-gray-300">
        <div className="w-full lg:w-1/3 relative">
          <Input
            placeholder
            padding={"xs"}
            icon={search}
            onChange={(e) => setQuery(e.target.value)}
            placehoder={"Số phiếu gửi, tên người nhận, số điện thoại ..."}
          />
        </div>
        <div className="text-xs text-start flex flex-wrap justify-end items-center capitalize gap-2 w-full lg:w-2/3">
          <span
            className=" bg-white px-2 pt-0.5 pb-1 rounded border border-ktsPrimary cursor-pointer hover:bg-ktsPrimary hover:text-white"
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
                className={`bg-white px-2 pt-0.5 pb-1 rounded border ${st.bdColor}   ${st.textColor} cursor-pointer ${st.hover} hover:text-white`}
                onClick={() => {
                  setQuery(st.name.toString().toLowerCase()),
                    setPagiCofig((prev) => {
                      return { ...prev, actp: 1 };
                    });
                }}
              >
                {st.name} ({searchByStatus(st.name.toString())})
              </span>
            );
          })}
        </div>
      </div>
      <DataTable
        headers={headers}
        // query={setQuery}
        config={setPagiCofig}
        len={Math.ceil(myFilter(bills, query, keys).length / pagiCofig.rpp)}
      >
        <div>
          {myFilter(bills, query, keys).length > 0 &&
            myFilter(bills, query, keys)
              .slice(
                (pagiCofig.actp - 1) * pagiCofig.rpp,
                pagiCofig.actp * pagiCofig.rpp
              )
              .map((b, i) => {
                const st = getStatus(b.status);
                return (
                  <Row
                    key={i}
                    b={b}
                    st={st}
                    // isShop={isShop}
                    // currentUser={currentUser}
                    // setShowPrint={setShowPrint}
                    // setPID={setPID}
                    // setDataPrint={setDataPrint}
                  />
                );
              })}
        </div>
      </DataTable>
    </div>
  );
};

export default Bills;
