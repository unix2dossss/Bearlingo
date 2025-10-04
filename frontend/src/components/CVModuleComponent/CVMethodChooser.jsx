// src/components/CVModuleComponent/MethodChooser.js
import React from 'react';

// Simple SVG icons to avoid external dependencies. You can replace these with an icon library.
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


const CVMethodChooser = ({ onSelectUpload, onSelectManual }) => {
  return (
    <div className="p-8 h-full rounded-2xl">
      <div className="max-w-lg mx-auto">
        
        <h1 className="text-2xl font-bold text-gray-800">Choose Your Method</h1>
        <p className="text-gray-500 mt-2 mb-8">How would you like to provide your information?</p>

        <div className="space-y-4">
          {/* Upload Existing CV Card */}
          <button
            onClick={onSelectUpload}
            className="w-full flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm text-left
                       transition-all duration-200 ease-in-out hover:bg-blue-50 hover:border-blue-300 transform hover:-translate-y-1"
          >
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
              <UploadIcon />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Upload Existing CV</h2>
              <p className="text-sm text-gray-500">Upload a PDF of your current CV</p>
            </div>
          </button>

          {/* Fill Form Manually Card */}
          <button
            onClick={onSelectManual}
            className="w-full flex items-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm text-left
                       transition-all duration-200 ease-in-out hover:bg-green-50 hover:border-green-300 transform hover:-translate-y-1"
          >
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
              <UserIcon />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Fill Form Manually</h2>
              <p className="text-sm text-gray-500">Enter your information step by step</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVMethodChooser;
