import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
const Tracking = () => {
  const [openPop, setOpenPop] = useState(false);
  const [orderID, setOrderID] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  useEffect(() => {
    const setTitle = () => {
      document.title = "Tra cứu hành trình đơn hàng - KTSCORP.VN";
    };
    setTitle();
  });
  return (
    <div className="flex w-full flex-1 flex-col gap-3 p-4">
      <div className="relative w-full lg:w-1/2 ">
        <input
          type="search"
          id="search-dropdown"
          className={` block w-full rounded-l-lg border border-r-2 border-blue-500 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 ${
            edit ? "  bg-gray-50 " : "  bg-gray-300 "
          }`}
          placeholder="Nhập mã vận đơn KTS, VTPost, VNPost ..."
          required=""
          disabled={!edit}
          onChange={(e) => setOrderID(e.target.value)}
        />
        <button
          type="button"
          className=" absolute top-0 -right-1 inline-flex items-center rounded-r-lg border border-blue-700 bg-blue-700 py-2.5 px-8 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault;
            if (!orderID) {
              toast.warning("Bạn hãy nhập mã vận đơn!");
              return;
            }
            setLoading(true);
            setEdit(false);
            var config = {
              method: "get",
              url: `tracking/${orderID}}`,
              params: {
                id: orderID,
              },
            };

            ktsRequest(config)
              .then(function (response) {
                setOrderDetails(JSON.stringify(response.data));
                setOpenPop(true);
                setLoading(false);
              })
              .catch(function (error) {
                toast.error("Network Error!");
              });
          }}
        >
          {loading ? (
            <svg
              class="h-5  w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          )}
        </button>
      </div>
      {openPop && (
        <div className="flex w-full items-center justify-center backdrop-blur duration-500 ease-in-out">
          <div className="h-full w-full rounded-lg border border-orange-500  bg-white">
            <div className="flex items-start justify-between rounded-t border-b p-4 ">
              <h3 className="text-xl font-semibold text-gray-900 ">
                Thông tin bưu gửi {orderID}
              </h3>
            </div>

            <div className="space-y-6 overflow-auto bg-red-100 p-3">
              <div className="col-span-12 space-y-3  px-4 sm:col-span-9">
                {JSON.parse(orderDetails).data ? (
                  JSON.parse(orderDetails).data.TBL_DELIVERY.map((i, index) => {
                    return (
                      <div
                        key={index}
                        className="col-span-12 border-l-4 border-orange-500 px-4  sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
                      >
                        <div className="flex flex-col">
                          <h6 className="font-semibold tracking-wide">
                            {i.STATUSTEXT}
                          </h6>
                          <p className="text-xs uppercase tracking-wide">
                            {i.NGAY_PHAT}
                          </p>
                          <p>{i.VI_TRI}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h3>Không có dữ liệu</h3>
                )}
              </div>
            </div>
            <div className="flex items-start justify-between rounded-t border-b p-4 ">
              <h3 className="text-xl font-semibold text-gray-900 ">
                Chi tiết bill gửi
              </h3>
            </div>
            <div className="h-[40vh] space-y-6 overflow-auto overflow-y-auto bg-red-100 p-3">
              <div className="col-span-12 space-y-3  px-4 sm:col-span-9">
                {JSON.parse(orderDetails).data ? (
                  JSON.parse(orderDetails).data.TBL_DINH_VI.map((i, index) => {
                    return (
                      <div
                        key={index}
                        className="col-span-12 border-l-4 border-orange-500 px-4  sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
                      >
                        <div className="flex flex-col">
                          <h6 className="font-semibold tracking-wide">
                            {i.StatusText}
                          </h6>
                          <p className="text-xs uppercase tracking-wide">
                            {i.TraceDate}
                          </p>
                          <p>{i.DiaChiBuuCuc}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h3>Không có dữ liệu</h3>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 rounded-b border-t border-gray-200 p-6 ">
              <button
                type="button"
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => {
                  setOpenPop(false);
                  setEdit(true);
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
