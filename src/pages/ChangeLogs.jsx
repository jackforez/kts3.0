import React from "react";
import { ktsChangeLogs } from "../ultis/config";
const ChangeLogs = () => {
  return (
    <div className="p-3 space-y-2">
      {ktsChangeLogs.map((i, index) => {
        return (
          <div className="bg-white p-2 rounded" key={index}>
            <span className="block font-semibold">{`${i.v} [${i.date}]`}</span>
            <div className="pl-10">
              {i.detail.map((j, index) => {
                return <span className="block">{`- ${j}`}</span>;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChangeLogs;
