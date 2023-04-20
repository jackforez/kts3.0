import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const Account = (props) => {
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
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [editDisplayName, setEditDisplayName] = useState(false);
  const handleCancle = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };
  const handleSave = () => {
    console.log("SAVE");
  };
  return (
    <div className="flex-1">
      {/* <div className="border-b-2 border-red-300 p-3 text-xl font-semibold">
        {props.title}
      </div> */}
      <div className="mx-auto p-3 lg:w-4/5">
        <div className="mb-6 flex">
          <div className="flex h-36 w-36 items-center justify-center rounded-[50%] bg-red-300 ">
            {currentUser.img ? (
              <img src={currentUser.img} />
            ) : (
              <span className="text-5xl font-bold text-white">
                {displayName
                  ? textAvatar(displayName)
                  : textAvatar(currentUser.name)}
              </span>
            )}
          </div>
          <div className="w-2/ relative p-3">
            <h3 className="mb-2 text-xl font-semibold">
              {currentUser.displayName}
            </h3>
            <span className="block text-gray-500">@{currentUser.name}</span>
            <span className="block text-gray-500">{currentUser.role}</span>
          </div>
        </div>
        <div>
          <label
            htmlFor="name"
            className="my-2 text-sm font-medium text-gray-900 md:block"
          >
            Tên đăng nhập
          </label>
          <input
            type="text"
            placeholder="0123 456 789"
            value={currentUser.name}
            id="name"
            className="block w-full rounded border border-gray-300 bg-gray-200 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500"
            disabled
          />
          <label
            htmlFor="displayName"
            className="my-2 text-sm font-medium text-gray-900 md:block"
          >
            Tên hiển thị
          </label>
          <input
            type="text"
            value={currentUser.displayName}
            id="displayName"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500"
          />
          <label
            htmlFor="address"
            className="my-2 text-sm font-medium text-gray-900 md:block"
          >
            Địa chỉ kho
          </label>
          <input
            type="text"
            value={
              currentUser.address +
              ", " +
              currentUser.wardFullName +
              ", " +
              currentUser.districtFullName +
              ", " +
              currentUser.cityFullName
            }
            id="address"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500"
          />
          <label
            htmlFor="phone"
            className="my-2 text-sm font-medium text-gray-900 md:block"
          >
            Số điện thoại
          </label>
          <input
            type="text"
            value={currentUser.phone}
            id="phone"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500"
          />
          <label
            htmlFor="email"
            className="my-2 text-sm font-medium text-gray-900 md:block"
          >
            Email
          </label>
          <input
            type="text"
            value={currentUser.email}
            id="email"
            className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500"
          />
          <div>
            <label
              htmlFor="password"
              className="my-2 text-sm font-medium text-gray-900 md:block"
            >
              Password
            </label>
            <div>
              <div className="flex h-10 gap-1">
                <input
                  type="password"
                  placeholder="********"
                  id="password"
                  className="block w-4/6 rounded border border-gray-300 bg-gray-200 p-2 text-sm text-gray-900 outline-0 focus:border-blue-500 focus:ring-blue-500 "
                  disabled
                />
                <button className="w-2/6 rounded border border-orange-500 font-semibold hover:bg-orange-500 hover:text-white">
                  Đổi mật khẩu
                </button>
              </div>
              <div className="hidden">abc</div>
            </div>
          </div>
          <div className="mt-3 flex w-full gap-1">
            <button className="flex h-full w-1/2 items-center justify-center gap-3 rounded border border-green-500 p-2 font-semibold hover:bg-green-500 hover:text-white md:w-1/3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                onClick={handleSave}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>

              <span> Lưu</span>
            </button>
            <button className="flex h-full w-1/2 items-center justify-center gap-1 rounded border border-red-600 p-2 font-semibold hover:bg-red-600 hover:text-white md:w-1/3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
                onClick={handleCancle}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>

              <span> Thoát</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
