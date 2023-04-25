import { useState } from "react";

const Ratio = ({ id, size, disabledBy = false, output = () => {} }) => {
  const [checked, setChecked] = useState(false);
  output(checked);
  return (
    <button
      disabled={disabledBy}
      onClick={() => {
        setChecked(!checked);
      }}
      className={`${
        checked ? "bg-green-500" : "bg-slate-500"
      } w-11 h-6 rounded-full flex items-center relative`}
    >
      <div
        className={`w-5 h-5 rounded-full bg-white absolute left-0.5 ${
          checked && "translate-x-5"
        }  duration-300`}
      ></div>
    </button>
  );
};

export default Ratio;
