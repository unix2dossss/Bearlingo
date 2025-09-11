import React from 'react';
import { useNavigate } from 'react-router-dom';
import background from "../../assets/Background.svg";
import bear from "../../assets/Bear.svg";
import cvbutton from "../../assets/CVButton.svg";
import TopNavbar from '../../components/TopNavbar';

const FirstTimePg2 = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/first-time-pg3"); // navigate to FirstTimePg3
  };

  return (
    <div className="relative w-full h-screen bg-[#D0EAFB]">
        <TopNavbar />
      {/* Background image */}
      <img
        src={background}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Bear Mascot */}
      <img
        src={bear}
        alt="Bear Mascot"
        className="absolute right-44 bottom-28 w-40 sm:w-48 md:w-56 lg:w-64"
      />

      {/* White Glowing CV Button */}
      {/* CV Button with hover glow */}
      <div
        className="absolute right-[450px] top-[400px] -translate-y-1/2 cursor-pointer group"
        onClick={handleClick}
      >
        {/* Glow only on hover */}
        <div className="absolute inset-0 -z-10 w-full h-full rounded-full bg-white blur-2xl opacity-0 group-hover:opacity-100 transition duration-300" />

        {/* Button Image */}
        <img
          src={cvbutton}
          alt="Elevator Button"
          className="w-32 h-auto transition transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default FirstTimePg2;
