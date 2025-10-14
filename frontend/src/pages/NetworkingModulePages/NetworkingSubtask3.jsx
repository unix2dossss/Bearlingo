import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { ArrowLeftIcon, Search, Calendar, MapPin, Clock, Star } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // "latest" | "rating" | "title"
  const [answers, setAnswers] = useState(Array(4).fill(0));
  const [activeTab, setActiveTab] = useState("new");
  const [title, setTitle] = useState("");

  gsap.registerPlugin(Draggable);

  const questions = [
    "I connected with someone new at this event and it was useful",
    "I learned something valuable at this event",
    "I feel more confident about networking after this event",
    "I have a clear next step to follow up with people I met",
  ];

  const avgScore = (responses = []) =>
    responses.length
      ? Math.round(
          (responses.reduce((s, r) => s + Number(r?.answer || 0), 0) /
            responses.length) *
            10
        ) / 10
      : 0;

  const filteredReflections = useMemo(() => {
    let list = [...userReflections];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter((r) => {
        const hay = `${r?.title || ""} ${r?.event?.name || ""} ${r?.responses
          ?.map((x) => x?.question)
          .join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (sortBy === "rating") {
      list.sort((a, b) => avgScore(b.responses) - avgScore(a.responses));
    } else if (sortBy === "title") {
      list.sort((a, b) =>
        (a?.title || "").localeCompare(b?.title || "")
      );
    } else {
      list.sort((a, b) => {
        const da = a?.createdAt ? new Date(a.createdAt).getTime() : -Infinity;
        const db = b?.createdAt ? new Date(b.createdAt).getTime() : -Infinity;
        return db - da;
      });
    }

    return list;
  }, [userReflections, query, sortBy]);

  const getReflections = async () => {
    try {
      const reflections = await api.get("/users/me/networking/reflections", {
        withCredentials: true,
      });
      setUserReflections(reflections.data.reflections);
      setSelectedReflection(reflections.data.reflections[0]);
    } catch (error) {
      console.log("Error in retrieving reflections", error);
      toast.error("Error in retrieving reflections");
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
        answer: answers[index],
      }));

      const saveReflection = await api.post(
        "/users/me/networking/reflections",
        {
          title: title,
          responses: responses,
          event: eventSelected?._id,
        },
        { withCredentials: true }
      );

      setUserReflections((prev) => [...prev, saveReflection.data.reflection]);
      setAnswers(Array(questions.length).fill(0));
      setEventSelected(null);
      setEventClicked(null);
      toast.success("Reflection saved!");
    } catch (error) {
      console.log("Error in saving reflection", error);
      toast.error("Error in saving reflection!");
    }
  };

  const Stars = ({ value = 0, size = 16 }) => (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i < Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }
        />
      ))}
      <span className="ml-1 text-xs text-slate-600">
        {value.toFixed(1)}
      </span>
    </div>
  );
  



return (
  <div className="min-h-screen w-full bg-[#fffef6]">

    {/* Back button */}
    <button
      className="btn btn-ghost absolute top-20 left-6 z-50 text-[#111827]"
      onClick={onBack}
    >
      <ArrowLeftIcon className="size-5" />
      Back to subtasks
    </button>



    {/* NEW Reflection */}
    {activeTab === "new" && (
      <section className="mx-auto max-w-6xl px-4 pt-28 pb-10">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          {/* LEFT: blue panel */}
          <aside
            className="lg:sticky lg:top-24 self-start rounded-[22px] border border-[#bcd1ea] bg-[#bcd1ea]/70 p-4 shadow-sm flex flex-col"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <h3 className="text-xl font-bold text-[#0f172a]">Create a new reflection</h3>
            <p className="mt-0.5 text-sm text-slate-600">
              Choose an attended event and give it a title.
            </p>

            {/* Title */}
            <label className="mt-4 block text-sm font-bold text-slate-800">
              Reflection title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Tech Careers Night — great conversations!"
              className="mt-2 w-full rounded-lg border border-white bg-white px-4 py-2.5 text-slate-800 outline-none ring-offset-0 focus:border-[#9ab6dd] focus:ring-2 focus:ring-[#9ab6dd]/40"
            />

            {/* Attended events */}
            <div className="mt-5">
              <div className="mb-2 text-sm font-bold text-slate-800">Attended events</div>
              <div className="h-[530px] overflow-y-auto pr-1 space-y-3">
                {userEvents.filter((ue) => ue?.status === "attended").map((ue) => {
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
                        "w-full text-left rounded-2xl border p-4 transition shadow-sm",
                        selected
                          ? "border-[#fff6bf] bg-[#fff6bf] text-black"
                          : "border-white bg-white hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="font-semibold">{evt.name}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {evt.date} • <em>{evt.location}</em>
                      </div>
                    </button>
                  );
                })}

                {userEvents.filter((ue) => ue?.status === "attended").length === 0 && (
                  <div className="flex h-28 items-center justify-center rounded-2xl border border-white bg-white text-sm text-slate-500">
                    You have no attended events yet.
                  </div>
                )}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="mt-4 flex gap-3">
            {/* New Reflection */}
            <button
                onClick={() => setActiveTab("new")}
                aria-pressed={activeTab === "new"}
                className={[
                "rounded-xl px-3 py-2 text-sm font-medium transition-all",
                "border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0",
                activeTab === "new"
                    // ACTIVE (blue)
                    ? "bg-[#fff6bf] border-[#fff6bf] text-black hover:brightness-105"
                    // INACTIVE (yellow pill)
                    : "bg-[#fff6bf] border-[#f4e58b] text-[#111827] hover:bg-[#fbe24f]"
                ].join(" ")}
            >
                ➕ New Reflection
            </button>

            {/* Past Reflections */}
            <button
                onClick={() => setActiveTab("past")}
                aria-pressed={activeTab === "past"}
                className={[
                "rounded-xl px-3 py-2 text-sm font-medium transition-all",
                "border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0",
                activeTab === "past"
                    // ACTIVE (blue)
                    ? "bg-[#4f9cf9] border-[#4f9cf9] text-white hover:brightness-105"
                    // INACTIVE (white pill)
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                ].join(" ")}
            >
                🎓 Past Reflections
            </button>
            </div>
          </aside>

          {/* RIGHT: pale-yellow questions panel */}
          <section
            className="rounded-[26px] border border-[#f4e58b] bg-[#fff6bf] p-6 shadow-sm"
            style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0f172a]">Reflection questions</h3>
                <p className="text-sm text-[#7a6a28]">Tap an emoji to rate your experience.</p>
              </div>
              <span className="rounded-full border border-[#f4e58b] bg-white px-3 py-1 text-xs text-[#7a6a28]">
                {answers.filter((a) => a > 0).length}/{questions.length} answered
              </span>
            </div>

            <div className="space-y-5">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#f7ec9e] bg-white p-4 shadow-sm"
                >
                  <p className="mb-3 text-[15px] font-semibold text-[#0f172a]">
                    {i + 1}. {q}
                  </p>

            {/* Heart rating (DaisyUI) */}
            <div className="mt-3">
            <div className="rating rating-lg grid grid-cols-5 gap-6 sm:gap-10 place-items-center">
                {[1, 2, 3, 4, 5].map((val) => {
                const colors = [
                    "bg-red-400",
                    "bg-orange-400",
                    "bg-yellow-400",
                    "bg-lime-400",
                    "bg-green-400",
                ];
                const captions = [
                    "Strongly disagree",
                    "Disagree",
                    "Neutral",
                    "Agree",
                    "Strongly agree",
                ];

                return (
                    <div key={val} className="flex flex-col items-center gap-1">
                    {/* Heart */}
                    <input
                        type="radio"
                        name={`rating-q-${i}`}
                        className={`mask mask-heart ${colors[val - 1]} opacity-50 transition-opacity duration-200
                                    checked:opacity-100 hover:opacity-100`}
                        aria-label={`${val} out of 5`}
                        checked={answers[i] === val}
                        onChange={() =>
                        setAnswers((prev) => {
                            const next = [...prev];
                            next[i] = val;
                            return next;
                        })
                        }
                    />
                    {/* Label under each heart */}
                    <span className="text-[10px] text-[#7a6a28] font-medium text-center w-20">
                        {captions[val - 1]}
                    </span>
                    </div>
                );
                })}
            </div>
            </div>

                </div>
              ))}

              {/* Submit */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={saveReflection}
                  disabled={
                    !title?.trim() || !eventSelected?._id || answers.some((a) => a === 0)
                  }
                  className={[
                    "mx-auto rounded-2xl px-8 py-3 text-lg font-semibold shadow-sm transition",
                    !title?.trim() || !eventSelected?._id || answers.some((a) => a === 0)
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "bg-[#bcd1ea] text-black hover:brightness-105",
                  ].join(" ")}
                >
                  Submit
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    )}

                {/* PAST Reflections */}
                {activeTab === "past" && (
                <section className="mx-auto max-w-6xl px-4 pt-28 pb-10">
                    <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
                    {/* LEFT: Blue panel */}
                    <aside
                        className="lg:sticky lg:top-24 self-start rounded-[22px] border border-[#bcd1ea] bg-[#bcd1ea]/70 p-4 shadow-sm flex flex-col"
                        style={{ backdropFilter: "blur(2px)" }}
                    >
                        <h3 className="text-xl font-bold text-[#0f172a]">Search reflections</h3>

                        {/* Search box */}
                        <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="search reflections, event or questions…"
                        className="mt-3 w-full rounded-xl border border-white bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-[#9ab6dd]/40"
                        />

                        {/* Sort pills */}
                        <div className="mt-4 text-sm font-semibold text-[#0f172a]">Sort by</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                        {[
                            { key: "latest", label: "Latest" },
                            { key: "rating", label: "Rating" },
                            { key: "title",  label: "Title"  },
                        ].map(({ key, label }) => (
                            <button
                            key={key}
                            onClick={() => setSortBy(key)}
                            className={[
                                "rounded-full px-3 py-1.5 text-sm font-medium transition",
                                sortBy === key
                                ? "bg-white text-[#0f172a] shadow-sm"
                                : "bg-white-opacity-50 text-slate-700 hover:bg-white",
                            ].join(" ")}
                            >
                            {label}
                            </button>
                        ))}
                        </div>

                        {/* List header */}
                        <div className="mt-5 text-sm font-semibold text-[#0f172a]">Attended events</div>

                        {/* Reflections list */}
                        <div className="mt-2 h-[520px] overflow-y-auto pr-1">
                        {filteredReflections.length === 0 ? (
                            <div className="flex h-32 items-center justify-center rounded-2xl border border-white bg-white/70 text-sm text-slate-600">
                            No reflections match your filters.
                            </div>
                        ) : (
                            <div className="space-y-2">
                            {filteredReflections.map((r, idx) => {
                                const active = selectedReflection?._id === r._id;
                                const score = r.responses?.length
                                ? Math.round(
                                    (r.responses.reduce((s, x) => s + Number(x.answer || 0), 0) /
                                        r.responses.length) * 10
                                    ) / 10
                                : 0;

                                return (
                                    <button
                                        key={r._id || idx}
                                        onClick={() => setSelectedReflection(r)}
                                        className={[
                                        "w-full text-left rounded-xl border p-3 transition shadow-sm",
                                        active
                                            ? "border-[#e8d96d] bg-[#fff6bf]"
                                            : "border-white bg-white hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        <div className="font-semibold">{r.title || "Untitled reflection"}</div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {r.event?.name || "No event"} • {r.event?.date || "No date"}
                                        {/* Average score with stars */}
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-[#7a6a28]"> {score.toFixed(1)}
                                        </span>
                                        </div>
                                    </button>
                                );
                            })}
                            </div>
                        )}
                        </div>

                        {/* Footer buttons */}
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => setActiveTab("new")}
                                aria-pressed={activeTab === "new"}
                                className={[
                                "rounded-xl px-3 py-2 text-sm font-medium transition-all",
                                "border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0",
                                activeTab === "new"
                                    // ACTIVE (blue)
                                    ? "bg-[#fff6bf] border-[#fff6bf] text-black hover:brightness-105"
                                    // INACTIVE (yellow pill)
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                ].join(" ")}
                            >
                                ➕ New Reflection
                            </button>

                            {/* Past Reflections */}
                            <button
                                onClick={() => setActiveTab("past")}
                                aria-pressed={activeTab === "past"}
                                className={[
                                "rounded-xl px-3 py-2 text-sm font-medium transition-all",
                                "border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0",
                                activeTab === "past"
                                    // ACTIVE (blue)
                                    ? "bg-[#fff6bf] border-[#fff6bf] text-black hover:brightness-105"
                                    // INACTIVE (white pill)
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                ].join(" ")}
                            >
                                🎓 Past Reflections
                            </button>
                        </div>
                    </aside>

                {/* RIGHT: Pale-yellow detail panel */}
                <section className="rounded-[26px] border border-[#f4e58b] bg-[#fff6bf] p-6 shadow-sm">
                {!selectedReflection ? (
                    <div className="flex h-40 items-center justify-center text-sm text-slate-600">
                    Select a reflection to view its details
                    </div>
                ) : (
                    <>
                    {/* Title + Event meta */}
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-2xl font-bold text-[#0f172a]">
                        {selectedReflection.title || "Title"}
                        </h3>
                    {/* Average score (number only) */}
                    <span
                    className="inline-flex items-center rounded-full border border-[#f4e58b] bg-white px-3 py-1 text-xs font-semibold text-[#7a6a28]"
                    aria-label="Average score"
                    title="Average score"
                    >
                    {avgScore(selectedReflection?.responses || []).toFixed(1)} / 5.0
                    </span>
                    
                    </div>
                    {/* Event details for this reflection */}
                    {selectedReflection?.event && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
                        {/* Event name */}
                        {selectedReflection.event.name && (
                        <span className="rounded-full border border-[#f4e58b] bg-white/80 px-2 py-0.5 font-medium text-[#0f172a]">
                            {selectedReflection.event.name}
                        </span>
                        )}

                        {/* Event date */}
                        {selectedReflection.event.date && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#f4e58b] bg-white/80 px-2 py-0.5 text-[#7a6a28]">
                            <Calendar className="size-3" />
                            {selectedReflection.event.date}
                        </span>
                        )}

                        {/* Event location */}
                        {selectedReflection.event.location && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#f4e58b] bg-white/80 px-2 py-0.5 text-[#7a6a28]">
                            <MapPin className="size-3" />
                            {selectedReflection.event.location}
                        </span>
                        )}

                        {/* When the reflection was created (optional) */}
                        {selectedReflection.createdAt && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#f4e58b] bg-white/80 px-3 py-0.5 text-[#7a6a28] font-medium">
                            <Clock className="size-3" />
                            {new Date(selectedReflection.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                            })}
                        </span>
                        )}
                    </div>
                    )}


                    {/* Existing questions list */}
                    <div className="mt-5 space-y-5">
                        {selectedReflection.responses?.map((resp, i) => (
                        <div key={resp._id || i} className="rounded-2xl border border-[#f7ec9e] bg-white p-5 shadow-sm">
                            <p className="text-[15px] font-semibold text-[#0f172a]">
                            {i + 1}. {resp.question}
                            </p>

                            {/* Hearts (read-only) with 50% opacity on unselected) */}
                            <div className="mt-3">
                            <div className="grid grid-cols-5 gap-6 sm:gap-10 place-items-center">
                                {[1, 2, 3, 4, 5].map((val, idx) => {
                                const value = Number(resp.answer) || 0;
                                const selected = value === val;
                                const colors = ["bg-red-400","bg-orange-400","bg-yellow-400","bg-lime-400","bg-green-400"];
                                const captions = ["Strongly disagree","Disagree","Neutral","Agree","Strongly agree"];
                                return (
                                    <div key={val} className="relative flex flex-col items-center gap-2">
                                    <span
                                        className={[
                                        "absolute -top-4 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                        "bg-white text-[#0f172a] shadow border border-slate-200 transition",
                                        selected ? "opacity-100" : "opacity-0 pointer-events-none",
                                        ].join(" ")}
                                    >
                                        {value}/5
                                    </span>
                                    <div className="rating rating-lg">
                                        <input
                                        type="radio"
                                        name={`past-q-${i}`}
                                        className={["mask mask-heart", colors[idx], selected ? "" : "opacity-50"].join(" ")}
                                        checked={selected}
                                        readOnly
                                        disabled
                                        aria-label={`${val} of 5`}
                                        />
                                    </div>
                                    <span className={`text-[11px] sm:text-xs text-center ${selected ? "font-bold text-[#0f172a]" : "font-medium text-[#7a6a28] opacity-70"}`}>
                                        {captions[idx]}
                                    </span>
                                    </div>
                                );
                                })}
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </>
                )}
                </section>

            </div>
        </section>
        )}

  </div>
);

}
