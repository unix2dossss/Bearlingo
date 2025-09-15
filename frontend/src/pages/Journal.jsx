import React from 'react';
import Navbar from '../components/TopNavbar';
import ComputerFrame from '../assets/computer-screen.png';
import MonitorImage from '../assets/journal-monitor.svg';
import { useState } from "react";
import { Modal, Button } from "daisyui";
import YellowFolder from "../assets/folder-yellow.svg";
import PinkFolder from "../assets/folder-pink.svg";
import BlueFolder from "../assets/folder-blue.svg";
import AddFolderImage from '../assets/add-folder.png';

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
                <div className="flex justify-end items-end pr-12 h-[calc(100vh-65px)]">
                    {/* Monitor */}
                    <div>
                        {/* <div classname="relative w-2/3 h-full flex items-center justify-center">
                            <img
                                src={MonitorImage}
                                alt="Monitor"
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                        </div> */}

                        <div className="relative w-full w-3/4 ml-auto">
                            {/* Full monitor image */}
                            <img
                            src={MonitorImage}
                            alt="Monitor"
                            className="w-full h-auto"
                            />

                            <div className="absolute top-[9%] left-[5.25%] w-[88.85%] h-10 bg-black/30"></div>

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
                        

                        {/* Top nav bar */}
                        {/* <div className="bg-slate-500/30 shadow-sm h-[50px] p-3 flex items-center justify-center">
                            <a className="text-white font-bold">Its Goal Setting Time User!</a>
                        </div> */}

                        {/* Folders */}
                        {/* <div className="flex flex-col items-end gap-2 ml-[750px] mt-[10px] mr-[10px] w-[100px] h-[318px] rounded-lg bg-rose-300 ">
                            {folders.map((folder, index) => (
                                <div
                                    key={index}
                                    className="w-16 h-16 flex flex-col items-center m-4 cursor-pointer"
                                >
                                    <button onClick={() => setOpenFolder(folder)}>
                                        {console.log("folder: ", folder)}
                                        <img
                                            src={FolderImage}
                                            alt="Folder"
                                            className="w-12 h-12 flex justify-center"
                                        />
                                    </button>
                                    <span className="text-white text-sm mt-1">{folder.name}</span>
                                </div>
                            ))}
                        </div> */}

                        {/* Files of a folder */}
                    </div>

                    {/*<div className="w-16 h-10 bg-gray-700 mx-auto rounded-b-full"></div>*/}
                    {/* <div className="w-56 h-[70px] bg-gray-700 mx-auto"></div> */}
                </div >
            </div >

        </>
    )
}

export default Journal
