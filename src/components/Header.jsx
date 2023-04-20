import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { textAvatar } from "../ultis/functions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="flex h-[8vh] md:h-[6vh] w-full items-center justify-end bg-white px-3 md:px-9 border-b border-ktsPrimary">
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
      {openMenu && (
        <div className="absolute top-12 z-10 rounded border border-primary-600 bg-white p-2">
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
