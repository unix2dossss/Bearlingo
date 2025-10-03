import React, { useRef, useState } from "react";
import api from "../../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "../../store/user";

const PRIMARY = "#4f9cf9";
const MUTED = "#767687";

export default function ResumeUpload({
  // Optional server handlers; if omitted, defaults below will POST to your API
  onUpload,        // async (file) => { ... }
  onRemove,        // async () => { ... }
  onAddUrl,        // async (url) => { ... }
  initialFileName, // e.g. "resume.pdf"
  initialFileSize, // number (bytes)
  initialPortfolioUrl = "",
  maxSizeMB = 10,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileMeta, setFileMeta] = useState(
    initialFileName ? { name: initialFileName, size: initialFileSize ?? 0 } : null
  );
  const [uploading, setUploading] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState(initialPortfolioUrl);

  const accept = ".pdf,.doc,.docx";
  const maxBytes = maxSizeMB * 1024 * 1024;

  const prettySize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

  const validateFile = (file) => {
    const ext = file.name.toLowerCase().split(".").pop();
    const okExt = ["pdf", "doc", "docx"].includes(ext);
    if (!okExt) {
      toast.error("Only PDF, DOC, or DOCX files are allowed.");
      return false;
    }
    if (file.size > maxBytes) {
      toast.error(`File is too large (max ${maxSizeMB} MB).`);
      return false;
    }
    return true;
  };

  const currentUser = useUserStore.getState().user;
    const firstName = currentUser?.firstName;
    const lastName = currentUser?.lastName;

  const defaultUpload = async (file) => {
    const fd = new FormData();
    fd.append("cv", file);
    fd.append("firstName", firstName);
    fd.append("lastName", lastName);
    const res = await api.post("/users/me/cv/upload", fd, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res?.data;
  };

  const defaultRemove = async () => {
    // Adjust if your API differs (DELETE or POST to a remove endpoint)
    await api.delete("/users/me/cv/delete", { withCredentials: true });
  };

  const defaultAddUrl = async (url) => {
    const res = await api.post(
      "/users/me/cv/portfolio-url",
      { url },
      { withCredentials: true }
    );
    return res?.data;
  };

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;

    try {
      setUploading(true);
      if (onUpload) {
        await onUpload(file);
      } else {
        await defaultUpload(file);
      }
      setFileMeta({ name: file.name, size: file.size });
      toast.success("Resume uploaded.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = (e) => {
    handleFiles(e.target.files);
    // reset input so same file can be chosen again
    e.target.value = "";
  };

  const handleRemove = async () => {
    if (!fileMeta) return;
    try {
      if (onRemove) {
        await onRemove();
      } else {
        await defaultRemove();
      }
      setFileMeta(null);
      toast.success("Resume removed.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove resume.");
    }
  };

  const handleAddUrl = async () => {
    const url = portfolioUrl.trim();
    if (!/^https?:\/\/.+/i.test(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }
    try {
      if (onAddUrl) {
        await onAddUrl(url);
      } else {
        await defaultAddUrl(url);
      }
      toast.success("Portfolio URL saved.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save URL.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 mt-8">
      {/* Heading */}
      <div className="text-center mb-4">
        <h1 className="text-[32px] md:text-4xl font-extrabold" style={{ color: PRIMARY }}>
          Upload your Resume
        </h1>
        <p className="mt-3 text-[17px] font-semibold" style={{ color: MUTED }}>
          Help us get to know you by sharing your resume
        </p>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-[18px] border p-8 md:p-14 bg-white shadow-sm transition-all
          ${dragOver ? "ring-2 ring-offset-2" : ""}
        `}
        style={{
          borderColor: dragOver ? PRIMARY : "#e5e7eb", // gray-200
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        }}
      >
        {/* Trash (remove) */}
        {fileMeta && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 text-black/80 hover:text-black"
            aria-label="Remove uploaded file"
            title="Remove"
          >
            {/* trash icon */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M9 7v10m6-10v10M10 4h4l1 2H9l1-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onBrowse}
          className="hidden"
        />

        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center select-none">
          {/* Cloud upload icon */}
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="none"
            className="mb-4"
            style={{ color: MUTED, opacity: 0.9 }}
          >
            <path
              d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A4 4 0 1 1 19 18H7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 13v6m0-6 3 3m-3-3-3 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {!fileMeta ? (
            <>
              <p className="text-lg md:text-xl font-semibold" style={{ color: MUTED }}>
                Drag & drop your resume here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, DOC, DOCX • up to {maxSizeMB}MB
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="mt-4 inline-flex items-center justify-center h-11 px-6 rounded-full text-white font-extrabold shadow-sm disabled:opacity-60"
                style={{ backgroundColor: PRIMARY }}
              >
                {uploading ? "Uploading..." : "Browse file"}
              </button>
            </>
          ) : (
            <>
              <p className="text-lg md:text-xl font-semibold mb-1" style={{ color: MUTED }}>
                {fileMeta.name}
              </p>
              <p className="text-sm text-gray-500">{prettySize(fileMeta.size)}</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-4 inline-flex items-center justify-center h-11 px-6 rounded-full bg-white border-2 font-extrabold"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                Replace file
              </button>
            </>
          )}
        </div>
      </div>

      {/* Portfolio URL */}
      <div className="mt-6">
        <label className="block text-lg font-extrabold mb-2" style={{ color: PRIMARY }}>
          OR add a Portfolio URL
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="http://"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            className="flex-1 h-12 rounded-xl bg-gray-100 px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2"
            style={{ borderColor: "transparent" }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${PRIMARY}55`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="h-12 px-6 rounded-xl text-white font-extrabold shadow-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            Add
          </button>
        </div>
      </div>
    </section>
  );
}
