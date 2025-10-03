import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import TopNavbar from "../components/TopNavbar";
import SideNavbar from "../components/SideNavbar";
import { useUserStore } from "../store/user";
import api from "../lib/axios";
import { getModuleByName } from "../utils/moduleHelpers";

import CV from "../assets/CVStats.svg";
import Net from "../assets/NetStats.svg";
import Int from "../assets/IntStats.svg";
import Jou from "../assets/JouStats.svg";

import gsap from "gsap";


const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: ""
  });
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        await useUserStore.getState().fetchUser();
      }
      const currentUser = useUserStore.getState().user;
      setUserInfo(currentUser);
      if (!currentUser) {
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate, user]);

  // Fetch modules and progress dynamically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const modulesToFetch = [
          {
            label: "CV",
            colorClass: "text-[#B471EC]",
            imageSrc: "https://placehold.co/100x100/B471EC/FFFFFF?text=CV"
          },
          {
            label: "Interview",
            colorClass: "text-[#39CD47]",
            imageSrc: "https://placehold.co/100x100/39CD47/FFFFFF?text=Interview"
          },
          {
            label: "Networking",
            colorClass: "text-[#FFDE32]",
            imageSrc: "https://placehold.co/100x100/FFDE32/FFFFFF?text=Networking"
          }
        ];

        const statsData = [];

        for (const mod of modulesToFetch) {
          try {
            // 1. Get module
            const module = await getModuleByName(mod.label);

            // 2. Fetch progress for that module
            const res = await api.get(`/users/progress/module/${module._id}`, {
              withCredentials: true
            });

            // 3. Extract percentage (fallback to "0%")
            const percentageStr = res.data?.moduleProgressPercentage || "0%";
            console.log("Percentage:", percentageStr);
            const percentageNum = parseFloat(percentageStr.replace("%", ""));

            statsData.push({
              ...mod,
              progress: percentageNum
            });
          } catch (err) {
            console.error(`Error fetching module ${mod.label}:`, err.message);
            statsData.push({ ...mod, progress: 0 });
          }
        }
        // Dummy last stat for now
        const lastStat = {
          label: "Last Stat",
          colorClass: "text-[#5CA3FF]",
          imageSrc: "https://placehold.co/100x100/5CA3FF/FFFFFF?text=Last Stat",
          progress: 0
        };
        statsData.push(lastStat);
        // console.log("Stats loaded:", statsData);
        setStats(statsData);
        // setStats(statsData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Update profile
  const { fetchUser } = useUserStore();
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        "/users/profile",
        {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          username: userInfo.username,
          email: userInfo.email
        },
        { withCredentials: true }
      );

      if (res.data?.user) {
        // Update zustand store with new user data
        await fetchUser();
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile!");
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete("/users", {
        withCredentials: true
      });

      if (res.status === 200) {
        toast.success("Your account has been deleted successfully.");
        // Redirect to home page
        navigate("/");
      } else {
        throw new Error(res.data.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="relative bg-[#D0EAFB] min-h-screen overflow-hidden">
      <TopNavbar />
      {/* Side Navbar floating on left */}
      <div className="fixed top-20 left-0 h-screen w-60 z-30">
        <SideNavbar />
      </div>
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="relative z-10">
          {/* Statistics Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Statistics</h1>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                  // Each stat card
                  <div
                    key={index}
                    className="aspect-square bg-white p-3 rounded-2xl shadow-sm flex items-center justify-center border-4 border-[#5CA3FF]"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Image as circle, same size as progress */}
                      <img
                        src={index === 0 
                            ? CV 
                            : index === 1 
                            ? Int 
                            : index === 2 
                            ? Net 
                            : index === 3 
                            ? Jou 
                            : stat.imageSrc} 
                        alt={stat.label}
                        className="w-[154px] h-[154px] rounded-full object-cover z-10 opacity-30"
                      />

                      {/* Radial progress on top */}
                      <div
                        className="absolute inset-0 flex items-center justify-center z-20"
                        role="progressbar"
                      >
                        <div
                          className={`radial-progress ${stat.colorClass} text-2xl font-bold`}
                          style={{
                            "--value": stat.progress,
                            "--size": "170px",
                            "--thickness": "7px"
                          }}
                        >
                          {stat.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Account</h1>
            <div className="bg-white backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-base font-bold text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={userInfo.firstName || ""}
                      onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                      className="input input-bordered w-full bg-gray-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-base font-bold text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={userInfo.lastName || ""}
                      onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                      className="input input-bordered w-full bg-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-base font-bold text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={userInfo.username}
                    onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                    className="input input-bordered w-full bg-gray-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-bold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="input input-bordered w-full bg-gray-200"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-36 text-lg"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline btn-error w-48 text-lg"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* LinkedIn Banner and Mascot */}
      <div className="relative px-4 lg:px-8 max-w-7xl mx-auto mt-[-2rem] sm:mt-0">
        <img
          src="/src/assets/Bear.svg"
          alt="Bear Mascot"
          className="absolute bottom-[-170px] md:right-10 lg:right-20 w-50 md:w-80 h-auto z-20 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default Profile;
