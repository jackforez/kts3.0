import React, { useEffect, useState } from "react";
import Input from "./Input";
import { useSelector } from "react-redux";
import Loading from "./Loading";
const DataTable = ({ headers, children, config, len = 5 }) => {
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [activePage, setActivePage] = useState(1);
  const { loading } = useSelector((state) => state.system);
  const [dataLen, setDataLen] = useState(len);
  const [prePage, setPrePage] = useState(0);
  const [nextPage, setNextPage] = useState(6);

  useEffect(() => {
    setDataLen(len);
    setActivePage(1);
    setPrePage(0);
    setNextPage(6);
    config((prev) => {
      return { ...prev, rpp: rowsPerPage };
    });
  }, [len]);
  return (
    <div className="flex flex-col flex-1 rounded-md justify-between gap-2 text-xs">
      <div className="flex flex-1 flex-col rounded-md overflow-hidden border border-ktsPrimary">
        <div class="uppercase text-white bg-ktsPrimary py-2 px-6 flex">
          {headers &&
            headers.map((h, i) => {
              return (
                <div scope="col" class={h.size || "px-2 py-3"} key={i}>
                  {h.title}
                </div>
              );
            })}
        </div>
        <div className="flex flex-1 flex-col overflow-auto rounded-md">
          {loading ? (
            <Loading />
          ) : len > 0 ? (
            <div className="max-h-[40em] md:h-0 divide-y divide-red-400">
              {children}
            </div>
          ) : (
            <div className="flex-1 flex justify-center items-center">
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>
      <div className="p-2 flex justify-between items-center bg-white rounded-md border border-gray-300">
        <Input
          type={"number"}
          size={"w-12"}
          padding={"xs"}
          value={rowsPerPage}
          textCenter
          onChange={(e) => {
            setRowsPerPage(e.target.value);

            config((prev) => {
              return { ...prev, rpp: e.target.value };
            });
          }}
        />

        <div>
          {prePage > 0 && (
            <button
              className="px-2 hover:text-primary hover:underline hover:underline-offset-4"
              onClick={() => {
                setPrePage(prePage > 0 ? prePage - 1 : 0);
                setNextPage(nextPage > 5 ? nextPage - 1 : 6);
                config((prev) => {
                  return {
                    ...prev,
                    crp: prePage > 0 ? prePage - 1 : 0,
                  };
                });
              }}
            >
              Trước
            </button>
          )}
          {Array.from({ length: dataLen < 5 ? dataLen : 5 }, (x, i) => i).map(
            (i, index) => {
              return (
                <button
                  className={`px-2 hover:text-primary hover:underline hover:underline-offset-4 ${
                    activePage == i + prePage + 1
                      ? "text-ktPrimary underline underline-offset-4"
                      : ""
                  }`}
                  onClick={() => {
                    setActivePage(i + prePage + 1);
                    config((prev) => {
                      return { ...prev, actp: i + prePage + 1 };
                    });
                  }}
                  key={index}
                >
                  {i + prePage + 1}
                </button>
              );
            }
          )}
          {nextPage < dataLen + 1 && (
            <button
              className="px-2 hover:text-primary hover:underline hover:underline-offset-4"
              onClick={() => {
                setNextPage(
                  nextPage < dataLen + 1 ? nextPage + 1 : dataLen + 1
                );
                setPrePage(prePage + 1);
                config((prev) => {
                  return { ...prev, crp: nextPage + 7 };
                });
              }}
            >
              Sau
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
