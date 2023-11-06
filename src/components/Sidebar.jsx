import { useState } from "react";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import arrow from "../assets/control.png";

import { dashboardConfig } from "../ultis/config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.role === "admin";
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(0);
  const Menus = isAdmin
    ? [...dashboardConfig.userLinks, ...dashboardConfig.adminLinks]
    : [...dashboardConfig.userLinks];
  return (
    <div className="hidden md:flex">
      <div
        className={` ${
          open ? "w-60" : "w-20 "
        } relative h-screen bg-ktsPrimary  px-5 py-2 duration-300`}
      >
        <img
          src={arrow}
          className={`absolute -right-3 top-[2vh] w-7 cursor-pointer rounded-full duration-500
           border border-ktsPrimary  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex items-center justify-center gap-x-4">
          <svg
            fill="white"
            viewBox="0 0 145 55"
            onClick={() => navigate("/")}
            className={`h-12 cursor-pointer text-white duration-500 ${
              open && "rotate-[360deg]"
            }`}
          >
            <g
              transform="translate(0.000000,55.000000) scale(0.100000,-0.100000)"
              stroke="none"
            >
              <path
                d="M93 523 c-4 -10 -10 -20 -15 -23 -11 -8 -68 -434 -58 -440 4 -3 9
                  -14 11 -25 4 -18 12 -20 84 -20 73 0 81 2 90 22 13 31 49 29 69 -2 16 -25 20
                  -26 104 -23 84 3 87 4 85 26 -3 21 0 22 71 22 70 0 75 -1 78 -22 3 -22 7 -23
                  93 -23 86 0 90 1 93 23 3 21 8 22 91 22 80 0 89 -2 111 -25 22 -24 28 -25 142
                  -25 112 0 121 2 152 25 18 14 44 25 58 25 25 0 25 1 52 198 33 248 33 242 -2
                  242 -16 0 -37 9 -47 20 -16 18 -31 20 -145 20 -114 0 -129 -2 -145 -20 -11
                  -12 -31 -20 -52 -20 -26 0 -33 4 -33 20 0 19 -7 20 -206 20 -197 0 -206 -1
                  -211 -20 -3 -11 -13 -20 -23 -20 -13 0 -17 6 -13 20 5 19 0 20 -85 20 -81 0
                  -93 -2 -102 -20 -7 -13 -21 -20 -40 -20 -23 0 -30 4 -30 20 0 18 -7 20 -85 20
                  -72 0 -87 -3 -92 -17z m162 -25 c-12 -76 -22 -148 -19 -148 2 0 31 41 64 90
                  l61 90 80 0 80 0 -23 -32 c-12 -18 -53 -75 -90 -126 l-67 -93 15 -35 c8 -20
                  33 -75 55 -122 21 -46 39 -87 39 -89 0 -2 -37 -3 -81 -1 l-81 3 -30 75 c-16
                  41 -33 79 -37 83 -5 5 -11 -20 -15 -55 -13 -114 -8 -108 -93 -108 l-74 0 6 32
                  c2 18 16 121 30 228 14 107 28 205 31 218 4 20 10 22 80 22 l75 0 -6 -32z
                  m705 5 c0 -16 -3 -45 -6 -65 l-7 -38 -58 0 c-33 0 -59 -4 -59 -9 0 -12 -38
                  -299 -45 -338 l-6 -33 -74 0 -75 0 0 28 c0 15 9 90 20 167 28 198 31 185 -36
                  185 l-55 0 7 58 c3 31 8 60 11 65 2 4 89 7 194 7 l189 0 0 -27z m397 -5 c29
                  -30 31 -37 26 -80 l-6 -48 -68 0 c-56 0 -69 3 -69 16 0 12 -10 14 -47 12 -44
                  -3 -48 -5 -51 -30 l-3 -28 85 0 85 0 26 -35 c27 -34 27 -35 16 -122 -11 -85
                  -13 -89 -52 -126 l-42 -37 -110 0 -111 0 -33 32 c-24 23 -33 41 -33 64 0 60 5
                  64 82 64 58 0 69 -3 64 -15 -4 -12 4 -15 44 -15 49 0 50 1 50 30 l0 30 -78 0
                  c-75 0 -79 1 -110 33 l-32 33 11 89 c11 87 13 91 53 127 l41 38 116 0 115 0
                  31 -32z"
              />
            </g>
          </svg>
        </div>
        <div className="pt-3">
          {Menus.map(
            (Menu, index) =>
              Menu.role.includes(currentUser?.role) && (
                <NavLink
                  to={Menu.path}
                  key={index}
                  onClick={() => setActive(Menu)}
                  title={Menu.title}
                  className={`flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm text-gray-300 hover:bg-ktsSecondary hover:font-bold hover:text-white
                ${Menu.gap ? "mt-6" : "mt-2"} ${
                    active === Menu
                      ? " bg-ktsSecondary font-bold text-white"
                      : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                    color="white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={Menu.d}
                    />
                  </svg>

                  <span
                    className={`${
                      !open && "hidden"
                    } absolute left-16 whitespace-pre duration-200`}
                  >
                    {Menu.title}
                  </span>
                </NavLink>
              )
          )}
        </div>
        <div
          className={`bottom-10 mt-6 flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm font-semibold text-gray-300 hover:bg-ktsSecondary hover:font-bold hover:text-white`}
          onClick={(e) => {
            e.preventDefault();
            toast.success(`bye ${currentUser?.displayName || "ktsCorp.vn"}`);
            dispatch(logout());
            navigate("/login");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 rotate-180"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>

          <span
            className={`${
              !open && "hidden"
            } absolute left-16 whitespace-pre duration-200`}
          >
            Đăng xuất
          </span>
        </div>
        <Link
          to="/dashboard/changelogs"
          className="text-white absolute bottom-3"
        >
          v3.1.1
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
