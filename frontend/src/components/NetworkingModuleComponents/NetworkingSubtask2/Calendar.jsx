import React, { useMemo, useState, useEffect } from "react";

function makeLocalNoon(y, m, d) {
  const dt = new Date(y, m, d);
  dt.setHours(12, 0, 0, 0); // avoid DST/UTC edge cases
  return dt;
}

function toLocalNoon(date) {
  if (!date) return null;
  return makeLocalNoon(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function Calendar({ value, onChange, events = [] }) {
  const [viewDate, setViewDate] = useState(() => toLocalNoon(value ?? new Date()));

  // keep viewDate in local-noon when value changes
  useEffect(() => {
    if (value) setViewDate(toLocalNoon(value));
  }, [value]);

  const monthLabel = useMemo(
    () => viewDate.toLocaleString(undefined, { month: "long", year: "numeric" }),
    [viewDate]
  );

  // month math at local noon
  const startOfMonth = makeLocalNoon(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = makeLocalNoon(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(makeLocalNoon(viewDate.getFullYear(), viewDate.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const isSameDate = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const goMonth = (delta) =>
    setViewDate(makeLocalNoon(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-sm font-semibold text-slate-800">Schedule</div>
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost btn-xs" onClick={() => goMonth(-1)}>‹</button>
          <select
            className="select select-xs select-bordered"
            value={viewDate.getMonth()}
            onChange={(e) =>
              setViewDate(makeLocalNoon(viewDate.getFullYear(), Number(e.target.value), 1))
            }
          >
            {Array.from({ length: 12 }).map((_, m) => (
              <option key={m} value={m}>
                {new Date(2000, m, 1).toLocaleString(undefined, { month: "long" })}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 hidden sm:inline">{monthLabel}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => goMonth(1)}>›</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-500 mb-1">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <div key={d} className="text-center">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          const isToday = date && isSameDate(date, toLocalNoon(new Date()));
          const isSelected = date && value && isSameDate(date, toLocalNoon(value));
          return (
            <button
              key={i}
              disabled={!date}
              onClick={() => onChange?.(date)} // already local-noon
              className={[
                "h-8 w-full rounded-md text-sm",
                !date ? "opacity-0 cursor-default" : "hover:bg-slate-100",
                isToday ? "ring-1 ring-sky-400" : "",
                isSelected ? "bg-sky-500 text-white hover:bg-sky-600" : "",
              ].join(" ")}
            >
              {date ? date.getDate() : ""}
          </button>
          );
        })}
      </div>
    </div>
  );
}
