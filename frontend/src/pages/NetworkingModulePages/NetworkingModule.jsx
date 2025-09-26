import { React, useState, useEffect } from 'react';
import TopNavbar from "../../components/TopNavbar";
import Bear from "../../assets/Bear.svg";
import { ArrowLeftIcon } from "lucide-react";
import { gsap } from "gsap";
import { Link } from "react-router";
import api from "../../lib/axios";
import toast from 'react-hot-toast';
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";

const NetworkingModule = () => {

    const [selectedSubtask, setSelectedSubtask] = useState(false);
    const [showSubtask, setShowSubtask] = useState(false);
    const [allEvents, setAllEvents] = useState("");
    const [userInfo, setUserInfo] = useState("");
    const navigate = useNavigate();

    const user = useUserStore((state) => state.user);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                await useUserStore.getState().fetchUser();
            }

            const currentUser = useUserStore.getState().user;
            if (!currentUser) {
                navigate("/login"); // redirect if still not logged in
            } else {
                setUserInfo(currentUser);
                console.log(currentUser);
            }
        };
        fetchUserData();
    }, [navigate]);

    const fetchAllEvents = async (e) => {
        try {
            const events = await api.get(
                "/users/me/networking/all-events",
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${userInfo?.token}` // or Sending token back to backend CHECK ON THE BACKEND CONNECTION
                    }
                }
            );
            toast.success("Events obtained sucessfully!");
            const eventsOnly = events.data.allEventsFromBackend;
            console.log(eventsOnly);
            setAllEvents(eventsOnly);

        } catch (error) {
            console.log("Error in obtaining events", error);
            toast.error("Error in obtaining events");
        }
    };
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

    useEffect(() => {
        if (showSubtask && selectedSubtask === "subtask2") {
            fetchAllEvents(); // ✅ only runs when condition is true
        }
    }, [showSubtask, selectedSubtask]);

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
                <div className="relative z-10">
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

                {showSubtask && selectedSubtask === "subtask2" && (
                    <div className="bg-yellow-200 relative min-h-screen flex flex-col min-w-0 border border-red-500 gap-4 p-4">
                        <button className="btn btn-ghost mb-6" onClick={() => handleSubtaskClick(false)}>
                            <ArrowLeftIcon className="size-5" />
                            Back to subtasks
                        </button>

                        <div className="flex flex-wrap gap-2 min-h-screen overflow-y-auto border border-green-400 p-2">
                            {Array.isArray(allEvents) &&
                                allEvents.map((item, index) => (
                                    <div key={index} className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-200 p-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Optional image placeholder */}
                                            <div className="flex-shrink-0 w-full md:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                Event
                                            </div>

                                            {/* Event details */}
                                            <div className="flex-1 flex flex-col gap-2">
                                                <h2 className="text-xl font-bold">{item.name}</h2>
                                                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                                    <span className="badge badge-outline">{item.type}</span>
                                                    <span className="badge badge-outline">{item.costType}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm">{item.date} · {item.time}</p>
                                                <p className="text-gray-600 text-sm">{item.location}</p>
                                                <p className="mt-2 text-gray-700 text-sm line-clamp-4">{item.description}</p>
                                                <div className="mt-auto pt-2">
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        View Event
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default NetworkingModule;
