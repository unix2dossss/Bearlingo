import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/axios";

const CookieConsent = () => {
  const [visible, setVisible] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkJWT = async () => {
      try {
        const res = await api.get("/users/check-jwt", { withCredentials: true });
        if (res.authorized) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      } catch (error) {
        console.error("Error checking JWT:", error);
      }
    };
    checkJWT();
  }, [location]);

  if (!visible) return null;

  const handleClose = () => setVisible(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ×
        </button>

        {/* Cookie icon */}
        <div className="flex items-center justify-center mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1047/1047711.png"
            alt="cookie icon"
            className="w-12 h-12"
          />
        </div>

        {/* Title & Message */}
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Cookie Consent</h2>
        <p className="text-center text-gray-700 text-sm mb-3">
          This site uses third-party cookies to authenticate and maintain a secure login experience.
        </p>

        {/* Toggle instructions */}
        <p
          className="text-blue-600 text-sm text-center cursor-pointer hover:underline"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? "Hide browser instructions" : "See instructions to enable cookies"}
        </p>

        {/* Instructions (toggleable, cute style) */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showInstructions ? "max-h-[600px] mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <p className="text-gray-800 text-sm mb-2 font-medium">
              Follow these steps to enable cookies for your browser:
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              {/* Chrome */}
              <li className="flex items-start gap-2">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg"
                  alt="Chrome"
                  className="w-5 h-5 mt-0.5"
                />

                <span>
                  <strong>Chrome:</strong> Settings → Privacy and security → Third-party cookies →
                  Select <em>Allow third-party cookies</em> (or <em>Allow all cookies</em>
                  ).
                </span>
              </li>

              {/* Safari */}
              <li className="flex items-start gap-2">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/safari/safari-original.svg"
                  alt="Safari"
                  className="w-5 h-5 mt-0.5"
                />
                <span>
                  <strong>Safari:</strong> Safari (menu bar) → Settings... (or Preferences...) →
                  <em>Privacy</em> tab → Uncheck “Prevent cross-site tracking” AND make sure “Block
                  all cookies” is unchecked.
                </span>
              </li>

              {/* FireFox */}
              <li className="flex items-start gap-2">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg"
                  alt="Firefox"
                  className="w-5 h-5 mt-0.5"
                />
                <span>
                  <strong>Firefox:</strong> Menu (three lines) → Settings → Privacy &amp; Security →
                  Under <em>Enhanced Tracking Protection</em>, select <em>Standard</em> OR choose{" "}
                  <em>Custom</em> and uncheck the box next to <em>Cookies</em>.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
