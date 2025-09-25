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

};

export default SideNavbar;
