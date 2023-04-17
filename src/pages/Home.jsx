import { useState } from "react";
import { Button, Footer, Hero, Input, Navbar } from "../components";
import { Contact, About, Services } from ".";
import { search } from "../ultis/svgs";

const Home = () => {
  const [openResult, setOpenResult] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const handleClick = () => {
    setOpenResult(!openResult);
  };
  console.log(currentPage);
  return (
    <div>
      <Navbar setPage={setCurrentPage} page={currentPage} />
      <div className="w-screen overflow-hidden">
        <div
          className="flex flex-nowrap scroll scroll-smooth scrollbar-hide duration-500"
          style={{
            transform: `translateX(-${currentPage * 100}vw)`,
          }}
        >
          <div className="w-screen bg-[url('./assets/imgs/hero-home.jpg')] h-screen bg-cover bg-fixed bg-center bg-no-repeat flex-grow-0 flex-shrink-0">
            <div className="w-full h-full bg-black/30">
              <div className="max-w-screen-xl mx-auto h-screen md:pt-[20vh] pt-[15vh] px-2">
                <div className={`flex text-white relative w-full `}>
                  <div
                    className={`md:w-1/2 w-full px-2 py-4 z-20 bg-black/10 rounded-md backdrop-blur drop-shadow-lg bg-opacity-20 text-ellipsis`}
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
                      />
                      <Button
                        group={true}
                        size={"w-1/6"}
                        type="primary"
                        icon={search}
                        callback={handleClick}
                      >
                        Tìm
                      </Button>
                    </div>
                  </div>
                  <div
                    className={`w-1/2 duration-300 left-0 botom-0 absolute h-full ${
                      !openResult ? "opacity-0" : "translate-x-full"
                    } bg-black/10 backdrop-blur drop-shadow-lg bg-opacity-20`}
                  >
                    kết quả
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
