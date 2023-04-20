import { useState } from "react";
import { NavLink } from "react-router-dom";
import { dashboardConfig } from "../ultis/config";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";
const Navigator = () => {
  const { currentUser } = useSelector((state) => state.user);
  const Menus =
    currentUser?.role === "admin"
      ? [...dashboardConfig.userLinks, ...dashboardConfig.adminLinks]
      : [...dashboardConfig.userLinks];
  const [active, setActive] = useState(0);
  return (
    <div className="h-[8vh] md:hidden relative bg-white">
      <Swiper
        spaceBetween={0}
        slidesPerView={5}
        className="h-full flex w-screen"
      >
        {Menus.map((menu, i) => {
          return (
            menu.role.includes(currentUser?.role) && (
              <SwiperSlide key={i}>
                <NavLink
                  key={i}
                  className={`h-full w-full flex flex-col items-center justify-center text-xs text-center ${
                    active === i && "bg-ktsPrimary text-white"
                  }`}
                  onClick={() => setActive(i)}
                  to={menu.path}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mx-auto duration-500"
                    color={active === i ? "white" : "black"}
                    style={{
                      transform: `translateY(-${active === i ? 3 : 0}vw)`,
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={menu.d}
                    />
                  </svg>

                  <span
                    className={`absolute duration-500 ${
                      active === i ? "bottom-2.5" : "-bottom-10"
                    }`}
                  >
                    {menu.title}
                  </span>
                </NavLink>
              </SwiperSlide>
            )
          );
        })}
      </Swiper>
    </div>
  );
};

export default Navigator;
