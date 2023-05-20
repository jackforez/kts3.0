import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import logo from "../assets/logo.svg";
import Barcode from "react-barcode";
import { toVND } from "../ultis/functions";

const ToPrint = (props) => {
  const printData = JSON.parse(props.data);
  console.log(printData);
  let componentRef = useRef();
  return (
    <div className="absolute top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className=" block  w-full rounded border border-red-300 bg-gray-300 shadow-lg md:w-2/3 xl:w-1/2">
        <h3 className="p-3 font-semibold uppercase"> In vận đơn</h3>
        <div ref={(el) => (componentRef = el)} className="bg-white">
          {/* header */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-red-300 p-3">
            <div className="flex justify-center flex-col items-center gap-1">
              <img src={logo} alt="" className="h-10" />
              <a
                href="https://ktscorp.vn"
                className="italic underline underline-offset-4"
              >
                ktscorp.vn
              </a>
            </div>
            <div className="flex w-2/3 flex-col justify-start">
              <Barcode
                value={printData.partnerTrackingId}
                width={2}
                fontSize={20}
                height={40}
                renderAs="svg"
                displayValue={false}
              />
              <div className="pl-2">
                <span>ID đơn hàng: </span>
                <span className="font-semibold"> {printData.orderNumber}</span>
              </div>
            </div>
          </div>
          {/* content */}
          <div className="grid grid-cols-2 border-b-2 border-dashed border-red-300 px-6 py-3">
            <div>
              <span className="block font-semibold uppercase">
                từ: {printData.fromName}
              </span>
              <span className="block">{printData.fromPhone}</span>
              <span className="block">
                {printData.fromAddress +
                  ", " +
                  printData.fromWard +
                  ", " +
                  printData.fromDistrict +
                  ", " +
                  printData.fromCity}
              </span>
            </div>
            <div>
              <span className="block font-semibold uppercase">
                đến: {printData.toName}
              </span>
              <span className="block">{printData.toPhone}</span>
              <span className="block">
                {printData.toAddress +
                  ", " +
                  printData.toWard +
                  ", " +
                  printData.toDistrict +
                  ", " +
                  printData.toCity}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b-2 border-dashed border-red-300 px-6 py-3">
            <div>
              <span>Thu hộ: </span>
              <span className="text-xl font-semibold">
                {toVND(printData.shopAmount)}
              </span>
            </div>
            <div>
              <span> Nội dung hàng hóa: </span>
              <span>{printData.itemName}</span>
              <span> (SL: {printData.itemQauntity})</span>
              <br />
              <span>Trọng lượng: {printData.weight} (gram)</span>
            </div>
          </div>
          {/* footer */}
          <div className="grid grid-cols-2 border-b-2 border-dashed border-red-300 bg-white p-3">
            <div>
              <span>Ghi chú: </span>{" "}
              <span className="font-semibold">{printData.note}</span>
            </div>
            <div className="border border-dashed border-black/50 px-2 pb-24 text-center">
              <h4 className="font-semibold uppercase">Người nhận</h4>
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
