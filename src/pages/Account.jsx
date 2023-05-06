import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Input } from "../components";
import { pencil } from "../ultis/svgs";
import { textAvatar } from "../ultis/functions";
import { toast } from "react-toastify";
const Account = (props) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [check, setCheck] = useState(false);
  const [checkChangePwd, setCheckChangePwd] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cityCode, setCityCode] = useState(currentUser?.cityCode);
  const [districtCode, setDistrictCode] = useState(currentUser?.districtCode);
  const [wardCode, setWardCode] = useState(currentUser?.wardCode);
  const [wards, setWards] = useState([]);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(currentUser?.img);
  const handleCancle = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };
  const handleSave = () => {
    console.log("SAVE");
  };
  const handleChange = (e) => {
    setCheck(true);
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleChangeInfo = async () => {
    try {
      const res = await ktsRequest.put(
        `users/${currentUser._id}`,
        { ...inputs, img: url },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data);
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    }
    // setRefresh(true);
  };
  const handleChangePwd = async () => {
    if (!newpwd) {
      toast.error("Mật khẩu mới không được để trống");
      return;
    }
    if (newpwd !== rePwd) {
      toast.error("Mật khẩu mới / xác nhận mật khẩu mới không trùng khớp");
      return;
    }
    console.log("change PWD");
    try {
      const res = await ktsRequest.put(
        `users/changepwd/${currentUser._id}`,
        { password: pwd, newpwd: newpwd },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data);
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
    }
    // setRefresh(true);
  };
  return (
    <div className="w-full h-full p-2 overflow-hidden">
      <div className="w-full bg-white rounded flex flex-col md:flex-row h-full overflow-auto">
        <div className="md:w-1/4 w-full md:py-12 py-3 px-2 flex flex-col items-center">
          <div className="w-32 h-32 aspect-square rounded-full relative flex justify-center items-center bg-orange-500 text-white">
            {currentUser.img || file ? (
              <img
                src={file ? URL.createObjectURL(file) : currentUser?.img}
                alt=""
                className="w-full h-full object-cover object-center rounded-full"
              />
            ) : (
              textAvatar(currentUser.displayName)
            )}
            <button
              className="rounded-full bg-orange-500 text-white p-2 absolute bottom-1 right-1 z-10 border border-white hover:border-orange-500 hover:text-orange-500 hover:bg-white"
              onClick={() => {
                document.getElementById("myInput").click();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </button>
          </div>

          <div className="font-semibold">#{currentUser.name}</div>
          <div className="px-2 py-0.5 bg-orange-300 text-orange-700 rounded-md">
            {currentUser.role}
          </div>
          <input
            type="file"
            id="myInput"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="md:w-3/4 w-full flex-col gap-2 p-2 flex md:flex-row">
          <div className="md:w-1/2 w-full space-y-3">
            <h3 className="uppercase font-bold w-full">Thông tin cơ bản</h3>
            <div className="w-full">
              <label htmlFor="displayName" className="">
                Tên hiển thị
              </label>
              <div className="flex gap-2">
                <Input
                  placehoder={currentUser.displayName}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editDisplayName}
                />
                <Button
                  type={editDisplayName ? "warning" : "outline-warning"}
                  icon={pencil}
                  padding={"sm"}
                  callback={() => setEditDisplayName(!editDisplayName)}
                ></Button>
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="phone" className="">
                Số điện thoại
              </label>
              <div className="flex gap-2">
                <Input
                  placehoder={currentUser.phone}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editPhone}
                />
                <Button
                  type={editPhone ? "warning" : "outline-warning"}
                  icon={pencil}
                  padding={"sm"}
                  callback={() => setEditPhone(!editPhone)}
                ></Button>
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="email" className="">
                Email{" "}
              </label>
              <div className="flex gap-2">
                <Input
                  placehoder={currentUser.email || "user@ktscorp.vn"}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editEmail}
                />
                <Button
                  type={editEmail ? "warning" : "outline-warning"}
                  icon={pencil}
                  padding={"sm"}
                  callback={() => setEditEmail(!editEmail)}
                ></Button>
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="address" className="">
                Địa chỉ
              </label>
              <div className="flex gap-2">
                <Input
                  placehoder={currentUser.address}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editAddress}
                />
                <Button
                  type={editAddress ? "warning" : "outline-warning"}
                  icon={pencil}
                  padding={"sm"}
                  callback={() => setEditAddress(!editAddress)}
                ></Button>
              </div>
            </div>
            {editAddress && (
              <div className="w-full justify-start flex">
                <div className="md:w-1/4 w-1/3 flex flex-col pr-1">
                  <label htmlFor="" className="hidden md:block">
                    Tỉnh/Thành
                  </label>
                  <select
                    id="cities"
                    class="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-ktsPrimary focus:ring-ktsPrimary"
                    onChange={(e) => setCityCode(e.target.value)}
                  >
                    {cities.map((i) => {
                      return (
                        <option
                          value={i.code}
                          key={i.code}
                          selected={i.code === currentUser.cityCode}
                        >
                          {i.name_with_type}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="md:w-1/4 w-1/3 flex flex-col pr-1">
                  <label htmlFor="" className="hidden md:block">
                    Quận/Huyện
                  </label>
                  <select
                    id="districts"
                    class="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-ktsPrimary focus:ring-ktsPrimary"
                    onChange={(e) => setDistrictCode(e.target.value)}
                  >
                    {districts.map((i) => {
                      return (
                        <option
                          value={i.code}
                          key={i.code}
                          selected={i.code === currentUser.districtCode}
                        >
                          {i.name_with_type}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="md:w-1/4 w-1/3 flex flex-col">
                  <label htmlFor="" className="hidden md:block">
                    Phường/Xã
                  </label>
                  <select
                    id="wards"
                    class="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-ktsPrimary focus:ring-ktsPrimary"
                    onChange={(e) => setWardCode(e.target.value)}
                  >
                    {wards.map((i) => {
                      return (
                        <option
                          value={i.code}
                          key={i.code}
                          selected={i.code === currentUser.wardCode}
                        >
                          {i.name_with_type}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
            <div className="w-full">
              <button
                type="submit"
                className={`md:w-3/4 w-full rounded ${
                  check
                    ? "bg-ktsPrimary hover:bg-primary-700 active:scale-95 transition-transform"
                    : "bg-slate-400"
                } px-5 py-3 text-center text-sm font-medium text-white md:mt-12 mt-3`}
                onClick={handleChangeInfo}
                disabled={!check}
              >
                Cập nhật thông tin
              </button>
            </div>
          </div>
          <div className="md:w-1/2 w-full space-y-3">
            <h3 className="uppercase font-bold w-full">Bảo mật</h3>
            <div className="w-full">
              <label htmlFor="password" className="">
                {editPassword ? "Mật khẩu cũ" : "Mật khẩu"}
              </label>
              <div className="flex gap-2">
                <div className="md:w-3/4 w-full relative">
                  <input
                    type="password"
                    name="password"
                    className={`w-full rounded border ${
                      editPassword ? "" : "bg-gray-200"
                    } border-gray-300 px-3 py-2 text-gray-900 focus:border-ktsPrimary focus:outline-none focus:ring-ktsPrimary-600 sm:text-sm`}
                    placeholder="*********"
                    required="a-z"
                    disabled={!editPassword}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 absolute right-3 top-2.5 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                    />
                  </svg>
                </div>

                <button
                  onClick={() => setEditPassword(!editPassword)}
                  className={`px-2.5 ${
                    editPassword
                      ? "bg-orange-400 text-white"
                      : "text-orange-400 bg-white"
                  } rounded border border-orange-400  hover:border-orange-400 hover:bg-orange-400 hover:text-white`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {editPassword && (
              <div className="w-full space-y-3">
                <div className="w-full">
                  <label htmlFor="" className="">
                    Mật khẩu mới
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      name="newPassword"
                      className="md:w-3/4 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ktsPrimary focus:outline-none focus:ring-ktsPrimary-600 sm:text-sm"
                      placeholder="*********"
                      required="a-z"
                      onChange={(e) => {
                        setNewPwd(e.target.value), setCheckChangePwd(true);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="" className="">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      name="renewPassword"
                      className="md:w-3/4 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-ktsPrimary focus:outline-none focus:ring-ktsPrimary-600 sm:text-sm"
                      placeholder="*********"
                      required="a-z"
                      onChange={(e) => {
                        setRePwd(e.target.value), setCheckChangePwd(true);
                      }}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className={`md:w-3/4 w-full rounded ${
                      checkChangePwd
                        ? "bg-ktsPrimary hover:bg-primary-700 active:scale-95 transition-transform"
                        : "bg-slate-400"
                    } px-5 py-3 text-center text-sm font-medium text-white mt-5`}
                    onClick={handleChangePwd}
                    disabled={!checkChangePwd}
                  >
                    Thay đổi mật khẩu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
