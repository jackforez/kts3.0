import { useEffect, useState } from "react";
import { Button, Input } from "../components";
import { search } from "../ultis/svgs";
import { ktsRequest } from "../ultis/connections";
import { toast } from "react-toastify";
import { vnpStatus } from "../ultis/vnpstatus";
const About = ({ slogan, description }) => {
  const [openResult, setOpenResult] = useState(false);
  const [title, setTitle] = useState("Tra cứu đơn hàng");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderID, setOrderID] = useState("");
  const [isKst, setIsKts] = useState(false);

  const handleClick = () => {
    if (!orderID) {
      toast.warn("Vui lòng nhập mã vận đơn!", {
        autoClose: 1000,
      });
      return;
    }
    setLoading(true);
    const config = {
      method: "get",
      url: `v2/tracking/${orderID}`,
      params: {
        id: orderID,
      },
    };

    ktsRequest(config)
      .then(function (response) {
        // console.log(response);
        setOrderDetails(response.data.data);
        setIsKts(response.data.kts);
        setLoading(false);
        setOpenResult(!openResult);
      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);
        toast.warn("Mã vận đơn đang được xử lý, vui lòng thử lại sau!");
      });
  };
  return (
    <div className="w-full h-full bg-gray-200 absolute top-0 z-10">
      <div className="max-w-screen-xl mx-auto h-screen md:pt-[15vh] pt-[20vh] px-2">
        <div className={`flex text-gray-900 relative w-full `}>
          <div
            className={`md:w-1/2 w-full px-2 py-4 z-20 rounded-md backdrop-blur drop-shadow-lg bg-opacity-20 absolute ${
              openResult && "-translate-x-[100vw]"
            } duration-500`}
          >
            <h1 className="mb-4 max-w-2xl text-3xl font-extrabold leading-none md:text-4xl xl:text-5xl">
              {slogan}
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-700  md:text-lg lg:mb-8 lg:text-xl">
              {description}
            </p>
            <div className="flex w-full">
              <Input
                group={true}
                size={"w-5/6"}
                placehoder={"Nhập mã vận đơn của bạn..."}
                onChange={(e) => setOrderID(e.target.value)}
                padding={"md"}
              />
              <Button
                type="primary"
                group={true}
                size={"w-1/6"}
                callback={handleClick}
                animation={true}
                disabledBy={loading}
                loading={loading}
                icon={search}
                padding={"md"}
              ></Button>
            </div>
          </div>
          <div
            className={`mx-auto w-full md:w-2/3 xl:w-1/2 duration-300 h-full rounded overflow-hidden ${
              !openResult ? `-translate-x-[200vw]` : "translate-x-0"
            } shadow bg-gray-300`}
          >
            <div className="w-full flex justify-between items-center">
              <h3 className="pl-3 uppercase font-semibold">
                mã vận đơn: {orderID}
              </h3>
              <button
                className="bg-primary-600 p-2"
                onClick={() => setOpenResult(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* {isKst.kts ? (
              <div className="bg-white h-[70vh]">
                <div className=" py-4 z-50 flex w-full items-center justify-center backdrop-blur duration-500 ease-in-out">
                  <div className="">
                    <div className="space-y-2 overflow-auto p-3 text-ktsPrimary">
                      <div className="col-span-12 space-y-3  px-4 sm:col-span-9">
                        {orderDetails.TBL_DELIVERY?.length > 0 ? (
                          orderDetails.TBL_DELIVERY.map((i, index) => {
                            return (
                              <div
                                key={index}
                                className="col-span-12 border-l-4 border-orange-500 bg-red-100  px-4  sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
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
                          <h3>Đơn hàng KTS</h3>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start justify-between rounded-t border-b px-7">
                      <h3 className="text-xl font-semibold text-gray-900 ">
                        Chi tiết bill gửi
                      </h3>
                    </div>
                    <div className="h-[50vh] overflow-auto overflow-y-auto p-3 text-ktsPrimary">
                      <div className="col-span-12 space-y-2  px-4 sm:col-span-9">
                        {orderDetails.TBL_DINH_VI ? (
                          orderDetails.TBL_DINH_VI.map((i, index) => {
                            return (
                              <div
                                key={index}
                                className="col-span-12 border-l-4 border-orange-500 bg-red-100  px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
                              >
                                <div className="flex flex-col">
                                  <h6 className="font-semibold tracking-wide">
                                    {i.StatusText}
                                  </h6>
                                  <p className="text-xs uppercase tracking-wide ">
                                    {i.TraceDate}
                                  </p>
                                  <p>{i.DiaChiBuuCuc}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <h3>KTS</h3>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white h-[70vh]">
                <div className=" py-4 z-50 flex w-full items-center justify-center backdrop-blur duration-500 ease-in-out">
                  <div className="">
                    <div className="space-y-2 overflow-auto p-3 text-ktsPrimary">
                      <div className="col-span-12 space-y-3  px-4 sm:col-span-9">
                        {orderDetails.TBL_DELIVERY?.length > 0 ? (
                          orderDetails.TBL_DELIVERY.map((i, index) => {
                            return (
                              <div
                                key={index}
                                className="col-span-12 border-l-4 border-orange-500 bg-red-100  px-4  sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
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
                          <h3>Không có dữ liệu trạng thái</h3>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start justify-between rounded-t border-b px-7">
                      <h3 className="text-xl font-semibold text-gray-900 ">
                        Chi tiết bill gửi
                      </h3>
                    </div>
                    <div className="h-[50vh] overflow-auto overflow-y-auto p-3 text-ktsPrimary">
                      <div className="col-span-12 space-y-2  px-4 sm:col-span-9">
                        {orderDetails.TBL_DINH_VI ? (
                          orderDetails.TBL_DINH_VI.map((i, index) => {
                            return (
                              <div
                                key={index}
                                className="col-span-12 border-l-4 border-orange-500 bg-red-100  px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
                              >
                                <div className="flex flex-col">
                                  <h6 className="font-semibold tracking-wide">
                                    {i.StatusText}
                                  </h6>
                                  <p className="text-xs uppercase tracking-wide ">
                                    {i.TraceDate}
                                  </p>
                                  <p>{i.DiaChiBuuCuc}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <h3>
                            Mã vận đơn đang được xử lý, vui lòng thử lại sau
                            hoặc liên hệ bộ phận CSKH
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            {isKst ? (
              <div className="bg-white h-[70vh]">
                <div className=" py-4 z-50 flex w-full items-center justify-center backdrop-blur duration-500 ease-in-out">
                  <div className="">
                    <div className="col-span-12 space-y-3  p-4 sm:col-span-9">
                      <span>Trạng thái cuối cùng: </span>
                      <span className="uppercase font-semibold">
                        {
                          vnpStatus[
                            orderDetails[0].statusHistory.reverse().pop()
                              .statusCode || 10
                          ]
                        }
                      </span>
                    </div>
                    <div className="flex items-start justify-between rounded-t border-b px-7">
                      <h3 className="text-xl font-semibold text-gray-900 ">
                        Chi tiết bill gửi
                      </h3>
                    </div>
                    <div className="h-[60vh] overflow-auto overflow-y-auto p-3 text-ktsPrimary">
                      <div className="col-span-12 sm:col-span-9">
                        {orderDetails[0].statusHistory.length > 0 ? (
                          orderDetails[0].statusHistory
                            .reverse()
                            .map((i, index) => {
                              return (
                                <div
                                  key={index}
                                  className="col-span-12 border-l-4 border-gray-300 py-1 relative px-4 sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
                                >
                                  <div className="w-4 h-4 bg-green-500 rounded-full absolute top-[50%] -left-2.5"></div>
                                  <div className="flex flex-col pl-4">
                                    <h6 className="font-semibold tracking-wide">
                                      {vnpStatus[i.statusCode || 10]}
                                    </h6>
                                    <p className="text-xs uppercase tracking-wide">
                                      {i.createHour + " - " + i.createdDate}
                                    </p>
                                    <p>{i.statusName}</p>
                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <h3>
                            Đơn hàng đang được xử lý, vui lòng thử lại sau hoặc
                            liên hệ bộ phận CSKH
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white h-[70vh]">
                <div className=" py-4 z-50 flex w-full items-center justify-center backdrop-blur duration-500 ease-in-out">
                  <div className="">
                    <div className="space-y-2 overflow-auto p-3 text-ktsPrimary">
                      <div className="col-span-12 space-y-3  px-4 sm:col-span-9">
                        {orderDetails.TBL_DELIVERY?.length > 0 ? (
                          orderDetails.TBL_DELIVERY.map((i, index) => {
                            return (
                              <div
                                key={index}
                                className="col-span-12 border-l-4 border-orange-500 bg-red-100 px-4  sm:col-span-8 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:-left-3 sm:before:w-0.5"
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
                          <h3>Không có dữ liệu trạng thái</h3>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start justify-between rounded-t border-b px-7">
                      <h3 className="text-xl font-semibold text-gray-900 ">
                        Chi tiết bill gửi
                      </h3>
                    </div>
                    <div className="h-[50vh] overflow-auto overflow-y-auto p-3 text-ktsPrimary">
                      <div className="col-span-12 px-4 sm:col-span-9">
                        {orderDetails.TBL_DINH_VI ? (
                          orderDetails.TBL_DINH_VI.map((i, index) => {
                            return (
                              <div
                                key={index}
                                className="col-span-12 border-l-4 border-gray-300 py-2 relative px-4 sm:col-span-8"
                              >
                                <div className="w-4 h-4 bg-green-500 rounded-full absolute top-[30%] -left-2.5"></div>
                                <div className="flex flex-col pr-3">
                                  <h6 className="font-semibold tracking-wide">
                                    {i.StatusText}
                                  </h6>
                                  <p className="text-xs uppercase tracking-wide ">
                                    {i.TraceDate}
                                  </p>
                                  <p>{i.DiaChiBuuCuc}</p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <h3>
                            Mã vận đơn đang được xử lý, vui lòng thử lại sau
                            hoặc liên hệ bộ phận CSKH
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
