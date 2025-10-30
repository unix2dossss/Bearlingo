import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import StarBear from "../../assets/StarBear.svg";
import main from "../../assets/NetworkingModulePassed.svg";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/user";

const NetworkingLevelPass = ({ onClose }) => {
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        await useUserStore.getState().fetchUser();
      }
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate, user]);

  // ✅ Button handler
  const handleClick = () => {
    onClose(); // close popup
  };

  useEffect(() => {
    // Animate gradient border
    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 4, ease: "linear" } });
    tl.to(boxRef.current, { backgroundPosition: "100% 0%" })
      .to(boxRef.current, { backgroundPosition: "0% 0%" });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={boxRef}
        className="relative p-5 rounded-lg text-center"
        style={{
          background: "linear-gradient(270deg,rgb(222, 205, 20),rgb(191, 144, 14), #4ec5ff,rgb(249, 228, 108))",
          backgroundSize: "600% 600%",
        }}
      >
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <img src={StarBear} className="mb-6 mx-auto" alt="Star Bear" />
          <img src={main} className="mb-6 mx-auto" alt="CV Module Passed" />

          <div className="bg-[#befbbb] rounded-lg p-4 mb-6">
            <p className="text-[#0aad3b] italic">
              You’ve mastered your networking game! Now every conversation is a chance to open new doors.
            </p>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg"
            onClick={handleClick}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkingLevelPass;
