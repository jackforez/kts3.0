import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { Button, GridData } from "../components";
import { pencil, trash } from "../ultis/svgs";
const Cost = () => {
  const [costs, setCosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser.token;
  const isAmin = currentUser.role === "admin";
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const getData = () => {
      const config = {
        method: "get",
        url: "/cost",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      ktsRequest(config)
        .then(function (response) {
          setCosts(response.data.data);
          setLoading(false);
        })
        .catch(function (err) {
          setLoading(false);
          toast.error(
            err.response ? err.response.data.message : "Network Error"
          );
        });
    };
    getData();
    setRefresh(false);
  }, [refresh]);
  const handleDelete = async (cost) => {
    if (
      confirm(
        `Bạn chắc chắn muốn xóa mức giá ${cost.costName}?\n Sau khi thực hiện sẽ không thể hoàn tác!\n Các thông tin đơn hàng cũ cũng không thể truy xuất!`
      )
    ) {
      try {
        const res = await ktsRequest.delete(`/cost/${cost._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(res.data.message);
        setRefresh(true);
      } catch (err) {
        err.response
          ? toast.error(err.response.data.message)
          : toast.error("Network Error!");
      }
    }
  };
  const headers = [
    { title: "Tên mức giá", size: "w-1/6" },
    { title: "Min (gram)", size: "w-1/6" },
    { title: "Max (gram)", size: "w-1/6" },
    { title: "Giá trị", size: "w-1/6" },
    { title: "Tạo bởi", size: "w-1/6" },
    { title: "Thao tác", size: "w-1/6 text-center" },
  ];
  return (
    <div className="flex-1 p-3">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-bold uppercase">
          Danh sách mức giá áp dụng trên hệ thống
        </h3>
        <Link
          to="/dashboard/cost/new"
          className="order-2 flex items-center gap-1 rounded border border-primary-600 p-2 text-xs font-semibold text-primary-600 hover:bg-primary-600 hover:text-white md:text-base lg:order-3"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>

          <span className="hidden md:block">Tạo mới</span>
        </Link>
      </div>
      <div className="border border-ktsPrimary rounded-md">
        <GridData headers={headers}>
          <div className="divide-y divide-dashed divide-ktsPrimary">
            {costs?.length > 0 ? (
              costs.map((c, i) => {
                return (
                  <div
                    className="px-2 py-1.5 flex items-center bg-white"
                    key={i}
                  >
                    <div className="w-1/6 font-semibold">{c.costName}</div>
                    <div className="w-1/6">{c.minWeight}</div>
                    <div className="w-1/6">{c.maxWeight}</div>
                    <div className="w-1/6">{c.value}</div>
                    <div className="w-1/6">{c.shopName}</div>
                    <div className="w-1/6 flex justify-between md:justify-center md:gap-2">
                      <Button
                        type="outline-warning"
                        icon={pencil}
                        iconSize={"4"}
                        padding="xs"
                      ></Button>
                      <Button
                        type="outline-danger"
                        icon={trash}
                        iconSize={"4"}
                        padding="xs"
                      ></Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-3 text-center">
                {loading ? "Đang tải dữ liệu ..." : "Không có dữ liệu"}
              </div>
            )}
          </div>
        </GridData>
      </div>
    </div>
  );
};

export default Cost;
