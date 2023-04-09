import React from "react";
import { Button, Input } from "../components";

const Home = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex w-1/2">
        <Input placehoder="Nhập mã vận đơn" group={true} />
        <Button type="success" group={true}>
          abc
        </Button>
      </div>
    </div>
  );
};

export default Home;
