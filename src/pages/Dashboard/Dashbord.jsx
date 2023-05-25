import React from "react";
import Illustration from "./illustration.svg";
import Titlebar from "../../Shared/Titlebar";

const Dashbord = () => {
  return (
    <div className="flex flex-col">
      <Titlebar showBackButton={false} title="Dashboard" />
      <div className="mt-5 flex items-end justify-end  bg-[#6B59CC] h-[30vh] rounded-lg w-full">
        <img src={Illustration} alt="" />
      </div>
    </div>
  );
};

export default Dashbord;
