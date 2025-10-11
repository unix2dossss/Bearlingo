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
import BackgroundMusicBox from '../components/BackgroundMusicBox';


const JournalRefined = () => {
    const [reflections, setReflections] = useState([]);
    const [goals, setGoals] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newFileName, setNewFileName] = useState("");
    const [openFolder, setOpenFolder] = useState(false);
    const [showAddFileModal, setShowAddFileModal] = useState(false);
    const [openFile, setOpenFile] = useState(false);

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



    // These are not needed when retrieving data from backend but were used in previous journal implementation
    const [showSmartFormModal, setShowSmartFormModal] = useState(false);
    const [newSmartGoal, setNewSmartGoal] = useState({
        fileName: "",
        smart: {
            specific: "",
            measurable: "",
            achievable: "",
            relevant: "",
            timebound: "",
        },
    });
    const [newReflection, setNewReflection] = useState({
        fileName: "",
        text: ""
    })



    return (
        <>
            <div className="bg-blue-200">
                <TopNavbar />

                <BackgroundMusicBox moduleName="Journal" />

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
                                        onClick={() => setShowAddFileModal(true)}
                                    >
                                        + Add New File
                                    </button>

                                    {/* Creating a new file and adding it to the goals folder */}
                                    {showAddFileModal && openFolder.name == "Goals" && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
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

                                    {/* Creating a new file and adding it to the reflections folder */}
                                    {showAddFileModal && openFolder.name == "Reflections" && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                            <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg">
                                                <h2 className="text-lg font-bold mb-4 text-purple-600">
                                                    Add A New Entry To {openFolder.name}
                                                </h2>

                                                <input
                                                    type="text"
                                                    placeholder="Enter name of Reflection"
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
                                                                setNewReflection({
                                                                    fileName: newFileName,
                                                                    text: ""
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

                                    {/* Filling out SMART goals in modal for Goals folder */}
                                    {showSmartFormModal && openFolder.name == "Goals" && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                            <div className="bg-white w-[600px] p-6 rounded-xl shadow-lg">
                                                <h2 className="text-lg font-bold mb-4 text-purple-600">
                                                    Fill SMART details for {newSmartGoal.fileName}
                                                </h2>

                                                {["Specific - What is one specific thing you want to achieve in the next 2 weeks? ", "measurable - How will you measure progress toward this goal?", "achievable - Is this goal achievable with the resources you have? ", "relevant - Why is this goal relevant to your long-term vision? ", "timebound - What is your deadline for completing this goal?"].map((field) => {
                                                    const [label, placeholder] = field.split(" - ");
                                                    return (
                                                        <div key={field} className="mb-3">

                                                            <label className="block font-semibold text-purple-700 capitalize">{label}</label>
                                                            <input
                                                                type="text"
                                                                className="input input-bordered w-full"
                                                                placeholder={placeholder}
                                                                value={newSmartGoal.smart[field]}
                                                                onChange={(e) =>
                                                                    setNewSmartGoal((prev) => ({
                                                                        ...prev,
                                                                        smart: { ...prev.smart, [label.toLowerCase()]: e.target.value }
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    );
                                                })}

                                                <div className="flex justify-end gap-3 mt-4">
                                                    <button
                                                        className="btn btn-ghost"
                                                        onClick={() => setShowSmartFormModal(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            // Add new goal to Goals folder
                                                            setFolders((currentFolders) =>
                                                                currentFolders.map((folder) =>
                                                                    folder.name === "Goals"
                                                                        ? { ...folder, files: [...folder.files, newSmartGoal] }
                                                                        : folder
                                                                )
                                                            );

                                                            // Also update the openFolder object if it's currently open
                                                            setOpenFolder((prev) =>
                                                                prev.name === "Goals"
                                                                    ? { ...prev, files: [...prev.files, newSmartGoal] }
                                                                    : prev
                                                            );

                                                            setShowSmartFormModal(false);
                                                            setOpenFile(newSmartGoal); // Optionally open the newly created goal
                                                        }}
                                                    >
                                                        Save Goal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Filling out reflection text in modal for Reflections folder */}
                                    {showSmartFormModal && openFolder.name == "Reflections" && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                                            <div className="bg-white w-[600px] p-6 rounded-xl shadow-lg">
                                                <h2 className="text-lg font-bold mb-4 text-purple-600">
                                                    Fill out reflection for {newReflection.fileName}
                                                </h2>

                                                <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                                                <h4 className="text-black text-sm font-extralight italic">
                                                    Example prompts: How are you feeling about your career this week? Are you happy with the direction you’re heading in? What challenges are you facing right now? How will you overcome this challenge? How clear are you about your next steps?
                                                </h4>
                                                <hr class="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                                                <div className="mb-3">

                                                    <label className="block font-semibold text-purple-700 capitalize">Reflection</label>
                                                    <input
                                                        type="text"
                                                        className="input input-bordered w-full"
                                                        placeholder={""}
                                                        value={newReflection.text}
                                                        onChange={(e) =>
                                                            setNewReflection((prev) => ({
                                                                ...prev,
                                                                text: e.target.value
                                                            }))
                                                        }
                                                    />
                                                </div>


                                                <div className="flex justify-end gap-3 mt-4">
                                                    <button
                                                        className="btn btn-ghost"
                                                        onClick={() => setShowSmartFormModal(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            // Add new goal to Goals folder
                                                            setFolders((currentFolders) =>
                                                                currentFolders.map((folder) =>
                                                                    folder.name === "Reflections"
                                                                        ? { ...folder, files: [...folder.files, newReflection] }
                                                                        : folder
                                                                )
                                                            );

                                                            // Also update the openFolder object if it's currently open
                                                            setOpenFolder((prev) =>
                                                                prev.name === "Reflections"
                                                                    ? { ...prev, files: [...prev.files, newReflection] }
                                                                    : prev
                                                            );

                                                            setShowSmartFormModal(false);
                                                            setOpenFile(newReflection); // Optionally open the newly created goal
                                                        }}
                                                    >
                                                        Save Reflection
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


                                {/* actual file content of Reflections folder + typing area */}
                                {openFolder.name == "Reflections" && (

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

                                                {/* Displaying the SMART Goals if they exist */}

                                                {/* If SMART goals exist */}
                                                {typeof openFile === "object" && openFile.smart ? (
                                                    <div className="space-y-3 mt-8">
                                                        <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-md shadow-sm">
                                                            <h4 className="font-semibold text-purple-700">Specific</h4>
                                                            <p className="text-gray-700">{openFile.text}</p>
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
