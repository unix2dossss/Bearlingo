import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import StarBear from "../../assets/StarBear.svg";
import main from "../../assets/CV Module Passed.svg";

const CVLevelPass = ({ onClose }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    // Animate gradient background border
    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 4, ease: "linear" } });
    tl.to(boxRef.current, {
      backgroundPosition: "100% 0%",
    }).to(boxRef.current, {
      backgroundPosition: "0% 0%",
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={boxRef}
        className="relative p-5 rounded-lg text-center"
        style={{
          background: "linear-gradient(270deg, #ff4ec5, #8a00ff, #4ec5ff, #ff4ec5)",
          backgroundSize: "600% 600%",
        }}
      >
        {/* Inner white box */}
        <div className="bg-white rounded-lg p-8 shadow-xl ">
          <img src={StarBear} className="mb-6 mx-auto" alt="Star Bear" />
          <img src={main} className="mb-6 mx-auto" alt="CV Module Passed" />
            
          {/* Grey box for message */}
          <div className="bg-[#DBBBFB] rounded-lg p-4 mb-6">
            <p className="text-[#9714de] font-small italic">
              You’ve successfully built your CV! Your room is fully decorated
            </p>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg"
            onClick={onClose}
          >
            Next Module
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVLevelPass;
