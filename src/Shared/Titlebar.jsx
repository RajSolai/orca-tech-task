/* eslint-disable react/prop-types */
import Avatar from "../assets/avatar.svg";
import { HiChevronLeft, HiOutlineSearch } from "react-icons/hi";

const Titlebar = ({ showBackButton = true, title }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button
            onClick={() => {
              window.history.back();
            }}
            className="flex items-center gap-2 py-2 px-2 rounded-lg border border-black"
          >
            <HiChevronLeft size={20} />
          </button>
        )}
        <h1 className="font-semibold text-xl">{title}</h1>
      </div>
      <div className="flex items-center">
        <button className="flex items-center gap-2 py-2 px-2 rounded-lg border border-black">
          <HiOutlineSearch size={20} />
        </button>
        <button className="flex items-center gap-2 py-2 px-3 rounded-lg">
          <img src={Avatar} alt="" className="h-10 w-10" />
        </button>
      </div>
    </div>
  );
};

export default Titlebar;
