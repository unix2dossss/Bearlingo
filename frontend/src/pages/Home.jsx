import React from 'react'
import Navbar from '../components/Navbar'
import toast from "react-hot-toast";
import landPg from '../assets/Lp.svg';
import slide2 from '../assets/Slide2.svg';
import { Carousel } from "flowbite-react";



const Home = () => {
    return (
        <>
            <Navbar />

            <div className="w-full">
                <Carousel slideInterval={4000}>
                    {/* Slide 1 */}
                    <div className="absolute w-full h-[700px]">
                        <img
                            src={landPg}
                            alt="Job Seeking"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-3 flex items-center justify-start">
                                <div className="text-left max-w-lg px-8 py-12">
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
                    <div className="relative w-full h-[700px]">
                        <img
                            src={slide2}
                            className="w-full h-full object-cover" />

                    </div>

                </Carousel >
                <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
                    <aside>
                        <p>Copyright © {new Date().getFullYear()} - All right reserved by Debug Divas</p>
                    </aside>
                </footer>
            </div >
        </>
    )
}

export default Home
