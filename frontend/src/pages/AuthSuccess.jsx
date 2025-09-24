import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user";

const AuthSuccess = () => {
  const { fetchUser } = useUserStore();

  const navigate = useNavigate();
  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      console.log(params);
      const accessToken = params.get("token");
      console.log("Token", accessToken);

      if (accessToken) {
        // localStorage.setItem("accessToken", accessToken);
        try {
          await fetchUser();
          navigate("/Welcome");
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };
    handleAuth();
  }, [navigate, fetchUser]);

  const user = useUserStore((state) => state.user);
  console.log("User: ", user);
  return <h2>Logging in...</h2>;
};

export default AuthSuccess;
