import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Input, Selector } from "../components";
import { pencil } from "../ultis/svgs";
import { textAvatar } from "../ultis/functions";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { loaded, onLoading } from "../redux/systemSlice";
import { loginSuccess } from "../redux/userSlice";
const Account = (props) => {
  // redux
  const { currentUser } = useSelector((state) => state.user);
  const { token } = currentUser;
  const { loading, refresh } = useSelector((state) => state.system);
  const dispatch = useDispatch();
  //
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [checkChangePwd, setCheckChangePwd] = useState(false);
  //
  const [inputs, setInputs] = useState(currentUser || {});
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(currentUser?.img || "");
  //
  const [pwd, setPwd] = useState("");
  const [newpwd, setNewPwd] = useState("");
  const [rePwd, setRePwd] = useState("");
  //
  const navigate = useNavigate();
  useEffect(() => {
    const setTitle = () => {
      document.title = "Thông tin tài khoản - KTSCORP.VN";
    };
    setTitle();
  });
  useEffect(() => {
    const getCities = async () => {
      try {
        const res = await ktsRequest.get("/cities");
        const data = Object.values(res.data);
        setCities(data);
      } catch (error) {
        toast.error(error);
      }
    };
    getCities();
  }, []);
  useEffect(() => {
    const getDistricts = async () => {
      try {
        const cName = cities.find((city) => city.name_with_type == cityCode);
        const resd = await ktsRequest.get(`/cities/districts/${cName.code}`);
        const data = Object.values(resd.data);
        setDistricts(data);
        setInputs((prev) => {
          return {
            ...prev,
            cityCode: cName.code,
            cityName: cName.name,
            cityFullName: cName.name_with_type,
          };
        });
      } catch (error) {
        toast.error(error);
      }
    };
    getDistricts();
  }, [cityCode]);
  useEffect(() => {
    const getWards = async () => {
      try {
        const dName = districts.find((d) => d.name_with_type == districtCode);
        const resw = await ktsRequest.get(`cities/wards/${dName.code}`);
        const data = Object.values(resw.data);
        setWards(data);
        setInputs((prev) => {
          return {
            ...prev,
            districtCode: dName.code,
            districtName: dName.name,
            districtFullName: dName.name_with_type,
          };
        });
      } catch (error) {
        toast.error(error);
      }
    };
    getWards();
  }, [districtCode]);
  useEffect(() => {
    const getWard = () => {
      try {
        const wName = wards.find((w) => w.name_with_type === wardCode);
        wardCode &&
          setInputs((prev) => {
            return {
              ...prev,
              wardCode: wName?.code || currentUser.wardCode,
              wardName: wName?.name || currentUser.wardName,
              wardFullName: wName?.name_with_type || currentUser.wardFullName,
            };
          });
      } catch (error) {
        toast.error(error);
      }
    };
    getWard();
  }, [wardCode]);
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleChangeInfo = async () => {
    dispatch(onLoading());
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
      toast.success("Cập nhật thông tin thành công");
      dispatch(loginSuccess({ ...res.data, token }));
      dispatch(loaded());
    } catch (error) {
      console.log(error);
      toast.error(error.response ? error.response.data : "Network Error!");
      dispatch(loaded());
    }
  };
  const handleChangePwd = async () => {
    dispatch(onLoading());
    if (!newpwd) {
      toast.error("Mật khẩu mới không được để trống");
      dispatch(loaded());
      return;
    }
    if (newpwd !== rePwd) {
      toast.error("Mật khẩu mới / xác nhận mật khẩu mới không trùng khớp");
      dispatch(loaded());
      return;
    }
    try {
      const res = await ktsRequest.post(
        `v2/users/changepwd/${inputs?._id}`,
        { password: pwd, newpwd: newpwd },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Thay đổi mật khẩu thành công");
      dispatch(loginSuccess({ ...res.data, token }));
      dispatch(loaded());
    } catch (error) {
      toast.error(error.response ? error.response.data : "Network Error!");
      dispatch(loaded());
    }
  };
  return (
    <div className="w-full h-full p-2 overflow-hidden">
      <div className="w-full bg-white rounded flex flex-col md:flex-row h-full overflow-auto">
        <div className="md:w-1/4 w-full md:py-12 py-3 px-2 flex flex-col items-center">
          <div className="w-32 h-32 aspect-square rounded-full relative flex justify-center items-center bg-orange-500 text-white">
            {inputs.img || file ? (
              <img
                src={file ? URL.createObjectURL(file) : inputs?.img}
                alt=""
                className="w-full h-full object-cover object-center rounded-full"
              />
            ) : (
              textAvatar(inputs?.displayName)
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

          <div className="font-semibold">#{inputs?.name}</div>
          <div className="px-2 py-0.5 bg-orange-300 text-orange-700 rounded-md">
            {inputs?.role}
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
                  name="displayName"
                  placehoder={inputs?.displayName || "Tên hiển thị"}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editDisplayName}
                  onChange={handleChange}
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
                  name="phone"
                  placehoder={currentUser.phone}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editPhone}
                  onChange={handleChange}
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
                  name="email"
                  placehoder={currentUser.email || "user@ktscorp.vn"}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editEmail}
                  onChange={handleChange}
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
                  name="address"
                  placehoder={currentUser.address}
                  size={"md:w-3/4 w-full"}
                  padding={"sm"}
                  disabledBy={!editAddress}
                  onChange={handleChange}
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
              <div className="grid md:grid-cols-3 gap-1 pt-1 w-full md:w-3/4">
                <div className="w-full z-30">
                  <Selector
                    placehoder={inputs?.cityFullName || "Tỉnh/Thành"}
                    data={cities}
                    field={["name"]}
                    toShow="name_with_type"
                    size={"sm"}
                    output={setCityCode}
                  />
                </div>
                <div className="w-full z-20">
                  <Selector
                    placehoder={inputs?.districtFullName || "Quận/Huyện"}
                    data={districts}
                    field={["name_with_type"]}
                    toShow="name_with_type"
                    size={"sm"}
                    output={setDistrictCode}
                  />
                </div>
                <div className="w-full z-10">
                  <Selector
                    placehoder={inputs?.wardFullName || "Phường/Xã"}
                    data={wards}
                    field={["name_with_type"]}
                    toShow="name_with_type"
                    size={"sm"}
                    output={setWardCode}
                  />
                </div>
              </div>
            )}
            <div className="w-full">
              <Button
                type="primary"
                size="md:w-3/4 w-full"
                callback={handleChangeInfo}
                loading={loading && inputs !== currentUser}
                disabledBy={inputs === currentUser}
                animation={true}
                padding={"sm"}
              >
                Cập nhật thông tin
              </Button>
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
                  <Button
                    type="primary"
                    size="md:w-3/4 w-full"
                    callback={handleChangePwd}
                    loading={loading}
                    disabledBy={!checkChangePwd}
                    animation={true}
                    padding={"sm"}
                  >
                    Thay đổi mật khẩu
                  </Button>
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
