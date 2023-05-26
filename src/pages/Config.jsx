import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ktsRequest } from "../ultis/connections";
import { storage } from "../ultis/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Button, Input } from "../components";
import { useNavigate } from "react-router-dom";
import { loaded, onLoading, onRefreh } from "../redux/systemSlice";
import { add, copy } from "../ultis/svgs";
const Config = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { loading, refresh } = useSelector((state) => state.system);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = currentUser.token;
  const [file, setFile] = useState([]);
  const [urls, setUrls] = useState([]);
  const [dlFile, setDlFile] = useState();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isLoadedFiles, setIsLoadedFiles] = useState(false);
  const [percs, setPercs] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [currentParams, setCurrentParams] = useState({});
  const [currentBgs, setCurrentBgs] = useState([]);
  const [currentQR, setCurrentQR] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ktsRequest.get("/system");
        setCurrentParams(res.data);
        setCurrentBgs(res.data.homeBackgroundImages);
        setCurrentQR(res.data.qr);
        setQrUrl(res.data.link);
      } catch (error) {
        toast.error("Không get được thông số hệ thống");
      }
    };
    fetchData();
  }, [refresh]);

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
      // setPercs(100);
    };
    file && uploadFile();
  }, [file]);
  useEffect(() => {
    setIsLoadedFiles(false);
    const uploadFile = async () => {
      dispatch(onLoading());
      const name = new Date().getTime() + currentUser._id + "_" + dlFile.name;
      const storageRef = ref(storage, `images/qr/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, dlFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDownloadUrl(downloadURL);
          });
        }
      );
      setIsLoadedFiles(true);
      dispatch(loaded());
    };
    dlFile && uploadFile();
  }, [dlFile]);
  const handleDeleteFireBase = (url = "") => {
    const imgRef = ref(storage, url);
    // Delete the file
    deleteObject(imgRef)
      .then(() => {
        toast.success("Done!");
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  const handleClick = async () => {
    dispatch(onLoading());
    await ktsRequest
      .put(
        "/system",
        {
          ...currentParams,
          homeBackgroundImages: [...currentBgs, ...urls],
          link: qrUrl,
          qr: downloadUrl,
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
        dispatch(loaded());
        setFile([]);
      })
      .catch((err) => {
        toast.error(`Cập nhật thất bại: ${err} `);
        dispatch(loaded());
      });
    dispatch(onRefreh());
  };
  return (
    <div className={`p-2 overflow-auto text-sm`}>
      <div>
        <h3 className="font-semibold uppercase">Mức giá mặc định</h3>
      </div>
      <div>
        <div className="flex justify-between">
          <h3 className="font-semibold uppercase">Thay đổi hình nền</h3>
          <Button
            type="primary"
            padding={"sm"}
            loading={loading}
            animation={true}
            disabledBy={loading}
            callback={handleClick}
          >
            Cập nhật
          </Button>
        </div>
        <div className="flex w-full items-center">
          <div className="max-w-3/4 flex items-center rounded-md border border-dashed border-ktsPrimary p-1.5 overflow-x-auto">
            {/* {file?.length > 0 ? ( */}
            <div className="flex gap-1.5">
              {currentBgs &&
                currentBgs.map((u, i) => {
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
                          handleDeleteFireBase(u);
                          setCurrentBgs(currentBgs.filter((e) => e !== u));
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
              {urls?.length > 0 &&
                urls.map((f, i) => {
                  return (
                    <div className="w-36 relative overflow-hidden" key={i}>
                      <div className="w-36 h-24 overflow-hidden flex rounded bg-white">
                        <img
                          src={f}
                          alt=""
                          className="object-cover w-full h-auto"
                        />
                      </div>

                      <button
                        className="hover:text-white hover:bg-red-500 p-1 rounded-full absolute top-0 right-0"
                        onClick={() => {
                          handleDeleteFireBase(f);
                          setUrls(urls.filter((e) => e !== f));
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
      <div>
        <div className="flex justify-between mt-4">
          <h3 className="font-semibold uppercase ">Link download</h3>
          <Button
            type="primary"
            padding={"sm"}
            loading={loading}
            animation={true}
            disabledBy={loading}
            callback={handleClick}
          >
            Cập nhật
          </Button>
        </div>
        <div className="flex w-full items-center">
          <div className="max-w-full flex items-center rounded-md border border-dashed border-ktsPrimary p-1.5 overflow-x-auto">
            {/* {file?.length > 0 ? ( */}
            <div className="flex gap-1.5">
              <div className="w-24 relative overflow-hidden">
                {downloadUrl || currentParams.qr ? (
                  <div className="min-w-1/4 w-24 relative overflow-hidden">
                    <div className="w-24 h-24 overflow-hidden flex rounded bg-white">
                      <img
                        src={downloadUrl || currentParams.qr}
                        alt=""
                        className="object-cover w-full h-auto"
                      />
                    </div>

                    <button
                      className="hover:text-white hover:bg-red-500 p-1 rounded-full absolute top-0 right-0"
                      onClick={() => {
                        handleDeleteFireBase(downloadUrl);
                        setDlFile(null);
                        setDownloadUrl("");
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

                    {isLoadedFiles && dlFile && (
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
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center">
                    <Button
                      type={"primary"}
                      size="rounded-full"
                      icon={add}
                      padding={"md"}
                      disabledBy={loading}
                      animation={true}
                      loading={loading}
                      callback={() => {
                        document.getElementById("downloadInput").click();
                      }}
                    ></Button>
                  </div>
                )}
              </div>
            </div>

            <input
              type="file"
              multiple
              id="downloadInput"
              hidden
              onChange={(e) => {
                setDlFile(e.target.files[0]);
              }}
            />
          </div>

          <div className="pl-2 space-y-2 flex-1">
            <div className="gap-2 flex">
              {/* <Input
                placehoder="Tên đăng nhập . . ."
                type="text"
                icon={userName}
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                }
              /> */}
              <Input
                type="text"
                disabledBy={!editLink}
                padding={"sm"}
                value={qrUrl}
                placeholder={"a123"}
                onChange={(e) => setQrUrl(e.target.value)}
              />
              {editLink ? (
                <Button
                  type={"primary"}
                  padding={"sm"}
                  callback={() => setEditLink(false)}
                >
                  lưu
                </Button>
              ) : (
                <Button
                  type={"primary"}
                  padding={"sm"}
                  callback={() => setEditLink(true)}
                >
                  edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className=" mt-4 space-y-2">
        <h3 className="font-semibold uppercase py-3">Reset token đối tác</h3>
        <div className="flex justify-between gap-2">
          <div className="w-1/6 rounded border border-gray-400 flex justify-center items-center">
            <span>VNPost</span>
          </div>
          <div className="w-4/6 relative">
            <Input size={"w-full"} padding={"sm"} placeholder={123} />
            <Button
              icon={copy}
              size={"absolute top-1 right-2"}
              padding={"xs"}
            ></Button>
          </div>
          <Button
            type="primary"
            padding={"sm"}
            size={"w-1/6"}
            loading={loading}
            animation={true}
            disabledBy={loading}
          >
            Cập nhật
          </Button>
        </div>
        <div className="flex justify-between gap-2">
          <div className="w-1/6 rounded border border-gray-400 flex justify-center items-center">
            <span>VTPost</span>
          </div>
          <div className="w-4/6 relative">
            <Input size={"w-full"} padding={"sm"} />
            <Button
              icon={copy}
              size={"absolute top-1 right-2"}
              padding={"xs"}
            ></Button>
          </div>
          <Button
            type="primary"
            padding={"sm"}
            size={"w-1/6"}
            loading={loading}
            animation={true}
            disabledBy={loading}
          >
            Cập nhật
          </Button>
        </div>
        <div className="flex justify-between gap-2">
          <div className="w-1/6 rounded border border-gray-400 flex justify-center items-center">
            <span>JNT</span>
          </div>
          <div className="w-4/6 relative">
            <Input size={"w-full"} padding={"sm"} />
            <Button
              icon={copy}
              size={"absolute top-1 right-2"}
              padding={"xs"}
            ></Button>
          </div>
          <Button
            type="primary"
            padding={"sm"}
            size={"w-1/6"}
            loading={loading}
            animation={true}
            disabledBy={loading}
          >
            Cập nhật
          </Button>
        </div>
        <div className="flex justify-between gap-2">
          <div className="w-1/6 rounded border border-gray-400 flex justify-center items-center">
            <span>Snapy</span>
          </div>
          <div className="w-4/6 relative">
            <Input size={"w-full"} padding={"sm"} />
            <Button
              icon={copy}
              size={"absolute top-1 right-2"}
              padding={"xs"}
            ></Button>
          </div>
          <Button
            type="primary"
            padding={"sm"}
            size={"w-1/6"}
            loading={loading}
            animation={true}
            disabledBy={loading}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Config;
