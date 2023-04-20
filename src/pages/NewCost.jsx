import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";

const NewCost = () => {
  const [costName, setCostName] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [value, setValue] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser.token;
  const handleClick = async () => {
    if (!costName) {
      toast.warn("Vui lòng nhập tên mức giá");
      return;
    }
    if (!minWeight) {
      toast.warn("Vui lòng khối lượng tối thiểu");
      return;
    }
    if (!maxWeight) {
      toast.warn("Vui lòng khối lượng tối đa");
      return;
    }
    if (minWeight >= maxWeight) {
      toast.warn("Giá trị không hợp lệ");
      return;
    }
    if (value <= 0) {
      toast.warn("Giá trị mức giá không hợp lên");
      return;
    }
    const config = {
      method: "post",
      url: "/cost",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        costName,
        minWeight,
        maxWeight,
        value,
        createdBy: currentUser._id,
        shopName: currentUser.displayName,
      },
    };

    await ktsRequest(config)
      .then(function (response) {
        toast.success(response.data.message);
      })
      .catch(function (err) {
        toast.error(err.response ? err.response.data.message : "Network Error");
      });
  };
  return (
    <div className="p-3">
      <div className="flex items-center justify-between ">
        <h3 className="block font-bold uppercase">Thêm mới mức giá</h3>
        <Link
          to="/dashboard/cost"
          className="flex items-center gap-1 rounded border border-primary-600 p-2 text-xs font-semibold text-primary-600 hover:bg-primary-600 hover:text-white md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>

          <span className="hidden md:block">Quay lại danh sách mức giá</span>
        </Link>
      </div>
      <div className="mt-9 flex flex-col justify-between gap-3">
        <label htmlFor="name" className="font-semibold">
          Tên mức giá <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Mức giá ..."
          id="name"
          name="name"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setCostName(e.target.value)}
        />
        <label htmlFor="minw" className="font-semibold">
          Khối lượng tối thiểu<span className="text-red-600">*</span>
        </label>

        <input
          type="text"
          placeholder="(gram)"
          id="minw"
          name="minw"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setMinWeight(e.target.value)}
        />
        <label htmlFor="maxw" className="font-semibold">
          Khối lượng tối đa <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="(gram)"
          id="maxw"
          name="maxw"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setMaxWeight(e.target.value)}
        />
        <label htmlFor="fee" className="font-semibold">
          Phí giao hàng <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="(VNĐ)"
          id="fee"
          name="fee"
          className="block w-full rounded border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <button
        className="mt-9 w-full rounded border-2 border-primary-600 p-2 font-semibold text-primary-600 hover:bg-primary-600 hover:text-white md:w-1/3"
        onClick={handleClick}
      >
        Tạo mới
      </button>
      <ToastContainer />
    </div>
  );
};

export default NewCost;
