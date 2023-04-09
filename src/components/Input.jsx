import React from "react";

const Input = ({
  type,
  size,
  placehoder,
  value,
  icon,
  onChange,
  group,
  disabledBy,
}) => {
  return (
    <div
      className={`relative ${size ? size : "w-full"} ${
        group ? "rounded-l-lg" : "rounded"
      }`}
    >
      <input
        value={value}
        placeholder={placehoder}
        type={type}
        onChange={onChange}
        disabled={disabledBy}
        className={`${group ? "rounded-l" : "rounded"} block w-full ${
          !disabledBy
            ? "focus:border-green-500 focus:ring-green-500"
            : " bg-gray-400"
        }
        border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-0 `}
      />
      {icon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-gray-600 absolute top-2.5 right-3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      )}
    </div>
  );
};

export default Input;
