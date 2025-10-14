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
    console.log("Saving reflection:", {
      reflectionTitle,
      about,
      feeling,
      whatWentWell,
      improvement,
      rating
    });
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

          <div className="flex justify-center items-center h-[calc(100vh-65px)]">
            <div className="flex justify-center items-center">
              <div className="relative w-3/4">
                {/* Monitor here */}
                <img src={MonitorImage} alt="Monitor" className="w-full h-auto" />

                <div
                  className="absolute top-[9%] left-[5.25%] w-[88.85%] h-10 flex items-center px-4"
                  style={{ backgroundColor: "rgba(67,109,133,0.30)" }}
                >
                  {/*<img src={AddFolderImage} alt="icon" className="h-7 w-auto ml-1" /> - removing this for now*/}
                  {/*<p className="text-white font-bold">Its Goal Setting Time User!</p>*/}
                </div>

                <div className="absolute top-[20%] right-[9%] flex flex-col items-center gap-8">
                  {folders.map((folder, index) => (
                    <div key={index} className="flex flex-col items-center cursor-pointer">
                      <button onClick={() => setOpenFolder(folder)}>
                        <img src={folder.image} alt={folder.name} className="w-16 h-auto" />
                      </button>
                      <span className="text-black text-sm mt-1">{folder.name}</span>
                    </div>
                  ))}
                </div>
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
                <div className="w-[20%] bg-purple-400 p-4 flex flex-col gap-3 overflow-y-auto">
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
                      setAddFile(true);
                    }}
                  >
                    + Add New File
                  </button>
                </div>

                {openFolder && !openFile && !addFile && (
                  <div className="flex flex-col justify-center items-center bg-purple-50 text-purple-400 w-[100%] text-2xl">
                    <div>
                      {" "}
                      <img src={Logo} className="h-32 w-52"></img>
                    </div>
                    <div>Click a file to get started...</div>
                  </div>
                )}

                {/* Creating a new file and adding it to the reflections folder */}
                {addFile && openFolder.name == "Reflections" && (
                  <div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
                    <div className="bg-white w-[100%] h-[95%] p-6 rounded-xl shadow-lg flex flex-col gap-3">
                      <div className="h-[95%] overflow-y-auto pb-20 ">
                        {messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${
                              msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`px-4 py-2 rounded-2xl max-w-[75%] mt-2 border border-purple-600 ${
                                msg.sender === "user"
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
                                                            ${
                                                              feeling.emoji === index + 1
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
                  ${
                    isSelected
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
          ${
            rating
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

                {/* actual file content of Reflections folder + typing area */}
                {openFile && addFile == false && openFolder.name == "Reflections" && (
                  <div className="border border-purple-300 flex-1 bg-purple-50 p-6 overflow-y-auto flex flex-col rounded-lg shadow-sm">
                    {/* Check if a file is selected */}
                    {openFile ? (
                      // Show selected file content
                      <div className="p-4 bg-white rounded-lg shadow-sm h-full flex flex-col">
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
                          <p className="text-purple-700"></p>
                        )}
                        <div className=" mt-auto flex justify-center items-center p-2">
                          <button
                            className="mt-4 btn btn-ghost w-40 border border-purple-500"
                            onClick={() => {
                              setOpenFile(null);
                              setOpenFile(null);
                            }}
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
                              <p className="text-purple-500 font-light text-sm italic">
                                {file.text}
                              </p>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
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
                            className={`flex ${
                              msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`px-4 py-2 rounded-2xl max-w-[75%] mt-2 border border-purple-600
                                                                    ${
                                                                      msg.sender === "user"
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
