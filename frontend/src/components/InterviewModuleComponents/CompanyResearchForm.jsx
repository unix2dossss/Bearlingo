import React, { useState, useEffect } from "react";
const ACCENT = "#43a047"; // Interview theme color (green)

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
    <section className="max-w-3xl mx-auto p-6 flex flex-col h-full">
      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto">
        {/* Sticky header */}
        <h1
          className="text-center text-[32px] md:text-4xl font-extrabold"
          style={{ color: ACCENT }}
        >
          Add Company Research
        </h1>
        <p className="text-gray-500 font-semibold mt-1 text-center">
          Fill out the details below to save your research
        </p>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2"
            style={{ focusRingColor: ACCENT }}
            placeholder="e.g., Google"
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-10 rounded bg-gray-100 px-3 focus:outline-none focus:ring-2"
            style={{ focusRingColor: ACCENT }}
            placeholder="e.g., Technology / Automotive / Finance"
            value={form.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
          />
        </div>

        {/* Products */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Key Products / Services <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full min-h-[90px] rounded bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2"
            style={{ focusRingColor: ACCENT }}
            placeholder="List the main products or services the company provides…"
            value={form.products}
            onChange={(e) => handleChange("products", e.target.value)}
          />
        </div>

        {/* Competitors */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Main Competitors <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full min-h-[90px] rounded bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2"
            style={{ focusRingColor: ACCENT }}
            placeholder="Which companies are their main competitors?"
            value={form.competitors}
            onChange={(e) => handleChange("competitors", e.target.value)}
          />
        </div>

        {/* Questions */}
        {form.questions.map((q, idx) => (
          <div key={idx}>
            <label className="block text-sm font-semibold mb-1">
              Question {idx + 1} to Ask the Interviewer <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full min-h-[70px] rounded bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2"
              style={{ focusRingColor: ACCENT }}
              placeholder="e.g., What does career growth look like here?"
              value={q}
              onChange={(e) => handleQuestionChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Footer buttons (non-scrollable) */}
      <div>
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-center gap-3">
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
                ? "bg-[#43a047] hover:bg-[#388e3c] focus:ring-[#43a047]"
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
