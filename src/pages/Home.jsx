import React from "react";
import { Button, Input, Selector } from "../components";

const Home = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full">
        <Selector placehoder={"Nhập tỉnh thành"} />
      </div>
    </div>
  );
};

export default Home;
