import React, { memo } from "react";
import { Clock, MapPin, Star } from "lucide-react";

// (optional) keep your type styles if you like
const TYPE_STYLES = {
  webinar:    { bg: "#e0f2fe", text: "#075985", accent: "#38bdf8" },
  seminar:    { bg: "#ede9fe", text: "#5b21b6", accent: "#8b5cf6" },
  workshop:   { bg: "#dcfce7", text: "#166534", accent: "#22c55e" },
  meetup:     { bg: "#fee2e2", text: "#7f1d1d", accent: "#ef4444" },
  hackathon:  { bg: "#fef9c3", text: "#854d0e", accent: "#f59e0b" },
  conference: { bg: "#fae8ff", text: "#6b21a8", accent: "#d946ef" },
  default:    { bg: "#f1f5f9", text: "#334155", accent: "#94a3b8" },
};

const EventCard = ({
  item = {},
  status = "default",          // "default" | "going" | "attended"
  onAttendanceClick,           // (eventId, currentStatus) => void
  isFavorite = false,
  onToggleFavorite,            // (eventId, nextBool) => void
}) => {
  const eventId = item.id ?? item._id;
  const isGoing = status === "going";
  const isAttended = status === "attended";

  const typeKey = String(item?.type || "default").toLowerCase();
  const theme = TYPE_STYLES[typeKey] || TYPE_STYLES.default;

  const tags = item?.tags?.length ? item.tags : [item?.type, item?.costType].filter(Boolean);

  // Compute label/color using your original snippet’s logic
  const btnBg =
    isGoing ? "#22c55e" : isAttended ? "#9ca3af" : "#fbbf24";
  const btnLabel =
    isAttended
      ? "Attended ✅"
      : isGoing
      ? "Locked In 🫡 (tap to mark attended)"
      : "Going to Attend";

  const handleClick = () => {
    if (!onAttendanceClick || isAttended) return;
    onAttendanceClick(eventId, status);
  };

  return (
    <article
      className="relative w-full bg-white rounded-xl border border-slate-200 shadow
                 hover:shadow-md hover:ring-1 hover:ring-sky-300 transition-all overflow-hidden"
    >
      {/* Left accent by event type (optional) */}
      <span aria-hidden className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: theme.accent }} />

      {/* Favourite star */}
      <button
        type="button"
        aria-label={isFavorite ? "Unfavourite" : "Favourite"}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(eventId, !isFavorite); }}
        className="absolute right-3 top-3 rounded-full p-2 bg-white/90 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400 z-10"
      >
        <Star size={16} className={isFavorite ? "fill-yellow-400 stroke-yellow-500" : "stroke-slate-600"} />
      </button>

      <div className="p-4 flex gap-4 items-stretch">
        {/* Thumbnail */}
        <div className="w-36 h-24 sm:w-40 sm:h-28 shrink-0 overflow-hidden rounded-md bg-slate-100">
          {item?.imageUrl ? (
            <img src={item.imageUrl} alt={item?.name || "Event cover"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.bg})` }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Meta */}
          <div className="text-[13px] text-slate-500">
            {item?.date || "TBC"}{item?.type && <span className="px-1">•</span>}
            <span className="capitalize">{item?.type}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mt-0.5 truncate">
            {item?.name || "Untitled Event"}
          </h3>

          {/* Chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => {
              const isType = String(t).toLowerCase() === typeKey && typeKey !== "default";
              return (
                <span
                  key={t}
                  className="inline-flex items-center px-2.5 py-1 text-[11px] rounded-full"
                  style={isType ? { backgroundColor: theme.bg, color: theme.text } : { backgroundColor: "#f1f5f9", color: "#334155" }}
                >
                  {t}
                </span>
              );
            })}
          </div>

          {/* Time & Location */}
          <div className="mt-2 text-sm text-slate-700 flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-1">
              <Clock size={14} style={{ color: theme.accent }} />
              {item?.time || "TBC"}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} style={{ color: theme.accent }} />
              {item?.location || "TBC"}
            </span>
          </div>

          {/* Description */}
          <p className="mt-2 text-[13px] sm:text-sm text-slate-700 line-clamp-2">
            {item?.description || "No description provided."}
          </p>

          {/* Buttons */}
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <a
              href={item?.link || "#"} target="_blank" rel="noreferrer"
              onClick={(e) => { if (!item?.link) e.preventDefault(); }}
              className="btn btn-sm w-full sm:w-auto text-white hover:scale-105 hover:shadow-md transition-transform duration-200"
              style={{ backgroundColor: "#4f9cf9" }}
            >
              View Event
            </a>

            <button
              type="button"
              className="btn btn-sm w-full sm:w-auto transition-transform duration-200 hover:scale-105"
              style={{
                backgroundColor: btnBg,
                color: "white",
                opacity: isAttended ? 0.8 : 1
              }}
              onClick={handleClick}
              disabled={isAttended}
              aria-pressed={isGoing || isAttended}
              aria-label={btnLabel}
              title={btnLabel}
            >
              {btnLabel}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(EventCard);
