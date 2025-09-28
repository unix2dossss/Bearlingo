import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

export default function NetworkingSubtask2({ userInfo, onBack }) {
  const [allEvents, setAllEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [costFilter, setCostFilter] = useState("All");
  const railRef = useRef(null);

  const attendingEventIds = userEvents[0]?.attendingEventIds || [];

  const getEventStatus = (eventId) =>
    attendingEventIds.find((ev) => ev.eventId === eventId)?.status || "default";

  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/users/me/networking/all-events", {
        withCredentials: true,
        headers: userInfo?.token
          ? { Authorization: `Bearer ${userInfo.token}` }
          : undefined,
      });
      const eventsOnly = Array.isArray(res?.data?.allEventsFromBackend)
        ? res.data.allEventsFromBackend
        : [];
      setAllEvents(eventsOnly);
      toast.success("Events obtained successfully!");
    } catch (error) {
      console.error("Error obtaining events", error);
      toast.error("Error obtaining events");
    }
  };

  const fetchEventsOfUser = async () => {
    try {
      const res = await api.get("/users/me/networking/events", {
        withCredentials: true,
      });
      setUserEvents(res?.data?.eventsToAttend || []);
      toast.success("Your events loaded");
    } catch (error) {
      console.error("User events were not fetched", error);
      toast.error("User events were not fetched");
    }
  };

  useEffect(() => {
    fetchAllEvents();
    fetchEventsOfUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAttendance = async (eventId, buttonState) => {
    const nextStatus = buttonState === "going" ? "attended" : "going"; // default->going, going->attended
    try {
      await api.put(
        "/users/me/networking/events",
        { attendingEventIds: [{ eventId, status: nextStatus }] },
        { withCredentials: true }
      );

      // Optimistic update
      setUserEvents((prev) => {
        if (!prev[0])
          return [{ attendingEventIds: [{ eventId, status: nextStatus }] }];
        const updated = { ...prev[0] };
        const idx = updated.attendingEventIds.findIndex(
          (ev) => ev.eventId === eventId
        );
        if (idx !== -1) {
          updated.attendingEventIds[idx].status = nextStatus;
        } else {
          updated.attendingEventIds.push({ eventId, status: nextStatus });
        }
        return [updated];
      });
    } catch (error) {
      console.error("Error updating events", error);
      toast.error("Events were not updated");
    }
  };

  const uniqueTypes = useMemo(
    () => ["All", ...new Set(allEvents.map((e) => e.type).filter(Boolean))],
    [allEvents]
  );
  const uniqueCosts = useMemo(
    () => ["All", ...new Set(allEvents.map((e) => e.costType).filter(Boolean))],
    [allEvents]
  );

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEvents.filter((e) => {
      const matchesQ =
        !q ||
        `${e.name} ${e.description} ${e.location} ${e.type} ${e.costType}`
          .toLowerCase()
          .includes(q);
      const matchesType = typeFilter === "All" || e.type === typeFilter;
      const matchesCost = costFilter === "All" || e.costType === costFilter;
      return matchesQ && matchesType && matchesCost;
    });
  }, [allEvents, query, typeFilter, costFilter]);

  const scrollByCards = (dir = 1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector(".carousel-item");
    const gap = 16;
    const delta = card
      ? card.getBoundingClientRect().width + gap
      : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  return (
    <div className="pt-16 bg-[#4f9cf9] relative min-h-screen flex flex-col min-w-0 gap-4 p-4">
      {/* Back */}
      <button
        className="btn btn-ghost absolute top-20 left-6 z-10"
        onClick={onBack}
        >
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
        </button>

        {/* spacer equal to button height + gap */}
        <div className="h-16" />

        <h2 className="text-2xl font-bold text-slate-800 mb-1">
        🎉 Join an Event & Earn Points!
        </h2>
        <p className="text-base text-slate-700 -mt-2">
        Participate, learn, and get rewarded for attending events!
        </p>

      {/*Controls bar */}
      <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-[#4f9cf9]/80 backdrop-blur rounded-b-xl">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="input input-sm input-bordered w-full sm:w-64"
            placeholder="Search events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="select select-sm select-bordered"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {uniqueTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            className="select select-sm select-bordered"
            value={costFilter}
            onChange={(e) => setCostFilter(e.target.value)}
          >
            {uniqueCosts.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div className="ml-auto text-sm opacity-80">
            Showing {filteredEvents.length}/{allEvents.length}
          </div>
        </div>
      </div>

      <div className="border-4 border-yellow-500 rounded-3xl shadow-[0_0_20px_4px_rgba(236,72,153,0.6)] overflow-hidden">
        {/* Prev / Next buttons (desktop) */}
        <button
          aria-label="Previous"
          onClick={() => scrollByCards(-1)}
          className="hidden md:flex btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 z-10"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={() => scrollByCards(1)}
          className="hidden md:flex btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 z-10"
        >
          ›
        </button>

        <div
          ref={railRef}
          className="w-full p-5 bg-amber-100 overflow-x-auto flex gap-4 snap-x snap-mandatory scroll-smooth"
        >
          {(Array.isArray(filteredEvents) ? filteredEvents : []).map(
            (item, index) => {
              const status = getEventStatus(item.id);
              const btnClass =
                status === "going"
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                  : status === "attended"
                  ? "bg-blue-400 hover:bg-blue-700 text-white shadow-lg opacity-50 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-md";

              return (
                <div
                  key={item.id ?? index}
                  className="carousel-item snap-start shrink-0 w-[88%] sm:w-[60%] md:w-[45%] lg:w-[32%]
                             bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700
                             rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105
                             flex flex-col overflow-hidden group"
                >
                  {/* Image / banner */}
                  <div className="h-40 bg-gray-200 rounded-t-2xl flex items-center justify-center text-gray-700 font-bold text-lg">
                    {item.type}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 flex flex-col p-4 gap-2 bg-base-100">
                    <h3 className="text-xl font-bold text-purple-100 group-hover:text-white transition-colors duration-200">
                      {item.name}
                    </h3>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                      <span className="badge badge-neutral">{item.type}</span>
                      <span className="badge badge-neutral">
                        {item.costType}
                      </span>
                    </div>

                    {/* Date / Time / Location */}
                    <p className="text-gray-700 text-sm">
                      📅 {item.date} · {item.time}
                    </p>
                    <p className="text-gray-600 text-sm">📍 {item.location}</p>

                    {/* Description */}
                    <h4 className="mt-2 text-purple-700 font-semibold">
                      Description
                    </h4>
                    <div className="mt-1 flex-1 max-h-28 overflow-y-auto p-2 border border-pink-500 rounded-lg shadow-[0_0_12px_2px_rgba(236,72,153,0.6)] scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-200 hover:shadow-[0_0_20px_4px_rgba(236,72,153,0.8)] transition-shadow duration-300">
                      <p className="text-gray-700 text-sm">
                        {item.description}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm w-full hover:scale-105 hover:shadow-lg transition-transform duration-200"
                      >
                        View Event
                      </a>

                      <button
                        className={`btn btn-sm w-full transition-transform duration-200 ${btnClass} hover:scale-105`}
                        onClick={() =>
                          handleAttendance(item.id, status /* current */)
                        }
                        disabled={status === "attended"}
                      >
                        {status === "attended"
                          ? "Attended ✅"
                          : status === "going"
                          ? "Locked In 🫡 (tap to mark attended)"
                          : "Going to Attend"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}

          {filteredEvents.length === 0 && (
            <div className="w-full text-center text-sm text-gray-700 py-8">
              No events match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
