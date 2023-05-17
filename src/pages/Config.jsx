import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { storage } from "../ultis/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";
import { loaded, onLoading } from "../redux/systemSlice";
import { add } from "../ultis/svgs";

const Config = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { loading, refresh } = useSelector((state) => state.system);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = currentUser.token;
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [workingtime, setWorkingtime] = useState("");
  const [hotline, setHotline] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState([]);
  const [urls, setUrls] = useState([]);
  const [isLoadedFiles, setIsLoadedFiles] = useState(false);
  const [percs, setPercs] = useState(0);
  const [currentParams, setCurrentParams] = useState({});
  const bg =
    "data:image/jpeg;base64,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";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/system");
        setCurrentParams(res.data);
      } catch (error) {
        toast.error("Không get được thông số hệ thống");
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    setIsLoadedFiles(false);
    const uploadFile = async () => {
      setUrls([]);
      setPercs(0);
      await Promise.all(
        file.map((f, i) => {
          const name = new Date().getTime() + currentUser._id + "_" + f.name;
          const storageRef = ref(storage, `images/homeBgs/${name}`);
          const uploadTask = uploadBytesResumable(storageRef, f);

          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setUrls((prev) => [...prev, downloadURL]);
              });
            }
          );
        })
      );
      setIsLoadedFiles(true);
      setPercs(100);
    };
    file && uploadFile();
  }, [file]);
  const handleClick = async () => {
    dispatch(onLoading());
    await ktsRequest
      .put(
        "/system",
        { ...currentParams, homeBackgroundImages: urls },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        toast.success(response.data);
        dispatch(loaded());
      })
      .catch((err) => {
        toast.error(`Cập nhật thất bại: ${err} `);
        dispatch(loaded());
      });
  };

  return (
    <div className={`p-2 overflow-auto text-sm`}>
      <div>
        <h3>Mức giá mặc định</h3>
      </div>
      <div>
        <h3 className="py-3 font-semibold uppercase">Thay đổi hình nền</h3>
        <div className="flex w-full items-center">
          <div className="max-w-3/4 flex items-center rounded-md border border-dashed border-ktsPrimary p-1.5 overflow-x-auto">
            {/* {file?.length > 0 ? ( */}
            <div className="flex gap-1.5">
              {currentParams.homeBackgroundImages &&
                currentParams.homeBackgroundImages.map((u, i) => {
                  return (
                    <div className="w-36 relative overflow-hidden" key={i}>
                      <div className="w-36 h-24 overflow-hidden flex rounded-md bg-white">
                        <img
                          src={u}
                          alt=""
                          className="object-cover w-full h-auto"
                        />
                      </div>
                      <button
                        className="hover:text-white hover:bg-red-500 p-1 rounded-full absolute top-0 right-0"
                        onClick={() => {
                          setCurrentParams((prev) => {
                            return {
                              ...prev,
                              homeBackgroundImages:
                                prev.homeBackgroundImages.filter(
                                  (e) => e != u
                                ) || {},
                            };
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <div
                        className={`flex justify-between absolute bottom-0 w-[${percs}%] h-4 bg-primary rounded-b-md`}
                      ></div>
                    </div>
                  );
                })}
              {file?.length > 0 &&
                file.map((f, i) => {
                  return (
                    <div className="w-36 relative overflow-hidden" key={i}>
                      <div className="w-36 h-24 overflow-hidden flex rounded bg-white">
                        <img
                          src={URL.createObjectURL(f)}
                          alt=""
                          className="object-cover w-full h-auto"
                        />
                      </div>

                      <button
                        className="hover:text-white hover:bg-red-500 p-1 rounded-full absolute top-0 right-0"
                        onClick={() => {
                          setFile(file.filter((e) => e.name !== f.name));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          className="w-3 h-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {isLoadedFiles && (
                        <div
                          className={`absolute bottom-0 p-0.5 bg-green-500 rounded`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="white"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            <div className="w-36 h-24 flex items-center justify-center">
              <Button
                type={"primary"}
                size="rounded-full"
                icon={add}
                padding={"md"}
                disabledBy={loading}
                animation={true}
                loading={loading}
                callback={() => {
                  document.getElementById("imgInputs").click();
                }}
              ></Button>
            </div>
            <input
              type="file"
              multiple
              id="imgInputs"
              hidden
              onChange={(e) => {
                setFile(Array.from(e.target.files));
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 py-2">
        <Button type="outline-danger" size={"w-1/6"} padding={"sm"}>
          Hủy
        </Button>
        <Button
          type="primary"
          size={"w-1/6"}
          padding={"sm"}
          loading={loading}
          animation={true}
          disabledBy={loading}
          callback={handleClick}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default Config;
