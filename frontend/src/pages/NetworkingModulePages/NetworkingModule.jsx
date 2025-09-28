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
import NetworkingSubtask1 from "./NetworkingSubtask1";
import NetworkingSubtask2 from "./NetworkingSubtask2";

const NetworkingModule = () => {

    const [selectedSubtask, setSelectedSubtask] = useState(false);
    const [userInfo, setUserInfo] = useState(false);
    const [showSubtask, setShowSubtask] = useState(false);
    const [allEvents, setAllEvents] = useState("");
    const [userEvents, setUserEvents] = useState("");
    const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
    const [animationDone, setAnimationDone] = useState(false);
    const [university, setUniversity] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [careerGoal, setCareerGoal] = useState("");
    const [selectedHeadline, setSelectedHeadline] = useState(""); // default empty or ""
    const [customHeadline, setCustomHeadline] = useState(""); // default empty

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
        "What is your career goal?",
        "Congratulations! You have finished your linked in profile! Nice job 🔥"
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
                        Authorization: `Bearer ${userInfo?.token}`
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
        };

        useEffect(() => {
            if (currentSpeechIndex === 8) {
                submitLinkedInProfile();
            }
        }, [currentSpeechIndex]);




        const submitLinkedInProfile = async () => {
            try {

            } catch (error) {
                toast.error("Could not submit linked-inprofile")
            }

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


                {!showSubtask && (
                    <div className="relative z-10 flex-1 flex flex-col justify-end items-center pb-14">
                        <div className="flex space-x-48 mb-[80px]">
                            <button
                                className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                                onClick={() => { setSelectedSubtask("subtask1"); setShowSubtask(true); }}
                            >
                                Task 1
                            </button>
                            <button
                                className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                                onClick={() => { setSelectedSubtask("subtask2"); setShowSubtask(true); }}
                            >
                                Task 2
                            </button>
                            <button
                                className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                                onClick={() => { setSelectedSubtask("subtask3"); setShowSubtask(true); }}
                            >
                                Task 3
                            </button>
                        </div>
                    </div>
                )}

                {showSubtask && selectedSubtask === "subtask1" && (
                    <NetworkingSubtask1
                        userInfo={userInfo}
                        onBack={() => { setShowSubtask(false); setSelectedSubtask(false); }}
                    />
                )}

                {showSubtask && selectedSubtask === "subtask2" && (
                    <NetworkingSubtask2
                        userInfo={userInfo}
                        onBack={() => { setShowSubtask(false); setSelectedSubtask(false); }}
                    />
                )}

            </div >
        </>
    )
}

export default NetworkingModule;
