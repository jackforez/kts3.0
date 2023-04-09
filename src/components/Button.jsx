import React from "react";

const Button = ({
  type,
  title,
  size,
  disabledBy,
  icon,
  iconSize,
  callback,
  children,
}) => {
  const bg =
    type === "success"
      ? "bg-green-500"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-white";
  const icsz = iconSize ? `w-${iconSize} h-${iconSize}` : "w-5 h-5";
  return (
    <button
      className={`rounded px-4 py-2 ${
        !disabledBy ? `active:scale-90 ${bg}` : "bg-gray-500"
      } duration-500 text-white flex items-center justify-center ${
        size ? `w-${size}` : ""
      }`}
      disabled={disabledBy}
      title={title}
      onClick={callback}
    >
      {icon && (
        <i className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={icsz}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </i>
      )}
      <span className="pb-0.5 pl-1">{children}</span>
    </button>
  );
};

export default Button;
