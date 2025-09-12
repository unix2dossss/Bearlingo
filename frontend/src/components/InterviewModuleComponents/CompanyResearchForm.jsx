import React, { useState } from "react";

const CompanyResearchForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    products: "",
    competitors: "",
    questions: ["", ""],
  });

  const isValid =
    form.companyName && form.industry && form.products && form.competitors && form.questions[0] && form.questions[1];

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
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Add Company Research</h2>

      <input
        type="text"
        placeholder="Company Name"
        className="w-full border p-2 rounded"
        value={form.companyName}
        onChange={(e) => handleChange("companyName", e.target.value)}
      />
      <input
        type="text"
        placeholder="Industry"
        className="w-full border p-2 rounded"
        value={form.industry}
        onChange={(e) => handleChange("industry", e.target.value)}
      />
      <textarea
        placeholder="Key Products/Services"
        className="w-full border p-2 rounded"
        value={form.products}
        onChange={(e) => handleChange("products", e.target.value)}
      />
      <textarea
        placeholder="Main Competitors"
        className="w-full border p-2 rounded"
        value={form.competitors}
        onChange={(e) => handleChange("competitors", e.target.value)}
      />
      <textarea
        placeholder="Question 1 to Ask the Interviewer"
        className="w-full border p-2 rounded"
        value={form.questions[0]}
        onChange={(e) => handleQuestionChange(0, e.target.value)}
      />
      <textarea
        placeholder="Question 2 to Ask the Interviewer"
        className="w-full border p-2 rounded"
        value={form.questions[1]}
        onChange={(e) => handleQuestionChange(1, e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`px-4 py-2 rounded text-white ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Save Company Research
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded border border-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CompanyResearchForm;
