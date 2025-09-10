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
                    <div className="relative w-full h-[800px]">
                        <img
                            src={landPg}
                            alt="Job Seeking"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-start">
                            <div className="absolute inset-0 flex items-center">
                                <div className="text-left max-w-lg px-8 py-12">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
                                        Job Seeking, Made Fun
                                    </h1>
                                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-8">
                                        Bearlingo turns the stress of job hunting into an adventure. Build skills, gain confidence, and land your dream job - one step at a time.
                                    </p>
                                    <button className="btn btn-primary btn-lg">
                                        Try BearLingo →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Slide 2 */}
                    <div className="relative w-full h-[800px]">
                        <img
                            src={slide2}
                            className="w-full h-full object-cover" />

                    </div>

                </Carousel >
            </div >
        </>
    )
}

export default Home
