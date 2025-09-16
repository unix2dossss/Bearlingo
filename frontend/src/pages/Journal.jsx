import React from 'react';
import Navbar from '../components/TopNavbar';
import ComputerFrame from '../assets/computer-screen.png';
import MonitorImage from '../assets/journal-monitor.svg';
import { useState } from "react";
import { Modal, Button } from "daisyui";
import YellowFolder from "../assets/folder-yellow.svg";
import PinkFolder from "../assets/folder-pink.svg";
import BlueFolder from "../assets/folder-blue.svg";
import AddFolderImage from '../assets/add-folder-icon.svg';
import api from "../lib/axios";

const Journal = () => {
    const [openFolder, setOpenFolder] = useState(false);
    const [openFile, setOpenFile] = useState(false);
    const [folders, setFolders] = useState([
        { name: "Reflections", image: PinkFolder, files: ["First Networking event!", "25/03/2025"] },
        { name: "Goals", image: YellowFolder, files: ["Major goals", "Refining goals"] },
        { name: "Notes", image: BlueFolder, files: ["Jobs to apply to", "{date}"] },
    ]);

    const addAddFile = () => {
        const folderName = prompt("Enter folder name");
        return (
            <div className="mockup-window border bg-base-300">
                <div className="flex justify-center bg-base-200 p-6">
                    <h1 className="text-2xl font-bold">Your React Component</h1>
                    <p>This content looks like it’s inside a computer window.</p>
                </div>
            </div>
        );

    };
    return (
        <>
            <Navbar />
            <div className="bg-blue-200 min-h-screen border">
                <div className="flex justify-center items-center h-[calc(100vh-65px)]">
                    {/* side navbar will come here */}
                    <div className="flex justify-center items-center">
                        <div className="relative w-3/4">
                            {/* Monitor here */}
                            <img
                                src={MonitorImage}
                                alt="Monitor"
                                className="w-full h-auto"
                            />

                            <div className="absolute top-[9%] left-[5.25%] w-[88.85%] h-10 flex items-center px-4"
                                style={{ backgroundColor: 'rgba(67,109,133,0.30)' }}>
                                <img src={AddFolderImage} alt="icon" className="h-7 w-auto ml-1" />
                                {/*<p className="text-white font-bold">Its Goal Setting Time User!</p>*/}
                            </div>

                            <div className="absolute top-[20%] right-[9%] flex flex-col items-center gap-8">
                                {folders.map((folder, index) => (
                                    <div key={index} className="flex flex-col items-center cursor-pointer">
                                        <button onClick={() => setOpenFolder(folder)}>
                                            <img
                                                src={folder.image}
                                                alt={folder.name}
                                                className="w-16 h-auto"
                                            />
                                        </button>
                                        <span className="text-black text-sm mt-1">{folder.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div >

                {openFolder && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
                        <div className="relative bg-white max-w-6xl w-[90%] h-[85%] rounded-2xl shadow-xl overflow-hidden flex flex-col">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                {/* dots */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setOpenFolder(null)}
                                        className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-gray text-xs"
                                        aria-label="Close"
                                    >
                                        X
                                    </button>
                                    <div className="w-4 h-4 rounded-full bg-yellow-400" />
                                    <div className="w-4 h-4 rounded-full bg-green-500" />
                                </div>

                                {/* Title - Folder */}
                                <h2 className="text-xl md:text-2xl font-bold text-purple-600 text-center flex-1">
                                    {openFolder.name}
                                </h2>
                                <div className="w-10"></div>
                            </div>

                            {/* Main thing */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* sidebar thingy with buttons */}
                                <div className="w-[20%] bg-purple-400 p-4 flex flex-col gap-3 overflow-y-auto">
                                    {openFolder.files.map((file, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setOpenFile(file)}
                                            className="flex justify-center px-3 py-5 bg-purple-300 text-purple-800 rounded-xl hover:bg-purple-200 transition-colors cursor-pointer border border-gray-400"
                                        >
                                            {file}
                                        </button>
                                    ))}
                                    <button className="flex justify-center px-3 py-5 bg-purple-400 text-white rounded-xl hover:bg-purple-500 transition-colors border border-white">
                                        + Add New File
                                    </button>
                                </div>

                                {/* actual file content + typing area */}
                                <div className="flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col justify-between">
                                    <h3 className="text-purple-600 text-3xl font-semibold mb-6 text-center">Goal Setting</h3>
                                    <p className="text-purple-700 mb-2">What makes a goal SMART?</p>
                                    <textarea
                                        placeholder="Type here"
                                        className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mb-4"
                                    />
                                    <p className="text-purple-700 mt-6 mb-2">Top three SMART goals for the upcoming fortnight</p>
                                    <textarea
                                        placeholder="Type here"
                                        className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </>
    )
}

export default Journal
