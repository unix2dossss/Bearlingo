import React, { useEffect } from "react";
import { useUserStore } from "../store/user";
import { Flame, Star, User } from "lucide-react";

const TopNavbar = () => {
  const { user, fetchUser } = useUserStore();

  useEffect(() => {
    if (!user) fetchUser(); // only fetch if user not already loaded in store
  }, [user, fetchUser]);

  return (
    <nav className="w-full bg-gray-200 p-4 flex justify-between items-center border border-black">
      {/* Logo */}
      <div className="flex items-center bg-white rounded-full px-4 py-1">
        <span className="ml-2 font-bold text-lg">BearLingo</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 bg-white rounded-full px-4 py-1">
        {/* Streak */}
        <div className="flex items-center space-x-1">
          <Flame className="text-orange-500 w-5 h-5" />
          <span>{user?.streak.current ?? 0}</span>
        </div>

        {/* XP */}
        <div className="flex items-center space-x-1">
          <Star className="text-yellow-400 w-5 h-5" />
          <span>{user?.xp ?? 0}</span>
        </div>

        {/* Profile */}
        <User className="text-gray-600 w-5 h-5" />
      </div>
    </nav>
  );
};

export default TopNavbar;
