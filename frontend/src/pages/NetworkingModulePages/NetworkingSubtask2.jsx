import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import EventCard from "../../components/NetworkingModuleComponents/NetworkingSubtask2/EventCard.jsx";
import Calendar from "../../components/NetworkingModuleComponents/NetworkingSubtask2/Calendar.jsx";


const COLORS = {
  primary: "#fcf782",        // pill / accent fill
  primaryHover: "#fbe24f",   // hover / stronger
  border: "#f4e58b",         // borders
  text: "#111827",           // main text
  muted: "#767687",          // subtext
  bg: "#fffbe6",             // page background (soft yellow)
  panel: "#fffdf0",          // card/panel background
};
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";
import { useUserStore } from "../../store/user";

export default function NetworkingSubtask2({ userInfo, onBack }) {
  const [allEvents, setAllEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [actualUserEvents, setActualUserEvents] = useState([]);
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
      if (res.data.eventstoAttend == []) {


        const userEvents = res.data.eventsToAttend[0].attendingEventIds;
        const userEventIds = userEvents.map(event => event.eventId);
        const attendedEvents = allEvents.filter(event =>
          userEventIds.includes(event.id)
        );
        setActualUserEvents(attendedEvents);
      }

    } catch (error) {
      console.error("User events were not fetched", error);
      toast.error("User events were not fetched");
    }
  };
  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    // only run when allEvents has been loaded
    if (allEvents.length > 0) {
      fetchEventsOfUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvents]);

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
    <div
      className="pt-16 relative min-h-screen flex flex-col min-w-0 gap-4 p-4"
      style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
    >
      {/* Back */}
      <button
        className="btn btn-ghost absolute top-20 left-6 z-10"
        onClick={onBack}
        style={{ color: COLORS.text }}
      >
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
      </button>

      <div className="h-10" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold inline-block rounded-lg px-2 py-1 text-[var(--text)]">My Events</h1>
      </div>

      {/* Search + selects (top row) */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className="input input-md flex-1 min-w-[240px] bg-white"
          placeholder="Search events…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            borderColor: COLORS.border,
            color: COLORS.text,
          }}
        />
        <select
          className="select select-md bg-white"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ borderColor: COLORS.border, color: COLORS.text }}
        >
          {uniqueTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select
          className="select select-md bg-white"
          value={costFilter}
          onChange={(e) => setCostFilter(e.target.value)}
          style={{ borderColor: COLORS.border, color: COLORS.text }}
        >
          {uniqueCosts.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Filter pills (All / Going / Favourite / Attended) */}
      <div className="flex items-center gap-2 mt-3">
        {["All", "Going", "Favourite", "Attended"].map((t) => {
          const active = activeTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-3 py-1.5 rounded-full text-sm border transition"
              style={{
                backgroundColor: active ? COLORS.primary : "#ffffff",
                borderColor: active ? COLORS.primary : COLORS.border,
                color: active ? COLORS.text : "#374151", // slate-700
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "#fffaf0";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Main area */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 min-h-0">
        {/* Scrollable list */}
        <section
          className="rounded-xl p-4 min-h-0 h-[65vh] lg:h-[calc(100vh-240px)] overflow-y-auto pr-1
                     overscroll-contain [scrollbar-gutter:stable] scrollbar-thin"
          style={{
            backgroundColor: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex flex-col gap-3">
            {(Array.isArray(filteredEvents) ? filteredEvents : []).map((item, i) => {
              const id = getEventId(item);
              return (
                <div
                  key={id ?? i}
                  className="rounded-xl border"
                  style={{ backgroundColor: "#ffffff", borderColor: COLORS.border }}
                >
                  <EventCard
                    item={item}
                    status={getStatus(id)}
                    onAttendanceClick={handleAttendance}
                    isFavorite={favourites.has(String(id))}
                    onToggleFavorite={toggleFavourite}
                  />
                </div>
              );
            })}
            {filteredEvents.length === 0 && (
              <div className="w-full text-center text-sm py-12" style={{ color: COLORS.muted }}>
                No events match your filters.
              </div>
            )}
          </div>
        </section>

        {/* Schedule panel */}
        <aside className="xl:sticky xl:top-24 self-start">
          <div
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: "#ffffff", border: `1px solid ${COLORS.border}` }}
          >
            <Calendar value={selectedDate} onChange={setSelectedDate} events={allEvents} />
          </div>

          <div
            className="mt-4 rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: "#ffffff", border: `1px solid ${COLORS.border}` }}
          >
            <div className="text-sm font-semibold mb-2" style={{ color: "#92400e" /* amber-800 */ }}>
              Upcoming
            </div>
            <div className="space-y-2 text-sm">
              {baseFiltered.slice(0, 3).map((e) => (
                <div key={getEventId(e)} className="flex items-center justify-between">
                  <div className="truncate">
                    <div className="font-medium truncate" style={{ color: COLORS.text }}>
                      {e.name}
                    </div>
                    <div style={{ color: COLORS.muted }}>
                      {e.date} · {e.time || "TBC"}
                    </div>
                  </div>
                  <a
                    href={e.link || "#"}
                    onClick={(ev) => { if (!e.link) ev.preventDefault(); }}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-3 underline"
                    style={{ color: "#b45309" /* amber-700 */ }}
                  >
                    Open
                  </a>
                </div>
              ))}
              {baseFiltered.length === 0 && (
                <div style={{ color: COLORS.muted }}>No upcoming items</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
