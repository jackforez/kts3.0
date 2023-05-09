import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import { toVND } from "../ultis/functions";
import { ktsRequest } from "../ultis/connections";
import { GridData } from "../components";
const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser.token;
  const isAdmin = currentUser.role === "admin";
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [numOfUsers, setNumOfUsers] = useState(0);
  const [numOfCustomers, setNumOfCustomers] = useState(0);
  const [cost, setCost] = useState(0);
  const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const setTitle = () => {
      document.title = "Tổng quan tài khoản - KTSCORP.VN";
    };
    setTitle();
  });
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await ktsRequest.get("/bills/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBills(res.data);
      } catch (err) {}
    };
    fetchBills();
  }, []);
  useEffect(() => {
    const fetchNumberOfUser = async () => {
      try {
        const res = await ktsRequest.get("/users/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNumOfUsers(res.data);
      } catch (err) {}
    };
    fetchNumberOfUser();
  }, []);
  useEffect(() => {
    const fetchNumberOfCustomers = async () => {
      try {
        const res = await ktsRequest.get("/customers/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNumOfCustomers(res.data);
      } catch (err) {}
    };
    fetchNumberOfCustomers();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/users/countcost", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCost(res.data);
      } catch (err) {}
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/bills/sum", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSum(res.data);
      } catch (err) {}
    };
    fetchData();
  }, []);
  const headers = [
    { title: "Đơn hàng ", size: "w-3/12" },
    { title: "người gửi/nhận", size: "w-5/12" },
    { title: "chịu cước", size: "w-1/12 text-end" },
    { title: "COD", size: "w-1/12 text-end" },
    { title: "cước shop", size: "w-1/12 text-end" },
    { title: "cước KTS", size: "w-1/12 text-end" },
  ];
  return (
    <div>
      {!isAdmin ? (
        <div className="flex flex-col gap-2 p-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <div className="grid w-full auto-cols-auto gap-3 md:grid-flow-col">
                <Link
                  to="/dashboard/customers"
                  className="flex flex-col justify-between gap-3 rounded-lg bg-amber-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-6xl font-bold">{numOfCustomers}</h3>
                    <div className="rounded-full bg-white p-1.5">
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
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="mt-6 font-semibold">Tất cả khách hàng</span>
                </Link>
                <Link
                  to="/dashboard/partners"
                  className="flex flex-col justify-between rounded-lg bg-emerald-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-6xl font-bold">{numOfUsers}</h3>
                    <div className="rounded-full bg-white p-1.5">
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
                          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="mt-6 font-semibold">Tất cả shop</span>
                </Link>
                <Link
                  to="/dashboard/cost"
                  className="flex flex-col justify-between rounded-lg bg-cyan-300 p-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-6xl font-bold">{cost}</h3>
                    <div className="rounded-full bg-white p-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="mt-6 font-semibold">Tất cả đơn giá</span>
                </Link>
                <Link
                  to="/dashboard/bills"
                  className="flex flex-col justify-between rounded-lg bg-green-400 p-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-6xl font-bold">{toVND(sum)}</h3>
                    <div className="rounded-full bg-white p-1.5">
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
                          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="mt-6 font-semibold">Tổng doanh thu</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between p-3">
              <h3 className="font-bold uppercase ">Đơn hàng gần nhất</h3>
              <Link
                to="/dashboard/bills"
                className="flex items-center text-gray-600 hover:text-blue-600 hover:italic"
              >
                <span>Tất cả đơn hàng </span>
                <span className="ml-1 rounded-full bg-gray-300 p-0.5">
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
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
              </Link>
            </div>
            <div className="border border-ktsPrimary rounded-md">
              <GridData headers={headers}>
                <div className="divide-y text-sm divide-dashed divide-ktsPrimary bg-white shadow-lg rounded-md">
                  {bills.map((b, i) => {
                    return (
                      <div className="px-2 py-1.5 flex items-center" key={i}>
                        <div className="w-3/12">
                          <span className="bg-primary-200 px-1 inline-block py-0.5 rounded text-primary-700 font-semibold text-xs">
                            {b.status}
                          </span>
                          <span> {b.orderNumber}</span>

                          {/* <div>Mã tra cứu: {b.partnerTrackingId}</div> */}
                        </div>
                        {/* <div className="w-/12 md:grid md:auto-cols-fr md:grid-flow-col"> */}
                        <div className="w-5/12">
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
                          <span className="font-semibold">
                            {toVND(b.costK)}
                          </span>
                        </div>
                        {/* </div> */}
                      </div>
                    );
                  })}
                </div>
              </GridData>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3">
          <div>
            {" "}
            <div>
              <div className="flex flex-wrap gap-2">
                <div className="grid w-full auto-cols-auto gap-3 md:grid-flow-col">
                  <Link
                    to="/dashboard/customers"
                    className="flex flex-col justify-between gap-3 rounded-lg bg-amber-200 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-6xl font-bold">{numOfCustomers}</h3>
                      <div className="rounded-full bg-white p-1.5">
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
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="mt-6 font-semibold">
                      Tất cả khách hàng
                    </span>
                  </Link>
                  <Link
                    to="/dashboard/partners"
                    className="flex flex-col justify-between rounded-lg bg-emerald-200 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-6xl font-bold">{numOfUsers}</h3>
                      <div className="rounded-full bg-white p-1.5">
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
                            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="mt-6 font-semibold">Tất cả shop</span>
                  </Link>
                  <Link
                    to="/dashboard/cost"
                    className="flex flex-col justify-between rounded-lg bg-cyan-300 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-6xl font-bold">{cost}</h3>
                      <div className="rounded-full bg-white p-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          class="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="mt-6 font-semibold">Tất cả đơn giá</span>
                  </Link>
                  <Link
                    to="/dashboard/bills"
                    className="flex flex-col justify-between rounded-lg bg-green-400 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-6xl font-bold">{sum}</h3>
                      <div className="rounded-full bg-white p-1.5">
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
                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="mt-6 font-semibold">Tổng số user</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
