const Card = ({ img = "", name = "anhvan", position = "thợ code" }) => {
  return (
    <div className="w-full border border-primary-300 rounded overflow-hidden object-cover">
      <div>
        <img src={img} alt="" className="h-full w-full" />
      </div>
      <div className="px-3 pb-2">
        <h3 className="uppercase font-semibold">{name}</h3>
        <h3 className="text-gray-500">{position}</h3>
        <div className="">handsom man</div>
      </div>
    </div>
  );
};
const About = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-16 lg:py-16 mt-[15vh] md:mt-[8vh] h-[92vh] overflow-y-auto">
      <div className="p-3 overflow-auto">
        <h3 className="text-center uppercase text-3xl font-extrabold">
          Về chúng tôi
        </h3>
        <p>
          Hôm nay ta thức dậy cũng như thường nhật Thấy thanh xuân ngày nào bỗng
          dưng trở lại Em soi gương cười duyên chẳng còn thấy đâu những vết đồi
          mồi Mặc một chiếc váy xinh ngồi chờ anh qua Anh sẽ đưa em quay trở về
          với những ngày hôm qua Khi mà bao lo toan bộn bề vẫn đang ở nơi xa Khi
          mà tuổi trẻ vẫn vương trên mái tóc Khi mà bầu trời vẫn một vẻ xanh
          trong Đời vẫn mênh mông chân ta ung dung bước Và tất cả những niềm mơ
          ở phía trước chẳng cách xa Lại chỉ có đôi ta Những ngày chỉ có đôi ta
          oh Đưa em về thanh xuân Về những dấu yêu ban đầu Những âu lo cứ thế
          hững hờ qua tay Ta thêm lần đôi mươi Và những ước ao đã từng Ở một
          tầng mây khác riêng hai chúng ta Thời gian cứ thế nhẹ trôi dẫu em vài
          lần luyến tiếc Màn đêm kéo những mộng mơ níu anh vào sâu mắt em Chặng
          đường ta bước cùng nhau như thước phim lưu trong ký ức Cả thanh xuân
          ta đã dành cho nhau Anh vẫn sẽ đưa tay về phía em chẳng chờ đợi điều
          gì Và anh vẫn sẽ đạp xe theo em vu vơ như xưa nhiều khi Bó hoa cài bên
          cửa vẫn không lời nhắn gửi Dành trao em cả nước mắt đắng bên cạnh kia
          những nụ cười Ba mươi năm trong đời từng ngậm ngùi bao nhiêu điều tiếc
          nuối Nhưng nếu một lần quay lại vẫn chọn cầm chặt tay em đến cuối Cùng
          viết lên chuyện đời đến khi chỉ còn một điều để nói Yes I love you
          baby Bình yên ghé thăm chiều nay Tuổi thanh xuân tô trời mây Buộc tia
          nắng anh nhẹ mang vào trong lá thư tay Những bỡ ngỡ trao về nhau giọt
          nước mắt đôi tay khẽ lau Cho vụng về trao ta những lần đầu huh Đưa em
          về thanh xuân Về những dấu yêu ban đầu Những âu lo cứ thế hững hờ qua
          tay Ta thêm lần đôi mươi Và những ước ao đã từng Ở một tầng mây khác
          riêng hai chúng ta Đưa em về thanh xuân Về những dấu yêu ban đầu Những
          âu lo cứ thế hững hờ qua tay Ta thêm lần đôi mươi Và những ước ao đã
          từng Ở một tầng mây khác riêng hai chúng ta Hôm nay ta thức dậy cũng
          như thường nhật Thấy thanh xuân ngày nào bỗng dưng trở lại Em soi
          gương cười duyên chẳng còn thấy đâu những vết đồi mồi Mặc một chiếc
          váy xinh ngồi chờ anh về
        </p>
      </div>
      <div className="mt-[2.5vh] overflow-auto">
        <h3 className="text-center uppercase text-3xl font-extrabold">
          our team
        </h3>
        <div className="grid md:grid-cols-7 grid-cols-2 gap-2">
          <Card
            img="https://s120-ava-talk.zadn.vn/f/2/5/8/18/120/4bda66c1b844d0ad057b130e75e9ac28.jpg"
            name="sang"
            position="CEO"
          />
          <Card
            img="https://s120-ava-talk.zadn.vn/8/5/6/e/2/120/57b073dd1158ac5da7afa399a5fca233.jpg"
            name="tiến"
            position="CFO"
          />
          <Card
            img="https://s75-ava-talk.zadn.vn/e/5/b/a/30/75/6ba47dc0095b3ac3390161a9f4fccca8.jpg"
            name="khánh"
            position="CTO"
          />
          <Card
            img="https://s120-ava-talk.zadn.vn/c/c/c/1/4/120/88e82372edfb2edfdc1f0f2e05f9d5a9.jpg"
            name="văn"
            position="CODER"
          />
          <Card
            img="https://s120-ava-talk.zadn.vn/e/b/5/6/4/120/1d68734824ec5ef470324e3e818ed3a7.jpg"
            name="tuấn"
            position="CODER"
          />
          <Card
            img="https://s120-ava-talk.zadn.vn/e/b/5/6/4/120/1d68734824ec5ef470324e3e818ed3a7.jpg"
            name="minh"
            position="TECHNICAN"
          />
          <Card
            img="https://s75-ava-talk.zadn.vn/9/f/7/d/5/75/c2dcecbd64a3fb5d58e293a731023014.jpg"
            name="sự"
            position="TECHNICAN"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
