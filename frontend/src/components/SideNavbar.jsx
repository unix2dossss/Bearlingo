import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 1, label: "CV", path: "/CvModule" },
    { id: 2, label: "Networking", path: "/NetworkingModule" },
    { id: 3, label: "Interview", path: "/InterviewModule" },
    { id: 4, label: "Journal", path: "/Journal" },
    { id: 5, label: "Leaderboard", path: "/Leaderboard" },
  ];

  return (
    <div
      className={`fixed left-4 top-28 bottom-8 bg-[#526E7A] flex flex-col rounded-2xl
      ${isOpen ? "w-64 p-4" : "w-20 items-center p-2"} 
      shadow-[6px_6px_2px_1px_#92A8B5]
      transition-all duration-300`}
    >

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full bg-[#EAEEF0] hover:bg-slate-100 mt-3 
        ${isOpen ? "self-end shadow-[5px_0px_2px_1px_#B0BEC5]" : "self-center shadow-[3px_0px_2px_1px_#B0BEC5]"}`}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {isOpen && (
        <nav className="flex flex-col gap-4 mt-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center px-4 py-3 rounded-lg font-bold text-white transition
                ${
                  isActive
                    ? "bg-slate-700 border border-white"
                    : "bg-[#78909C] hover:bg-slate-400 shadow-[4px_3px_0px_0px_#EAEEF0]"
                }`
              }
            >

              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  window.location.pathname === item.path
                    ? "bg-green-400 text-slate-800"
                    : "bg-slate-300 text-slate-700"
                }`}
              >
                {item.id}
              </span>

              <span className="ml-4">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );

};

export default SideNavbar;
