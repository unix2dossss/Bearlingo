import React from 'react';
import Navbar from '../components/TopNavbar';
import ComputerFrame from '../assets/computer-screen.png';
import ComputerBackground from '../assets/pastel.jpg';
import { useState } from "react";
import { Modal, Button } from "daisyui";
import FolderImage from "../assets/folder.png";
import AddFolderImage from '../assets/add-folder.png';

const Journal = () => {
    const [openFolder, setOpenFolder] = useState(false);
    const [folders, setFolders] = useState([
        { name: "Reflections", files: ["entry1.txt", "entry2.txt"] },
        { name: "Goals", files: ["goals2025.txt", "career-plan.md"] },
        { name: "Notes", files: ["jobs-to-apply-to.pdf", "ideas.md"] },
    ]);

    const handleShowFiles = () => {
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
            <div className="bg-blue-200 min-h-screen  border border-blue-600">

                <div className="mx-auto w-fit mt-20 ml-96">
                    {/* Monitor */}
                    <div className="w-[900px] h-[500px] bg-gray-900 border-[15px] border-gray-700 rounded-xl shadow-2xl relative bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${ComputerBackground})` }}>

                        {/* Top nav bar */}
                        <div className="bg-slate-500/30 shadow-sm h-[50px] p-3 flex items-center">
                            <a className="text-white font-bold ml-[350px]">Welcome User...</a>
                        </div>

                        {/* Folders */}
                        <div className="flex flex-col items-end gap-2 ml-[750px] mt-[10px] mr-[10px] w-[100px] h-[318px] rounded-lg bg-rose-300 ">
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
                        </div>

                        {/* Files of a folder */}
                        {openFolder && (
                            <>
                                <div className="flex justify-center">
                                    <div className=" absolute top-14 left-3 w-[800px] h-[400px] mockup-window bg-base-100 border border-green-300"> {/*} border-base-300 */}

                                        <button
                                            className="flex justify-center border border-green-500 rounded-full absolute left-4 top-4 bg-red-600 btn-error w-[25px] h-[25px] "
                                            onClick={() => setOpenFolder(null)}
                                        >
                                            X
                                        </button>
                                        <ul className="mt-4 space-y-2">
                                            {openFolder.files.map((file, i) => (
                                                <li
                                                    key={i}
                                                    className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                                                >
                                                    {file}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>





                            </>
                        )}



                    </div>


                    {/*<div className="w-16 h-10 bg-gray-700 mx-auto rounded-b-full"></div>*/}
                    <div className="w-56 h-[70px] bg-gray-700 mx-auto"></div>


                    {/* Base */}
                    <div className="w-96 h-[50px] bg-gray-700 mx-auto rounded-full shadow-inner"></div>

                    {/* Extra Shadow for Depth */}
                    <div className="w-64 h-2 bg-gray-900 mx-auto rounded-full blur-sm opacity-50"></div>
                </div >




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
