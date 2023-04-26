const Ratio = ({ id, size, checked, disabledBy = false, output }) => {
  return (
    <button
      disabled={disabledBy}
      onClick={() => {
        output(!checked);
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
