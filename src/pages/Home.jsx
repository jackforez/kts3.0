import { useEffect, useState } from "react";
import { Button, Input, Navbar } from "../components";
import { Contact, About, Services } from ".";
import { search } from "../ultis/svgs";
import { ktsRequest } from "../ultis/connections";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
SwiperCore.use([Autoplay]);

const Home = () => {
  const [openResult, setOpenResult] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [title, setTitle] = useState("Trang chủ");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderID, setOrderID] = useState("");
  const [config, setConfig] = useState({});
  const [imgs, setImgs] = useState([]);
  document.title = title + " - KTSCORP.VN";
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await ktsRequest.get("/system");
        setConfig(res.data);
        setImgs(res.data.homeBackgroundImages);
      } catch (error) {
        console.log("Không load được cấu hình hệ thống");
      }
    };
    fetchConfig();
  }, []);
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
          <div
            className={`w-screen h-screen 
              bg-[url('./assets/imgs/hero-home.jpg')] bg-cover bg-fixed bg-center bg-no-repeat flex-grow-0 flex-shrink-0`}
          >
            {currentPage === 0 && (
              <Swiper
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{ delay: 10000 }}
                loop={true}
                modules={[EffectFade, Autoplay]}
                effect={"fade"}
              >
                {imgs &&
                  imgs.map((bg, i) => {
                    return (
                      <SwiperSlide
                        key={i}
                        className="w-screen h-screen"
                        style={{
                          backgroundImage: `url(${bg})`,
                        }}
                      >
                        <img src={bg} className="w-full h-full object-cover" />
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            )}
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
