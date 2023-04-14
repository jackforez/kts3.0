import React from "react";

const Button = ({
  type,
  title,
  size,
  disabledBy,
  icon,
  iconSize,
  callback,
  group,
  children,
}) => {
  const bg =
    type === "success"
      ? "bg-green-500 text-white"
      : type === "warning"
      ? "bg-yellow-500 text-white"
      : type === "danger"
      ? "bg-red-500 text-white"
      : type === "primary"
      ? "bg-primary-500 text-white"
      : type === "outline-primary"
      ? "bg-white border border-primary-500 text-primary-500 hover:text-white hover:bg-primary-500"
      : type === "outline-success"
      ? "bg-white border border-green-500 text-green-500 hover:text-white hover:bg-green-500"
      : type === "outline-warning"
      ? "bg-white border border-yellow-500 text-yellow-500 hover:text-white hover:bg-yellow-500"
      : type === "outline-danger"
      ? "bg-white border border-red-500 text-red-500 hover:text-white hover:bg-red-500"
      : "bg-white";
  const icsz = iconSize ? `w-${iconSize} h-${iconSize}` : "w-5 h-5";
  const sz = size ? `${size}` : "";
  return (
    <button
      className={`${group ? "rounded-r" : "rounded"} px-4 py-2 ${
        !disabledBy ? `active:scale-90 ${bg}` : "bg-gray-500"
      } duration-500 flex items-center justify-center ${sz}`}
      disabled={disabledBy}
      title={title}
      onClick={callback}
    >
      {icon && (
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
      )}
      <span className="pb-0.5">{children}</span>
    </button>
  );
};

export default Button;
