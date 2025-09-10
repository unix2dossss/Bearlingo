import React, { useState } from "react";

export default function PersonalInfoCard({
  onClose = () => {},
  onClear: onClearProp,
  onSubmit = (values) => console.log("Submit:", values),
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    emailUser: "",
    emailDomain: "gmail.com",
    linkedin: "",
  });

  const clear = () => {
    const reset = {
      firstName: "",
      lastName: "",
      phone: "",
      emailUser: "",
      emailDomain: "gmail.com",
      linkedin: "",
    };
    setForm(reset);
    onClearProp?.(reset);
  };

  const saveAndContinue = () => onSubmit(form);

  return (
    <div>
      {/* header */}
      <div className="pt-4 pb-2 px-8 text-center">
        <h2 className="text-center text-[32px] md:text-4xl font-extrabold text-[#4f9cf9]">
          Section 1: Personal Info
        </h2>
        <p className="text-sm font-semibold text-[#767687]">
          Please fill out your details
        </p>
      </div>

      {/* Basic Details */}
      <div className="px-6">
        <div className="border rounded-xl border-gray-200 p-4 mb-4">
          <p className="text-[#767687] font-semibold text-sm mb-3">
            Basic Details
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                First Name
              </label>
              <input
                className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
                placeholder="Enter your first name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Last Name
              </label>
              <input
                className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
                placeholder="Enter your last name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border rounded-2xl border-gray-200 p-4">
          <p className="text-[#767687] font-semibold text-sm mb-3">
            Contact Information
          </p>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
              placeholder="12345646"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Email</label>
            <div className="relative flex">
              <input
                className="flex-1 h-10 rounded bg-gray-100 px-3 pr-28 placeholder:text-gray-400"
                placeholder="username"
                value={form.emailUser}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emailUser: e.target.value }))
                }
              />
              <div className="absolute right-2 inset-y-0 flex items-center gap-2">
                <span className="text-gray-500">@</span>
                <input
                  className="w-28 h-8 rounded bg-gray-100 px-2 text-sm"
                  value={form.emailDomain}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emailDomain: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              LinkedIn Profile
            </label>
            <input
              className="w-full h-10 rounded bg-gray-100 px-3 placeholder:text-gray-400"
              placeholder="https://linkedin.com/in/yourprofile"
              value={form.linkedin}
              onChange={(e) =>
                setForm((f) => ({ ...f, linkedin: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

    </div>
  );
}
