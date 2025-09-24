import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import googleLogo from "../assets/googleLogo.png";

const OAuth = () => {
  const handleGoogleClick = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    window.open(`${BASE_URL}/users/auth/google`, "_self");
  };
  return (
    <div variant="outlined" className="card-actions justify-center mb-2 h-14">
      <button
        type="button"
        className="btn bg-white border-1 border-gray-300 w-80 h-18"
        onClick={handleGoogleClick}
      >
        {/* <AiFillGoogleCircle className="w-6 h-6 mr-1" /> */}
        <img src={googleLogo} alt="Google Icon" className="w-5" />
        Login with Google
      </button>
    </div>
  );
};

export default OAuth;
