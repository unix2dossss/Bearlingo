import { React, useState, useEffect } from 'react';
import TopNavbar from "../../components/TopNavbar";
import Bear from "../../assets/Bear.svg";
import { ArrowLeftIcon } from "lucide-react";
import { gsap } from "gsap";
import { Link } from "react-router";
import api from "../../lib/axios";

const NetworkingModule = () => {

    const [selectedSubtask, setSelectedSubtask] = useState(false);
    const [showSubtask, setShowSubtask] = useState(false);

    const fetchAllEvents = async (e) => { }
    const fetchEventsOfUser = async (e) => {
        try {
            await api.get(
                "/users/me/networking/events",
                {
                    firstName,
                    lastName,
                    username,
                    email,
                    password,
                    confirmPassword,
                    linkedIn: linkedIn.trim() === "" ? undefined : linkedIn.trim()
                },
                {
                    withCredentials: true // Tells the browser to accept cookies from the backend and include them in future requests.
                }
            );
            toast.success("You registered sucessfully!");
            navigate("/login"); // This should navigate to login page
        } catch (error) {
            console.log("Error in registering", error);
            toast.error("Failed to register! Please try again");
        }
    }

    // Animate bear when Subtask 1 opens
    useEffect(() => {
        if (showSubtask && selectedSubtask === "subtask1") {
            const tl = gsap.timeline();
            tl.fromTo(
                ".bear",
                { y: -50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7 }
            );
            tl.to(".bear", { rotation: 50, yoyo: true, repeat: 2, duration: 0.5 });
            tl.from(".bear", { rotation: 50, yoyo: true, repeat: 2, duration: 0.5 });
            tl.to(".bear", { rotation: -50, yoyo: true, repeat: 2, duration: 0.5 });
            tl.from(".bear", { rotation: -50, yoyo: true, repeat: 2, duration: 0.5 });
            tl.to(".bear", { rotation: 50, yoyo: true, repeat: 2, duration: 0.5 });
        }
    }, [showSubtask, selectedSubtask]);

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

                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url("src/assets/Interview-Floor1.svg")`
                    }}
                />
                {/* Top Navbar */}
                <div className="fixed top-0 inset-x-0 z-[100]">
                    <TopNavbar />
                </div>


                {!showSubtask &&

                    <div className="relative z-10 flex-1 flex flex-col justify-end items-center pb-14">
                        {/* Main Workspace */}
                        <div className="flex space-x-48 mb-[80px]">
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
                            <div className="border border-red-500 mt-36"><img className="bear h-[700px] w-[700px]" src={Bear} alt=" Bear Mascot" /></div>
                        </div>
                        <div className="flex-1 border border-black">Questions</div>
                    </div>
                }

                {showSubtask && selectedSubtask == "subtask2" &&
                    <div className="bg-yellow-200 relative min-h-screen flex flex-row min-w-0  border border-red-500 gap-4 p-4">
                        <button className="btn btn-ghost mb-6" onClick={() => handleSubtaskClick(false)}>
                            <ArrowLeftIcon className="size-5" />
                            Back to subtasks
                        </button>
                        <div className="flex flex-1 border border-green-400">
                            <div className="border border-red-500 mt-36"><img className="bear h-[700px] w-[700px]" src={Bear} alt=" Bear Mascot" /></div>
                        </div>
                        <div className="flex-1 border border-black">Questions</div>
                    </div>
                }
            </div>
        </>
    )
}

export default NetworkingModule;
