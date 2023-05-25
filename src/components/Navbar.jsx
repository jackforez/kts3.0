import { useState } from "react";
import { Link } from "react-router-dom";
import androidLink from "../assets/adr-link.png";
import androidQr from "../assets/adr-qr.png";
const Navbar = ({ page, setPage, title, links }) => {
  const navLinks = ["Trang chủ", "Tra đơn", "Dịch vụ", "Liên hệ"];
  const [openDownload, setOpenDownload] = useState(false);
  return (
    <nav
      className={`fixed z-30 w-full ${
        page > 0
          ? "bg-ktsPrimary"
          : "bg-black text-white backdrop-blur rounded-lg drop-shadow bg-opacity-10"
      } duration-300`}
    >
      <div className="mx-auto flex flex-wrap max-w-screen-xl items-center justify-between md:px-4 px-2 lg:px-6 pb-4 md:pb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="193.333"
          height="73.333"
          version="1"
          viewBox="0 0 145 55"
          className="w-24 order-1"
        >
          <path
            fill="white"
            d="M93 523c-4-10-10-20-15-23-11-8-68-434-58-440 4-3 9-14 11-25 4-18 12-20 84-20 73 0 81 2 90 22 13 31 49 29 69-2 16-25 20-26 104-23s87 4 85 26c-3 21 0 22 71 22 70 0 75-1 78-22 3-22 7-23 93-23s90 1 93 23c3 21 8 22 91 22 80 0 89-2 111-25 22-24 28-25 142-25 112 0 121 2 152 25 18 14 44 25 58 25 25 0 25 1 52 198 33 248 33 242-2 242-16 0-37 9-47 20-16 18-31 20-145 20s-129-2-145-20c-11-12-31-20-52-20-26 0-33 4-33 20 0 19-7 20-206 20-197 0-206-1-211-20-3-11-13-20-23-20-13 0-17 6-13 20 5 19 0 20-85 20-81 0-93-2-102-20-7-13-21-20-40-20-23 0-30 4-30 20 0 18-7 20-85 20-72 0-87-3-92-17zm162-25c-12-76-22-148-19-148 2 0 31 41 64 90l61 90h160l-23-32c-12-18-53-75-90-126l-67-93 15-35c8-20 33-75 55-122 21-46 39-87 39-89s-37-3-81-1l-81 3-30 75c-16 41-33 79-37 83-5 5-11-20-15-55-13-114-8-108-93-108H39l6 32c2 18 16 121 30 228s28 205 31 218c4 20 10 22 80 22h75l-6-32zm705 5c0-16-3-45-6-65l-7-38h-58c-33 0-59-4-59-9 0-12-38-299-45-338l-6-33H630v28c0 15 9 90 20 167 28 198 31 185-36 185h-55l7 58c3 31 8 60 11 65 2 4 89 7 194 7h189v-27zm397-5c29-30 31-37 26-80l-6-48h-68c-56 0-69 3-69 16 0 12-10 14-47 12-44-3-48-5-51-30l-3-28h170l26-35c27-34 27-35 16-122-11-85-13-89-52-126l-42-37h-221l-33 32c-24 23-33 41-33 64 0 60 5 64 82 64 58 0 69-3 64-15-4-12 4-15 44-15 49 0 50 1 50 30v30h-78c-75 0-79 1-110 33l-32 33 11 89c11 87 13 91 53 127l41 38h231l31-32z"
            transform="matrix(.1 0 0 -.1 0 55)"
          ></path>
        </svg>
        <div className="justify-between md:w-5/12 w-full flex order-3 md:order-2 px-5">
          {navLinks.map((l, i) => {
            return (
              <button
                onClick={() => {
                  setPage(i);
                  title(l);
                  setOpenDownload(false);
                }}
                key={i}
                className={`uppercase font-semibold text-sm ${
                  page === i
                    ? "text-white underline underline-offset-8"
                    : "text-white/50"
                }`}
              >
                {l}
              </button>
            );
          })}
          <div className="relative">
            <button
              onClick={() => setOpenDownload(!openDownload)}
              className={`uppercase font-semibold text-sm text-white
            }`}
            >
              Download
            </button>
            {openDownload && (
              <div className="absolute bg-white p-2 w-36 z-50 flex">
                <a href={links.main} download>
                  <img src={links.qr} className="h-32 w-32" />
                  <img src={androidLink} className="w-32" />
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center order-2 md:order-3">
          <Link
            to="/login"
            className="mr-2 px-3 text-xs py-3 uppercase md:text-sm bg-white text-primary-600 rounded-md font-medium hover:bg-primary-600 hover:text-white"
          >
            đăng nhập
          </Link>
          <Link
            to="/dashboard/bills/new"
            className="text-xs md:text-sm rounded-md bg-primary-600 px-5 uppercase py-3 font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 "
          >
            <span>tạo đơn</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
