const Input = ({
  name,
  type,
  size,
  placehoder,
  value,
  icon,
  onChange,
  group,
  padding,
  disabledBy,
  textCenter = false,
}) => {
  return (
    <div
      className={`relative ${size ? size : "w-full"} ${
        group ? "rounded-l-lg" : "rounded"
      }`}
    >
      <input
        name={name}
        value={value || ""}
        placeholder={placehoder}
        type={type}
        onChange={onChange}
        disabled={disabledBy}
        className={`${group ? "rounded-l" : "rounded"} block w-full ${
          textCenter && "text-center"
        } ${
          !disabledBy
            ? "focus:border-primary-500 focus:ring-primary-500"
            : " bg-slate-200"
        }
        border border-gray-300 bg-gray-50 ${
          padding === "xs" ? "p-1" : padding === "sm" ? "p-2" : "p-3"
        } text-sm text-gray-900 outline-0 `}
      />
      {icon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 text-gray-600 absolute ${
            padding === "xs" ? "top-2" : padding === "sm" ? "top-3" : "top-4"
          } right-3`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      )}
    </div>
  );
};

export default Input;
