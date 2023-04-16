import { useState } from "react";
import { Button, Footer, Hero, Input, Navbar } from "../components";
import { search } from "../ultis/svgs";
const Home = () => {
  const [output, setOutput] = useState("");
  const [openResult, setOpenResult] = useState(false);
  const handleClick = () => {
    setOpenResult(!openResult);
  };
  return (
    <div className="bg-[url('./assets/imgs/hero-home.jpg')] h-screen bg-cover bg-fixed bg-center bg-no-repeat overflow-hidden">
      <div className="h-screen w-full bg-black/30">
        <Navbar />
        <div className="max-w-screen-xl mx-auto h-[80vh]">
          <div className={`flex text-white  relative `}>
            <div
              className={`w-1/2 px-2 py-4 z-20 bg-black/10 rounded-md backdrop-blur drop-shadow-lg bg-opacity-20`}
            >
              <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none  md:text-5xl xl:text-6xl">
                Nhanh chóng an toàn đáng tin cậy
              </h1>
              <p className="mb-6 max-w-2xl font-light text-gray-200  md:text-lg lg:mb-8 lg:text-xl">
                KTS hiện đã triển khai liên kết với dịch vụ của VNPOST, cùng với
                VietelPost, SNAPY, JT&T, NinjaVan, chúng tôi đã có mạng lưới bưu
                cục rộng khắp cả nước
              </p>
              <div className="flex w-full">
                <Input
                  group={true}
                  size={"w-5/6"}
                  placehoder={"Nhập mã vận đơn ..."}
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
              className={`w-1/2 duration-300 left-0 absolute h-full ${
                !openResult ? "opacity-0" : "translate-x-full"
              } bg-black/10 backdrop-blur drop-shadow-lg bg-opacity-20`}
            >
              kết quả
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
