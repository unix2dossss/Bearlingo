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
      className={`fixed left-4 top-8 bottom-8 bg-slate-600 shadow-2xl flex flex-col rounded-2xl 
      ${isOpen ? "w-64 p-4" : "w-16 items-center p-2"} 
      transition-all duration-300`}
    >

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-slate-500 hover:bg-slate-400 mb-6 self-end"
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-lg font-bold text-white transition
              ${
                isActive
                  ? "bg-slate-700 border border-white"
                  : "bg-slate-500 hover:bg-slate-400"
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

            {isOpen && <span className="ml-4">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );

};

export default SideNavbar;
