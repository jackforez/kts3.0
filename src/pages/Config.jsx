import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";

const Config = () => {
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser.token;
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [workingtime, setWorkingtime] = useState("");
  const [hotline, setHotline] = useState("");
  const [email, setEmail] = useState("");
  const handleClick = async () => {
    await ktsRequest
      .put(
        "/system",
        {
          slogan,
          description,
          address,
          workingtime,
          hotline,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        toast.success(response.data);
      })
      .catch((err) => {
        toast.error(`Cập nhật thất bại: ${err} `);
      });
  };
  return (
    <div className="flex h-full w-full flex-col gap-2 p-3">
      <h3 className="font-bold ">Tạo mới thông tin trang chủ</h3>
      <div className="flex items-center gap-4">
        <label
          htmlFor="name"
          className="w-1/4 bg-slate-300 p-1.5 font-semibold"
        >
          Slogan
        </label>
        <input
          type="text"
          placeholder="Slogan ..."
          id="slogan"
          name="slogan"
          className="flex-7 block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setSlogan(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <label
          htmlFor="description"
          className="w-1/4 bg-slate-300 p-1.5 font-semibold"
        >
          Description
        </label>
        <input
          type="text"
          placeholder="Địa chỉ ..."
          id="description"
          name="description"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <label
          htmlFor="address"
          className="w-1/4 bg-slate-300 p-1.5 font-semibold"
        >
          Địa chỉ
        </label>
        <input
          type="text"
          placeholder="Địa chỉ ..."
          id="address"
          name="address"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <label
          htmlFor="wokingtime"
          className="w-1/4 bg-slate-300 p-1.5 font-semibold"
        >
          Thời gian làm việc
        </label>
        <input
          type="text"
          placeholder="Thời gian làm việc ..."
          id="wokingtime"
          name="wokingtime"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setWorkingtime(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <label
          htmlFor="hotline"
          className="w-1/4 bg-slate-300 p-1.5 font-semibold"
        >
          Hotline
        </label>
        <input
          type="text"
          placeholder="Hotline ..."
          id="hotline"
          name="hotline"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setHotline(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <label
          htmlFor="email"
          className="w-1/4 bg-slate-300 p-1.5 font-semibold"
        >
          email
        </label>
        <input
          type="text"
          placeholder="Email ..."
          id="email"
          name="email"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        className="mt-9 w-full rounded border-2 border-primary-600 p-2 font-semibold text-primary-600 hover:bg-primary-600 hover:text-white md:w-1/3"
        onClick={handleClick}
      >
        Cập nhật
      </button>
    </div>
  );
};

export default Config;
