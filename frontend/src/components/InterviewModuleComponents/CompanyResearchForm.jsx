import React, { useState, useEffect } from "react";
const ACCENT = "#4f9cf9"; // Interview theme color (green)

const CompanyResearchForm = ({ onSave, onCancel, initialData, onDraftChange }) => {
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    products: "",
    competitors: "",
    questions: ["", ""]
  });

  // Load existing data if editing (Not needed for now, later need when editing existing data)
  useEffect(() => {
    if (initialData) {
      setForm({
        companyName: initialData.companyName || "",
        industry: initialData.industry || "",
        products: initialData.products || "",
        competitors: initialData.competitors || "",
        questions: initialData.questions?.length ? initialData.questions : ["", ""]
      });
    }
  }, [initialData]);

  // Notify parent about draft changes
  useEffect(() => {
    onDraftChange(form);
  }, [form, onDraftChange]);

  const isValid =
    form.companyName &&
    form.industry &&
    form.products &&
    form.competitors &&
    form.questions[0] &&
    form.questions[1];

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleQuestionChange = (idx, value) => {
    const updated = [...form.questions];
    updated[idx] = value;
    setForm({ ...form, questions: updated });
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSave(form);
  };

  return (
    <section className="flex h-full flex-col">
      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Sticky header */}
        <h1
          className="text-center text-[32px] md:text-4xl font-extrabold mb-1"
          style={{ color: ACCENT }}
        >
          Add Company Research
        </h1>
        <p className="text-gray-600 font-medium text-center mb-6">
          Fill out the details below to save your research
        </p>

        {/* Company Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-10 rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-offset-1"
            // style={{ focusRingColor: ACCENT }}
            style={{
              borderColor: "transparent",
              outline: "none",
              boxShadow: `0 0 0 2px transparent`
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            placeholder="e.g., Google"
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />
        </div>

        {/* Industry */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-10 rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 focus:ring-offset-1"
            // style={{ focusRingColor: ACCENT }}
            style={{
              borderColor: "transparent",
              outline: "none",
              boxShadow: `0 0 0 2px transparent`
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            placeholder="e.g., Technology / Automotive / Finance"
            value={form.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
          />
        </div>

        {/* Products */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Key Products / Services <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full min-h-[90px] rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1"
            // style={{ focusRingColor: ACCENT }}
            style={{
              borderColor: "transparent",
              outline: "none",
              boxShadow: `0 0 0 2px transparent`
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            placeholder="List the main products or services the company provides…"
            value={form.products}
            onChange={(e) => handleChange("products", e.target.value)}
          />
        </div>

        {/* Competitors */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Main Competitors <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full min-h-[90px] rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1"
            // style={{ focusRingColor: ACCENT }}
            style={{
              borderColor: "transparent",
              outline: "none",
              boxShadow: `0 0 0 2px transparent`
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            placeholder="Which companies are their main competitors?"
            value={form.competitors}
            onChange={(e) => handleChange("competitors", e.target.value)}
          />
        </div>

        {/* Questions */}
        {form.questions.map((q, idx) => (
          <div className="mb-4" key={idx}>
            <label className="block text-sm font-semibold mb-1">
              Question {idx + 1} to Ask the Interviewer <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full min-h-[70px] rounded-md bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1"
              // style={{ focusRingColor: ACCENT }}
              style={{
                borderColor: "transparent",
                outline: "none",
                boxShadow: `0 0 0 2px transparent`
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${ACCENT}55`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              placeholder="e.g., What does career growth look like here?"
              value={q}
              onChange={(e) => handleQuestionChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Footer buttons (non-scrollable) */}
      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex items-center justify-center gap-3">
          {/* Cancel */}
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center
        h-12 md:h-14 px-8 md:px-10 rounded-full
        bg-white text-red-600 border-2 border-red-600
        font-extrabold text-base md:text-lg
        shadow-sm hover:bg-red-50
        focus:outline-none focus:ring-2 focus:ring-red-600
        min-w-[200px]"
          >
            Cancel
          </button>

          {/* Save */}
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`inline-flex items-center justify-center
        h-12 md:h-14 px-8 md:px-10 rounded-full
        text-white font-extrabold text-base md:text-lg
        shadow-sm focus:outline-none focus:ring-2
        min-w-[200px] ${
          isValid
            ? "bg-[#4f9cf9] hover:bg-[#3d86ea] focus:ring-[#3d86ea]"
            : "bg-gray-400 opacity-65 cursor-not-allowed"
        }`}
          >
            Save Research
          </button>
        </div>
      </div>
    </section>
  );
};

export default CompanyResearchForm;
