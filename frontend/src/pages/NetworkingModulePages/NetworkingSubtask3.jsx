import React, { useEffect, useState, useRef, useMemo } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { gsap } from "gsap";
import toast from "react-hot-toast";
import Bear from "../../assets/Bear.svg";
import api from "../../lib/axios";
import { Draggable } from "gsap/Draggable";
import events from "../../../../backend/src/utils/networkingEvents";
import { FaStar } from "react-icons/fa";
import { Search, Calendar, MapPin, Clock, Star } from "lucide-react";




export default function NetworkingSubtask3({ userInfo = {}, onBack }) {
    const [userReflections, setUserReflections] = useState([]);
    const [selectedReflection, setSelectedReflection] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const bearRefs = useRef([]);
    const scaleRefs = useRef([]);
    const [eventSelected, setEventSelected] = useState(null);
    const [eventClicked, setEventClicked] = useState(null);
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest"); // "latest" | "rating" | "title"

    const filteredReflections = useMemo(() => {
    let list = [...userReflections];

    // filter
    const q = query.trim().toLowerCase();
    if (q) {
        list = list.filter(r => {
        const hay =
            `${r?.title || ""} ${r?.event?.name || ""} ${r?.responses?.map(x => x?.question).join(" ")}`.toLowerCase();
        return hay.includes(q);
        });
    }

    // sort
    if (sortBy === "rating") {
        list.sort((a, b) => avgScore(b.responses) - avgScore(a.responses));
    } else if (sortBy === "title") {
        list.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
    } else {
        // latest: use createdAt if present, else keep original order (most recent first by index)
        list.sort((a, b) => {
        const da = a?.createdAt ? new Date(a.createdAt).getTime() : -Infinity;
        const db = b?.createdAt ? new Date(b.createdAt).getTime() : -Infinity;
        return db - da;
        });
    }

    return list;
    }, [userReflections, query, sortBy]);
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
    const avgScore = (responses = []) =>
    responses.length
        ? Math.round(
            (responses.reduce((s, r) => s + Number(r?.answer || 0), 0) / responses.length) * 10
        ) / 10
        : 0;

    const Stars = ({ value = 0, size = 16 }) => (
    <div className="flex items-center gap-0.5">
        {[0,1,2,3,4].map(i => (
        <Star
            key={i}
            size={size}
            className={i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
        />
        ))}
        <span className="ml-1 text-xs text-slate-600">{value.toFixed(1)}</span>
    </div>
    );


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

            {activeTab === "new" && (
            <section className="w-full">
                <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.15fr,1fr]">
                {/* LEFT: Title + Event */}
                <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Create a new reflection</h3>
                        <p className="text-sm text-slate-500">Choose an attended event and give it a title.</p>
                    </div>
                    </header>

                    <div className="space-y-5 p-5">
                    {/* Title */}
                    <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                        Reflection title
                        </label>
                        <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Tech Careers Night — great conversations!"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                    </div>

                    {/* Event selector */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-800">Attended events</label>

                        <div className="grid max-h-72 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                        {userEvents
                            .filter((ue) => ue?.status === "attended")
                            .map((ue) => {
                            const evt = events.find((e) => e.id === ue.eventId);
                            if (!evt) return null;
                            const selected = eventClicked?.id === evt.id;

                            return (
                                <button
                                key={evt.id}
                                onClick={() => {
                                    setEventSelected(ue);
                                    setEventClicked(evt);
                                }}
                                className={[
                                    "text-left rounded-lg border p-3 transition",
                                    selected
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-slate-50 hover:bg-white",
                                ].join(" ")}
                                >
                                <div className="font-medium">{evt.name}</div>
                                <div className="text-xs opacity-80">{evt.date}</div>
                                <div className="text-xs italic opacity-80">{evt.location}</div>
                                </button>
                            );
                            })}

                        {/* Empty state */}
                        {userEvents.filter((ue) => ue?.status === "attended").length === 0 && (
                            <div className="col-span-full flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                            You have no attended events yet.
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                </section>

                {/* RIGHT: Questions */}
                <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Reflection questions</h3>
                        <p className="text-sm text-slate-500">Tap an emoji to rate your experience.</p>
                    </div>

                    {/* Progress */}
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                        {answers.filter((a) => a > 0).length}/{questions.length} answered
                    </span>
                    </header>

                    <div className="space-y-5 p-5">
                    {questions.map((question, index) => (
                        <div key={index} className="rounded-lg border border-slate-200 p-3">
                        <p className="mb-2 text-sm font-medium text-slate-800">
                            {index + 1}. {question}
                        </p>

              {/* Track */}
              <div
                ref={(el) => (scaleRefs.current[index] = el)}
                className="relative h-20 rounded-md bg-gradient-to-r from-slate-100 via-white to-slate-100"
              >
                {/* Bear icon (moves horizontally) */}
                <img
                  ref={(el) => (bearRefs.current[index] = el)}
                  src={Bear}
                  alt="Bear"
                  className="absolute top-1/2 -translate-y-1/2 h-10 w-10 select-none"
                  draggable={false}
                />

                {/* Emoji row */}
                <div className="absolute bottom-1 left-2 right-2 flex justify-between text-lg sm:text-xl">
                  {["😡", "🙁", "😐", "🙂", "😀"].map((emoji, step) => (
                    <button
                      key={step}
                      type="button"
                      aria-label={`Rate ${step + 1} out of 5`}
                      className={[
                        "rounded-md px-2 py-1 transition",
                        answers[index] === step + 1 ? "scale-110" : "opacity-90 hover:scale-110",
                      ].join(" ")}
                      onClick={() => {
                        const track = scaleRefs.current[index];
                        const bear = bearRefs.current[index];
                        if (!track || !bear) return;
                        const totalSteps = 5;
                        const stepWidth = track.clientWidth / (totalSteps - 1);
                        const bearOffset = bear.clientWidth / 2;
                        const x = step * stepWidth - bearOffset + 16; // +16 ≈ left padding (left-2)
                        gsap.to(bear, { x, duration: 0.35, ease: "power2.out" });
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[index] = step + 1; // 1..5
                          return next;
                        });
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected value */}
              <div className="mt-1 text-xs text-slate-600">
                Selected: <span className="font-medium">{answers[index] || "—"}</span>/5
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setAnswers(Array(questions.length).fill(0))}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={saveReflection}
              disabled={
                !title.trim() ||
                !eventSelected?._id ||
                answers.some((a) => a === 0)
              }
              className={[
                "rounded-md px-5 py-2 text-sm font-medium",
                !title.trim() || !eventSelected?._id || answers.some((a) => a === 0)
                  ? "cursor-not-allowed border border-slate-200 bg-slate-200 text-slate-500"
                  : "bg-slate-900 text-white hover:bg-slate-800",
              ].join(" ")}
            >
              Save Reflection
            </button>
          </div>
        </div>
      </section>
    </div>
  </section>
)}


            {/* Reflections UI */}
            {activeTab === "past" && (
            <section className="mx-auto mt-16 w-full max-w-6xl">
                <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
                    {/* search */}
                    <div className="relative flex-1 min-w-[220px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search reflections, events, or questions…"
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
                    />
                    </div>

                    {/* sort */}
                    <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">Sort by</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <option value="latest">Latest</option>
                        <option value="rating">Highest rating</option>
                        <option value="title">Title A–Z</option>
                    </select>
                    </div>

                    <div className="ml-auto text-xs text-slate-500">
                    Showing {filteredReflections.length}/{userReflections.length}
                    </div>
                </div>

                {/* Content grid */}
                <div className="grid gap-0 lg:grid-cols-[0.95fr,1.05fr]">
                    {/* LEFT: list */}
                    <aside className="max-h-[70vh] overflow-y-auto border-r border-slate-100 p-3">
                    {filteredReflections.length === 0 && (
                        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                        No reflections match your search.
                        </div>
                    )}

                    <div className="space-y-2">
                        {filteredReflections.map((r, idx) => {
                        const active = selectedReflection?._id === r._id;
                        const score = avgScore(r.responses);
                        return (
                            <button
                            key={r._id || idx}
                            onClick={() => setSelectedReflection(r)}
                            className={[
                                "w-full text-left rounded-lg border p-3 transition",
                                active
                                ? "border-slate-900 bg-slate-200 text-black"
                                : "border-slate-200 bg-slate-50 hover:bg-white",
                            ].join(" ")}
                            >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                <div className="truncate text-sm font-semibold">
                                    {r.title || `Reflection ${idx + 1}`}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                                    {r?.event?.date && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                        <Calendar className="size-3 opacity-70" />
                                        {r.event.date}
                                    </span>
                                    )}
                                    {r?.event?.location && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                        <MapPin className="size-3 opacity-70" />
                                        {r.event.location}
                                    </span>
                                    )}
                                    {r?.createdAt && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                        <Clock className="size-3 opacity-70" />
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </span>
                                    )}
                                </div>
                                <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                                    {r.responses?.[0]?.question}
                                </p>
                                </div>

                                <Stars value={score} />
                            </div>
                            </button>
                        );
                        })}
                    </div>
                    </aside>

                    {/* RIGHT: detail */}
                    <section className="p-5">
                    {!selectedReflection ? (
                        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                        Select a reflection to view its details
                        </div>
                    ) : (
                        <>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                {selectedReflection.title || "Reflection"}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-2 text-[12px] text-slate-600">
                                {selectedReflection?.event?.name && (
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                                    {selectedReflection.event.name}
                                </span>
                                )}
                                {selectedReflection?.event?.date && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                                    <Calendar className="size-3" />
                                    {selectedReflection.event.date}
                                </span>
                                )}
                                {selectedReflection?.event?.location && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                                    <MapPin className="size-3" />
                                    {selectedReflection.event.location}
                                </span>
                                )}
                                {selectedReflection?.createdAt && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5">
                                    <Clock className="size-3" />
                                    {new Date(selectedReflection.createdAt).toLocaleString()}
                                </span>
                                )}
                            </div>
                            </div>

                            <Stars value={avgScore(selectedReflection.responses)} />
                        </div>

                        <div className="mt-6 space-y-4">
                            {selectedReflection.responses?.map((resp, i) => (
                            <div key={resp._id || i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="text-sm font-medium text-slate-800">
                                {i + 1}. {resp.question}
                                </p>

                                {/* tiny progress bar */}
                                <div className="mt-2 h-2 w-full rounded bg-slate-200">
                                <div
                                    className="h-2 rounded bg-blue-500"
                                    style={{ width: `${Math.max(0, Math.min(100, (Number(resp.answer || 0) / 5) * 100))}%` }}
                                />
                                </div>
                                <div className="mt-1 text-xs text-slate-600">Answer: {resp.answer}/5</div>
                            </div>
                            ))}
                        </div>
                        </>
                    )}
                    </section>
                </div>
                </div>
            </section>
            )}
        </div>
    )
};
