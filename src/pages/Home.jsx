import { useState } from "react";
import { Footer, Hero, Navbar } from "../components";

const Home = () => {
  const [output, setOutput] = useState("");
  const [openResult, setOpenResult] = useState(false);
  return (
    <div className="bg-hero h-screen bg-cover bg-fixed bg-center bg-no-repeat overflow-hidden">
      <Navbar />
      {/* <div className="bg-white flex max-w-screen-lg text-white relative bg-opacity-20 mx-auto backdrop-blur rounded drop-shadow-lg">
        
      </div> */}
      <div className="max-w-screen-xl mx-auto">
        <div
          className={`bg-white flex text-white backdrop-blur rounded overflow-hidden drop-shadow-lg bg-opacity-20 relative ${
            openResult ? "w-full" : "w-1/2"
          } duration-500`}
        >
          <div className="w-1/2 z-20 opacity-40">
            <button onClick={() => setOpenResult(!openResult)}> open </button>
          </div>
          <div
            className={`w-1/2 duration-300 left-0 absolute ${
              !openResult ? "opacity-0" : "translate-x-full"
            } bg-white `}
          >
            kết quả
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
