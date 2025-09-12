import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/user";
import { Flame, Star, User } from "lucide-react";
import api from "../lib/axios";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

const TopNavbar = () => {
  const { user, fetchUser } = useUserStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setOpen(false);
      await api.get("/users", { withCredentials: true });
      // Clear local store
      useUserStore.getState().clearUser();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="navbar bg-blue-100 px-4 py-2 shadow-sm">
      {/* left: brand */}
      <div className="flex-1">
        <Link to="/" className="flex items-center space-x-3 ml-7 cursor-pointer text-xl">
          <div className="flex items-center space-x-3">
            <span className="font-bold">BearLingo</span>
          </div>
        </Link>
      </div>

      {/* right: stats + profile */}
      <div className="flex-none flex items-center gap-3 mr-6">
        {/* streak + xp pill */}
        <div className="flex items-center bg-white rounded-full px-5 py-2 shadow">
          <div className="flex items-center space-x-2 mr-2">
            <Flame className="w-7 h-7 text-orange-500" />
            <span className="text-base">{user?.streak?.current ?? 0}</span>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <div className="flex items-center space-x-2 ml-2">
            <Star className="w-7 h-7 text-yellow-400" />
            <span className="text-base">{user?.xp ?? 0}</span>
          </div>
        </div>

        {/* profile dropdown (DaisyUI) */}
        <div ref={dropdownRef} className="dropdown dropdown-end relative ">
          <button
            onClick={() => setOpen((s) => !s)}
            className="cursor-pointer rounded-full p-1 focus:outline-none"
            aria-expanded={open}
            aria-haspopup="true"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </button>

          {/* DaisyUI menu — use open state to control visibility */}
          <ul
            tabIndex={0}
            className={`dropdown-content menu p-2 shadow bg-white rounded-box w-52 mt-2 z-50 ${
              open ? "block" : "hidden"
            }`}
          >
            <li>
              <Link to="/profile" className="w-full hover:bg-gray-200" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-red-500 hover:bg-gray-200" type="button">
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
