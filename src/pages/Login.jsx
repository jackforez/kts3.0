import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/imgs/img1.jpg";
import img2 from "../assets/imgs/img2.jpg";
import { Button, Input } from "../components";
import { key } from "../ultis/svgs";
import { userName } from "../ultis/svgs";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { ktsRequest } from "../ultis/connections";
import { loginFailure, loginSuccess } from "../redux/userSlice";
SwiperCore.use([Autoplay]);
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentUser) {
      toast.success(`Xin chào ${currentUser?.displayName || "ktsCorp.vn"}`);
      return navigate("/dashboard");
    }
  }, []);
  const handleLogin = async () => {
    if (!username) {
      toast.warn("Tên đăng nhập không được để trống");
      return;
    }
    if (!password) {
      toast.warn("Mật khẩu không được để trống");
      return;
    }
    setLoading(true);
    try {
      const res = await ktsRequest.post("/auth/signin", {
        name: username,
        password,
      });
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      dispatch(loginFailure());
      toast.error(err.response ? err.response.data.message : "Network Error!");
      setLoading(false);
    }
  };
  return (
    <div className="bg-[url('./assets/imgs/img1.jpg')] md:bg-[url('./assets/imgs/hero.jpg')] p-3 h-screen bg-cover bg-fixed bg-center bg-no-repeat overflow-hidden flex justify-center items-center">
      <div className="relative lg:w-1/2 md:w-3/4 w-full py-4 md:p-0 justify-between bg-indigo-900 flex text-white backdrop-blur rounded overflow-hidden drop-shadow bg-opacity-10 ">
        <div className="md:w-1/2 flex items-center w-full">
          <div className="w-full px-6">
            <Link
              title="Trang chủ"
              to="/"
              className="underline underline-offset-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="193.333"
                height="73.333"
                version="1"
                viewBox="0 0 145 55"
                className="h-20 mx-auto pb-4"
              >
                <path
                  fill="white"
                  d="M93 523c-4-10-10-20-15-23-11-8-68-434-58-440 4-3 9-14 11-25 4-18 12-20 84-20 73 0 81 2 90 22 13 31 49 29 69-2 16-25 20-26 104-23s87 4 85 26c-3 21 0 22 71 22 70 0 75-1 78-22 3-22 7-23 93-23s90 1 93 23c3 21 8 22 91 22 80 0 89-2 111-25 22-24 28-25 142-25 112 0 121 2 152 25 18 14 44 25 58 25 25 0 25 1 52 198 33 248 33 242-2 242-16 0-37 9-47 20-16 18-31 20-145 20s-129-2-145-20c-11-12-31-20-52-20-26 0-33 4-33 20 0 19-7 20-206 20-197 0-206-1-211-20-3-11-13-20-23-20-13 0-17 6-13 20 5 19 0 20-85 20-81 0-93-2-102-20-7-13-21-20-40-20-23 0-30 4-30 20 0 18-7 20-85 20-72 0-87-3-92-17zm162-25c-12-76-22-148-19-148 2 0 31 41 64 90l61 90h160l-23-32c-12-18-53-75-90-126l-67-93 15-35c8-20 33-75 55-122 21-46 39-87 39-89s-37-3-81-1l-81 3-30 75c-16 41-33 79-37 83-5 5-11-20-15-55-13-114-8-108-93-108H39l6 32c2 18 16 121 30 228s28 205 31 218c4 20 10 22 80 22h75l-6-32zm705 5c0-16-3-45-6-65l-7-38h-58c-33 0-59-4-59-9 0-12-38-299-45-338l-6-33H630v28c0 15 9 90 20 167 28 198 31 185-36 185h-55l7 58c3 31 8 60 11 65 2 4 89 7 194 7h189v-27zm397-5c29-30 31-37 26-80l-6-48h-68c-56 0-69 3-69 16 0 12-10 14-47 12-44-3-48-5-51-30l-3-28h170l26-35c27-34 27-35 16-122-11-85-13-89-52-126l-42-37h-221l-33 32c-24 23-33 41-33 64 0 60 5 64 82 64 58 0 69-3 64-15-4-12 4-15 44-15 49 0 50 1 50 30v30h-78c-75 0-79 1-110 33l-32 33 11 89c11 87 13 91 53 127l41 38h231l31-32z"
                  transform="matrix(.1 0 0 -.1 0 55)"
                ></path>
              </svg>
            </Link>
            <div className="w-full space-y-3">
              <Input
                placehoder="Tên đăng nhập . . ."
                type="text"
                icon={userName}
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                }
              />
              <Input
                placehoder="Mật khẩu . . . "
                type="password"
                icon={key}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="primary"
                size="w-full"
                style="uppercase font-semibold"
                callback={handleLogin}
                loading={loading}
                disabledBy={loading}
              >
                Đăng nhập
              </Button>
              <div className="flex justify-end">
                <Link
                  to="/"
                  className="underline underline-offset-4 text-gray-400 hover:text-white"
                >
                  Đăng ký
                </Link>
              </div>
              <div className="absolute w-1/2 bottom-1 md:flex justify-center hidden gap-1.5 py-2 text-center">
                <a
                  href="#"
                  className="text-gray-500 hover:text-white"
                  title="Facebook page"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-white "
                  title="Instagram page"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-white "
                  title="Twitter page"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-white "
                  title="Home Page"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 md:block hidden max-h-[80vh]">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            className="h-full"
            autoplay={{ delay: 12000 }}
            loop={true}
          >
            <SwiperSlide className="h-full">
              <img src={img1} alt="" className="w-full h-auto object-cover" />
            </SwiperSlide>
            <SwiperSlide className="h-full">
              <img src={img2} alt="" className="w-full h-full object-cover" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Login;
