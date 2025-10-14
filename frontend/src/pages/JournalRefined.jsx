import React from "react";
import TopNavbar from "../components/TopNavbar";
import MonitorImage from "../assets/journal-monitor.svg";
import { useState, useEffect, useRef } from "react";
import YellowFolder from "../assets/folder-yellow.svg";
import PinkFolder from "../assets/folder-pink.svg";
import BlueFolder from "../assets/folder-blue.svg";
import AddFolderImage from "../assets/add-folder-icon.svg";
import SideNavbar from "../components/SideNavbar";
import api from "../lib/axios";
import BackgroundMusicBox from "../components/BackgroundMusicBox";
import Logo from "../assets/Logo1.svg";
import toast from "react-hot-toast";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";
import BearFace from "../assets/bear-logo.svg";

const JournalRefined = () => {
    const [reflections, setReflections] = useState([]);
    const [goals, setGoals] = useState([]);
    const [notes, setNotes] = useState([]);
    const [openFolder, setOpenFolder] = useState(false);
    const [openFile, setOpenFile] = useState(false);
    const [addFile, setAddFile] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const emojiOptions = ["😞", "😐", "🙂", "😊", "🤩"];
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isNewEntry, setIsNewEntry] = useState(false);

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

    const reflectionQuestions = [
        "Let's create a reflection together!",
        "Ready to get started?",
        "What would you like to title this reflection?",
        "Which event or experience are you reflecting on?",
        "Nice! How did that make you feel? Choose an emoji to express it.",
        "What was the positive takeaway or silver lining from this experience?",
        "What could you do differently or improve next time?",
        "How would you rate this event or experience (1-10)?",
        "Great work! 👍 Press the save button if you’re ready to save it."
    ];

    const goalQuestions = [
        {
            question: "What would you like to title this goal entry?",
            example: "For example: 'Learn web development basics'."
        },
        {
            question:
                "What is your goal? (Write 1–2 lines about a goal you want to achieve. Remember to make it SMART.)",
            example: "For example: 'I want to run 5km without stopping by the end of next month.'"
        },
        {
            question: "Is your goal Specific? Please type Y / N",
            example: "For example: 'Yes — it focuses on running 5km, not just general exercise.'"
        },
        {
            question: "Is your goal Measurable?  Please type Y / N",
            example: "For example: 'Yes — I can track progress by the distance I can run each week.'"
        },
        {
            question: "Is your goal Achievable?  Please type Y / N",
            example: "For example: 'Yes — I can train three times per week to gradually build endurance.'"
        },
        {
            question: "Is your goal Realistic?  Please type Y / N",
            example:
                "For example: 'Yes — I already run 2km comfortably, so 5km is realistic with practice.'"
        },
        {
            question: "Is your goal Timely?  Please type Y / N",
            example: "For example: 'Yes — I’ve set a clear deadline of one month to achieve this.'"
        },

        {
            question: "Nice job 🤩! Press the following button to save your goal!",
            example: null
        }
    ];

    // These are for setting a new goal (i.e making a POST request)
    const [goalTitle, setGoalTitle] = useState("");
    const [goal, setGoal] = useState("");
    const [goalIsCompleted, setGoalIsCompleted] = useState(false); // by defualt false

    // These are for setting a new reflection (i.e making a POST request)
    const [reflectionTitle, setReflectionTitle] = useState("");
    const [about, setAbout] = useState("");
    const [feeling, setFeeling] = useState({
        emoji: 5, // or null / default emoji rating
        text: "" // empty optional explanation
    });
    const [whatWentWell, setWhatWentWell] = useState("");
    const [improvement, setImprovement] = useState("");
    // Q5: Rate the event/experience (1–10 stars)
    const [rating, setRating] = useState("");

    // These are for setting a new note (i.e making a POST request)
    const [noteTitle, setNoteTitle] = useState("");
    const [thoughts, setThoughts] = useState("");

    const [folders, setFolders] = useState([
        { id: 1, name: "Reflections", image: PinkFolder, items: reflections },
        { id: 2, name: "Goals", image: YellowFolder, items: goals },
        { id: 3, name: "Notes", image: BlueFolder, items: notes }
    ]);

    useEffect(() => {
        setFolders([
            { id: 1, name: "Reflections", image: PinkFolder, items: reflections },
            { id: 2, name: "Goals", image: YellowFolder, items: goals },
            { id: 3, name: "Notes", image: BlueFolder, items: notes }
        ]);
    }, [reflections, goals, notes]);

    const handleUpdateGoal = {};

    // Initialize state from openFile when it changes
    useEffect(() => {
        if (openFile && openFolder?.name === "Reflections") {
            setReflectionTitle(openFile.title || "");
            setAbout(openFile.about || "");
            setWhatWentWell(openFile.whatWentWell || "");
            setImprovement(openFile.improvement || "");
            setFeeling(openFile.feeling || { emoji: 5 });
            setRating(openFile.rating || 0);
        }

        if (openFile && openFolder?.name === "Goals") {
            console.log("goalTitle: ", goalTitle);
            setGoalTitle(goalTitle.title || "");
            setGoal(openFile.goal || "");
            setGoalIsCompleted(openFile.goalIsCompleted || "");
        }
    }, [openFile, openFolder]);

    const getAllJournals = async () => {
        try {
            const getGoals = await api.get("/users/journal/goals", { withCredentials: true });
            const getReflections = await api.get("/users/journal/reflections", { withCredentials: true });
            const getNotes = await api.get("/users/journal/notes", { withCredentials: true });
            if (getGoals.data.message == "Goals retrieved succesfully!") {
                setGoals(getGoals.data.goals);
            }
            if (getReflections.data.message == "Reflections retrieved succesfully!") {
                setReflections(getReflections.data.reflections);
            }
            if (getNotes.data.message == "Notes retrieved succesfully!") {
                setNotes(getNotes.data.notes);
            }
        } catch (error) {
            console.error("Error obtaining journal items", error);
            toast.error("Error obtaining journal items");
        }
    };

    // Update goal
    const updateGoal = async () => {
        try {
            const updated = {
                title: openFile.title,
                updatedTitle: goalTitle?.trim() ? goalTitle.trim() : openFile.titles,
                goal,
                goalIsCompleted
            };
            const res = await api.put(`/users/journal/goals`, updated, {
                withCredentials: true
            });
            // Use the actual updated entry returned from backend
            const updatedGoal = res.data.goalEntry;

            // Update local state
            setGoals((prev) =>
                prev.map((g) => (g._id === updatedGoal._id ? updatedGoal : g))
            );
            // Force-update openFolder immediately
            if (openFolder?.name === "Goals") {
                setOpenFolder((prev) => ({
                    ...prev,
                    items: prev.items.map((g) =>
                        g._id === updatedGoal._id ? { ...updatedGoal } : g
                    ),
                }));
            }

            setOpenFile({ ...updatedGoal });
            toast.success("Goal updated!");
            setOpenFile(null);
        } catch (error) {
            console.error("error: ", error);
            toast.error("Error updating goal");
        }
    };

    // Save goal to backend
    const saveGoal = async () => {
        try {
            console.log("goal: ", goal);
            const goalSaved = await api.post(
                "/users/journal/goals",
                {
                    title: goalTitle,
                    goal: goal,
                    isCompleted: false
                },
                { withCredentials: true }
            );
            setGoals((prevGoals) => [...prevGoals, goalSaved.data]);
            setMessages([]);
            setCurrentIndex(0);
            toast.success("Goal saved!");
        } catch (error) {
            console.error("Error in saving goal", error);
            toast.error("Error in saving goal");
        }
    };

    // Save reflection to backend
    const saveReflection = async () => {
        try {
            const reflectionSaved = await api.post(
                "/users/journal/reflections",
                {
                    title: reflectionTitle,
                    about: about,
                    feeling: feeling,
                    whatWentWell: whatWentWell,
                    improvement: improvement,
                    rating: rating
                },
                { withCredentials: true }
            );
            setReflections((prev) => [...prev, reflectionSaved.data]);
            setMessages([]);
            setCurrentIndex(0);
            toast.success("Reflection saved!");
        } catch (error) {
            console.error("Error in saving reflection", error);
            toast.error("Error in saving reflection");
        }
    };


    // Function to update a reflection
    const updateReflection = async () => {
        try {
            // Prepare the updated data
            const updated = {
                title: reflectionTitle?.trim() ? reflectionTitle.trim() : openFile.title,
                about,
                feeling, // feeling object: { emoji, text }
                whatWentWell,
                improvement,
                rating
            };

            const res = await api.put(`/users/journal/reflections`, updated, {
                withCredentials: true
            });

            // Get the updated reflection from backend
            const updatedReflection = res.data.reflectionEntry;

            // Update local state
            setReflections((prev) =>
                prev.map((r) => (r._id === updatedReflection._id ? updatedReflection : r))
            );

            // Force-update openFolder immediately if it's currently "Reflections"
            if (openFolder?.name === "Reflections") {
                setOpenFolder((prev) => ({
                    ...prev,
                    items: prev.items.map((r) =>
                        r._id === updatedReflection._id ? { ...updatedReflection } : r
                    ),
                }));
            }

            // Update currently open file
            setOpenFile({ ...updatedReflection });

            toast.success("Reflection updated!");
            setOpenFile(null);
        } catch (error) {
            console.error("Error updating reflection: ", error);
            toast.error("Error updating reflection");
        }
    };


    // Save note to backend
    const saveNote = async () => {
        try {
            const noteSaved = await api.post(
                "/users/journal/notes",
                {
                    title: noteTitle,
                    thoughts: thoughts
                },
                { withCredentials: true }
            );
            setNotes((prev) => [...prev, noteSaved.data]);
        } catch (error) {
            console.error("Error in saving note", error);
            toast.error("Error in saving note");
        }
    };

    // Run once when component mounts to check if user already has journal entries
    useEffect(() => {
        getAllJournals();
    }, []);

    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // For temporarily saving data to the messages array
    useEffect(() => {
        let timer;
        let questions = [];

        if (openFolder.name === "Reflections") {
            questions = reflectionQuestions;
        } else if (openFolder.name === "Goals") {
            questions = goalQuestions;
        }

        if (questions.length > 0 && currentIndex < questions.length) {
            setIsTyping(true);

            timer = setTimeout(() => {
                setMessages((prev) => {
                    const currentQ = questions[currentIndex];

                    // Handle both reflection (string) and goal (object) questions
                    const newMessage =
                        typeof currentQ === "string"
                            ? { sender: "bear", text: currentQ }
                            : {
                                sender: "bear",
                                question: currentQ.question,
                                example: currentQ.example
                            };

                    return [...prev, newMessage];
                });
                setIsTyping(false);
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [currentIndex, openFolder.name]);

    const handleSend = () => {
        if (currentIndex == 4 || currentIndex == 7) {
            setCurrentIndex((prev) => prev + 1);
            return;
        }
        if (isTyping || input.trim() === "") return; // prevent sending while "typing" animation

        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setInput("");
        setCurrentIndex((prev) => prev + 1);
        if (currentIndex == reflectionQuestions.length - 1) {
            setInput("");
            setMessages([]);
        }
        if (currentIndex == 2) {
            setReflectionTitle(input);
        }
        if (currentIndex == 3) {
            setAbout(input);
        }
        if (currentIndex == 4) {
            setFeeling({ ...feeling, emoji: e.target.value });
        }
        if (currentIndex == 5) {
            setWhatWentWell(input);
        }
        if (currentIndex == 6) {
            setImprovement(input);
        }
        if (currentIndex == 7) {
            setRating(input);
        }
    };

    const handleGoalSend = () => {
        if (isTyping || input.trim() === "") return; // prevent sending while "typing" animation
        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        if ([2, 3, 4, 5, 6].includes(currentIndex) && !(input == "Y" || input == "N")) {
            setInput("");
            setIsTyping(true);

            timer = setTimeout(() => {
                setMessages((prev) => [...prev, { sender: "bear", text: "Please type Y or N!" }]);
                setIsTyping(false);
            }, 1000);
            return;
        }
        if ([2, 3, 4, 5, 6].includes(currentIndex) && input == "N") {
            setInput("");
            setIsTyping(true);

            timer = setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bear", text: "Please rewrite your goal to adhere to the SMART principles!" }
                ]);
                // Reset to the goal-writing step (index 1)
                setCurrentIndex(1);
            }, 1000);
            return;
        }

        if (currentIndex == 0) {
            setGoalTitle(input);
        }
        if (currentIndex == 1) {
            setGoal(input);
        }
        setInput("");
        setCurrentIndex((prev) => prev + 1);
    };

    // BackgroundMusicBox visibility state
    const [showMusicBox, setShowMusicBox] = useState(false);

    return (
        <>
            <div className="bg-blue-200 min-h-screen border border-black">
                <TopNavbar
                    showMusicBox={showMusicBox}
                    onToggleMusicBox={() => setShowMusicBox(!showMusicBox)}
                />
                {/* Conditionally show music box */}
                {showMusicBox && <BackgroundMusicBox moduleName="Journal" />}

                <div className="flex">
                    <div className="">
                        <SideNavbar />
                    </div>

                    <div className="flex justify-start items-center h-[calc(100vh-65px)]">
                        <div className="relative w-3/4 ml-28">
                            {/* Monitor here */}
                            <img
                                src={MonitorImage}
                                alt="Monitor"
                                className="w-full h-auto"
                            />

                            <div className="absolute top-[9%] left-[5.25%] w-[88.85%] h-10 flex items-center px-4"
                                style={{ backgroundColor: 'rgba(67,109,133,0.30)' }}>
                                {/*<img src={AddFolderImage} alt="icon" className="h-7 w-auto ml-1" /> - removing this for now*/}
                                {/*<p className="text-white font-bold">Its Goal Setting Time User!</p>*/}
                            </div>

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
                    </div>
                </div>


                {openFolder && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
                        <div className="relative bg-white max-w-6xl w-[90%] h-[85%] rounded-2xl shadow-xl overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                {/* dots */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setOpenFolder(false);
                                            setOpenFile(null);
                                            setAddFile(false);
                                            setMessages([]);
                                            setInput("");
                                        }}
                                        className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-gray text-xs"
                                        aria-label="Close"
                                    >
                                        X
                                    </button>
                                    <div className="w-4 h-4 rounded-full bg-yellow-400" />
                                    <div className="w-4 h-4 rounded-full bg-green-500" />
                                </div>

                                {/* Title - Folder */}
                                <h2 className="text-xl md:text-2xl font-bold text-purple-600 text-center flex-1">
                                    {openFolder.name}
                                </h2>
                                <div className="w-10"></div>
                            </div>

                            {/* Main thing */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* sidebar thingy with buttons */}
                                <div className="relative w-[20%] bg-purple-400 p-4 flex flex-col gap-3 overflow-y-auto">
                                      <div className="flex-1 flex flex-col gap-3">
                                        {openFolder.items.map((file, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                            setOpenFile(file);
                                            setAddFile(false);
                                            }}
                                            className="flex justify-center px-3 py-5 bg-purple-300 text-purple-800 rounded-xl hover:bg-purple-200 transition-colors cursor-pointer border border-gray-400"
                                        >
                                            {file.title}
                                        </button>
                                        ))}
                                    </div>

                                    {/* Cat div */}
                                    <div className="mt-auto w-full">
                                        <button
                                            className="flex justify-center px-3 py-5 bg-purple-400 text-white rounded-xl 
                                                        hover:bg-purple-500 transition-transform transform hover:scale-105 
                                                        shadow-lg border border-white w-full"
                                            onClick={() => {
                                                setIsChatOpen(false);
                                                setAddFile(false);
                                                setOpenFile(true);
                                                setIsNewEntry(true);
                                                console.log("Open file", openFile);
                                            }}
                                        >
                                            + Add New File
                                        </button>

                                        <div className="p-2 text-center text-white">
                                            or
                                        </div>

                                        <button
                                            className="flex justify-center px-3 py-5 bg-white text-black rounded-xl hover:bg-purple-100 hover:text-black transition-transform transform hover:scale-105 shadow-lg w-full"
                                            onClick={() => {
                                                setIsChatOpen(true); 
                                                setAddFile(true);
                                                setOpenFile(false);
                                            }}
                                        >
                                            <div className="flex gap-2 pl-3">
                                                <img src={BearFace} alt="" className="w-[20%] h-auto rotate-[-8deg]" />
                                                <div className="">
                                                    Chat with Bear!

                                                </div>
                                                

                                            </div>
                                        </button>

                                    </div>
                                    
                                </div>

                                {openFolder && !openFile && !addFile && (
                                    <div className="flex flex-col justify-center items-center bg-purple-50 text-purple-400 w-[80%] text-2xl">
                                        <div>
                                            {" "}
                                            <img src={Logo} className="h-32 w-52"></img>
                                        </div>
                                        <div>Click a file to get started...</div>
                                    </div>
                                )}

                                {/* Creating a new file and adding it to the reflections folder */}
                                {isChatOpen && openFolder.name == "Reflections" && (
                                    <div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
                                        <div className="bg-white w-[100%] h-[95%] p-6 rounded-xl shadow-lg flex flex-col gap-3">
                                            <div className="h-[95%] overflow-y-auto pb-20 ">
                                                {messages.map((msg, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`px-4 py-2 rounded-2xl max-w-[75%] mt-2 border border-purple-600 ${msg.sender === "user"
                                                                ? "bg-purple-100 text-purple-800 self-end"
                                                                : "bg-purple-200 text-purple-900"
                                                                }`}
                                                        >
                                                            {msg.text}
                                                        </div>
                                                        {currentIndex == 0 ? setCurrentIndex(1) : null}
                                                    </div>
                                                ))}
                                                {isTyping && (
                                                    <div className=" flex items-center justify-start gap-1 text-purple-400">
                                                        <span className="animate-bounce">•</span>
                                                        <span className="animate-bounce delay-100">•</span>
                                                        <span className="animate-bounce delay-100">•</span>
                                                    </div>
                                                )}

                                                {!isTyping && currentIndex === 4 && (
                                                    <div className="flex gap-4 justify-center mt-6">
                                                        {emojiOptions.map((emoji, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => {
                                                                    setFeeling({ ...feeling, emoji: index + 1 });
                                                                }}
                                                                disabled={currentIndex > 4}
                                                                className={` text-3xl flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300
                                                            ${feeling.emoji === index + 1
                                                                        ? "border-purple-500 bg-purple-100 scale-110 shadow-[0_0_20px_rgba(128,90,255,0.6)] animate-pulse"
                                                                        : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50 hover:scale-105"
                                                                    }`}
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                {
                                                                    const selectedEmoji = emojiOptions[feeling.emoji - 1];
                                                                    setMessages((prev) => [
                                                                        ...prev,
                                                                        { sender: "user", text: selectedEmoji }
                                                                    ]);
                                                                }
                                                                handleSend();
                                                            }}
                                                            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-purple-500 active:scale-95 focus:outline-none"
                                                        >
                                                            Next
                                                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                                                ➜
                                                            </span>
                                                        </button>
                                                    </div>
                                                )}

                                                {currentIndex === 7 && !isTyping && (
                                                    <div className="flex flex-col justify-center items-center gap-10 w-full mt-20">
                                                        {/* Rating Line */}
                                                        <div className="relative flex flex-col items-center w-full max-w-2xl gap-6">
                                                            <div className="relative flex items-center justify-between w-full">
                                                                <div className="absolute left-0 right-0 h-[3px] bg-purple-300 z-0" />
                                                                {[...Array(10)].map((_, index) => {
                                                                    const value = index + 1;
                                                                    const isSelected = rating === value;
                                                                    return (
                                                                        <div key={value} className="relative z-10">
                                                                            <button
                                                                                onClick={() => setRating(value)}
                                                                                className={`
                  w-6 h-6 rounded-full flex items-center justify-center 
                  transition-all duration-300
                  ${isSelected
                                                                                        ? "bg-yellow-400 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                                                                                        : "bg-purple-300 hover:bg-purple-400 hover:scale-110"
                                                                                    }
                `}
                                                                            >
                                                                                {isSelected && (
                                                                                    <span className="absolute text-yellow-400 text-xl -top-7 animate-bounce">
                                                                                        ⭐
                                                                                    </span>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Labels */}
                                                            <div className="flex justify-between w-full text-purple-400 font-medium mt-2">
                                                                <span>1</span>
                                                                <span>10</span>
                                                            </div>

                                                            {/* Note Paragraph */}
                                                            <p className="text-center text-purple-600 text-sm max-w-lg leading-relaxed bg-purple-50 rounded-xl p-4 border border-purple-200 shadow-sm">
                                                                Note: <span className="font-semibold">1 = Very negative</span> (no
                                                                value, no learning, no enjoyment, no impact);
                                                                <br />
                                                                <span className="font-semibold">10 = Very positive</span> (high
                                                                value, strong learning, enjoyable, impactful)
                                                            </p>

                                                            {/* Next Button */}
                                                            <button
                                                                onClick={() => {
                                                                    if (rating) {
                                                                        setMessages((prev) => [
                                                                            ...prev,
                                                                            { sender: "user", text: rating }
                                                                        ]);
                                                                        setCurrentIndex((prev) => prev + 1);
                                                                    }
                                                                }}
                                                                className={`
          flex items-center gap-2 px-6 py-3 rounded-full font-semibold 
          transition-all duration-300 
          ${rating
                                                                        ? "bg-purple-600 text-white hover:bg-purple-500 hover:scale-105 shadow-md"
                                                                        : "bg-purple-200 text-purple-400 cursor-not-allowed"
                                                                    }
        `}
                                                            >
                                                                Next
                                                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                                                    ➜
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {currentIndex == reflectionQuestions.length - 1 && !isTyping && (
                                                    <div className="flex justify-center">
                                                        <button
                                                            className="
                                                                bg-gradient-to-r from-purple-600 to-purple-500 
                                                                text-white font-semibold px-6 py-2 rounded-full 
                                                                shadow-md transition-all duration-300 
                                                                hover:scale-105 hover:shadow-xl hover:from-purple-500 hover:to-purple-400
                                                                active:scale-95 focus:outline-none mt-7 mb-4"
                                                            onClick={() => {
                                                                saveReflection();
                                                                setAddFile(false);
                                                            }}
                                                        >
                                                            💾 Save
                                                        </button>
                                                    </div>
                                                )}
                                                {/* 👇 Empty div to scroll into view */}
                                                <div ref={messagesEndRef} />
                                            </div>

                                            {addFile && currentIndex != 0 && (
                                                <div className="flex mt-1 flex-col">
                                                    <div className="w-[100%] flex gap-0.5">
                                                        <input
                                                            type="text"
                                                            value={input}
                                                            onChange={(e) => setInput(e.target.value)}
                                                            placeholder="Type your answer..."
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" &&
                                                                    !e.shiftKey &&
                                                                    !isTyping &&
                                                                    currentIndex != 4 &&
                                                                    currentIndex != 7 &&
                                                                    currentIndex != reflectionQuestions.length - 1
                                                                ) {
                                                                    e.preventDefault(); // stop newline
                                                                    handleSend(); // same handler as button
                                                                }
                                                            }}
                                                            className="w-[90%] flex-1 border rounded-full px-4 py-2 text-sm border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                        />
                                                        <button
                                                            disabled={
                                                                isTyping ||
                                                                currentIndex == reflectionQuestions.length - 1 ||
                                                                currentIndex == 4 ||
                                                                currentIndex == 7
                                                            }
                                                            onClick={handleSend}
                                                            className="ml-2 bg-purple-500 text-white rounded-full px-4 py-2 text-sm hover:bg-purple-600"
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Actual file content of Reflections folder + editable area */}
                                {openFile && addFile === false && openFolder.name === "Reflections" && (
                                    <div className="flex-1 bg-gradient-to-br from-purple-100 via-white to-purple-50 p-8 rounded-2xl shadow-[0_0_20px_rgba(167,139,250,0.25)] border border-purple-200">
                                        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full overflow-y-auto">
                                            {/* Header */}
                                            <div className="text-center mb-8">
                                                 <input
                                                    type="text"
                                                    value={reflectionTitle}
                                                    onChange={(e) => setReflectionTitle(e.target.value)}
                                                    className="text-2xl font-bold text-purple-700 tracking-wide text-center w-full bg-transparent border-b-2 border-purple-300 focus:outline-none focus:border-purple-500"
                                                />
                                                <textarea
                                                    value={about}
                                                    onChange={(e) => setAbout(e.target.value)}
                                                    className="text-purple-400 text-sm mt-1 w-full bg-transparent resize-none text-center focus:outline-none"
                                                />
                                            </div>

                                            {/* Feelings Section */}
                                            <h3 className="font-semibold text-purple-700 mb-4 text-lg">
                                                How did this event/experience make me feel?
                                            </h3>
                                            <div className="flex justify-center gap-6 mb-10">
                                                {emojiOptions.map((emoji, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setFeeling((prev) => ({ ...prev, emoji: index + 1 }))}
                                                        className={`text-3xl flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all duration-300
                                                                ${feeling.emoji === index + 1
                                                                ? "border-purple-500 bg-purple-100 scale-110 shadow-[0_0_25px_rgba(168,85,247,0.4)] animate-bounce"
                                                                : "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                                                            }`}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Reflection Answers */}
                                            <div className="space-y-8">
                                                <div>
                                                    <h3 className="font-semibold text-purple-700 mb-3 text-lg">
                                                        What went well?
                                                    </h3>
                                                    <textarea
                                                        value={whatWentWell}
                                                        onChange={(e) => setWhatWentWell(e.target.value)}
                                                        placeholder="Write what went well..."
                                                        className="w-full bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm resize-none focus:outline-none focus:border-purple-400"
                                                        rows={4}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-purple-700 mb-3 text-lg">
                                                        What could I do to improve my experience next time?
                                                    </h3>
                                                    <textarea
                                                        value={improvement}
                                                        onChange={(e) => setImprovement(e.target.value)}
                                                        placeholder="Write improvements..."
                                                        className="w-full bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm resize-none focus:outline-none focus:border-purple-400"
                                                        rows={4}
                                                    />
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="mt-10">
                                                <h3 className="font-semibold text-purple-700 mb-14 text-lg text-center">
                                                    Rate the event/experience overall
                                                </h3>
                                                <div className="relative flex justify-around">
                                                    {[...Array(10)].map((_, index) => {
                                                        const value = index + 1;
                                                        return (
                                                            <div key={value} className="relative flex flex-col items-center">
                                                                <button
                                                                    onClick={() => setRating(value)}
                                                                    className={`
                                                                            w-6 h-6 rounded-full flex items-center justify-center 
                                                                            transition-all duration-300
                                                                            ${rating === value
                                                                            ? "bg-yellow-400 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                                                                            : "bg-purple-300 hover:bg-purple-400 hover:scale-110"
                                                                        }
                                                                `}
                                                                >
                                                                    {rating === value && (
                                                                        <span className="absolute -top-8 text-yellow-400 text-lg animate-bounce">
                                                                            ⭐
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <p className="text-center text-sm text-purple-400 max-w-lg mx-auto mt-8">
                                                    <span className="font-medium">Note:</span> 1 = Very negative; 10 = Very
                                                    positive
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-10 flex justify-center gap-4">
                                                <button
                                                    onClick={() => setOpenFile(null)}
                                                    className="px-8 py-2 rounded-full border border-purple-500 text-purple-700 font-semibold hover:bg-purple-100 transition-all duration-300 hover:scale-105 shadow-sm"
                                                >
                                                    ← Back
                                                </button>

                                                <button
                                                    onClick={isNewEntry ? saveReflection : updateReflection}
                                                    className="px-8 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105 shadow-sm"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actual file contents of Goals + editable area */}
                                {openFile && !addFile && openFolder?.name === "Goals" && (
                                    <div className="flex-1 bg-gradient-to-br from-purple-100 via-white to-purple-50 p-8 rounded-2xl shadow-[0_0_20px_rgba(167,139,250,0.25)] border border-purple-200">
                                        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col h-full overflow-y-auto">
                                            {/* Goal Title at Top */}
                                            <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">
                                                {openFile.title || "Untitled Goal"}
                                            </h1>
                                            <input
                                                type="text"
                                                value={goalTitle}
                                                onChange={(e) => setGoalTitle(e.target.value)}
                                                placeholder="Edit goal title..."
                                                className="w-full mb-6 p-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-400 bg-purple-50 text-lg font-semibold text-center"
                                            />

                                            {/* Goal Description */}
                                            <div className="flex flex-col mb-6">
                                                <label className="text-purple-700 font-semibold mb-2">Goal:</label>
                                                <textarea
                                                    value={goal}
                                                    onChange={(e) => setGoal(e.target.value)}
                                                    placeholder="Describe your goal..."
                                                    rows={4}
                                                    className="w-full p-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-400 bg-purple-50 resize-none"
                                                />
                                            </div>

                                            {/* Completion */}
                                            <div className="flex items-center gap-3 mb-10">
                                                <input
                                                    type="checkbox"
                                                    checked={goalIsCompleted}
                                                    onChange={(e) => setGoalIsCompleted(e.target.checked)}
                                                    className="w-6 h-6 accent-purple-500"
                                                />
                                                <label className="text-purple-700 font-medium">Completed</label>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    onClick={() => setOpenFile(null)}
                                                    className="px-8 py-2 rounded-full border border-purple-500 text-purple-700 font-semibold hover:bg-purple-100 transition-all duration-300 hover:scale-105 shadow-sm"
                                                >
                                                    ← Back
                                                </button>

                                                <button
                                                    onClick={openFile.goalTitle ? updateGoal : saveGoal}
                                                    className="px-8 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105 shadow-sm"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Creating a new file and adding it to the goals folder */}
                                {addFile && openFolder.name == "Goals" && (
                                    <div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
                                        <div className="bg-white w-[100%] h-[95%] p-6 rounded-xl shadow-lg flex flex-col gap-3">
                                            <div className="h-[95%] overflow-y-auto pb-20 ">
                                                {messages.map((msg, i) => (
                                                    <div
                                                        key={i}
                                                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`px-4 py-2 rounded-2xl max-w-[75%] mt-2 border border-purple-600
                                                                    ${msg.sender === "user"
                                                                    ? "bg-purple-100 text-purple-800 self-end"
                                                                    : "bg-purple-200 text-purple-900"
                                                                }`}
                                                        >
                                                            {/* User message */}
                                                            {msg.sender === "user" && msg.text && <p>{msg.text}</p>}

                                                            {/* 🐻 Bear message */}
                                                            {msg.sender === "bear" && msg.example && (
                                                                <div>
                                                                    <p className="font-semibold text-purple-900"> {msg.question}</p>
                                                                    {msg.example && (
                                                                        <p className="text-sm italic text-purple-700 mt-1 .text-sm.text-purple-700.opacity-80.pl-3.border-l-2.border-purple-400">
                                                                            {msg.example}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Ladt bear message or error message for not typing Y / N */}
                                                            {msg.sender === "bear" && !msg.example && (
                                                                <div> {msg.question || msg.text} </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {isTyping && (
                                                    <div className="flex items-center justify-start gap-1 text-purple-400 mb-2">
                                                        <span className="animate-bounce">•</span>
                                                        <span className="animate-bounce delay-100">•</span>
                                                        <span className="animate-bounce delay-200">•</span>
                                                    </div>
                                                )}

                                                {currentIndex == goalQuestions.length - 1 && !isTyping && (
                                                    <div className="flex justify-center">
                                                        <button
                                                            className="
                                                                bg-gradient-to-r from-purple-600 to-purple-500 
                                                                text-white font-semibold px-6 py-2 rounded-full 
                                                                shadow-md transition-all duration-300 
                                                                hover:scale-105 hover:shadow-xl hover:from-purple-500 hover:to-purple-400
                                                                active:scale-95 focus:outline-none mt-7 mb-4"
                                                            onClick={() => {
                                                                saveGoal();
                                                                setAddFile(false);
                                                            }}
                                                        >
                                                            💾 Save
                                                        </button>
                                                    </div>
                                                )}
                                                {/* 👇 Empty div to scroll into view */}
                                                <div ref={messagesEndRef} />
                                            </div>
                                            {addFile && (
                                                <div className="flex mt-1 flex-col">
                                                    <div className="w-[100%] flex gap-0.5">
                                                        <input
                                                            type="text"
                                                            value={input}
                                                            onChange={(e) => setInput(e.target.value)}
                                                            placeholder="Type your answer..."
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key === "Enter" &&
                                                                    !e.shiftKey &&
                                                                    currentIndex != goalQuestions.length - 1
                                                                ) {
                                                                    e.preventDefault(); // stop newline
                                                                    handleGoalSend(); // same handler as button
                                                                }
                                                            }}
                                                            className="w-[90%] flex-1 border rounded-full px-4 py-2 text-sm border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                        />
                                                        <button
                                                            disabled={isTyping || currentIndex == goalQuestions.length - 1}
                                                            onClick={handleGoalSend}
                                                            className="ml-2 bg-purple-500 text-white rounded-full px-4 py-2 text-sm hover:bg-purple-600"
                                                        >
                                                            Send
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default JournalRefined;
