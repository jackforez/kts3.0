import { useEffect, useState } from "react";
import { Button, Input, Navbar } from "../components";
import { Contact, About, Services } from ".";
import { search } from "../ultis/svgs";
import { ktsRequest } from "../ultis/connections";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
SwiperCore.use([Autoplay]);

const Home = () => {
  const [openResult, setOpenResult] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [title, setTitle] = useState("Trang chủ");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderID, setOrderID] = useState("");
  const [config, setConfig] = useState({});
  document.title = title + " - KTSCORP.VN";
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await ktsRequest.get("/system");
        setConfig(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Không load được cấu hình hệ thống");
      }
    };
    fetchConfig();
  }, []);
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
      url: `tracking/${orderID}`,
      params: {
        id: orderID,
      },
    };

    ktsRequest(config)
      .then(function (response) {
        setOrderDetails(response.data.data);
        setLoading(false);
        setOpenResult(!openResult);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
        toast.error("Network Error!");
      });
  };

  return (
    <div>
      <Navbar setPage={setCurrentPage} page={currentPage} title={setTitle} />
      <div className="w-screen overflow-hidden">
        <div
          className="flex flex-nowrap scroll scroll-smooth scrollbar-hide duration-500"
          style={{
            transform: `translateX(-${currentPage * 100}vw)`,
          }}
        >
          <div className="w-screen h-screen flex-grow-0 flex-shrink-0">
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              className="h-full"
              autoplay={{ delay: 1000 }}
              loop={true}
            >
              <SwiperSlide
                className={`w-screen h-screen bg-[url()] bg-cover bg-fixed bg-center bg-no-repeat`}
              ></SwiperSlide>
              <SwiperSlide
                className={`w-screen h-screen bg-[url()] bg-cover bg-fixed bg-center bg-no-repeat`}
              ></SwiperSlide>
              <SwiperSlide
                className={`w-screen h-screen bg-[url()] bg-cover bg-fixed bg-center bg-no-repeat`}
              ></SwiperSlide>
            </Swiper>
            <div className="w-full h-full bg-black/30 absolute top-0 z-10">
              <div className="max-w-screen-xl mx-auto h-screen md:pt-[15vh] pt-[20vh] px-2">
                <div className={`flex text-white relative w-full `}>
                  <div
                    className={`md:w-1/2 w-full px-2 py-4 z-20 bg-black/10 rounded-md backdrop-blur drop-shadow-lg bg-opacity-20 absolute ${
                      openResult && "-translate-x-[100vw]"
                    } duration-500`}
                  >
                    <h1 className="mb-4 max-w-2xl text-3xl font-extrabold leading-none md:text-4xl xl:text-5xl">
                      Nhanh chóng an toàn đáng tin cậy
                    </h1>
                    <p className="mb-6 max-w-2xl font-light text-gray-200  md:text-lg lg:mb-8 lg:text-xl">
                      KTS hiện đã triển khai liên kết với dịch vụ của VNPOST,
                      cùng với VietelPost, SNAPY, JT&T, NinjaVan, chúng tôi đã
                      có mạng lưới bưu cục rộng khắp cả nước
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
                    className={`w-full duration-300 h-full rounded overflow-hidden ${
                      !openResult ? `-translate-x-[200vw]` : "translate-x-0"
                    } bg-black/10 backdrop-blur drop-shadow-lg bg-opacity-20`}
                  >
                    <div className="w-full flex justify-between items-center">
                      <h3 className="pl-3 uppercase">mã vận đơn: {orderID}</h3>
                      <button
                        className="bg-primary-600 p-2"
                        onClick={() => setOpenResult(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
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
                          <div className="flex items-start justify-between rounded-t border-b p-4">
                            <h3 className="text-xl font-semibold text-gray-900 ">
                              Chi tiết bill gửi
                            </h3>
                          </div>
                          <div className="h-[50vh] overflow-auto overflow-y-auto p-3 text-ktsPrimary">
                            <div className="col-span-12 space-y-0.5  px-4 sm:col-span-9">
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
                                <h3>Không có dữ liệu chi tiết</h3>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-screen h-screen flex-grow-0 flex-shrink-0">
            <About />
          </div>
          <div className="w-screen h-screen flex-grow-0 flex-shrink-0">
            <Services />
          </div>
          <div className="w-screen h-screen flex-grow-0 flex-shrink-0">
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
