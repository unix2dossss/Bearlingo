import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Bear from "../../assets/Bear.svg";

import AddReflection from "../../components/NetworkingModuleComponents/NetworkingSubtask3/AddReflection.jsx";
import PastReflections from "../../components/NetworkingModuleComponents/NetworkingSubtask3/PastReflections.jsx";

export default function NetworkingSubtask3({ userInfo = {}, onBack }) {
  const [activeTab, setActiveTab] = useState("new"); // "new" | "past"
  const [userReflections, setUserReflections] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  // Fetch data
  const getReflections = async () => {
    try {
      const { data } = await api.get("/users/me/networking/reflections", { withCredentials: true });
      setUserReflections(data?.reflections || []);
    } catch (error) {
      console.log("Error retrieving reflections", error);
      toast.error("Error retrieving reflections");
    }
  };

  const getUserEvents = async () => {
    try {
      const res = await api.get("/users/me/networking/events", { withCredentials: true });
      setUserEvents(res?.data?.eventsToAttend?.[0]?.attendingEventIds || []);
    } catch (error) {
      console.error("User events were not fetched", error);
      toast.error("User events were not fetched");
    }
  };

  useEffect(() => {
    getReflections();
    getUserEvents();
  }, []);

  const handleSavedReflection = (newReflection) => {
    if (!newReflection) return;
    setUserReflections((prev) => [...prev, newReflection]);
    setActiveTab("past"); // optional: jump to past after save
  };

  return (
    <div className="pt-16 bg-[#4f9cf9] relative min-h-screen flex flex-col min-w-0 gap-4 p-4">
      {/* Back */}
      <button className="btn btn-ghost absolute top-20 left-6 z-10" onClick={onBack}>
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
      </button>

      {/* Tabs */}
      <div className="absolute top-16 left-[37%] tabs tabs-box w-max mx-auto mb-6 flex flex-row gap-6">
        <button
          onClick={() => setActiveTab("new")}
          className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200
            ${activeTab === "new"
              ? "bg-blue-500 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
            }`}
        >
          📝 New Reflection
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200
            ${activeTab === "past"
              ? "bg-blue-500 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
            }`}
        >
          📚 Past Reflections
        </button>
      </div>

      {/* Content */}
      <div className="mt-24"> {/* push content below the sticky-ish tab row */}
        {activeTab === "new" ? (
          <AddReflection
            userEvents={userEvents}
            bearSrc={Bear}
            onSaved={handleSavedReflection}
          />
        ) : (
          <PastReflections userReflections={userReflections} />
        )}
      </div>
    </div>
  );
}
