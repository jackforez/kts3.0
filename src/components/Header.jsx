import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { textAvatar } from "../ultis/functions";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { dashboardConfig } from "../ultis/config";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentPage } = useSelector((state) => state.system);
  const [openMenu, setOpenMenu] = useState(false);
  const [header, setHeader] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const Menus =
    currentUser.role === "admin"
      ? [...dashboardConfig.userLinks, ...dashboardConfig.adminLinks]
      : [...dashboardConfig.userLinks];
  useEffect(() => {
    setHeader(Menus.find((i) => i.path === pathname)?.title || currentPage);
  }, [window.location.pathname]);
  return (
    <div className="flex h-[8vh] w-full items-center justify-between bg-white px-3 md:px-9 border-b border-ktsPrimary">
      <h3 className="font-bold uppercase">{header}</h3>
      <div className="flex items-center">
        <h3 className="mr-4 font-bold">{currentUser?.displayName}</h3>
        <div
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-orange-500 font-bold text-white"
          onClick={(e) => {
            e.preventDefault();
            setOpenMenu(!openMenu);
          }}
        >
          {textAvatar(currentUser?.displayName || "ktscorp.vn")}
        </div>
      </div>
      {openMenu && (
        <div className="absolute top-12 right-10 z-10 rounded border border-primary-600 bg-white p-2">
          <button
            onClick={(e) => {
              navigate("/login");
              e.preventDefault();
              toast.success(`bye ${currentUser?.displayName || "ktsCorp.vn"}`);
              setOpenMenu(!openMenu);
              dispatch(logout());
            }}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
