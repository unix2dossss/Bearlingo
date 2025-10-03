import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../lib/axios";

const CookieConsent = () => {
  const [visible, setVisible] = useState(true);
  const location = useLocation();
// const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    const checkJWT = async () => {
        // console.log(visible);
      try {
        const res = await api.get("/users/check-jwt", { withCredentials: true });
        // JWT cookie sent successfully → browser allows third-party cookies
        if (res.authorized){
          setVisible(false);
        } else {
          setVisible(true);
        }
      } catch (error) {
        // if (error.response && error.response.status === 401) {
        //   // JWT missing → probably blocked
        //   setVisible(true);
        // } else {
        //   console.error("Error checking JWT:", error);
        // }
        console.error("Error checking JWT:", error);
      }
    };

    checkJWT();
  }, [location]);

  // If browser allows third-party cookies, don't show the cookie consent
  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Enable Third-Party Cookies</h2>
        <p className="text-gray-700 text-sm">
          To fully use this site, please enable third-party cookies in your browser. This is
          required to store your session (JWT) securely.
        </p>

        {/* Instructions stay the same */}
        <div className="text-gray-700 text-sm">
          <p>Instructions:</p>
          <ul className="list-disc list-inside mt-1">
            <li>
              <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
              → Allow all cookies
            </li>
            <li>
              <strong>Firefox:</strong> Preferences → Privacy & Security → Cookies → Standard or
              Custom → Allow cookies
            </li>
            <li>
              <strong>Safari:</strong> Preferences → Privacy → Uncheck “Prevent cross-site tracking”
            </li>
          </ul>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
