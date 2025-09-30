import React, { useEffect, useState, useRef } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import Bear from "../../assets/Bear.svg";
import api from "../../lib/axios";
import { Draggable } from "gsap/Draggable";
import events from "../../../../backend/src/utils/networkingEvents";
import { FaStar } from "react-icons/fa";



export default function NetworkingSubtask3({ userInfo = {}, onBack }) {
    const [userReflections, setUserReflections] = useState([]);
    const [selectedReflection, setSelectedReflection] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const bearRefs = useRef([]);
    const scaleRefs = useRef([]);
    const [eventSelected, setEventSelected] = useState(null);
    const [eventClicked, setEventClicked] = useState(null);
    const questions = [
        "I connected with someone new at this event and it was useful",
        "I learned something valuable at this event",
        "I feel more confident about networking after this event",
        "I have a clear next step to follow up with people I met"
    ];
    const [answers, setAnswers] = useState(Array(questions.length).fill(0));
    const [activeTab, setActiveTab] = useState("new"); // "new" or "past"
    const [title, setTitle] = useState("");

    gsap.registerPlugin(Draggable);


    const getReflections = async () => {
        try {
            const reflections = await api.get("/users/me/networking/reflections",
                { withCredentials: true }
            );

            setUserReflections(reflections.data.reflections);
            setSelectedReflection(reflections.data.reflections[0]);
        } catch (error) {
            console.log("Erorr in retrieving reflections", error);
            toast.error("Erorr in retrieving reflections");
        }
    };

    const getUserEvents = async () => {
        try {
            const res = await api.get("/users/me/networking/events", {
                withCredentials: true,
            });
            setUserEvents(res?.data?.eventsToAttend[0].attendingEventIds || []);
        } catch (error) {
            console.error("User events were not fetched", error);
            toast.error("User events were not fetched");
        }
    };

    useEffect(() => {
        getReflections();
        getUserEvents();
    }, []);

    const saveReflection = async () => {
        try {

            const responses = questions.map((q, index) => ({
                question: q,
                answer: answers[index], // +1 as steps are 0–4 but backend expects 1–5
            }));

            console.log("eventSelected: ", eventSelected._id);

            const saveReflection = await api.post("/users/me/networking/reflections", {
                title: title,
                responses: responses,
                event: eventSelected?._id
            }, { withCredentials: true })
            setUserReflections(prev => {
                const updated = [...prev];
                updated.push(saveReflection.data.reflection);
                return updated;
            })

            setAnswers(Array(questions.length).fill(0));
            setEventSelected(null);
            setEventClicked(null);
            toast.success("Reflection saved!");

        } catch (error) {
            console.log("Error in saving reflection", error);
            toast.error("Error in saving reflection!");
        }
    };


    return (

        <div className="pt-16 bg-[#4f9cf9] relative min-h-screen flex flex-row min-w-0 gap-4 p-4">
            {/* Go back */}

            <button
                className="btn btn-ghost absolute top-20 left-6 z-10"
                onClick={onBack}
            >
                <ArrowLeftIcon className="size-5" />
                Back to subtasks
            </button>
            {/* name of each tab group should be unique */}
            {/* Tab buttons */}
            <div className="absolute top-16 left-[37%] tabs tabs-box w-max mx-auto mb-6 flex flex-row gap-6">
                <button
                    onClick={() => setActiveTab("new")}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200
      ${activeTab === "new"
                            ? "bg-blue-500 text-white shadow-lg scale-105"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
                        }`}
                >
                    📝 New Reflection
                </button>

                <button
                    onClick={() => setActiveTab("past")}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200
      ${activeTab === "past"
                            ? "bg-blue-500 text-white shadow-lg scale-105"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
                        }`}
                >
                    📚 Past Reflections
                </button>

            </div>

            {activeTab == 'new' && (
                <div className=" w-[100%] flex justify-center">
                    <div className="flex flex-col gap-8 bg-slate-300 min-h-screen mt-16 p-4  w-[80%]">
                        {/* Title + Event Selection */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                🎉 Choose an event to reflect on!
                            </h2>
                            <div className="mb-2">
                                <label className="flex items-center gap-2 text-lg font-bold text-yellow-600 mb-2">
                                    <FaStar className="animate-bounce" /> Reflection Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter your reflection title..."
                                    className="
          w-full px-4 py-3 rounded-lg bg-yellow-50 border-2 border-yellow-300
          focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200
          placeholder-yellow-400 text-yellow-900 font-semibold
          shadow-sm focus:shadow-md transition-all duration-300
        "
                                />


                            </div>

                            <div className="border-2 border-red-400 h-[300px] w-[98%] mx-auto overflow-y-auto 
                    bg-white rounded-xl p-4 flex flex-2 flex-col gap-4 shadow-inner">
                                {userEvents.map((userEvent) => {
                                    const event = events.find(
                                        (e) => e.id === userEvent.eventId && userEvent.status === "attended"
                                    );
                                    if (!event) return null;

                                    const isSelected = eventClicked?.id === event.id;


                                    return (
                                        <button
                                            key={event.id}
                                            onClick={() => {
                                                setEventSelected(userEvent);
                                                setEventClicked(event);
                                            }}

                                            className={`flex flex-col text-left p-4 rounded-xl shadow-md transition-all duration-200 
                        hover:scale-105 hover:shadow-xl 
                        ${isSelected
                                                    ? "bg-blue-500 text-white border-2 border-blue-700"
                                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                                                }`}
                                        >
                                            <h3 className="font-bold text-lg">{event.name}</h3>
                                            <p className="text-sm">{event.date}</p>
                                            <p className="text-sm italic">{event.location}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reflection Questions */}
                        <div className="flex flex-col gap-6">
                            {questions.map((question, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-md h-[200px]"
                                >
                                    <p className="text-gray-800 font-semibold text-lg">
                                        {index + 1}. {question}
                                    </p>

                                    {/* Slider Track */}
                                    <div
                                        ref={(el) => (scaleRefs.current[index] = el)}
                                        className="relative h-24 w-[90%] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"
                                    >
                                        {/* Bear */}
                                        <img
                                            ref={(el) => (bearRefs.current[index] = el)}
                                            src={Bear}
                                            alt="Bear"
                                            className="absolute top-[15px] w-12 h-12 select-none"
                                        />

                                        {/* Emoji Labels */}
                                        <div className="absolute bottom-[-40px] left-0 right-0 flex justify-around text-2xl font-medium text-gray-600 px-2">
                                            {["😡", "🙁", "😐", "🙂", "😀"].map((emoji, step) => (
                                                <button
                                                    key={step}
                                                    onClick={() => {
                                                        const container = scaleRefs.current[index];
                                                        const bear = bearRefs.current[index];

                                                        if (!container || !bear) return;

                                                        const totalSteps = 5;
                                                        const stepWidth = container.offsetWidth / (totalSteps - 1);

                                                        // Center bear over emoji
                                                        const bearOffset = bear.offsetWidth / 2;
                                                        const emojiElements = container.querySelectorAll("button");
                                                        const targetX = emojiElements[step].offsetLeft + emojiElements[step].offsetWidth / 2 - bearOffset;


                                                        gsap.to(bear, {
                                                            x: targetX,
                                                            duration: 0.4,
                                                            ease: "power2.out",
                                                        });

                                                        setAnswers((prev) => {
                                                            const updated = [...prev];
                                                            updated[index] = step + 1;
                                                            return updated;
                                                        });

                                                        console.log(`Q${index + 1} → ${step + 1}`);
                                                    }}
                                                    className="cursor-pointer hover:scale-125 transition-transform"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                        <div className="flex justify-center">
                            <button
                                className="btn btn-primary mt-4 w-[40%]"
                                onClick={saveReflection}
                            >
                                Save Reflection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reflections UI */}
            {activeTab == 'past' && (
                <div className="flex-1 flex border border-blue-500 bg-gray-100 h-[63%] mt-16">
                    {/* Left: Reflections List */}
                    <div className="w-1/2 border-r border-gray-300 p-6 overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Past Reflections</h2>
                        <div className="space-y-4">
                            {userReflections.map((reflection, index) => (
                                <div
                                    key={reflection._id || index}
                                    onClick={() => setSelectedReflection(reflection)}
                                    className={`p-4 rounded-xl shadow cursor-pointer transition ${selectedReflection === reflection
                                        ? "bg-blue-100 border border-blue-400"
                                        : "bg-white hover:bg-gray-50"
                                        }`}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {reflection.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 truncate">
                                        {/* Show first question as a preview */}
                                        {reflection.responses[0]?.question}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Reflection Detail */}
                    <div className="w-1/2 p-6">
                        {selectedReflection ? (
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    {selectedReflection.title} Details
                                </h2>
                                <ul className="space-y-3">
                                    {selectedReflection.responses.map((resp) => (
                                        <li
                                            key={resp._id}
                                            className="p-3 border rounded-lg bg-gray-50"
                                        >
                                            <p className="font-medium text-gray-800">{resp.question}</p>
                                            <p className="text-gray-600">Answer: {resp.answer}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                {selectedReflection == null ? 'Create a reflection' : 'Select a reflection to view its details'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div >



    )
};
