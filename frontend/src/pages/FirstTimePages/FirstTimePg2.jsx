import React from 'react';
import { useNavigate } from 'react-router-dom';
import background from "../../assets/Background1.svg";
import bear from "../../assets/Bear.svg";
import cvbutton from "../../assets/CVButton.svg";
import TopNavbar from '../../components/TopNavbar';
import StartButton from "../../assets/StartingButton.svg";

const FirstTimePg2 = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/First Level"); // navigate to FirstTimePg3
  };

  return (
    <div className="relative w-full h-screen bg-[#D0EAFB]">
        {/* Navbar at top */}
      <div className="absolute top-0 left-0 w-full z-20">
        <TopNavbar />
      </div>
      {/* Background image */}
      <img
        src={background}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <img
        src={StartButton}
        alt="Start Button"
        className="fixed right-[90px] top-[140px]"
      />

      {/* White Glowing CV Button */}
      {/* CV Button with hover glow */}
      <div
        className="fixed right-[25vw] top-[340px] -translate-y-1/2 cursor-pointer group"
        onClick={handleClick}
      >
        {/* Glow only on hover */}
        <div className="absolute inset-0 -z-10 w-full h-full rounded-full bg-white blur-2xl opacity-0 group-hover:opacity-100 transition duration-300" />

        {/* Button Image */}
        <img
          src={cvbutton}
          alt="Elevator Button"
          className="w-[16vw] max-w-[130px] min-w-[20px] h-auto transition transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default FirstTimePg2;
