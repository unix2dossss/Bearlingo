import React from 'react';
import Navbar from '../components/Navbar';
import landPg from '../assets/Lp.svg';
import slide2 from '../assets/Slide2.svg';
import { Carousel } from "flowbite-react";

const Home = () => {
  // Set fixed heights for navbar and footer
  const navbarHeight = 80; // adjust to your Navbar height in px
  const footerHeight = 64; // adjust to your Footer height in px

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <div style={{ height: `${navbarHeight}px` }}>
        <Navbar />
      </div>

      {/* Carousel fills remaining space */}
      <div style={{ height: `calc(100vh - ${navbarHeight}px - ${footerHeight}px)` }}>
        <Carousel slideInterval={4000} className="h-full">
          {/* Slide 1 */}
          <div className="relative w-full h-full">
            <img
              src={landPg}
              alt="Job Seeking"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-left">
              <div className="text-left max-w-lg px-8 py-12 ml-20">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
                        Job Seeking, Made Fun
                     </h1>
                     <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-8">
                        Bearlingo turns the stress of job hunting into an adventure. Build skills, gain confidence, and land your dream job - one step at a time.
                    </p>
                    <button className="btn btn-primary btn-lg">
                        <a href="/register">Try BearLingo →</a>
                    </button>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative w-full h-full">
            <img
              src={slide2}
              alt="Slide 2"
              className="w-full h-full object-cover"
            />
          </div>
        </Carousel>
      </div>

      {/* Footer at bottom */}
      <div style={{ height: `${footerHeight}px` }}>
        <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 h-full">
          <p>Copyright © {new Date().getFullYear()} - All rights reserved by Debug Divas</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
