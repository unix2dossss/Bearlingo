import React from "react";

const CompanyResearchList = ({ researches, onAddClick, onDelete }) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-xl font-semibold">Company Research Guide</h2>
      <p className="text-gray-600 text-center max-w-md">
        Research companies before your interviews and keep track of all your job applications. Build
        a comprehensive database to help you prepare and stand out.
      </p>

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

      <button
        onClick={onAddClick}
        className="px-6 py-2 rounded-lg bg-[#79B66F] text-white font-semibold hover:bg-[#5f9c56] transition duration-200 ease-in-out"
      >
        + Add Company Research
      </button>

      {researches.length === 0 ? (
        <div className="text-gray-500 text-center mt-6">
          <p>No company research yet</p>
          <p>
            Start building your interview preparation database by researching your first company.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-6 w-full max-w-3xl">
          {researches.map((r) => (
            <div key={r._id} className="relative border rounded-lg shadow p-4">
              {/* Delete button on top-right */}
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
    </div>
  );
};

export default CompanyResearchList;
