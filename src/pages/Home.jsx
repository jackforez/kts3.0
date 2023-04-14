import { useState } from "react";
import { Footer, Hero, Navbar } from "../components";

const Home = () => {
  const [output, setOutput] = useState("");
  return (
    <div className="w-full">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;
