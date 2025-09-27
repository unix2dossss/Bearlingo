import door from '../../assets/Opendoor.svg';
import TopNavbar from '../../components/TopNavbar';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const FirstTimePg3 = () => {
  const navigate = useNavigate();
  const leftDoor = useRef(null);
  const rightDoor = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 1.5, // wait 3 seconds before starting
      onComplete: () => navigate('/CvModule')
    });

    // Slide in doors from outside until they meet in middle
    tl.to(leftDoor.current, { x: "0%", duration: 1.5, ease: "power2.inOut" })
      .to(rightDoor.current, { x: "0%", duration: 1.5, ease: "power2.inOut" }, "<");
  }, [navigate]);

  return (
    <div className="relative w-full h-screen bg-[#D0EAFB] overflow-hidden">
      <TopNavbar />
      <img src={door} alt="elevator" className="absolute inset-0 w-full h-full object-cover" />

      {/* Left door */}
      <div
        ref={leftDoor}
        className="absolute top-0 left-0 w-1/2 h-full bg-gray-400"
        style={{ transform: "translateX(-100%)" }} // fully hidden off left
      />
      {/* Right door */}
      <div
        ref={rightDoor}
        className="absolute top-0 right-0 w-1/2 h-full bg-gray-500"
        style={{ transform: "translateX(100%)" }} // fully hidden off right
      />
    </div>
  );
};

export default FirstTimePg3;
