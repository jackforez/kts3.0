import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-300">
      <img src={logo} alt="" />
      <h3 className="p-4 text-3xl font-bold">Nothing here !!!</h3>
      <div className="mt-5 flex w-1/4 justify-between">
        <button
          className="font-bold"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          Back{" "}
        </button>
        <button
          className="font-bold"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Home{" "}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
