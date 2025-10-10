import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Bear from "../../assets/Bear.svg";
import { useUserStore } from "../../store/user";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";

import AddReflection from "../../components/NetworkingModuleComponents/NetworkingSubtask3/AddReflection.jsx";
import PastReflections from "../../components/NetworkingModuleComponents/NetworkingSubtask3/PastReflections.jsx";

export default function NetworkingSubtask3({ userInfo = {}, onBack }) {
  const [userReflections, setUserReflections] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("new"); // "new" | "past"
  const { completeTask } = useUserStore();

  // --- data fetchers ---
  const getReflections = async () => {
    try {
      const res = await api.get("/users/me/networking/reflections", { withCredentials: true });
      const list = Array.isArray(res?.data?.reflections) ? res.data.reflections : [];
      setUserReflections(list);
    } catch (error) {
      console.error("Error retrieving reflections", error);
      toast.error("Error retrieving reflections");
    }
  };

  const getUserEvents = async () => {
    try {
      const res = await api.get("/users/me/networking/events", { withCredentials: true });
      // shape: { eventsToAttend: [{ attendingEventIds: [...] }] }
      const attending = res?.data?.eventsToAttend?.[0]?.attendingEventIds || [];
      setUserEvents(attending);
    } catch (error) {
      console.error("User events were not fetched", error);
      toast.error("User events were not fetched");
    }
  };

  useEffect(() => {
    getReflections();
    getUserEvents();
  }, []);

  // --- after a reflection is saved in child ---
  const handleSavedReflection = async (newReflection) => {
    // update local list
    setUserReflections((prev) => [newReflection, ...prev]);
    setActiveTab("past");

    // try to mark subtask complete
    try {
      const subtaskId = await getSubtaskBySequenceNumber("Networking Hub", 1, 3);
      const done = await completeTask(subtaskId);
      if (done?.data?.message === "Well Done! You completed the subtask") {
        toast.success("Task completed!");
      }
    } catch (err) {
      console.error("Failed to complete task", err);
      // don’t hard-fail UX; just show a soft error
      toast.error("Could not mark task complete");
    }
  };

  return (
    <div className="pt-16 bg-[#4f9cf9] relative min-h-screen flex flex-col min-w-0 gap-4 p-4">
      {/* Back */}
      <button className="btn btn-ghost absolute top-20 left-6 z-10" onClick={onBack}>
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
      </button>

      {/* Tabs */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-max mx-auto mb-6 flex flex-row gap-6">
        <button
          onClick={() => setActiveTab("new")}
          className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200
            ${activeTab === "new"
              ? "bg-blue-500 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"}`}
        >
          📝 New Reflection
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200
            ${activeTab === "past"
              ? "bg-blue-500 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"}`}
        >
          📚 Past Reflections
        </button>
      </div>

      {/* Content */}
      <div className="mt-24">
        {activeTab === "new" ? (
          <AddReflection
            userEvents={userEvents}     // [{ eventId, status, _id, ... }]
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
