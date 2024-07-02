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
    // <div className="flex flex-col flex-1 rounded-md overflow-hidden justify-between">
    //   <div className=" rounded-md border h-full border-gray-300 overflow-auto">
    //     <div class="relative overflow-auto">
    //       <div class="w-full text-sm text-left text-gray-800 table-fixed">
    //         <div class="text-xs uppercase text-white bg-ktsPrimary py-2 flex">
    //           {headers &&
    //             headers.map((h, i) => {
    //               return (
    //                 <div scope="col" class={h.size || "px-2 py-3"} key={i}>
    //                   {h.title}
    //                 </div>
    //               );
    //             })}
    //         </div>
    //         <div className="divide-y divide-primary divide-dashed overflow-auto flex-1 text-xs">
    //           {loading ? (
    //             <Loading />
    //           ) : (
    //             <div>{len > 0 ? children : <div>Không có dữ liệu</div>}</div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="py-2 flex justify-between items-center">
    //     <Input
    //       type={"number"}
    //       size={"w-12"}
    //       padding={"xs"}
    //       value={rowsPerPage}
    //       textCenter
    //       onChange={(e) => {
    //         setRowsPerPage(e.target.value);

    //         config((prev) => {
    //           return { ...prev, rpp: e.target.value };
    //         });
    //       }}
    //     />

    //     <div className="p-2">
    //       {prePage > 0 && (
    //         <button
    //           className="px-2 hover:text-primary hover:underline hover:underline-offset-4"
    //           onClick={() => {
    //             setPrePage(prePage > 0 ? prePage - 1 : 0);
    //             setNextPage(nextPage > 5 ? nextPage - 1 : 6);
    //             config((prev) => {
    //               return {
    //                 ...prev,
    //                 crp: prePage > 0 ? prePage - 1 : 0,
    //               };
    //             });
    //           }}
    //         >
    //           Trước
    //         </button>
    //       )}
    //       {Array.from({ length: dataLen < 5 ? dataLen : 5 }, (x, i) => i).map(
    //         (i, index) => {
    //           return (
    //             <button
    //               className={`px-2 hover:text-primary hover:underline hover:underline-offset-4 ${
    //                 activePage == i + prePage + 1
    //                   ? "text-green-500 underline underline-offset-4"
    //                   : ""
    //               }`}
    //               onClick={() => {
    //                 setActivePage(i + prePage + 1);
    //                 config((prev) => {
    //                   return { ...prev, actp: i + prePage + 1 };
    //                 });
    //               }}
    //               key={index}
    //             >
    //               {i + prePage + 1}
    //             </button>
    //           );
    //         }
    //       )}
    //       {nextPage < dataLen + 1 && (
    //         <button
    //           className="px-2 hover:text-primary hover:underline hover:underline-offset-4"
    //           onClick={() => {
    //             setNextPage(
    //               nextPage < dataLen + 1 ? nextPage + 1 : dataLen + 1
    //             );
    //             setPrePage(prePage + 1);
    //             config((prev) => {
    //               return { ...prev, crp: nextPage + 7 };
    //             });
    //           }}
    //         >
    //           Sau
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-1 flex-col  space-y-2">
      <div className="flex flex-1 flex-col bg-white rounded-md border border-ktsPrimary">
        <div className="bg-ktsPrimary text-[11px] font-medium text-white flex p-2 uppercase">
          {headers &&
            headers.map((h, i) => {
              return (
                <div scope="col" class={h.size || "px-2 py-3"} key={i}>
                  {h.title}
                </div>
              );
            })}
        </div>
        <div className="flex-1">body</div>
      </div>
      <div>button</div>
    </div>
  );
};

export default DataTable;
