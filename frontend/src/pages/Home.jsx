import React from 'react'
import Navbar from '../components/Navbar'
import toast from "react-hot-toast";

const Home = () => {
    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center">
                <button onClick={() => toast.success("yay toast works - frontend branch")} className="btn btn-outline border-red-400">Click me</button>
            </div>
            <div className="min-h-screen text-white">
                HI FROM HOME
            </div>
        </>
    )
}

export default Home
