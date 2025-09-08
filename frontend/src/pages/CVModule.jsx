import React from "react";
import TopNavbar from "../components/TopNavbar";
import { useUserStore } from "../store/user";

const CvModule = () => {
  const { completeTask } = useUserStore();

  return (
    <div>
      <TopNavbar />

      {/* Simple button to test completeTask */}
      <div className="p-4">
        <button
          onClick={() => completeTask("68b7b7bc4cf5e160aae83d4e")}
          className="btn btn-success"
        >
          Complete Task
        </button>
      </div>
    </div>
  );
};

export default CvModule;
