import React from "react";
import { useNavigate } from "react-router-dom";
import Titlebar from "../../Shared/Titlebar";

const buttonList = [
  { title: "Bumper Install", id: "bumper-install" },
  { title: "IP Install", id: "ip-install" },
  { title: "TL Install", id: "tl-install" },
  { title: "Seat Install", id: "seat-install" },
];

const AssemblyPage = () => {
  const navigte = useNavigate();
  return (
    <>
      <Titlebar title={"Assembly"} showBackButton={false} />
      <div className="flex flex-col w-full gap-5">
        <div className="flex flex-wrap flex-shrink-0 gap-10 items-center">
          {buttonList.map(({ title, id }, index) => {
            return (
              <button
                className="w-[13rem] h-[6rem] ease-in-out transition-all hover:translate-y-[-2px] hover:bg-[#F2D8D8] rounded-lg bg-gray-200 mt-3"
                onClick={() => {
                  navigte(`table/${id}`);
                }}
                key={index}
              >
                {title}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AssemblyPage;
