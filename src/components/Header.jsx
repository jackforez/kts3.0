import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";

import { useNavigate } from "react-router-dom";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const textAvatar = (text) => {
    let name = text.split(" ");
    if (name.length === 1) {
      return name[0].charAt().toUpperCase();
    } else {
      return (
        name[0].charAt(0).toUpperCase() +
        name[name.length - 1].charAt(0).toUpperCase()
      );
    }
  };
  return (
    <div className="flex h-[6vh] w-full items-center justify-end rounded bg-white px-3 md:px-9">
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
            to="/login"
            onClick={(e) => {
              e.preventDefault();
              setOpenMenu(!openMenu);
              dispatch(setMsg(`bye! ${currentUser.displayName}`));
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
