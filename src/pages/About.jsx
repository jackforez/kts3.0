import { useEffect, useState } from "react";
import { Button, Input } from "../components";
import { search } from "../ultis/svgs";
import { ktsRequest } from "../ultis/connections";
import { toast } from "react-toastify";

// const Card = ({ img = "", name = "anhvan", position = "thợ code" }) => {
//   return (
//     <div className="w-full border border-primary-300 rounded overflow-hidden object-cover">
//       <div>
//         <img src={img} alt="" className="h-full w-full" />
//       </div>
//       <div className="px-3 pb-2">
//         <h3 className="uppercase font-semibold">{name}</h3>
//         <h3 className="text-gray-500 text-xs">{position}</h3>
//         <div className="text-sm">handsome man</div>
//       </div>
//     </div>
//   );
// };
const About = () => {
  const [openResult, setOpenResult] = useState(false);
  const [title, setTitle] = useState("Tra cứu đơn hàng");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [orderID, setOrderID] = useState("");
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
    // <div className="mx-auto max-w-screen-xl px-4 pb-16 lg:py-4 mt-[15vh] md:mt-[8vh] h-[92vh] overflow-y-auto">
    //   <div className="p-3 overflow-auto text">
    //     <h3 className="text-center uppercase text-3xl font-extrabold">
    //       Về chúng tôi
    //     </h3>
    //     <p
    //       id="content"
    //       className={`${
    //         collapse ? "line-clamp-999" : "line-clamp-6"
    //       } text-justify leading-6`}
    //     >
    //       Hôm nay ta thức dậy cũng như thường nhật Thấy thanh xuân ngày nào bỗng
    //       dưng trở lại Em soi gương cười duyên chẳng còn thấy đâu những vết đồi
    //       mồi Mặc một chiếc váy xinh ngồi chờ anh qua Anh sẽ đưa em quay trở về
    //       với những ngày hôm qua Khi mà bao lo toan bộn bề vẫn đang ở nơi xa Khi
    //       mà tuổi trẻ vẫn vương trên mái tóc Khi mà bầu trời vẫn một vẻ xanh
    //       trong Đời vẫn mênh mông chân ta ung dung bước Và tất cả những niềm mơ
    //       ở phía trước chẳng cách xa Lại chỉ có đôi ta Những ngày chỉ có đôi ta
    //       oh Đưa em về thanh xuân Về những dấu yêu ban đầu Những âu lo cứ thế
    //       hững hờ qua tay Ta thêm lần đôi mươi Và những ước ao đã từng Ở một
    //       tầng mây khác riêng hai chúng ta Thời gian cứ thế nhẹ trôi dẫu em vài
    //       lần luyến tiếc Màn đêm kéo những mộng mơ níu anh vào sâu mắt em Chặng
    //       đường ta bước cùng nhau như thước phim lưu trong ký ức Cả thanh xuân
    //       ta đã dành cho nhau Anh vẫn sẽ đưa tay về phía em chẳng chờ đợi điều
    //       gì Và anh vẫn sẽ đạp xe theo em vu vơ như xưa nhiều khi Bó hoa cài bên
    //       cửa vẫn không lời nhắn gửi Dành trao em cả nước mắt đắng bên cạnh kia
    //       những nụ cười Ba mươi năm trong đời từng ngậm ngùi bao nhiêu điều tiếc
    //       nuối Nhưng nếu một lần quay lại vẫn chọn cầm chặt tay em đến cuối Cùng
    //       viết lên chuyện đời đến khi chỉ còn một điều để nói Yes I love you
    //       baby Bình yên ghé thăm chiều nay Tuổi thanh xuân tô trời mây Buộc tia
    //       nắng anh nhẹ mang vào trong lá thư tay Những bỡ ngỡ trao về nhau giọt
    //       nước mắt đôi tay khẽ lau Cho vụng về trao ta những lần đầu huh Đưa em
    //       về thanh xuân Về những dấu yêu ban đầu Những âu lo cứ thế hững hờ qua
    //       tay Ta thêm lần đôi mươi Và những ước ao đã từng Ở một tầng mây khác
    //       riêng hai chúng ta Đưa em về thanh xuân Về những dấu yêu ban đầu Những
    //       âu lo cứ thế hững hờ qua tay Ta thêm lần đôi mươi Và những ước ao đã
    //       từng Ở một tầng mây khác riêng hai chúng ta Hôm nay ta thức dậy cũng
    //       như thường nhật Thấy thanh xuân ngày nào bỗng dưng trở lại Em soi
    //       gương cười duyên chẳng còn thấy đâu những vết đồi mồi Mặc một chiếc
    //       váy xinh ngồi chờ anh về
    //     </p>
    //     <span
    //       className={`block text-end cursor-pointer hover:text-primary hover:italic text-gray-600 hover:text-gray-900`}
    //       onClick={() => setCollapse(!collapse)}
    //     >
    //       {collapse ? "Thu gọn" : "Xem thêm"}
    //     </span>
    //   </div>
    //   <div className="mt-[2.5vh] overflow-auto">
    //     <h3 className="text-center uppercase text-3xl font-extrabold">
    //       our team
    //     </h3>
    //     <div className="grid md:grid-cols-7 grid-cols-2 gap-2">
    //       <Card
    //         img="https://s120-ava-talk.zadn.vn/f/2/5/8/18/120/4bda66c1b844d0ad057b130e75e9ac28.jpg"
    //         name="sang"
    //         position="CEO"
    //       />
    //       <Card
    //         img="https://s120-ava-talk.zadn.vn/8/5/6/e/2/120/57b073dd1158ac5da7afa399a5fca233.jpg"
    //         name="tiến"
    //         position="CFO"
    //       />
    //       <Card
    //         img="https://s75-ava-talk.zadn.vn/e/5/b/a/30/75/6ba47dc0095b3ac3390161a9f4fccca8.jpg"
    //         name="khánh"
    //         position="CTO"
    //       />
    //       <Card
    //         img="https://s120-ava-talk.zadn.vn/c/c/c/1/4/120/88e82372edfb2edfdc1f0f2e05f9d5a9.jpg"
    //         name="văn"
    //         position="CODER"
    //       />
    //       <Card
    //         img="https://s120-ava-talk.zadn.vn/e/b/5/6/4/120/1d68734824ec5ef470324e3e818ed3a7.jpg"
    //         name="tuấn"
    //         position="CODER"
    //       />
    //       <Card
    //         img="https://s75-ava-talk.zadn.vn/4/9/8/7/72/75/135e8cb6fc02660a4bb8642704b3b2e5.jpg"
    //         name="minh"
    //         position="TECHNICAN"
    //       />
    //       <Card
    //         img="https://s75-ava-talk.zadn.vn/9/f/7/d/5/75/c2dcecbd64a3fb5d58e293a731023014.jpg"
    //         name="sự"
    //         position="TECHNICAN"
    //       />
    //     </div>
    //   </div>
    // </div>
    <div className="w-full h-full bg-gray-200 absolute top-0 z-10">
      <div className="max-w-screen-xl mx-auto h-screen md:pt-[15vh] pt-[20vh] px-2">
        <div className={`flex text-gray-900 relative w-full `}>
          <div
            className={`md:w-1/2 w-full px-2 py-4 z-20 rounded-md backdrop-blur drop-shadow-lg bg-opacity-20 absolute ${
              openResult && "-translate-x-[100vw]"
            } duration-500`}
          >
            <h1 className="mb-4 max-w-2xl text-3xl font-extrabold leading-none md:text-4xl xl:text-5xl">
              Nhanh chóng an toàn đáng tin cậy
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-700  md:text-lg lg:mb-8 lg:text-xl">
              KTS hiện đã triển khai liên kết với dịch vụ của VNPOST, cùng với
              VietelPost, SNAPY, JT&T, NinjaVan, chúng tôi đã có mạng lưới bưu
              cục rộng khắp cả nước
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
  );
};

export default About;
