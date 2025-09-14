import React from 'react';
import Navbar from '../components/TopNavbar';
import ComputerFrame from '../assets/computer-screen.png';
import ComputerBackground from '../assets/pastel.jpg';

const Journal = () => {
    return (
        <>
            <Navbar />
            <div className="bg-blue-200 min-h-screen  border border-blue-600">

                <div className="mx-auto w-fit mt-20 ml-96">
                    {/* Monitor */}
                    <div className="w-[900px] h-[500px] bg-gray-900 border-8 border-gray-700 rounded-xl shadow-2xl relative bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${ComputerBackground})` }}>

                    </div>


                    {/*<div className="w-16 h-10 bg-gray-700 mx-auto rounded-b-full"></div>*/}
                    <div className="w-56 h-[70px] bg-gray-700 mx-auto"></div>


                    {/* Base */}
                    <div className="w-96 h-[50px] bg-gray-700 mx-auto rounded-full shadow-inner"></div>

                    {/* Extra Shadow for Depth */}
                    <div className="w-64 h-2 bg-gray-900 mx-auto rounded-full blur-sm opacity-50"></div>
                </div >
                <div className="flex justify-center border border-red-500">
                    <div className="mockup-window bg-base-100 border w-[1000px] h-[600px] border-green-300 ml-32 mt-32"> {/*} border-base-300 */}
                        <div className="grid place-content-center h-80">Hello!</div>
                    </div>
                </div>



                <div className="mockup-window border bg-base-300">
                    <div className="flex justify-center bg-base-200 p-6">
                        <h1 className="text-2xl font-bold">Your React Component</h1>
                        <p>This content looks like it’s inside a computer window.</p>
                    </div>
                </div>

                <div className="relative w-[1000px] mx-auto">
                    {/* Laptop Frame Image */}
                    <img
                        src={ComputerFrame}
                        alt="Computer Frame"
                        className="w-full h-auto"
                    />
                </div>

            </div >




        </>
    )
}

export default Journal
