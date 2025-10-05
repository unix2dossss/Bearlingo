import React from "react";
// const ACCENT = "#4f9cf9"; 
const ACCENT = "#43a047";
const COLORS = {
  primary: "#4f9cf9",
  primaryHover: "#3d86ea",
  textMuted: "#767687",
};

const CompanyResearchList = ({ researches, onAddClick, onDelete }) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-center text-[32px] md:text-4xl font-extrabold" 
      style={{ color: ACCENT }}>Company Research Guide</h2>
      {/* Gentle tip card */}
        <div className="mt-4 max-w-3xl mx-auto px-6 w-full pb-6">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <p className="text-orange-900 text-sm">
              <span className="font-bold">Tip: </span> Research companies before your interviews and keep track of all your job applications. Build
        a comprehensive database to help you prepare and stand out.
            </p>
          </div>
        </div>
      

      <div className="flex flex-wrap gap-2 justify-center">
        {[
          "Google",
          "Microsoft",
          "Apple",
          "Amazon",
          "Meta",
          "Netflix",
          "Tesla",
          "Spotify",
          "Airbnb",
          "Uber"
        ].map((c) => (
          <span key={c} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
            {c}
          </span>
        ))}
      </div>


      {researches.length === 0 ? (
        <div className="text-gray-500 text-center mt-6">
          <p>No company research yet</p>
          <p>
            Start building your interview preparation database by researching your first company.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-6 w-full max-w-3xl p-8">
          {researches.map((r) => (
            <div key={r._id} className="relative border rounded-lg shadow p-4">
              <button
                onClick={() => onDelete(r._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>

              <h3 className="text-lg font-bold">{r.companyName}</h3>
              <p className="text-sm text-gray-600">{r.industry}</p>
              <p className="mt-2">
                <strong>Products:</strong> {r.products}
              </p>
              <p>
                <strong>Competitors:</strong> {r.competitors}
              </p>
              <div className="mt-2">
                <strong>Questions:</strong>
                <ul className="list-disc list-inside text-sm">
                  {r.questions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      )}
      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center h-12 md:h-14 px-8 md:px-10 rounded-full 
              text-white font-extrabold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT, minWidth: 200 }}
      >
        + Add Company Research
      </button>
    </div>
  );
};

export default CompanyResearchList;
