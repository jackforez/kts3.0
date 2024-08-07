import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { ktsRequest } from "../ultis/connections";
import { Card } from "../components";
const Accounts = () => {
  const currentUser = useSelector((state) => state.user);
  const token = currentUser.currentUser.token;
  const [data, setData] = useState([]);
  const [cost, setCost] = useState([]);
  const [change, setChange] = useState(false);
  useEffect(() => {
    const setTitle = () => {
      document.title = "Danh sách người dùng - KTSCORP.VN";
    };
    setTitle();
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/users", {
          headers: {
            Authorization: `Beare ${token}`,
          },
        });
        setData(res.data);
      } catch (error) {}
    };
    fetchData();
    setChange(false);
  }, [change]);
  useEffect(() => {
    const fetchCost = async () => {
      try {
        const res = await ktsRequest.get("/cost", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCost(res.data.data);
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      }
    };
    fetchCost();
  }, []);
  return (
    <div className="flex flex-1 h-full flex-col gap-2 bg-gray-200 p-2 overflow-auto">
      {data.map((i) => {
        return (
          <Card
            user={i}
            key={i._id}
            success={setChange}
            token={token}
            cost={cost}
            parent={data.find((el) => el._id === i.parentUser) || ""}
          />
        );
      })}
    </div>
  );
};

export default Accounts;
