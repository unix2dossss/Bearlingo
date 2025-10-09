import React, { useMemo, useState } from "react";

export default function Calendar({ value, onChange, events = [] }) {
  const [viewDate, setViewDate] = useState(value ?? new Date());

  const monthLabel = useMemo(
    () => viewDate.toLocaleString(undefined, { month: "long", year: "numeric" }),
    [viewDate]
  );

  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const isSameDate = (a, b) =>
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const goMonth = (delta) =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-sm font-semibold text-slate-800">Schedule</div>
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost btn-xs" onClick={() => goMonth(-1)}>‹</button>
          <select
            className="select select-xs select-bordered"
            value={viewDate.getMonth()}
            onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), Number(e.target.value), 1))}
          >
            {Array.from({ length: 12 }).map((_, m) => (
              <option key={m} value={m}>{new Date(2000, m, 1).toLocaleString(undefined, { month: "long" })}</option>
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
          const isToday = date && isSameDate(date, new Date());
          const isSelected = date && value && isSameDate(date, value);
          return (
            <button
              key={i}
              disabled={!date}
              onClick={() => onChange?.(date)}
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
