import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import CompanyResearchList from "../../components/InterviewModuleComponents/CompanyResearchList";
import CompanyResearchForm from "../../components/InterviewModuleComponents/CompanyResearchForm";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

const InterviewSubtask2 = ({ setIsSubmitted, onClose }) => {
  const [researches, setResearches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null if adding, object if editing
  const [formDraft, setFormDraft] = useState(null); // track unsaved form state

  // Fetch existing company research data from the database
  const fetchResearches = async () => {
    try {
      const res = await api.get("/users/me/interview/company-researches", {
        withCredentials: true
      });
      // If backend returns an array, sort it
      if (Array.isArray(res.data)) {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setResearches(sorted);
      } else {
        // Backend returned something else, e.g., { message: "No company research found" }
        setResearches([]); // empty array for first-time users
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch company researches");
    }
  };

  useEffect(() => {
    fetchResearches();
  }, []);

  // Warn before reload/close browser if form has changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        formDraft &&
        Object.values(formDraft).some((v) => {
          if (Array.isArray(v)) return v.some((q) => q.trim() !== "");
          return v && v.trim() !== "";
        })
      ) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave this page?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formDraft]);

  // Send company research data to the backend
  const { completeTask } = useUserStore();
  const handleSave = async (form) => {
    try {
      // create new
      await api.post("/users/me/interview/company-research", form, { withCredentials: true });
      toast.success("Company research added successfully!");
      setShowForm(false);
      setIsSubmitted(true);
      setEditing(null);
      setFormDraft(null); // clear draft after saving
      fetchResearches();

      // Get subtaskId by module name, level number and subtask sequence number
      let subtaskId;
      try {
        subtaskId = await getSubtaskBySequenceNumber("Interview", 1, 2);
      } catch (err) {
        console.error("Failed to get subtask ID", err);
        toast.error("Could not find subtask");
        return;
      }
      // Mark subtask as completed
      try {
        const res = await completeTask(subtaskId);
        // Check if subtask is completed and display appropriate message
        if (res.data.message === "Well Done! You completed the subtask") {
          toast.success("Task 2 completed!");
        }
      } catch (err) {
        console.error("Failed to complete task", err);
        toast.error("Could not mark task complete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save company research");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/me/interview/company-research/${id}`, { withCredentials: true });
      toast.success("Company research deleted successfully");
      fetchResearches();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete company research");
    }
  };

  // Close button handler with ConfirmLeave logic
  const handleLocalClose = () => {
    const hasChanges =
      formDraft &&
      Object.values(formDraft).some((v) => {
        if (Array.isArray(v)) return v.some((q) => q.trim() !== "");
        return v && v.trim() !== "";
      });

    onClose(hasChanges, false);
  };

  return (
    <div className="p-4">
      {/* Right: Close */}
      <button
        onClick={handleLocalClose}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 text-xl"
        aria-label="Close"
      >
        ✖
      </button>
      {!showForm ? (
        <CompanyResearchList
          researches={researches}
          onAddClick={() => {
            setShowForm(true);
            setEditing(null);
          }}
          onDelete={handleDelete}
          onEdit={(research) => {
            setEditing(research);
            setShowForm(true);
          }}
        />
      ) : (
        <CompanyResearchForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
            setFormDraft(null);
          }}
          initialData={editing}
          editingId={editing?._id || null}
          onDraftChange={setFormDraft} // track changes
        />
      )}
    </div>
  );
};

export default InterviewSubtask2;
