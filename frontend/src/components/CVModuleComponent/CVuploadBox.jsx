import React, { useState } from "react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { useUserStore } from "../../store/user";

export default function CVuploadBox() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const currentUser = useUserStore.getState().user;
  const firstName = currentUser?.firstName;
  const lastName = currentUser?.lastName;

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Pick a file");
    const form = new FormData();
    form.append("cv", file);
    form.append("firstName", firstName);
    form.append("lastName", lastName);

    try {
      await api.post("/users/me/cv/upload", form, {
        withCredentials: true,
        onUploadProgress: (p) => {
          setProgress(Math.round((p.loaded * 100) / p.total));
        },
      });
      toast.success("CV uploaded successfully!");
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 border border-gray-300 rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Upload Your CV</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-medium py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Upload CV
        </button>
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded h-3 overflow-hidden mt-2">
            <div
              className="bg-blue-500 h-3"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </form>
    </div>
  );
}
