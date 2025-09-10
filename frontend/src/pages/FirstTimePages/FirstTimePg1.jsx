import React from "react";
import bearScreen from '../../assets/BearScreen.svg';
import messyFloor from '../../assets/MessyFloor.svg';

const FirstTimePg1 = () => {
  return (
    <>
      <div className="relative w-full h-screen bg-[#D0EAFB] flex items-center justify-center">
        {/* SVG background */}
        <img
          src={messyFloor}
          alt="Welcome"
            className="absolute bottom-0 left-0 w-full h-auto"
        />
        <div className="relative w-4/5 max-w-[1200px] mb-32">
        {/* BearScreen image */}
        <img
          src={bearScreen}
          alt="Bear"
          className="w-full h-auto"
        />

        {/* Button positioned above the image bottom */}
        <button className="absolute left-1/2 transform -translate-x-1/2 bottom-[16rem] px-8 py-4 bg-blue-500 text-white text-2xl font-bold rounded-lg shadow-lg hover:bg-blue-600 transition">
          Get Started →
        </button>
      </div>
        
      </div>
    </>
  );
};


export default FirstTimePg1;
