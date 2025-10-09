import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import EventCard from "../../components/NetworkingModuleComponents/NetworkingSubtask2/EventCard.jsx";
import Calendar from "../../components/NetworkingModuleComponents/NetworkingSubtask2/Calendar.jsx";


const COLORS = {
  primary: "#fcf782",
  primaryHover: "#fbbf24",
  textMuted: "#767687",
};
 import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

export default function NetworkingSubtask2({ userInfo, onBack }) {
  const [allEvents, setAllEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [costFilter, setCostFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("All"); // All | Going | Favourite | Attended

  // --- favourites (client-side; wire to API if needed)
  const [favourites, setFavourites] = useState(() => new Set());
  const toggleFavourite = (id, next) => {
    setFavourites((prev) => {
      const s = new Set(prev);
      const key = String(id);
      if (next ?? !s.has(key)) s.add(key); else s.delete(key);
      return s;
    });
  };
  const { completeTask } = useUserStore();

  const attendingEventIds = userEvents[0]?.attendingEventIds || [];
  const getEventId = (e) => e?.id ?? e?._id;

  const statusById = useMemo(() => {
    const m = new Map();
    (attendingEventIds || []).forEach(({ eventId, status }) => {
      if (eventId != null) m.set(String(eventId), status);
    });
    return m;
  }, [attendingEventIds]);

  const getStatus = (id) => statusById.get(String(id)) || "default";

  // --- Data fetch ---
  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/users/me/networking/all-events", {
        withCredentials: true,
        headers: userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : undefined,
      });
      setAllEvents(Array.isArray(res?.data?.allEventsFromBackend) ? res.data.allEventsFromBackend : []);
    } catch (error) {
      console.error("Error obtaining events", error);
      toast.error("Error obtaining events");
    }
  };

  const fetchEventsOfUser = async () => {
    try {
      const res = await api.get("/users/me/networking/events", { withCredentials: true });
      setUserEvents(res?.data?.eventsToAttend || []);
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

  // --- Attendance toggle ---
  const handleAttendance = async (eventId, currentStatus) => {
    const nextStatus = currentStatus === "going" ? "attended" : "going";
    try {
      await api.put(
        "/users/me/networking/events",
        { attendingEventIds: [{ eventId, status: nextStatus }] },
        { withCredentials: true }
      );
      setUserEvents((prev) => {
        if (!prev[0]) return [{ attendingEventIds: [{ eventId, status: nextStatus }] }];
        const updated = { ...prev[0] };
        const idx = updated.attendingEventIds.findIndex((ev) => String(ev.eventId) === String(eventId));
        if (idx !== -1) updated.attendingEventIds[idx].status = nextStatus;
        else updated.attendingEventIds.push({ eventId, status: nextStatus });
        return [updated];
      });
    } catch (err) {
      console.error(err);
      toast.error("Events were not updated");
    }
  };

  // --- Filtering / search ---
  const uniqueTypes = useMemo(
    () => ["All", ...new Set(allEvents.map((e) => e.type).filter(Boolean))],
    [allEvents]
  );
  const uniqueCosts = useMemo(
    () => ["All", ...new Set(allEvents.map((e) => e.costType).filter(Boolean))],
    [allEvents]
  );

  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedISO = selectedDate ? selectedDate.toISOString().slice(0, 10) : null;

    return allEvents.filter((e) => {
      const matchesQ =
        !q ||
        `${e.name} ${e.description} ${e.location} ${e.type} ${e.costType}`.toLowerCase().includes(q);
      const matchesType = typeFilter === "All" || e.type === typeFilter;
      const matchesCost = costFilter === "All" || e.costType === costFilter;
      const matchesDate = !selectedISO || e.dateISO === selectedISO; // if you store ISO dates
      return matchesQ && matchesType && matchesCost && matchesDate;
    });
  }, [allEvents, query, typeFilter, costFilter, selectedDate]);

  const filteredEvents = useMemo(() => {
    if (activeTab === "Going") return baseFiltered.filter((e) => getStatus(getEventId(e)) === "going");
    if (activeTab === "Attended") return baseFiltered.filter((e) => getStatus(getEventId(e)) === "attended");
    if (activeTab === "Favourite") return baseFiltered.filter((e) => favourites.has(String(getEventId(e))));
    return baseFiltered;
  }, [baseFiltered, activeTab, favourites, userEvents]);

  // --- UI helpers ---
  const clearFilters = () => {
    setQuery("");
    setTypeFilter("All");
    setCostFilter("All");
    setSelectedDate(null);
    setActiveTab("All");
  };

  return (
    <div className="pt-16 bg-white relative min-h-screen flex flex-col min-w-auto min-h-auto gap-4 p-4">
      {/* Back */}
      <button className="btn btn-ghost absolute top-20 left-6 z-10" onClick={onBack}>
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
      </button>

      <div className="h-10" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Events</h1>
      </div>

      {/* Search + selects (top row) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="input input-md input-bordered flex-1 min-w-[240px]"
          placeholder="Search events…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="select select-md select-bordered" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {uniqueTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="select select-md select-bordered" value={costFilter} onChange={(e) => setCostFilter(e.target.value)}>
          {uniqueCosts.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Filter pills (All / Going / Favourite / Attended) */}
      <div className="flex items-center gap-2 mt-3">
        {["All", "Going", "Favourite", "Attended"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={[
              "px-3 py-1.5 rounded-full text-sm border",
              activeTab === t
                ? "bg-[#fadb14] text-black border-[#fcf782]"
                : "bg-white text-slate-700 border-slate-200",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main area */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 min-h-0">
        {/* Scrollable list */}
        <section
          className="rounded-xl bg-white/60 p-4 border border-slate-200 min-h-0
                     h-[65vh] lg:h-[calc(100vh-240px)] overflow-y-auto pr-1
                     overscroll-contain [scrollbar-gutter:stable] scrollbar-thin
                     scrollbar-thumb-slate-300 scrollbar-track-transparent"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex flex-col gap-3">
            {(Array.isArray(filteredEvents) ? filteredEvents : []).map((item, i) => {
              const id = getEventId(item);
              return (
                <EventCard
                  key={id ?? i}
                  item={item}
                  status={getStatus(id)}
                  onAttendanceClick={handleAttendance}
                  isFavorite={favourites.has(String(id))}
                  onToggleFavorite={toggleFavourite}
                />
              );
            })}
            {filteredEvents.length === 0 && (
              <div className="w-full text-center text-sm text-slate-600 py-12">
                No events match your filters.
              </div>
            )}
          </div>
        </section>

        {/* Schedule panel */}
        <aside className="xl:sticky xl:top-24 self-start">
          <Calendar value={selectedDate} onChange={setSelectedDate} events={allEvents} />
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-800 mb-2">Upcoming</div>
            <div className="space-y-2 text-sm">
              {(baseFiltered.slice(0, 3)).map((e) => (
                <div key={getEventId(e)} className="flex items-center justify-between">
                  <div className="truncate">
                    <div className="font-medium text-slate-900 truncate">{e.name}</div>
                    <div className="text-slate-500">{e.date} · {e.time || "TBC"}</div>
                  </div>
                  <a
                    href={e.link || "#"} onClick={(ev) => { if (!e.link) ev.preventDefault(); }}
                    target="_blank" rel="noreferrer"
                    className="text-sky-600 hover:underline ml-3"
                  >
                    Open
                  </a>
                </div>
              ))}
              {baseFiltered.length === 0 && <div className="text-slate-500">No upcoming items</div>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
