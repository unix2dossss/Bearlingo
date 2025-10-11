import React from 'react';
import TopNavbar from '../components/TopNavbar';
import MonitorImage from '../assets/journal-monitor.svg';
import { useState, useEffect } from "react";
import YellowFolder from "../assets/folder-yellow.svg";
import PinkFolder from "../assets/folder-pink.svg";
import BlueFolder from "../assets/folder-blue.svg";
import AddFolderImage from '../assets/add-folder-icon.svg';
import SideNavbar from '../components/SideNavbar';
import api from "../lib/axios";


const JournalRefined = () => {
    const [reflections, setReflections] = useState([]);
    const [goals, setGoals] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newFileName, setNewFileName] = useState("");
    const [openFolder, setOpenFolder] = useState(false);
    const [showAddFileModal, setShowAddFileModal] = useState(false);
    const [openFile, setOpenFile] = useState(false);
    const [addFile, setAddFile] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    const reflectionQuestions = [
        "Let's create a reflection together!",
        "Ready to get started?",
        "What would you like to title this reflection?",
        "Which event or experience are you reflecting on?",
        "Nice! How did that make you feel? Choose an emoji to express it.",
        "What was the positive takeaway or silver lining from this experience?",
        "What could you do differently or improve next time?",
        "How would you rate this event or experience?",
        "Great work! 👍 Give this reflection a thumbs up if you’re ready to save it."
    ];

    // These are for setting a new goal (i.e making a POST request)
    const [goalTitle, setGoalTitle] = useState("");
    const [goal, setGoal] = useState("");
    const [goalIsCompleted, setGoalIsCompleted] = useState(false); // by defualt false

    // These are for setting a new reflection (i.e making a POST request)
    const [reflectionTitle, setReflectionTitle] = useState("");
    const [about, setAbout] = useState("");
    const [feeling, setFeeling] = useState({
        emoji: 0,   // or null / default emoji rating
        text: ""    // empty optional explanation
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
        { id: 3, name: "Notes", image: BlueFolder, items: notes },
    ]);

    useEffect(() => {
        setFolders([
            { id: 1, name: "Reflections", image: PinkFolder, items: reflections },
            { id: 2, name: "Goals", image: YellowFolder, items: goals },
            { id: 3, name: "Notes", image: BlueFolder, items: notes },
        ]);
    }, [reflections, goals, notes]);


    const getAllJournals = async () => {
        try {
            const getGoals = await api.get("/users/journal/goals",
                { withCredentials: true });
            const getReflections = await api.get("/users/journal/reflections",
                { withCredentials: true });
            const getNotes = await api.get("/users/journal/notes",
                { withCredentials: true });
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

    // Save goal to backend
    const saveGoal = async () => {
        try {
            const goalSaved = await api.post("/users/journal/goals",
                {
                    title: goalTitle,
                    goal: goal,
                    isCompleted: goalIsCompleted
                },
                { withCredentials: true });
            setGoals(prevGoals => [...prevGoals, goalSaved.data])


        } catch (error) {
            console.error("Error in saving goal", error);
            toast.error("Error in saving goal");
        }

    };

    // Save reflection to backend
    const saveReflection = async () => {
        try {
            const reflectionSaved = await api.post("/users/journal/reflections",
                {
                    title: reflectionTitle,
                    about: about,
                    feeling: feeling,
                    whatWentWell: whatWentWell,
                    improvement: improvement,
                    rating: rating
                },
                { withCredentials: true });
            setReflections(prev => [...prev, reflectionSaved.data]);

        } catch (error) {
            console.error("Error in saving reflection", error);
            toast.error("Error in saving reflection");
        }

    };

    // Save note to backend
    const saveNote = async () => {
        try {
            const noteSaved = await api.post("/users/journal/notes",
                {
                    title: noteTitle,
                    thoughts: thoughts
                },
                { withCredentials: true });
            setNotes(prev => [...prev, noteSaved.data]);


        } catch (error) {
            console.error("Error in saving note", error);
            toast.error("Error in saving note");
        }

    };


    // Run once when component mounts to check if user already has journal entries
    useEffect(() => {
        getAllJournals();
    }, []);



    useEffect(() => {
        if (currentIndex < reflectionQuestions.length) {
            setIsTyping(true);
            const timer = setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bear", text: reflectionQuestions[currentIndex] }
                ]);
                setIsTyping(false);
            }, 1000); // typing delay
            return () => clearTimeout(timer);
        }
    }, [currentIndex]);

    const handleSend = () => {
        if (input.trim() === "") return;
        setMessages((prev) => [...prev, { sender: "user", text: input }]);
        setInput("");
        setCurrentIndex((prev) => prev + 1);
        if (currentIndex == reflectionQuestions.length - 1) {
            setInput("");
            setMessages("");
        }
    };




    return (
        <>
            <div className="bg-blue-200 min-h-screen border border-black">
                <TopNavbar />

                <div className="flex">
                    <div className="mt-8">
                        <SideNavbar />
                    </div>

                    <div className="flex justify-center items-center h-[calc(100vh-65px)]">
                        <div className="flex justify-center items-center">
                            <div className="relative w-3/4">
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
                    </div >
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
                                            setOpenFolder(null),
                                                setOpenFile(null)
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
                                <div className="w-[20%] bg-purple-400 p-4 flex flex-col gap-3 overflow-y-auto">
                                    {console.log("openFolder.items: ", openFolder.items)}
                                    {openFolder.items.map((file, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setOpenFile(file)}
                                            className="flex justify-center px-3 py-5 bg-purple-300 text-purple-800 rounded-xl hover:bg-purple-200 transition-colors cursor-pointer border border-gray-400"
                                        >
                                            {file.title}
                                        </button>
                                    ))}
                                    <button
                                        className="flex justify-center px-3 py-5 bg-purple-400 text-white rounded-xl hover:bg-purple-500 transition-colors border border-white"
                                        onClick={() => {
                                            setShowAddFileModal(true);
                                            setAddFile(true);
                                        }
                                        }
                                    >
                                        + Add New File
                                    </button>

                                    {/* Creating a new file and adding it to the goals folder */}
                                    {showAddFileModal && openFolder.name == "Goals" && (

                                        < div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                            <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg">
                                                <h2 className="text-lg font-bold mb-4 text-purple-600">
                                                    Add A New Entry To {openFolder.name}
                                                </h2>

                                                <input
                                                    type="text"
                                                    placeholder="Enter name of entry"
                                                    value={newFileName}
                                                    onChange={(e) => setNewFileName(e.target.value)}
                                                    className="input input-bordered w-full mb-4"
                                                />

                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        className="btn btn-ghost"
                                                        onClick={() => {
                                                            setNewFileName("");
                                                            setShowAddFileModal(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            if (newFileName.trim()) {
                                                                // Initialize the new goal
                                                                setNewSmartGoal({
                                                                    fileName: newFileName,
                                                                    smart: {
                                                                        specific: "",
                                                                        measurable: "",
                                                                        achievable: "",
                                                                        relevant: "",
                                                                        timebound: "",
                                                                    },
                                                                });

                                                                setShowAddFileModal(false);
                                                                setShowSmartFormModal(true);
                                                                setNewFileName("");
                                                            }


                                                        }}
                                                    >
                                                        Next
                                                    </button>


                                                </div>
                                            </div>
                                        </div>
                                    )}


                                </div>

                                {/* File content in Goals folder + typing area */}
                                {openFolder.name == "Goals" && (

                                    < div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
                                        {/* Check if a file is selected */}
                                        {openFile ? (
                                            // Show selected file content
                                            <div className="p-4 bg-white rounded-lg shadow-sm h-full flex flex-col">
                                                <div className="flex justify-center">
                                                    <div className="flex items-between">
                                                        <h1 className="text-purple-800 font-semibold mb-2 text-xl mt-2">
                                                            {typeof openFile === "object" ? openFile.fileName : openFile}
                                                        </h1>

                                                    </div>
                                                </div>
                                                <p className="text-purple-700">
                                                    {typeof openFile === "object" ? openFile.text : "No content available."}
                                                </p>

                                                {/* Displaying the SMART Goals if they exist */}

                                                {/* If SMART goals exist */}
                                                {typeof openFile === "object" && openFile.smart ? (
                                                    <div className="space-y-3 mt-8">
                                                        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md shadow-sm">
                                                            <h4 className="font-semibold text-purple-700">Specific</h4>
                                                            <p className="text-gray-700">{openFile.smart?.specific}</p>
                                                        </div>
                                                        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md shadow-sm">
                                                            <h4 className="font-semibold text-purple-700">Measurable</h4>
                                                            <p className="text-gray-700">{openFile.smart?.measurable}</p>
                                                        </div>
                                                        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md shadow-sm">
                                                            <h4 className="font-semibold text-purple-700">Achievable</h4>
                                                            <p className="text-gray-700">{openFile.smart?.achievable}</p>
                                                        </div>
                                                        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md shadow-sm">
                                                            <h4 className="font-semibold text-purple-700">Relevant</h4>
                                                            <p className="text-gray-700">{openFile.smart?.relevant}</p>
                                                        </div>
                                                        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md shadow-sm">
                                                            <h4 className="font-semibold text-purple-700">Time Bound</h4>
                                                            <p className="text-gray-700">{openFile.smart?.timebound}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-purple-700">
                                                        {typeof openFile === "object" ? openFile.text || "No content available." : "No file selected."}
                                                    </p>
                                                )}
                                                <div className=" mt-auto flex justify-center items-center p-2">

                                                    <button
                                                        className="mt-4 btn btn-ghost w-40 border border-purple-500"
                                                        onClick={() => { setOpenFile(null); setOpenFile(null); }}
                                                    >
                                                        Back to Goals Overview
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Show default list of goals
                                            <ul className="space-y-3">
                                                {openFolder.items.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:bg-purple-100 transition-colors cursor-pointer"

                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 accent-purple-600"
                                                            readOnly
                                                        />
                                                        <span className="text-purple-800 font-medium">
                                                            {typeof file === "object" ? file.fileName : file}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}

                                {/* Creating a new file and adding it to the reflections folder */}
                                {addFile && openFolder.name == "Reflections" && (
                                    <div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
                                        <div className="bg-white w-[100%] h-[90%] p-6 rounded-xl shadow-lg flex flex-col gap-3 overflow-y-scroll">
                                            {messages.map((msg, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                                        }`}
                                                >
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl max-w-[75%] ${msg.sender === "user"
                                                            ? "bg-purple-100 text-purple-800 self-end"
                                                            : "bg-purple-200 text-purple-900"
                                                            }`}
                                                    >
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}

                                            {isTyping && (
                                                <div className="flex items-center gap-1 text-purple-400">
                                                    <span className="animate-bounce">•</span>
                                                    <span className="animate-bounce delay-100">•</span>
                                                    <span className="animate-bounce delay-100">•</span>
                                                </div>
                                            )}

                                            {!isTyping && currentIndex < reflectionQuestions.length && (
                                                <div className="flex mt-3">
                                                    <input
                                                        type="text"
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        placeholder="Type your answer..."
                                                        className="flex-1 border rounded-full px-4 py-2 text-sm border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                                    />
                                                    <button
                                                        onClick={handleSend}
                                                        className="ml-2 bg-purple-500 text-white rounded-full px-4 py-2 text-sm hover:bg-purple-600"
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                )}


                                {/* actual file content of Reflections folder + typing area */}
                                {addFile == false && openFolder.name == "Reflections" && (

                                    < div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">

                                        {/* Check if a file is selected */}
                                        {openFile ? (

                                            // Show selected file content
                                            < div className="p-4 bg-white rounded-lg shadow-sm h-full flex flex-col">
                                                {console.log("Open file: ", openFile)}
                                                {console.log("typeof openFile", typeof openFile)}
                                                {console.log("openFile === object", openFile === "object")}
                                                <div className="flex justify-center">
                                                    <div className="flex items-between">
                                                        <h1 className="text-purple-800 font-semibold mb-2 text-xl mt-2">
                                                            {openFile.title}
                                                        </h1>

                                                    </div>
                                                </div>


                                                {/* If reflections exist */}
                                                {typeof openFile === "object" && openFile.smart ? (
                                                    <div className="space-y-3 mt-8">
                                                        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md shadow-sm">
                                                            <h4 className="font-semibold text-purple-700">{openFile.title}</h4>
                                                            <p className="text-gray-700">{openFile.about}</p>
                                                        </div>

                                                    </div>
                                                ) : (
                                                    <p className="text-purple-700">

                                                    </p>
                                                )}
                                                <div className=" mt-auto flex justify-center items-center p-2">

                                                    <button
                                                        className="mt-4 btn btn-ghost w-40 border border-purple-500"
                                                        onClick={() => { setOpenFile(null); setOpenFile(null); }}
                                                    >
                                                        Back to Reflections Overview
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Show default overview of reflections
                                            <ul className="space-y-3">
                                                {openFolder.items.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:bg-purple-100 transition-colors cursor-pointer"

                                                    >

                                                        <span className="text-purple-800 font-medium">
                                                            {typeof file === "object" ? file.fileName : file}
                                                            <p className="text-purple-500 font-light text-sm italic">{file.text}</p>
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </>
    )
}

export default JournalRefined;
