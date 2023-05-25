import { useState } from "react";
import Avatar from "./assets/avatar.svg";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import {
  HiOutlineBell,
  HiOutlineHome,
  HiOutlinePencil,
  HiOutlineChartPie,
  HiOutlineSearch,
  HiAnnotation,
  HiSearch,
} from "react-icons/hi";
import "./App.css";
import { twMerge } from "tailwind-merge";
import AssemblyPage from "./pages/Assembly/Assembly";
import DynamicTablePage from "./pages/Assembly/DynamicTablePage/DynamicTablePage";
import Dashbord from "./pages/Dashboard/Dashbord";
import Titlebar from "./Shared/Titlebar";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex p-5 gap-[4rem]">
          <div className="flex-[0.2] flex-col gap-1">
            <div className="flex items-center gap-2">
              <img src={Avatar} alt="" />
              <div className="flex items-start flex-col">
                <h2 className="text-lg font-semibold">Duck UI</h2>
                <p className="text-sm text-gray-500">duckui@demo.com</p>
              </div>
            </div>
            <div className="flex p-2 items-center rounded-lg bg-gray-200 mt-3">
              <HiOutlineSearch size={20} />
              <input
                type="text"
                className="p-2 bg-transparent outline-none"
                placeholder="Search"
              />
            </div>
            <div className="flex flex-col gap-5 mt-10">
              <NavLink
                to={"/"}
                end
                className={({ isActive }) =>
                  twMerge(
                    "flex items-center gap-2 py-4 px-3 rounded-lg",
                    isActive ? "bg-[#A0C6F2]" : "bg-transparent"
                  )
                }
              >
                <HiOutlineHome size={20} />
                <p>Body</p>
              </NavLink>
              <NavLink
                to={"/paint"}
                end
                className={({ isActive }) =>
                  twMerge(
                    "flex items-center gap-2 py-4 px-3 rounded-lg",
                    isActive ? "bg-[#A0C6F2]" : "bg-transparent"
                  )
                }
              >
                <HiOutlinePencil size={20} />
                <p>Paint</p>
              </NavLink>
              <NavLink
                to={"/assembly"}
                className={({ isActive }) =>
                  twMerge(
                    "flex items-center gap-2 py-4 px-3 rounded-lg",
                    isActive ? "bg-[#A0C6F2]" : "bg-transparent"
                  )
                }
              >
                <HiOutlineBell size={20} />
                <p>Assembly</p>
              </NavLink>
              <NavLink
                to={"/battery"}
                end
                className={({ isActive }) =>
                  twMerge(
                    "flex items-center gap-2 py-4 px-3 rounded-lg",
                    isActive ? "bg-[#A0C6F2]" : "bg-transparent"
                  )
                }
              >
                <HiOutlineChartPie size={20} />
                <p>Battery</p>
              </NavLink>
              <NavLink
                to={"/stamping"}
                end
                className={({ isActive }) =>
                  twMerge(
                    "flex items-center gap-2 py-4 px-3 rounded-lg",
                    isActive ? "bg-[#A0C6F2]" : "bg-transparent"
                  )
                }
              >
                <HiAnnotation size={20} />
                <p>Stamping</p>
              </NavLink>
            </div>
          </div>
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Dashbord />} />
              <Route
                path="/paint"
                element={
                  <div className="flex flex-col">
                    <Titlebar showBackButton={false} title="Paint" />
                  </div>
                }
              />
              <Route
                path="/battery"
                element={
                  <div className="flex flex-col">
                    <Titlebar showBackButton={false} title="Paint" />
                  </div>
                }
              />
              <Route path="/assembly" element={<AssemblyPage />} />
              <Route
                path="/assembly/table/:id"
                element={<DynamicTablePage />}
              />
              <Route
                path="/stamping"
                element={
                  <div className="flex flex-col">
                    <Titlebar showBackButton={false} title="Stamping" />
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
