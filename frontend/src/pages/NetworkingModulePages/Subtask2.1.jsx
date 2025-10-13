import React, { useEffect, useMemo, useState, useRef } from "react";
import { ArrowLeftIcon, Star, StarOff, X } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import EventCard from "../../components/NetworkingModuleComponents/NetworkingSubtask2/EventCard.jsx";
import Calendar from "../../components/NetworkingModuleComponents/NetworkingSubtask2/Calendar.jsx";
import { useUserStore } from "../../store/user";
import Bear from "../../assets/Bear.svg";
import { gsap } from "gsap";
import { getSubtaskBySequenceNumber } from "../../utils/moduleHelpers";


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

  // 🧠 Bear logic
    const [bearMessage, setBearMessage] = useState("Ready for meeting up with people??");
    const bearRef = useRef(null);
  
  
    //Bear moving up and down
    useEffect(() => {
      gsap.fromTo(
        bearRef.current,
        { y: 200 },
        { y: 0, duration: 1.5, ease: "bounce.out", delay: 0.5 }
      );
      gsap.fromTo(
        ".speech-bubble",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 1.2 }
      );
      gsap.to(bearRef.current, {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2
      });
    }, []);
  

  return (
  <div
    className="pt-16 min-h-screen flex flex-col min-w-0 gap-4 p-4"
    style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
  >
    {/* Top bar: back + title (aligned left like screenshot) */}
    <div className="flex items-center gap-3">
      <button
        className="btn btn-ghost"
        onClick={onBack}
        style={{ color: COLORS.text }}
      >
        <ArrowLeftIcon className="size-5" />
        Back to subtasks
      </button>

    </div>

    {/* Main 2-column layout (left = calendar/upcoming, center = content) */}
    <div className="grid grid-cols-1 lg:grid-cols-[375px_minmax(0,1fr)] gap-6">
      {/* LEFT: Calendar + Upcoming */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div
          className="rounded-2xl p-4 shadow-sm border"
          style={{ backgroundColor: "#ffffff", borderColor: COLORS.border }}
        >
          <Calendar value={selectedDate} onChange={setSelectedDate} events={allEvents} />
        </div>
        {/* Reset filters (compact, aligns with screenshot’s minimalist controls) */}
        <div className="mt-2">
          <button
            className="btn btn-sm"
            onClick={clearFilters}
            style={{ borderColor: COLORS.border }}
          >
            Reset filters
          </button>
        </div>

        <div
          className="rounded-2xl p-4 shadow-sm border"
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
      </div>

      {/* CENTER: Filters (top) + Event list */}
      <main className="min-w-0">
        {/* Filter row like screenshot: search + selects (right aligned) */}
        <div
          className="w-full rounded-xl p-3 border bg-white flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: COLORS.border }}
        >
          <div className="flex-1 min-w-0">
            <input
              className="input input-md w-full bg-white"
              placeholder="Search events…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ borderColor: COLORS.border, color: COLORS.text }}
            />
          </div>

          <div className="flex gap-2 shrink-0">
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

        {/* Tabs row (horizontal above list) */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {["All", "Going", "Favourite", "Attended"].map((t) => {
            const active = activeTab === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="px-3 py-1.5 rounded-full border text-sm"
                style={{
                  backgroundColor: active ? COLORS.primary : "#ffffff",
                  borderColor: COLORS.border,
                  color: COLORS.text,
                }}
              >
                {t}
              </button>
            );
          })}

          {/* small helper count on the right on larger screens */}
          <div className="ml-auto text-sm pr-1" style={{ color: COLORS.muted }}>
            Showing <span className="font-medium">{filteredEvents.length}</span> event
            {filteredEvents.length === 1 ? "" : "s"}
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
        </div>

        {/* Event list */}
        <section
          className="mt-2 rounded-xl p-3 min-h-0 h-[65vh] lg:h-[calc(100vh-250px)] overflow-y-auto pr-1
                     overscroll-contain [scrollbar-gutter:stable] scrollbar-thin border"
          style={{
            backgroundColor: COLORS.panel,
            borderColor: COLORS.border,
            WebkitOverflowScrolling: "touch",
          }}
        >
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

        {/* Bear with speech bubble */}
        <div className="absolute -bottom-[20vh] left-16 flex flex-col items-end z-40">
          {/* Speech bubble */}
          <div
            key="bear-speech"
            className="chat chat-end absolute -top-10 -left-48 opacity-100 bear-speech"
          >
            <div className="chat-bubble bg-[#031331] text-[#C5CBD3] font-semibold shadow-md text-sm sm:text-sm md:text-sm">
              {bearMessage}
            </div>
          </div>

          <img
            ref={bearRef}
            src={Bear}
            alt="Bear mascot"
            className="w-[40vw] max-w-[300px] sm:w-[30vw] sm:max-w-[250px] md:w-[20vw] md:max-w-[240px] lg:w-[18vw] lg:max-w-[220px] h-auto"
          />
        </div>


      </main>
    </div>
  </div>
);
}
