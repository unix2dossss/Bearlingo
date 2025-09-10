import React from "react";
import messyFloor from '../../assets/MessyFloor.svg';
import word from "../../assets/Welcome to Bearlingo.svg";

const FirstTimePg1 = () => {
  return (
    <>
      <TopNavBar />
      <div className="relative w-full h-screen bg-[#D0EAFB] flex items-center justify-center">
        {/* SVG background */}
        <img
          src={messyFloor}
          alt="Welcome"
          className="absolute bottom-0 left-0 w-full h-auto"
        />
        <div className="relative w-[1167px] h-[864px] overflow-hidden mx-auto">
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


            <button className="absolute left-1/2 transform -translate-x-1/2 bottom-[16rem] px-8 py-4 bg-blue-500 text-white text-2xl font-bold rounded-lg shadow-lg hover:bg-blue-600 transition">
          Get Started →
        </button>
        </div>
      </div>
        
    </>
  );
};


export default FirstTimePg1;
