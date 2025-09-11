import React from "react";
import messyFloor from '../../assets/MessyFloor.svg';
import word from "../../assets/Welcome to Bearlingo.svg";
import bear from "../../assets/Bear.svg";
import { useNavigate } from 'react-router-dom';
import TopNavbar from "../../components/TopNavbar";


const FirstTimePg1 = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/Getting Started");
    };
  return (
    <>
<div className="relative w-full h-screen bg-[#D0EAFB]">
      {/* Navbar at top */}
      <div className="absolute top-0 left-0 w-full z-20">
        <TopNavbar />
      </div>
        <img
          src={messyFloor}
          alt="Welcome"
          className="absolute bottom-0 left-0 w-full h-auto"
        />
        <div className="relative w-[1167px] h-[999px] overflow-hidden mx-auto">
            {/* Background box */}
            <div className="absolute left-[64px] top-[137px] w-[1040px] h-[548px] bg-black"></div>

            {/* Blue inner box */}
            <div className="absolute left-[81px] top-[154px] w-[1005px] h-[513px] bg-blue-400"></div>

            {/* Grey inner box */}
            <div className="absolute left-[96px] top-[154px] w-[1005px] h-[513px] bg-black/25"></div>

            {/* Transparent overlays */}
            <div className="absolute left-[96px] top-[172px] w-[975px] h-[476px] bg-white">
                <img
                    src={word}
                    alt="Welcome to Bearlingo"
                    className="absolute left-[96px] top-[-33px] w-[775px] h-[476px]"
                    />
            </div>
            <img
                    src={bear}
                    alt="Bear Mascot"
                    className="fixed right-40 bottom-24 w-40 sm:w-48 md:w-56 lg:w-64"
                    />

            <button className="absolute left-1/2 transform -translate-x-1/2 bottom-[24rem] px-8 py-4 bg-blue-500 text-white text-2xl 
            font-bold rounded-lg shadow-lg hover:bg-blue-600 transition" onClick={handleClick} >
                Get Started →
            </button>
        </div>
      </div>
        
    </>
  );
};


export default FirstTimePg1;
