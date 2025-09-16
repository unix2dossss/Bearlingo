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

const Journal = () => {
    const [openFolder, setOpenFolder] = useState(false);
    const [openFile, setOpenFile] = useState(false);
    const [folders, setFolders] = useState([
        { name: "Reflections", image: PinkFolder, files: ["First Networking event!", "25/03/2025"] },
        { name: "Goals", image: YellowFolder, files: ["Major goals", "Refining goals"] },
        { name: "Notes", image: BlueFolder, files: ["Jobs to apply to", "{date}"] },
    ]);

    const addAddFile = () => {
        const folderName = prompt("Enter folder name"); // Simple prompt for folder name
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
                    {/* side navbar here */}
                    <div className="flex justify-center items-center">
                        <div className="relative w-3/4">
                            {/* Full monitor image */}
                            <img
                            src={MonitorImage}
                            alt="Monitor"
                            className="w-full h-auto"
                            />

                            <div className="absolute top-[9%] left-[5.25%] w-[88.85%] h-10 flex items-center px-4"
                                style={{ backgroundColor: 'rgba(67,109,133,0.30)' }}>
                                <img src={AddFolderImage} alt="icon" className="h-7 w-auto ml-1" />
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
                    <>
                        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
                            <div className="relative bg-base-100 mockup-window max-w-6xl w-[90%] h-[90%]"> {/*} border-base-300 */}
                                <div className="border border-stone-400">

                                    <button
                                        className="flex justify-center rounded-full absolute left-4 top-4 bg-red-600 btn-error w-[25px] h-[25px] "
                                        onClick={() => setOpenFolder(null)}
                                    >
                                        X
                                    </button>
                                </div>
                                <div className="flex flex-row h-full gap-0">
                                    <div className="w-[190px] bg-purple-400 h-full p-[8px]">
                                        <ul className="mt-4 flex flex-col gap-2">
                                            {openFolder.files.map((file, i) => (
                                                <button onClick={() => setOpenFile(file)}>
                                                    {console.log("Opened file: ", file)}
                                                    <li
                                                        key={i}
                                                        className="flex justify-center p-3 bg-purple-200 text-purple-800 hover:bg-gray-200 cursor-pointer"
                                                    >
                                                        {file}
                                                    </li>
                                                </button>

                                            ))}
                                            <li className="flex justify-center p-3 bg-purple-400 border border-white text-white hover:bg-white hover:text-purple-800 cursor-pointer">
                                                <button onClick={() => ""} >
                                                    + Add New File
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* Showing a file */}
                                    <div className="bg-purple-100 w-full">

                                        <h2 className="flex justify-center text-3xl text-purple-400 mt-5">Goal Setting</h2>
                                        <div className="flex flex-col ml-7">
                                            <p className="text-purple-400 text-sm mt-4">What makes a goal SMART?</p>
                                            <textarea placeholder="Type here" className="textarea textarea-neutral mt-2 w-96"></textarea>
                                            <button className="ml-80 btn-neutral btn-outline border border-gray-600 h-5 w-16 text-sm">Submit</button>
                                        </div>
                                        <p className="text-purple-400 text-sm ml-7 mt-4">Top three SMART goals for the upcoming fortnight</p>
                                        <textarea placeholder="Type here" className="textarea textarea-neutral ml-7 mt-2 w-96"></textarea>
                                        {openFile && (
                                            <>
                                                {console.log("IN OPEN FILE!!!")}

                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div >
        </>
    )
}

export default Journal
