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
    const [tempButtonChange, setTempButtonChange] = useState()
    const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
    const [waitingForInput, setWaitingForInput] = useState(false);
    const [animationDone, setAnimationDone] = useState(false);
    const [headline, setHeadline] = useState("");
    const [customHeadline, setCustomHeadline] = useState(""); // value typed in the input
    const [university, setUniversity] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);

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



    const speechForSubtask1 = [
        "Hi there! 👋",
        "Welcome to the first subtask of the Networking Module!",
        "This will only take a few minutes - you'll create a simple LinkedIn profile like this one.",
        "Complete this task to earn XPs and advance your career!",
        "Choose one of the suggested headlines or create your own.",
        "Which university are you attending?",
        "Select top four skills that apply — both technical and soft skills.",
        "What is your career goal?"
    ];

    const allSkills = [
        "Python", "Java", "C++", "JavaScript", "React", "Node.js",
        "SQL", "Git", "Linux", "AWS", "Docker", "Machine Learning",
        "Communication", "Teamwork", "Problem Solving", "Adaptability"
    ];

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
        if (showSubtask && selectedSubtask === "subtask2") {
            const fetchEventsOfUser = async () => {
                try {
                    const res = await api.get("/users/me/networking/events", {
                        withCredentials: true,
                    });

                    setUserEvents(res.data.eventsToAttend); // <- update your state
                    toast.success("User events obtained successfully");
                    console.log("User events:", res.data.eventsToAttend);
                    console.log("userEvents usesState: ", userEvents);
                } catch (error) {
                    console.error("User events were not fetched", error);
                    toast.error("User events were not fetched");
                }
            };

            fetchEventsOfUser();
        }
    }, [selectedSubtask]);

    useEffect(() => {
        if (showSubtask && selectedSubtask === "subtask2") {
            fetchAllEvents();
        }
    }, [showSubtask, selectedSubtask]);

    // Animate bear when Subtask 1 opens
    useEffect(() => {
        if (showSubtask && selectedSubtask === "subtask1") {
            const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" }, onComplete: () => setAnimationDone(true) });

            // 1. Scale up from tiny and rotate while fading in
            tl.fromTo(
                ".bear",
                { scale: 0, rotation: -180, opacity: 0, x: -200, y: -100 },
                { scale: 1, rotation: 0, opacity: 1, x: 0, y: 0, duration: 1.2 }
            );

            // 2. Bounce slightly with a yoyo effect
            tl.to(".bear", { y: -30, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.inOut" });

        }
    }, [showSubtask, selectedSubtask]);


    useEffect(() => {
        if (animationDone) {
            gsap.fromTo(
                ".bear-speech",
                { opacity: 0, y: 50, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
            );
        }
    }, [currentSpeechIndex, animationDone]);

    const handleSubtaskClick = (task) => {
        setSelectedSubtask(task);
        if (task == false) {
            setShowSubtask(false);
        }
        else {
            setShowSubtask(true);
        }
    };


    const handleNext = () => {
        if (currentSpeechIndex < speechForSubtask1.length - 1) {
            setCurrentSpeechIndex(currentSpeechIndex + 1);
        }
    };


    const handleSkillChange = (e) => {
        const value = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setSelectedSkills(value);
    };

    // Safely extract attendingEventIds for easier use, ? ensures that if userEvents[0] is null the program won't crash
    const attendingEventIds = userEvents[0]?.attendingEventIds || [];

    // Helper function to get the status of a specific event
    const getEventStatus = (eventId) => {
        return attendingEventIds.find(ev => ev.eventId === eventId)?.status || null;
    };

    const handleAttendance = async (eventId, buttonState) => {
        if (buttonState == 'going') {
            try {
                const res = await api.put("/users/me/networking/events", {
                    attendingEventIds: [{
                        eventId: eventId,
                        status: "attended"
                    }]
                },
                    {
                        withCredentials: true,
                    });

                // Update frontend state immediately by checking its previous / cuurent state hence (prev - the current userEvents state at the moment this update runs)
                setUserEvents((prev) => {
                    // If the user has no events then create a new Event object
                    if (!prev[0]) return [{ attendingEventIds: [{ eventId, status: "attended" }] }];
                    // Creates a shallow copy of the first object in prev.
                    const updated = { ...prev[0] };
                    // Searches in attendingEventIds array to see if this event already exists in the state. Returns index of -1 if teh event does not already exist
                    const idx = updated.attendingEventIds.findIndex((ev) => ev.eventId === eventId);
                    if (idx !== -1) {
                        updated.attendingEventIds[idx].status = "attended";
                    } else {
                        updated.attendingEventIds.push({ eventId, status: "attended" });
                    }
                    // Returns a new array with the updated object which updates userEvents state and  triggers a re-render of the component
                    return [updated];
                });

            } catch (error) {
                console.log("Error in updating events: ", events);
                toast.error("Events were not updated");
            }
        }
        else if (buttonState == 'default') {
            try {
                const res = await api.put("/users/me/networking/events", {
                    attendingEventIds: [{
                        eventId: eventId,
                        status: "going"
                    }]
                },
                    {
                        withCredentials: true,
                    });

                setUserEvents((prev) => {

                    if (!prev[0]) return [{ attendingEventIds: [{ eventId, status: "going" }] }];
                    const updated = { ...prev[0] };
                    const idx = updated.attendingEventIds.findIndex((ev) => ev.eventId === eventId);
                    if (idx !== -1) {
                        updated.attendingEventIds[idx].status = "going";
                    } else {
                        updated.attendingEventIds.push({ eventId, status: "going" });
                    }
                    return [updated];
                });

            } catch (error) {
                console.log("Error in updating events: ", events);
                toast.error("Events were not updated");
            }
        }

    }

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

                            <div className="border border-red-500 mt-20">
                                {animationDone &&
                                    <div key={currentSpeechIndex} // ensures React replaces the bubble so GSAP can animate it.
                                        className="chat chat-start opacity-0 translate-y-4 bear-speech flex justify-center">
                                        <div className="chat-bubble">
                                            {speechForSubtask1[currentSpeechIndex]}
                                        </div>
                                    </div>}


                                {/* "Next" button */}
                                {animationDone && (
                                    <button
                                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-lg"
                                        onClick={handleNext}
                                        disabled={currentSpeechIndex === speechForSubtask1.length - 1}
                                    >
                                        Next
                                    </button>
                                )}
                                <img className="bear h-[700px] w-[700px]" src={Bear} alt=" Bear Mascot" />
                            </div>
                        </div>
                        <div className="flex-1 border border-black">
                            Questions
                            {currentSpeechIndex == 2 &&
                                <div className="flex justify-center mt-32">
                                    <div className="card bg-base-100 w-96 shadow-sm">

                                        <div className="card w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden">
                                            <div className="card-body space-y-6">
                                                {/* Profile Info */}
                                                <div className="flex flex-col items-center text-center border-b border-gray-200 pb-4">
                                                    <h1 className="text-2xl font-bold text-gray-900">John Smith</h1>
                                                    <p className="text-gray-600 mt-1">Manager at Xero | CEO of Meta</p>
                                                    <p className="text-gray-500 mt-2 text-sm">University of Auckland</p>
                                                </div>

                                                {/* Key Skills */}
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Key Skills</h2>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="badge badge-outline">Python</span>
                                                        <span className="badge badge-outline">Java</span>
                                                        <span className="badge badge-outline">React</span>
                                                        <span className="badge badge-outline">Leadership</span>
                                                    </div>
                                                </div>

                                                {/* Career Goals */}
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Career Goals</h2>
                                                    <p className="text-gray-600 text-sm">
                                                        Interested in developing innovative software solutions and leading tech teams in the fintech industry.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }


                            {currentSpeechIndex == 4 &&
                                <div className="border border-red-500  flex flex-col items-center justify-center gap-10 mt-[30%] h-[40%]">
                                    <select defaultValue="Pick a headline"
                                        value={headline} // controlled component
                                        onChange={(e) => setSelectedHeadline(e.target.value)} // update state when user selects
                                        className="select w-[70%]">
                                        <option disabled={true}>Pick a headline</option>
                                        <option>Aspiring Software Engineer | Computer Science Student</option>
                                        <option>Computer Science Undergraduate | Passionate About AI & Machine Learning</option>
                                        <option>Future Full-Stack Developer | Tech Enthusiast</option>
                                        <option>CS Student | Exploring Cloud Computing & DevOps</option>
                                        <option>Software Developer in Training | Problem Solver & Innovator</option>
                                        <option>Tech Student | Building Projects in Web & Mobile Development</option>
                                        <option>Computer Science Enthusiast | Passionate About Data Science</option>
                                        <option>CS Student | Interested in Cybersecurity & Ethical Hacking</option>
                                    </select>
                                    <div className="flex flex-row gap-1">
                                        <input
                                            type="text"
                                            placeholder="Enter headline here"
                                            className="input w-[90%]"
                                            value={customHeadline}
                                            onChange={(e) => setCustomHeadline(e.target.value)}
                                        />
                                        <button className="btn"
                                            onClick={() => {
                                                if (customHeadline.trim() !== "") {
                                                    setHeadline(customHeadline); // update headline with input value
                                                    setCustomHeadline(""); //  clear input
                                                    toast.success("Headline saved!");
                                                }
                                            }} >Enter</button>
                                    </div>
                                </div>
                            }


                            {currentSpeechIndex == 5 &&
                                <div className="flex justify-center mt-[50%]">
                                    <div className="flex flex-row gap-1">
                                        <input
                                            type="text"
                                            placeholder="Enter university here"
                                            className="input w-3/4 text-xl px-4 py-2"
                                            value={university}
                                            onChange={(e) => setUniversity(e.target.value)}
                                        />
                                        <button className="btn"
                                            onClick={() => {
                                                if (university.trim() !== "") {
                                                    setUniversity(customHeadline); // update headline with input value
                                                    toast.success("Unversity saved!");
                                                }
                                            }} >Submit</button>
                                    </div>
                                </div>
                            }


                            {currentSpeechIndex == 6 &&
                                <div className="flex flex-col items-center gap-2 border border-red-500">
                                    <label className="font-semibold">Select Your Skills</label>
                                    <select
                                        multiple
                                        className="select border p-2 w-[70%] h-40"
                                        value={selectedSkills}
                                        onChange={handleSkillChange}
                                    >
                                        {allSkills.map((skill, idx) => (
                                            <option key={idx} value={skill}>
                                                {skill}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-2">Selected Skills: {selectedSkills.join(", ")}</p>
                                </div>}
                        </div>

                    </div>
                }

                {showSubtask && selectedSubtask === "subtask2" && (
                    <div className="bg-yellow-200 relative min-h-screen flex flex-col min-w-0 border border-red-500 gap-4 p-4 mt-2">
                        <div>
                            <button className="btn btn-ghost mb-2 " onClick={() => handleSubtaskClick(false)}>
                                <ArrowLeftIcon className="size-5" />
                                Back to subtasks
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-black-800 mb-4">
                            🎉 Join an Event & Earn Points!
                            Participate, learn, and get rewarded for attending events!
                        </h2>
                        <div className="border-4 border-yellow-500 rounded-3xl
                shadow-[0_0_20px_4px_rgba(236,72,153,0.6)] overflow-hidden">

                            <div className="carousel w-full p-5 space-x-4 bg-amber-100">
                                {Array.isArray(allEvents) &&
                                    allEvents.map((item, index) => (
                                        <div
                                            key={index}
                                            className="carousel-item w-[30%] min-w-[30%] max-w-[30%] bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 flex flex-col overflow-hidden group"
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
                                                <div className="mt-1 flex-1 max-h-28 overflow-y-auto p-2 border border-pink-500 rounded-lg shadow-[0_0_12px_2px_rgba(236,72,153,0.6)] scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-200 hover:shadow-[0_0_20px_4px_rgba(236,72,153,0.8)] transition-shadow duration-300">
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
                                                        className={`btn btn-sm w-full transition-transform duration-200 ${getEventStatus(item.id) === 'going' ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' : getEventStatus(item.id) == 'attended' ? 'bg-blue-400 hover:bg-blue-700 text-white shadow-lg opacity-50 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-md'} hover:scale-105`}
                                                        onClick={() => {
                                                            getEventStatus(item.id) === 'going' ? handleAttendance(item.id, 'going') : handleAttendance(item.id, 'default');
                                                        }} // Have a popup to confirm that the user wants to attend or is planning to attend
                                                        disabled={getEventStatus(item.id) === 'attended'}
                                                    >
                                                        {getEventStatus(item.id) === 'attended'
                                                            ? 'Attended ✅'
                                                            : getEventStatus(item.id) === 'going'
                                                                ? 'Locked In 🫡'
                                                                : 'Going to Attend'}
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
