import React from "react";
import CVuploadBox from "../../components/CVModuleComponent/CVuploadBox";

export default function PersonalInfoCard({ personal, setPersonal }) {

  return (
    <div>
      <CVuploadBox />
      {/* header */}
      <div className="pt-4 pb-2 px-8 text-center">
        <h2 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
          Section 1: Personal Information
        </h2>
        <p className="text-sm font-semibold text-[#767687]">Please fill out your details</p>
      </div>

      {/* Basic Details */}
      <div className="max-w-3xl p-6">
        <div className="border rounded-xl border-gray-200 p-4 mb-4">
          <p className="text-[#767687] font-semibold text-sm mb-3">Basic Details</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                First Name <label className="text-red-500">*</label>
                {/*<label className="text-[#4f9cf9]">*</label>*/}
                </label>
              <input
                className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
                placeholder="Enter your first name"
                value={personal.firstName}
                onChange={(e) => setPersonal({ ...personal, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Last Name <label className="text-red-500">*</label> 
              </label>
              <input
                className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
                placeholder="Enter your last name"
                value={personal.lastName}
                onChange={(e) => setPersonal({ ...personal, lastName: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border rounded-2xl border-gray-200 p-4">
          <p className="text-[#767687] font-semibold text-sm mb-3">Contact Information</p>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">
              Phone Number <label className="text-red-500">*</label></label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
              placeholder="12345646"
              value={personal.phone}
              onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">
              Email <label className="text-red-500">*</label> </label>
            <div className="relative flex">
              <input
                className="flex-1 h-10 rounded bg-gray-100 px-3 pr-28 placeholder:text-gray-400"
                placeholder="username"
                value={personal.email.split("@")[0] || ""}
                onChange={(e) =>
                  setPersonal((p) => ({
                    ...p,
                    email: `${e.target.value}@${p.email.split("@")[1] || ""}`
                  }))
                }
              />
              <div className="absolute right-2 inset-y-0 flex items-center gap-2">
                <span className="text-gray-500">@gmail.com</span>
                {/* <input
                  className="w-28 h-8 rounded bg-gray-100 px-2 text-sm"
                  value={personal.email.split("@")[1] || ""}
                  onChange={(e) =>
                    setPersonal((p) => ({
                      ...p,
                      email: `${p.email.split("@")[0] || ""}@${e.target.value}`
                    }))
                  }
                /> */}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              LinkedIn Profile  
              <span className="text-xs font-normal text-gray-500"> (optional) </span>
            </label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
              placeholder="https://linkedin.com/in/yourprofile"
              value={personal.linkedin}
              onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
