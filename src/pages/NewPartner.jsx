import { Button, Input, Selector } from "../components";
import { key, mail, mapPin, phone } from "../ultis/svgs";
import { userName } from "../ultis/svgs";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { ktsRequest } from "../ultis/connections";
import { loaded, onLoading } from "../redux/systemSlice";
import { useNavigate } from "react-router-dom";

const NewPartner = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.system);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [costName, setCostName] = useState("");
  const [cost, setCost] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "Tạo mới đối tác - KTSCORP.VN";
  }, []);
  const handelChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
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
        setInputs((prev) => {
          return {
            ...prev,
            wardCode: wName?.code,
            wardName: wName?.name,
            wardFullName: wName?.name_with_type,
          };
        });
      } catch (error) {
        toast.error(error);
      }
    };
    wardCode && getWard();
  }, [wardCode]);
  useEffect(() => {
    const fetchCost = async () => {
      try {
        const res = await ktsRequest.get("/cost", {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setCost(res.data.data);
        setCostName(res.data.data[0].costName);
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Network Error!");
      }
    };
    fetchCost();
  }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    dispatch(onLoading());
    if (!inputs.name) {
      toast.warn("Tên đăng nhập không được để trống!");
      dispatch(loaded());
      return;
    }
    if (!inputs.phone || inputs.phone.length !== 10) {
      toast.warn("Số điện thoại không hợp lệ");
      dispatch(loaded());
      return;
    }
    if (!inputs.displayName) {
      toast.warn("Tên shop không được để trống!");
      dispatch(loaded());
      return;
    }
    if (!inputs.address) {
      toast.warn("Vui lòng nhập địa chỉ, tên đường!");
      dispatch(loaded());
      return;
    }
    if (!inputs.cityCode) {
      toast.warn("Vui lòng chọn Tỉnh/Thành!");
      dispatch(loaded());
      return;
    }
    if (!inputs.districtCode) {
      toast.warn("Vui lòng chọn Quận/Huyện!");
      dispatch(loaded());
      return;
    }
    if (!inputs.wardCode) {
      toast.warn("Vui lòng chọn Phường/Xã!");
      dispatch(loaded());
      return;
    }
    try {
      const res = await ktsRequest.post("/auth/signup", {
        ...inputs,
        parentUser: currentUser?._id,
        cost: [costName],
      });
      toast.success(res.data);
      dispatch(loaded());
    } catch (er) {
      dispatch(loaded());
      toast.error(er.response ? er.response.data : "Network Error");
    }
  };
  return (
    <div className="w-full p-2">
      <form
        className="w-full space-y-3 border border-gray-300 rounded p-2 bg-white"
        action=""
      >
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          <div className="space-y-2">
            <Input
              padding="sm"
              placehoder="Tên đăng nhập . . ."
              type="text"
              icon={userName}
              value={inputs?.name}
              onChange={(e) =>
                setInputs((prev) => {
                  return {
                    ...prev,
                    name: e.target.value.replace(/[^a-zA-Z0-9]/g, ""),
                  };
                })
              }
            />
            <Input
              name="password"
              padding="sm"
              placehoder="Mật khẩu . . . "
              type="password"
              icon={key}
              value={inputs?.password}
              onChange={handelChange}
            />
            <Input
              name="repassword"
              padding="sm"
              placehoder="Xác nhận mật khẩu . . . "
              type="password"
              icon={key}
              value={inputs?.repassword}
              onChange={handelChange}
            />
            <Input
              name="displayName"
              padding="sm"
              placehoder="Tên shop . . ."
              type="text"
              icon={userName}
              value={inputs?.displayName}
              onChange={handelChange}
            />
            <Input
              name="phone"
              padding="sm"
              placehoder="Số điện thoại . . ."
              type="number"
              icon={phone}
              value={inputs?.phone}
              onChange={handelChange}
            />
          </div>
          <div className="space-y-2">
            {" "}
            <Input
              name="email"
              padding="sm"
              placehoder="Email . . ."
              type="email"
              icon={mail}
              value={inputs?.email}
              onChange={handelChange}
            />
            <Input
              name="address"
              padding="sm"
              placehoder="Số nhà tên đường . . ."
              type="text"
              icon={mapPin}
              value={inputs?.address}
              onChange={handelChange}
            />
            <div className="grid gap-2 w-full text-gray-900">
              <div className="w-full z-30">
                <Selector
                  placehoder={"Tỉnh/Thành"}
                  data={cities}
                  field={["name"]}
                  toShow="name_with_type"
                  size={"sm"}
                  output={setCityCode}
                />
              </div>
              <div className="w-full z-20">
                <Selector
                  placehoder={"Quận/Huyện"}
                  data={districts}
                  field={["name_with_type"]}
                  toShow="name_with_type"
                  size={"sm"}
                  output={setDistrictCode}
                />
              </div>
              <div className="w-full z-10">
                <Selector
                  placehoder={"Phường/Xã"}
                  data={wards}
                  field={["name_with_type"]}
                  toShow="name_with_type"
                  size={"sm"}
                  output={setWardCode}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full z-10">
          <Selector
            placehoder={"Chọn mức giá sẽ áp dụng"}
            data={cost}
            field={["costName"]}
            toShow="costName"
            size={"sm"}
            output={setCostName}
          />
        </div>

        <div className="flex justify-end gap-2 w-full">
          <Button
            type="outline-danger"
            size="w-1/2 md:w-1/6"
            padding={"sm"}
            callback={() => navigate("/dashboard/partners")}
          >
            HỦY BỎ
          </Button>
          <Button
            type="primary"
            size="w-1/2 md:w-1/6"
            style="uppercase font-semibold"
            callback={(e) => handleCreate(e)}
            loading={loading}
            disabledBy={loading}
            animation={true}
            clickType="submit"
            padding={"sm"}
          >
            Tạo mới đối tác
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewPartner;
