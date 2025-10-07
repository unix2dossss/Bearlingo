import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";

const AuthSuccess = () => {
  const { fetchUser } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // localStorage.setItem("accessToken", accessToken);
      try {
        // Try if user is logged in
        await fetchUser();
        navigate("/Welcome");
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login?error=auth_failed");
      }
    };
    handleAuth();
  }, [navigate, fetchUser]);

  const user = useUserStore((state) => state.user);
  console.log("User: ", user);
  return <h2>Logging in...</h2>;
};

export default AuthSuccess;
