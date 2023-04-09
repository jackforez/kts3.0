import React from "react";

const GridData = ({ headers, children }) => {
  return (
    <div className="w-full rounded overflow-hidden">
      <div className="hidden md:flex w-full bg-green-500 text-white py-3 text-xs uppercase font-semibold">
        {headers &&
          headers.map((h, i) => {
            return (
              <div className={`${h.size}`} key={i}>
                {h.title}
              </div>
            );
          })}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default GridData;
