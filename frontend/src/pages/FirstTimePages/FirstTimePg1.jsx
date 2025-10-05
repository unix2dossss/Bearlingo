import { React, useEffect } from "react";
import messyFloor from "../../assets/MessyFloor.svg";
import word from "../../assets/Welcome to Bearlingo.svg";
import bear from "../../assets/Bear.svg";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../../components/TopNavbar";
import { useUserStore } from "../../store/user";

const FirstTimePg1 = () => {
  const navigate = useNavigate();

  // Check if user logined before allowing to come to this page
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
        <img src={messyFloor} alt="Welcome" className="absolute bottom-0 left-0 w-full h-auto" />
        <div className="relative w-[867px] h-[70vh] mx-auto">
          {/* Background box */}
          <div className="absolute left-[24px] top-[137px] w-[840px] h-[515px] bg-black"></div>

          {/* Blue inner box */}
          <div className="absolute left-[41px] top-[154px] w-[805px] h-[483px] bg-blue-400"></div>

          {/* Grey inner box */}
          <div className="absolute left-[56px] top-[154px] w-[805px] h-[466px] bg-black/25"></div>

          {/* Transparent overlays */}
          <div className="absolute left-[56px] top-[172px] w-[775px] h-[450px] bg-white">
            <img
              src={word}
              alt="Welcome to Bearlingo"
              className="absolute left-[51px] top-[-3px] w-[675px] h-[373px]"
            />
            <div className="absolute inset-0 flex items-end justify-center pb-[5%]">
              <button
                className="px-8 py-4 bg-blue-500 text-white text-2xl font-bold rounded-lg shadow-lg hover:bg-blue-600 transition"
                onClick={handleClick}
              >
                Get Started →
              </button>
            </div>
          </div>
        </div>
        <img src={bear} alt="Bear Mascot" className="absolute right-[40px] bottom-[100px]" />
      </div>
    </>
  );
};

export default FirstTimePg1;
