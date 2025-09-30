import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); 

  const menuItems = [
    { id: 1, label: "CV", path: "/CvModule" },
    { id: 2, label: "Interview", path: "/InterviewModule" },
    { id: 3, label: "Networking", path: "/NetworkingModule" },
    { id: 4, label: "Journal", path: "/Journal" },
    { id: 5, label: "Leaderboard", path: "/Leaderboard" },
  ];

  return (
    <div
      className={`bg-[#526E7A] flex flex-col rounded-2xl
        ${isOpen ? "w-64 p-4" : "w-20 items-center p-2"} 
        shadow-[6px_6px_2px_1px_#92A8B5]
        transition-all duration-300 min-h-[40rem] mt-8 ml-10 z-40`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full bg-[#EAEEF0] hover:bg-slate-100 mt-3
          ${isOpen ? "self-end shadow-[5px_0px_2px_1px_#B0BEC5]" : "self-center shadow-[3px_0px_2px_1px_#B0BEC5]"}`}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {/* Nav links */}
      {isOpen && (
        <nav className="flex flex-col gap-4 mt-6">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className="relative flex items-center px-4 py-3 rounded-lg font-bold text-white transition bg-[#78909C] hover:bg-slate-400 shadow-[4px_3px_0px_0px_#EAEEF0]"
              >
                {/* Number badge */}
                <span
                  className={`w-12 h-8 flex items-center rounded-full font-bold relative transition-colors duration-300
                    ${active ? "bg-[#7FDE6C] text-slate-800" : "bg-slate-300 text-slate-700"}`}
                >
                  <span
                    className={`absolute w-10 h-8 flex items-center justify-center rounded-full bg-white text-black text-sm transition-all duration-300
                      ${active ? "translate-x-2" : "translate-x-0"}`}
                  >
                    {item.id}
                  </span>
                </span>

                <span className="ml-4">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default SideNavbar;
