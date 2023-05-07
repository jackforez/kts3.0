import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { Button, GridData, Input } from "../components";
import { pencil, search, trash } from "../ultis/svgs";
import { loaded, onLoading, onRefreh } from "../redux/systemSlice";
import { search as myFilter, toVND } from "../ultis/functions";
const Cost = () => {
  const [costs, setCosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.system);
  const { refresh } = useSelector((state) => state.system);
  const token = currentUser.token;
  const isAmin = currentUser.role === "admin";
  const [openAddCost, setOpenAddCost] = useState(false);
  const [inputs, setInputs] = useState({});
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(onLoading());
      try {
        const res = await ktsRequest.get("/cost", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setCosts(res.data.data);
        dispatch(loaded());
      } catch (error) {
        dispatch(loaded());
        toast.error(error.response ? error.response.data : "Network Error!");
      }
    };
    fetchData();
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
        dispatch(onRefreh());
      } catch (err) {
        err.response
          ? toast.error(err.response.data.message)
          : toast.error("Network Error!");
      }
    }
  };
  const handleCreate = async () => {
    dispatch(onLoading());
    if (!inputs.costName) {
      toast.warn("Vui lòng nhập tên mức giá");
      dispatch(loaded());
      return;
    }
    if (!inputs.minWeight) {
      toast.warn("Vui lòng khối lượng tối thiểu");
      dispatch(loaded());
      return;
    }
    if (!inputs.maxWeight) {
      toast.warn("Vui lòng khối lượng tối đa");
      dispatch(loaded());
      return;
    }
    if (inputs.minWeight >= inputs.maxWeight) {
      toast.warn("Giá trị không hợp lệ");
      dispatch(loaded());
      return;
    }
    if (inputs.value <= 0) {
      toast.warn("Giá trị mức giá không hợp lệ");
      dispatch(loaded());
      return;
    }
    try {
      const res = await ktsRequest.post(
        "/cost",
        {
          ...inputs,
          createdBy: currentUser._id,
          shopName: currentUser.displayName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
      dispatch(loaded());
      dispatch(onRefreh());
    } catch (err) {
      dispatch(loaded());
      toast.error(err.response ? err.response.data.message : "Network Error");
    }
  };
  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
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
      <div className="flex items-center justify-between py-3">
        <Input
          placehoder={"Tìm theo tên ..."}
          size={"w-1/3"}
          onChange={(e) => setQuery(e.target.value)}
          icon={search}
          padding="sm"
        />
        {openAddCost ? (
          <div className="md:w-1/4 w-1/2 flex gap-2">
            <Button
              Button
              type="outline-danger"
              padding={"xs"}
              size="w-1/2"
              callback={() => setOpenAddCost(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              Button
              type="success"
              padding={"xs"}
              size="w-1/2"
              disabledBy={loading}
              animation={true}
              loading={loading}
              callback={handleCreate}
            >
              Lưu
            </Button>
          </div>
        ) : (
          <Button
            type="primary"
            padding={"xs"}
            size="md:w-1/6 w-1/3 p-1.5"
            callback={() => setOpenAddCost(true)}
          >
            Tạo mới
          </Button>
        )}
      </div>
      {openAddCost && (
        <div className="rounded border border-gray-300 bg-white p-2 flex flex-wrap mb-2">
          <div className="grid md:grid-cols-4 gap-1 pt-1 w-full">
            <div className="w-full">
              <label className="block">Tên mức giá</label>
              <Input
                name="costName"
                placehoder={"tên mức giá"}
                padding={"sm"}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="block">Khối lượng tối thiểu</label>
              <Input
                name="minWeight"
                type="number"
                placehoder={"gram"}
                onChange={handleChange}
                padding={"sm"}
              />
            </div>
            <div className="w-full">
              <label className="block">Khối lượng tối đa</label>
              <Input
                name="maxWeight"
                type="number"
                placehoder={"gram"}
                onChange={handleChange}
                padding={"sm"}
              />
            </div>
            <div className="w-full">
              <label className="block">Phí vận chuyển</label>
              <Input
                name="value"
                type="number"
                placehoder={"VND"}
                onChange={handleChange}
                padding={"sm"}
              />
            </div>
          </div>
        </div>
      )}
      <div className="border border-ktsPrimary rounded-md overflow-hidden">
        <GridData headers={headers}>
          <div className="divide-y divide-dashed divide-ktsPrimary">
            {myFilter(costs, query, ["costName"]).length > 0 ? (
              myFilter(costs, query, ["costName"]).map((c, i) => {
                return (
                  <div
                    className="px-2 py-1.5 flex items-center bg-white"
                    key={i}
                  >
                    <div className="w-1/6 font-semibold">{c.costName}</div>
                    <div className="w-1/6">{c.minWeight}</div>
                    <div className="w-1/6">{c.maxWeight}</div>
                    <div className="w-1/6">{toVND(c.value)}</div>
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
