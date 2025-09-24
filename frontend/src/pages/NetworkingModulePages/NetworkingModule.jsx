import { React, useState } from 'react';
import TopNavbar from "../../components/TopNavbar";
import Bear from "../../assets/Bear.svg";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router";

const NetworkingModule = () => {

    const [selectedSubtask, setSelectedSubtask] = useState(false);
    const [showSubtask, setShowSubtask] = useState(false);

    const handleSubtaskClick = (task) => {
        setSelectedSubtask(task);
        if (task == false) {
            setShowSubtask(false);
        }
        else {
            setShowSubtask(true);
        }

    };

    // Render the selected subtask
    const renderSubtask = () => {
        switch (selectedSubtask) {
            case "subtask1":
                return (
                    <NetworkingSubtask1
                        task={selectedSubtask}
                        isSubmitted={isSubmitted}
                        setIsSubmitted={setIsSubmitted}
                        onClose={handleClose}
                        onTaskComplete={() => setTask1Complete(true)}
                    />
                );
            case "subtask2":
                return (
                    <NetworkingSubtask2
                        isSubmitted={isSubmitted}
                        setIsSubmitted={setIsSubmitted}
                        onClose={handleClose}
                        onTaskComplete={() => setTask2Complete(true)}
                    />
                );
            case "subtask3":
                return <NetworkingSubtask3
                    onClose={handleClose}
                    setIsSubmitted={setIsSubmitted}
                    onTaskComplete={() => setTask3Complete(true)}
                />;
            default:
                return null;
        }
    };
    return (
        <>
            <div className="relative min-h-screen flex flex-col">
                {/* Background
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url("src/assets/CVFloor.svg")`
                    }}
                />
                 */}
                {/* Top Navbar */}
                <div className="relative z-10">
                    <TopNavbar />
                </div>


                {!showSubtask &&

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
                }

                {showSubtask && selectedSubtask == "subtask1" &&
                    <div className="bg-yellow-200 relative min-h-screen flex flex-row min-w-0  border border-red-500 gap-4 p-4">
                        <button className="btn btn-ghost mb-6" onClick={() => handleSubtaskClick(false)}>
                            <ArrowLeftIcon className="size-5" />
                            Back to subtasks
                        </button>
                        <div className="flex flex-1 border border-green-400">
                            <div className="border border-red-500 mt-36"><img className="h-[700px] w-[700px]" src={Bear} alt=" Bear Mascot" /></div>
                        </div>
                        <div className="flex-1 border border-black">Questions</div>
                    </div>
                }
            </div>
        </>
    )
}

export default NetworkingModule;
