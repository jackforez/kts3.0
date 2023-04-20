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
    <div className="flex h-full flex-col gap-2 bg-gray-200 p-2">
      {data.map((i) => {
        return (
          <Card
            user={i}
            key={i._id}
            success={setChange}
            token={token}
            cost={cost}
          />
        );
      })}
    </div>
  );
};

export default Accounts;
