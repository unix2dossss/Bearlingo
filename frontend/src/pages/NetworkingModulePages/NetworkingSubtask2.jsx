import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, Star, StarOff, X } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import EventCard from "../../components/NetworkingModuleComponents/NetworkingSubtask2/EventCard.jsx";
import Calendar from "../../components/NetworkingModuleComponents/NetworkingSubtask2/Calendar.jsx";
import { useUserStore } from "../../store/user";

const COLORS = {
  primary: "#fcf782",
  primaryHover: "#fbe24f",
  border: "#f4e58b",
  text: "#111827",
  muted: "#767687",
  bg: "#fff9c7",
  panel: "#fffdf0",
};

export default function NetworkingSubtask2({ userInfo, onBack }) {
  // -------------------- state --------------------
  const [allEvents, setAllEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]); // [{attendingEventIds:[{eventId,status}]}]
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [costFilter, setCostFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null); // Date | null
  const [activeTab, setActiveTab] = useState("All"); // All | Going | Favourite | Attended
  const [favourites, setFavourites] = useState(() => new Set());

  const { completeTask } = useUserStore();

  // -------------------- helpers --------------------
  const getEventId = (e) => e?.id ?? e?._id ?? e?.eventId;
  const normaliseDateISO = (e) => {
    // Accept e.dateISO, e.date, or e.start as ISO; fallback to null
    const raw =
      e?.dateISO ||
      e?.date ||
      e?.start ||
      e?.startTime ||
      e?.time ||
      null;
    try {
      if (!raw) return null;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 10);
    } catch {
      return null;
    }
  };

  const toggleFavourite = (id, next) => {
    setFavourites((prev) => {
      const s = new Set(prev);
      const key = String(id);
      if (next ?? !s.has(key)) s.add(key);
      else s.delete(key);
      return s;
    });
  };

  const attendingEventIds = userEvents[0]?.attendingEventIds || [];
  const statusById = useMemo(() => {
    const m = new Map();
    attendingEventIds.forEach(({ eventId, status }) => {
      if (eventId != null) m.set(String(eventId), status);
    });
    return m;
  }, [attendingEventIds]);
  const getStatus = (id) => statusById.get(String(id)) || "default";

  // -------------------- data fetch --------------------
  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/users/me/networking/all-events", {
        withCredentials: true,
        headers: userInfo?.token
          ? { Authorization: `Bearer ${userInfo.token}` }
          : undefined,
      });
      const arr = Array.isArray(res?.data?.allEventsFromBackend)
        ? res.data.allEventsFromBackend
        : [];
      setAllEvents(arr);
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

      // Expect shape: { eventsToAttend: [{ attendingEventIds: [{eventId,status}] }] }
      const payload = res?.data?.eventsToAttend;
      const safe = Array.isArray(payload) ? payload : [];
      setUserEvents(safe);
    } catch (error) {
      console.error("User events were not fetched", error);
      toast.error("User events were not fetched");
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    if (allEvents.length > 0) fetchEventsOfUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvents]);

  // -------------------- actions --------------------
  const handleAttendance = async (eventId, currentStatus) => {
    const prevStatus = currentStatus;
    const nextStatus = prevStatus === "going" ? "attended" : "going";

    // optimistic
    setUserEvents((prev) => {
      const base = prev[0] ?? { attendingEventIds: [] };
      const updated = { ...base, attendingEventIds: [...base.attendingEventIds] };
      const idx = updated.attendingEventIds.findIndex(
        (ev) => String(ev.eventId) === String(eventId)
      );
      if (idx !== -1)
        updated.attendingEventIds[idx] = {
          ...updated.attendingEventIds[idx],
          status: nextStatus,
        };
      else updated.attendingEventIds.push({ eventId, status: nextStatus });
      return [updated];
    });

    try {
      await api.put(
        "/users/me/networking/events",
        { attendingEventIds: [{ eventId, status: nextStatus }] },
        { withCredentials: true }
      );
      toast.success(nextStatus === "attended" ? "Marked attended ✅" : "Locked in 🫡");
    } catch (err) {
      // revert
      setUserEvents((prev) => {
        const base = prev[0] ?? { attendingEventIds: [] };
        const updated = { ...base, attendingEventIds: [...base.attendingEventIds] };
        const idx = updated.attendingEventIds.findIndex(
          (ev) => String(ev.eventId) === String(eventId)
        );
        if (idx !== -1)
          updated.attendingEventIds[idx] = {
            ...updated.attendingEventIds[idx],
            status: prevStatus,
          };
        else updated.attendingEventIds.push({ eventId, status: prevStatus });
        return [updated];
      });
      console.error(err);
      toast.error("Couldn’t update attendance");
    }
  };

  // -------------------- filtering --------------------
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
      const id = getEventId(e);
      const matchesQ =
        !q ||
        `${e.name ?? e.title ?? ""} ${e.description ?? ""} ${e.location ?? ""} ${e.type ?? ""} ${e.costType ?? ""}`
          .toLowerCase()
          .includes(q);

      const matchesType = typeFilter === "All" || e.type === typeFilter;
      const matchesCost = costFilter === "All" || e.costType === costFilter;

      const iso = normaliseDateISO(e);
      const matchesDate = !selectedISO || (iso && iso === selectedISO);

      return matchesQ && matchesType && matchesCost && matchesDate;
    });
  }, [allEvents, query, typeFilter, costFilter, selectedDate]);

  const filteredEvents = useMemo(() => {
    if (activeTab === "Going")
      return baseFiltered.filter((e) => getStatus(getEventId(e)) === "going");
    if (activeTab === "Attended")
      return baseFiltered.filter((e) => getStatus(getEventId(e)) === "attended");
    if (activeTab === "Favourite")
      return baseFiltered.filter((e) => favourites.has(String(getEventId(e))));
    return baseFiltered;
  }, [baseFiltered, activeTab, favourites, userEvents]);

  // -------------------- ui helpers --------------------
  const clearFilters = () => {
    setQuery("");
    setTypeFilter("All");
    setCostFilter("All");
    setSelectedDate(null);
    setActiveTab("All");
  };

  const upcoming3 = useMemo(() => {
    // naive sort by ISO date/time if available
    const withDate = baseFiltered
      .map((e) => ({ e, iso: normaliseDateISO(e) }))
      .filter((x) => x.iso);
    withDate.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : 0));
    return withDate.slice(0, 3).map((x) => x.e);
  }, [baseFiltered]);

  // Sound Effects
  // Button Click
  const playClickSound = () => {
    const audio = new Audio("/sounds/mouse-click-290204.mp3");
    audio.currentTime = 0; // rewind to start for rapid clicks
    audio.play();
  };

  // -------------------- render --------------------
  return (
    <div
      className="pt-16 min-h-screen flex flex-col min-w-0 gap-4 p-4"
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
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_340px] gap-6">
        <h1 className="text-2xl font-bold inline-block rounded-lg px-2 py-1">My Events</h1>
        <div className="hidden md:flex gap-2">
          <input
            className="input input-md min-w-[726px] bg-white"
            placeholder="Search events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ borderColor: COLORS.border, color: COLORS.text }}
          />
          <select
            className="select select-md bg-white"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ borderColor: COLORS.border, color: COLORS.text }}
          >
            {uniqueTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            className="select select-md bg-white"
            value={costFilter}
            onChange={(e) => setCostFilter(e.target.value)}
            style={{ borderColor: COLORS.border, color: COLORS.text }}
          >
            {uniqueCosts.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_340px] gap-6">
        {/* LEFT: Planner panel */}
        <aside
          className="rounded-xl p-4 h-fit lg:sticky lg:top-24 border"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
        >
          {/* Mobile search (since header hides it on small) */}
          <div className="md:hidden mb-3">
            <input
              className="input input-md w-full bg-white"
              placeholder="Search events…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            />
          </div>

          {/* Date filter */}
          <div className="mb-4">
            <div className="text-sm font-semibold mb-1">Filter by date</div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="input input-sm bg-white w-full"
                value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  setSelectedDate(e.target.value ? new Date(e.target.value) : null)
                }
                style={{ borderColor: COLORS.border, color: COLORS.text }}
              />
              {selectedDate && (
                <button
                  className="btn btn-sm"
                  onClick={() => {
                          playClickSound(); 
                          setSelectedDate(null);}}
                  title="Clear date"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status tabs */}
          <div className="space-y-2">
            {["All", "Going", "Favourite", "Attended"].map((t) => {
              const active = activeTab === t;
              return (
                <button
                  key={t}
                  onClick={() => {
                          playClickSound(); setActiveTab(t); }}
                  className="w-full px-3 py-2 rounded-lg border text-left"
                  style={{
                    backgroundColor: active ? COLORS.primary : "#ffffff",
                    borderColor: COLORS.border,
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Clear */}
          <button
            className="mt-4 w-full btn btn-sm"
            onClick={() => {
                          playClickSound(); 
                          clearFilters(); }}
            style={{ borderColor: COLORS.border }}
          >
            Reset filters
          </button>
        </aside>

        {/* CENTER: Event list */}
        <main>
          <section
            className="rounded-xl p-4 min-h-0 h-[65vh] lg:h-[calc(100vh-240px)] overflow-y-auto pr-1
                       overscroll-contain [scrollbar-gutter:stable] scrollbar-thin border"
            style={{
              backgroundColor: COLORS.panel,
              borderColor: COLORS.border,
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="mb-3 text-sm" style={{ color: COLORS.muted }}>
              Showing <span className="font-medium">{filteredEvents.length}</span> event(s)
              {selectedDate && (
                <>
                  {" "}
                  on{" "}
                  <span className="font-medium">
                    {selectedDate.toLocaleDateString()}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {filteredEvents.map((item, i) => {
                const id = getEventId(item);
                return (
                  <div
                    key={id ?? i}
                    className="rounded-xl border bg-white"
                    style={{ borderColor: COLORS.border }}
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
        </main>

        {/* RIGHT: Calendar + Upcoming */}
        <aside className="lg:sticky lg:top-24 self-start">
          <div
            className="rounded-2xl p-4 shadow-sm border"
            style={{ backgroundColor: "#ffffff", borderColor: COLORS.border }}
          >
            <Calendar value={selectedDate} onChange={setSelectedDate} events={allEvents} />
          </div>

          <div
            className="mt-4 rounded-2xl p-4 shadow-sm border"
            style={{ backgroundColor: "#ffffff", borderColor: COLORS.border }}
          >
            <div className="text-sm font-semibold mb-2" style={{ color: "#92400e" }}>
              Upcoming
            </div>
            <div className="space-y-2 text-sm">
              {upcoming3.map((e) => {
                const id = getEventId(e);
                return (
                  <div key={id} className="flex items-center justify-between">
                    <div className="truncate">
                      <div className="font-medium truncate" style={{ color: COLORS.text }}>
                        {e.name ?? e.title}
                      </div>
                      <div style={{ color: COLORS.muted }}>
                        {e.date ?? normaliseDateISO(e)} · {e.time || "TBC"}
                      </div>
                    </div>
                    <a
                      href={e.link || e.url || "#"}
                      onClick={(ev) => {
                        if (!e.link && !e.url) ev.preventDefault();
                      }}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-3 underline"
                      style={{ color: "#b45309" }}
                    >
                      Open
                    </a>
                  </div>
                );
              })}
              {upcoming3.length === 0 && (
                <div style={{ color: COLORS.muted }}>No upcoming items</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
