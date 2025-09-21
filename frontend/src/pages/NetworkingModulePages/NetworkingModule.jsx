import { React, useState } from 'react';
import TopNavbar from "../../components/TopNavbar";

const NetworkingModule = () => {

    const [selectedSubtask, setSelectedSubtask] = useState(false);
    const [showSubtask, setShowSubtask] = useState(false);

    const handleSubtaskClick = (task) => {
        setSelectedSubtask(task);
        setShowSubtask(true);
    };
    return (
        <>
            <div className="relative min-h-screen flex flex-col">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url("src/assets/CVFloor.svg")`
                    }}
                />
                <TopNavbar />

                <div className="relative z-10 flex-1 flex flex-col justify-end items-center pb-14">
                    {/* Main Workspace */}
                    <div className="flex space-x-48 mb-[51px]">
                        <button
                            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                            onClick={() => handleSubtaskClick("subtask1")}
                        >
                            Task 1
                        </button>
                        <button
                            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                            onClick={() => handleSubtaskClick("subtask2")}
                        >
                            Task 2
                        </button>
                        <button
                            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                            onClick={() => handleSubtaskClick("subtask3")}
                        >
                            Task 3
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NetworkingModule
