import React from 'react';
import { useNavigate } from 'react-router-dom';
import background from "../../assets/Background.svg";
import bear from "../../assets/Bear.svg";
import cvbutton from "../../assets/CVButton.svg";

const FirstTimePg2 = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/first-time-pg3"); // navigate to FirstTimePg3
  };

  return (
    <div className="relative w-full h-screen bg-[#D0EAFB]">
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
      <div
        className="absolute right-[450px] top-[400px] -translate-y-1/2 cursor-pointer"
        onClick={handleClick}
      >
        {/* Glow */}
        <div className="absolute inset-0 -z-10 w-full h-full rounded-full bg-yellow-100  blur-xl pointer-events-none" />
            {/* Button Image */}
            <img
            src={cvbutton}
            alt="Elevator Button"
            className="w-32 h-auto transition transform duration-300 ease-in-out hover:scale-105"
            />
      </div>
    </div>
  );
};

export default FirstTimePg2;
