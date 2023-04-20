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
  style,
  animation = false,
  loading = false,
  clickType = "button",
  children,
}) => {
  const bg =
    type === "success"
      ? "bg-green-500 text-white hover:bg-green-700"
      : type === "warning"
      ? "bg-yellow-500 text-white hover:bg-yellow-700"
      : type === "danger"
      ? "bg-red-500 text-white hover:bg-red-700"
      : type === "primary"
      ? "bg-primary-600 text-white hover:bg-primary-700"
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
      className={`${style} ${group ? "rounded-r" : "rounded"} p-2.5 ${
        !disabledBy ? `active:scale-90 ${bg}` : "bg-gray-500"
      } duration-500 ${sz}`}
      disabled={disabledBy}
      title={title}
      onClick={callback}
      type={clickType}
    >
      {animation ? (
        loading ? (
          <svg
            class="h-6 w-6 animate-spin text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <div className="flex items-center justify-center">
            {icon && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${icsz}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
            )}
            {children}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center">
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
          {children}
        </div>
      )}
    </button>
  );
};

export default Button;
