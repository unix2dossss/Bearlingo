import door from '../../assets/Opendoor.svg';
import TopNavbar from '../../components/TopNavbar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const FirstTimePg3 = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = null;
    const duration = 3000; // 3 seconds

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const percentage = Math.min((elapsed / duration) * 100, 100);

      setProgress(percentage);

      if (percentage < 100) {
        requestAnimationFrame(animate);
      } else {
        navigate('/CvModule'); // 👈 redirect
      }
    };

    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame); // cleanup
  }, [navigate]);

  return (
    <div className="relative w-full h-screen bg-[#D0EAFB]">
        <TopNavbar />
      {/* Background image */}
{/* Background image behind everything */}
      <img
        src={door}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Progress bar */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3/4 max-w-xl h-4 bg-gray-300 rounded-full overflow-hidden shadow-md">
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading text */}
    <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-700 font-semibold">
        Loading...
      </p>
    </div>
  )
};


export default FirstTimePg3