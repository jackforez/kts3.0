import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import logo from "../assets/logo.svg";
import Barcode from "react-barcode";
import { toVND } from "../ultis/functions";

const ToPrint = (props) => {
  const printData = JSON.parse(props.data);
  let componentRef = useRef();
  return (
    <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className=" block  w-full rounded border border-red-300 bg-gray-300 shadow-lg md:w-1/2">
        <h3 className="p-3 font-bold uppercase"> In vận đơn</h3>
        <div ref={(el) => (componentRef = el)} className="bg-white">
          {/* header */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-red-300 p-3">
            <img src={logo} alt="" className="h-10" />
            <div className="flex w-1/2 flex-col justify-start">
              <Barcode
                value={printData.partnerTrackingId}
                width={2}
                fontSize={20}
                height={40}
                renderAs="svg"
              />
              <div>
                <span> ID đơn hàng: </span>
                <span className="font-bold"> {printData.orderNumber}</span>
              </div>
            </div>
          </div>
          {/* content */}
          <div className="grid grid-cols-2 border-b-2 border-dashed border-red-300 px-6 py-3">
            <div>
              <span className="block font-bold uppercase">
                từ: {printData.fromName}
              </span>
              <span className="block">{printData.fromPhone}</span>
              <span className="block">{printData.fromAddress}</span>
            </div>
            <div>
              <span className="block font-bold uppercase">
                đến: {printData.toName}
              </span>
              <span className="block">{printData.toPhone}</span>
              <span className="block">{printData.toAddress}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b-2 border-dashed border-red-300 px-6 py-3">
            <div>
              <span>Thu hộ: </span>
              <span>{toVND(printData.cod)}</span>
              <br />
              <span>Cước: </span>
              <span>{toVND(printData.ktsAmount)}</span>
              <br />
              <span>Tổng thu: </span>
              <span className="text-xl font-bold">
                {toVND(printData.ktsAmount + printData.cod)}
              </span>
            </div>
            <div>
              <span> Nội dung hàng hóa: </span>
              <span>{printData.itemName}</span>
              <span> (SL: {printData.itemQauntity})</span>
              <br />
              <span>Trọng lượng: {printData.weight} (gram)</span>
              <br />
              <span>Ghi chú: </span>
              <span className="font-bold">{printData.note}</span>
            </div>
          </div>
          {/* footer */}
          <div className="grid grid-cols-2 border-b-2 border-dashed border-red-300 bg-white p-3">
            <div>
              <h6>- Chuyển hàng sau 3 lần phát</h6>
              <h6>- Lưu kho 5 ngày</h6>
            </div>
            <div className="border border-black px-2 pb-24 text-center">
              <h4 className="font-bold uppercase">Người nhận</h4>
              <h4>(Ký, ghi rõ họ tên) </h4>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-2">
          <button
            onClick={(e) => {
              props.setClose(false);
            }}
            className="bg-white py-2 px-4"
          >
            đóng
          </button>
          <ReactToPrint
            trigger={() => {
              return <button className="bg-white px-4 py-2">in cái này</button>;
            }}
            content={() => componentRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ToPrint;
