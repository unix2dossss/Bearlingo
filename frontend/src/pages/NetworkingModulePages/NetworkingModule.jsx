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
    const [userInfo, setUserInfo] = useState(false);
    const [showSubtask, setShowSubtask] = useState(false);
    const [allEvents, setAllEvents] = useState("");
    const [userEvents, setUserEvents] = useState("");
    const [attendedEvents, setAttendedEvents] = useState([]);
    const [attended, setAttended] = useState(false);


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

    useEffect(() => {
        if (selectedSubtask === "subtask2") {
            const fetchEventsOfUser = async () => {
                try {
                    const res = await api.get("/users/me/networking/events", {
                        withCredentials: true,
                    });

                    setUserEvents(res.data.eventsToAttend); // <- update your state
                    toast.success("User events obtained successfully");
                    console.log("User events:", res.data.eventsToAttend);
                } catch (error) {
                    console.error("User events were not fetched", error);
                    toast.error("User events were not fetched");
                }
            };

            fetchEventsOfUser();
        }
    }, [selectedSubtask]);

    const handleAttendance = (eventId) => {

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
                        <h2>Attend an event and earn points!</h2>
                        <div className="border-4 border-yellow-500 rounded-3xl
                shadow-[0_0_20px_4px_rgba(236,72,153,0.6)] overflow-hidden">

                            <div className="carousel w-full p-5 space-x-4 bg-amber-100">
                                {Array.isArray(allEvents) &&
                                    allEvents.map((item, index) => (
                                        <div
                                            key={index}
                                            className="carousel-item w-[30%] min-w-[30%] max-w-[30%] bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 
                   rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 flex flex-col overflow-hidden group"
                                        >
                                            {/* Image / banner */}
                                            <div className="h-40 bg-gray-200 rounded-t-2xl flex items-center justify-center text-gray-500 font-bold text-lg">
                                                {item.type}
                                            </div>

                                            {/* Event content */}
                                            <div className="flex-1 flex flex-col p-4 gap-2 bg-base-100">
                                                <h2 className="text-xl font-bold text-purple-800 group-hover:text-purple-900 transition-colors duration-200">
                                                    {item.name}
                                                </h2>

                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                                                    <span className="badge badge-neutral">{item.type}</span>
                                                    <span className="badge badge-neutral">{item.costType}</span>
                                                </div>

                                                {/* Date / Time / Location */}
                                                <p className="text-gray-700 text-sm">📅 {item.date} · {item.time}</p>
                                                <p className="text-gray-600 text-sm">📍 {item.location}</p>

                                                {/* Description header */}
                                                <h3 className="mt-2 text-purple-700 font-semibold">Description</h3>

                                                {/* Scrollable description */}
                                                <div className="mt-1 flex-1 max-h-28 overflow-y-auto p-2 border border-pink-500 rounded-lg
                          shadow-[0_0_12px_2px_rgba(236,72,153,0.6)] 
                          scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-200 
                          hover:shadow-[0_0_20px_4px_rgba(236,72,153,0.8)] transition-shadow duration-300">
                                                    <p className="text-gray-700 text-sm">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {/* Buttons */}
                                                <div className="mt-auto pt-2 flex flex-col gap-2">
                                                    {/* View Event */}
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="btn btn-primary btn-sm w-full hover:scale-105 hover:shadow-lg transition-transform duration-200"
                                                    >
                                                        View Event
                                                    </a>

                                                    {/* Attendance button */}
                                                    <button
                                                        className={`btn btn-sm w-full transition-transform duration-200 
                ${attended ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' : 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-md'} 
                hover:scale-105`}
                                                        onClick={() => {
                                                            handleAttendance(item.id);
                                                        }}
                                                    >
                                                        {attended ? 'Locked In 🫡' : 'Going to Attend'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div >
                )}
            </div >
        </>
    )
}

export default NetworkingModule;
