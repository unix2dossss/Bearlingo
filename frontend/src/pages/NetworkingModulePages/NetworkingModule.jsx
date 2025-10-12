import React, { useState, useEffect, useRef } from "react";
import TopNavbar from "../../components/TopNavbar";
import ConfirmLeaveDialog from "../../components/ConfirmLeaveDialog";
import { useUserStore } from "../../store/user";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import { getModuleByName, getLevelByNumber, getSubtasksByLevel } from "../../utils/moduleHelpers";
import { Info } from "lucide-react";
import SubtaskInfoPopup from "../../components/SubtaskInfoPopup";

// Subtasks
import NetworkingSubtask1 from "./NetworkingSubtask1";
import NetworkingSubtask2 from "./NetworkingSubtask2";
import NetworkingSubtask3 from "./NetworkingSubtask3";

// UI bits
import BackgroundMusicBox from "../../components/BackgroundMusicBox";
import SideNavbar from "../../components/SideNavbar";

// Assets
import Floor from "../../assets/NFloor.svg";
import Cafe from "../../assets/NCafe.svg";
import Sign from "../../assets/NSign.svg";
import Table from "../../assets/NTable.svg";
import Bear from "../../assets/Bear.svg";

const COLORS = {
  bg: "#fff9c7",
  primary: "#3d86ea",
  primaryHover: "#4f9cf9",
  doorLeft: "#9ca3af",
  doorRight: "#6b7280"
};

const NetworkingModule = () => {
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [showSubtask, setShowSubtask] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);

  const [currentSpeechIndex, setCurrentSpeechIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [elevatorOpen, setElevatorOpen] = useState(true);

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const bearRef = useRef(null);
  const [bearMessage] = useState("Let’s make new connections!");

  // Elevator doors (hub only)
  const leftDoor = useRef(null);
  const rightDoor = useRef(null);

  // Auth
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) await useUserStore.getState().fetchUser();
      const currentUser = useUserStore.getState().user;
      if (!currentUser) {
        navigate("/login");
      } else {
        setUserInfo(currentUser);
      }
    };
    fetchUserData();
  }, [navigate, user]);

  // Script for bear speech (hub)
  const speechForSubtask1 = [
    "Hi there! 👋",
    "Welcome to the first subtask of the Networking Module!",
    "This will only take a few minutes - you'll create a simple LinkedIn profile like this one.",
    "Complete this task to earn XPs and advance your career!",
    "Choose one of the suggested headlines or create your own.",
    "Which university are you attending?",
    "Select top four skills that apply — both technical and soft skills.",
    "What is your career goal?",
    "Congratulations! You have finished your LinkedIn profile! Nice job 🔥"
  ];

  // Load events when entering subtask 2
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const res = await api.get("/users/me/networking/events", { withCredentials: true });
        setUserEvents(res.data.eventsToAttend || []);
      } catch (error) {
        console.error("User events were not fetched", error);
        toast.error("User events were not fetched");
      }
    };
    const fetchAllEvents = async () => {
      try {
        const res = await api.get("/users/me/networking/all-events", { withCredentials: true });
        setAllEvents(res.data.allEventsFromBackend || []);
      } catch (error) {
        console.log("Error in obtaining events", error);
        toast.error("Error in obtaining events");
      }
    };
    if (showSubtask && selectedSubtask === "subtask2") {
      fetchUserEvents();
      fetchAllEvents();
    }
  }, [showSubtask, selectedSubtask]);

  // Bear entrance (hub)
  useEffect(() => {
    if (!showSubtask) {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
        onComplete: () => setAnimationDone(true)
      });
      tl.fromTo(
        ".bear",
        { scale: 0, rotation: -180, opacity: 0, x: -200, y: -100 },
        { scale: 1, rotation: 0, opacity: 1, x: 0, y: 0, duration: 1.2 }
      ).to(".bear", { y: -30, duration: 0.4, yoyo: true, repeat: 1, ease: "power2.inOut" });
    }
  }, [showSubtask]);

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
    

    // Animate elevator opening when CVModule loads
    useEffect(() => {
        if (!showSubtask && elevatorOpen) {
            gsap.set(leftDoor.current, { x: "0%" });
            gsap.set(rightDoor.current, { x: "0%" });

            gsap.to(leftDoor.current, {
                x: "-100%",
                duration: 1.5,
                ease: "power2.inOut",
                delay: 0.3
            });

            gsap.to(rightDoor.current, {
                x: "100%",
                duration: 1.5,
                ease: "power2.inOut",
                delay: 0.3
            });

            setElevatorOpen(false);
        }
    }, [showSubtask]);

    // Sound Effects
    // Button Click 
    const playClickSound = () => {
    const audio = new Audio("/sounds/mouse-click-290204.mp3");
    audio.currentTime = 0; // rewind to start for rapid clicks
    audio.play();
    };


    return (
        <>
            <div className="relative min-h-screen flex flex-col bg-[#fff9c7]">

                {/* Elevator Doors Overlay */}

                {/* Top Navbar */}
                <div className="fixed top-0 inset-x-0 z-[100]">
                    <TopNavbar />
                </div>

                {/* Floating music control */}
                {/* <div className="fixed top-20 right-6 z-30 pointer-events-auto">
                    <BackgroundMusicBox moduleName="NetworkingModule" />
                </div> */}
                <BackgroundMusicBox moduleName="NetworkingModule" />




                {!showSubtask && (
                    <div>

                        {/* Elevator Doors Overlay */}
                        <div ref={leftDoor} className="absolute top-0 left-0 w-1/2 h-full bg-gray-400 z-50" />
                        <div ref={rightDoor} className="absolute top-0 right-0 w-1/2 h-full bg-gray-500 z-50" />

                        {/* Background */}
                        <div className="flex"> 
                            <div className="mt-20 z-40">
                                <SideNavbar />
                            </div>

                            <div className="relative z-10 flex-1 flex flex-col justify-end items-center pb-14"> 
                                
                                <img
                                    src={Cafe}
                                    alt="Unlocked Networking Cafe"
                                    className="absolute top-[18vh] left-28 w-[49vw] max-w-[800px] h-auto"
                                />
                                
                                <img
                                    src={Sign}
                                    alt="Unlocked Networking Sign"
                                    className="absolute top-[10vh] right-64 w-[20vw] max-w-[800px] h-auto" />
                                

                                <img
                                    src={Table}
                                    alt="Unlocked Networking Table"
                                    className="absolute top-[45vh] right-[12vw] w-[34vw] max-w-[800px] h-auto"
                                />

                                <div className="w-full bg-white shadow-md p-4 fixed bottom-10 left-0 flex justify-center z-20">
                                    <div className="flex space-x-6">

                                        <button
                                            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                                            onClick={() => { playClickSound(); setSelectedSubtask("subtask1"); setShowSubtask(true); setElevatorOpen(true); '' }}
                                        >
                                            Task 1
                                        </button>
                                        <button
                                            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                                            onClick={() => { playClickSound(); setSelectedSubtask("subtask2"); setShowSubtask(true); setElevatorOpen(true); }}
                                        >
                                            Task 2
                                        </button>
                                        <button
                                            className="bg-blue-400 hover:bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition"
                                            onClick={() => { playClickSound(); setSelectedSubtask("subtask3"); setShowSubtask(true); setElevatorOpen(true); }}
                                        >
                                            Task 3
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Yellow Floor */}
                        <img src={Floor} alt="Welcome" className="absolute bottom-0 left-0 w-full h-auto" />
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

                {showSubtask && selectedSubtask === "subtask3" && (
                    <NetworkingSubtask3
                        userInfo={userInfo}
                        onBack={() => { setShowSubtask(false); setSelectedSubtask(false); }}
                    />
                )}


            </div >
        </>
    )
}

export default NetworkingModule;
