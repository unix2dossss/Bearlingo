import React, { useMemo, useState } from "react";
import { Search, Calendar, MapPin, Clock, Star as StarIcon } from "lucide-react";

const Stars = ({ value = 0, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[0, 1, 2, 3, 4].map((i) => (
      <StarIcon
        key={i}
        size={size}
        className={i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
      />
    ))}
    <span className="ml-1 text-xs text-slate-600">{value.toFixed(1)}</span>
  </div>
);

const avgScore = (responses = []) =>
  responses.length
    ? Math.round((responses.reduce((s, r) => s + Number(r?.answer || 0), 0) / responses.length) * 10) / 10
    : 0;

export default function PastReflections({ userReflections = [] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest | rating | title
  const [selectedReflection, setSelectedReflection] = useState(
    userReflections?.[0] ?? null
  );

  const filteredReflections = useMemo(() => {
    let list = [...userReflections];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter((r) => {
        const hay = `${r?.title || ""} ${r?.event?.name || ""} ${(r?.responses || [])
          .map((x) => x?.question)
          .join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (sortBy === "rating") {
      list.sort((a, b) => avgScore(b.responses) - avgScore(a.responses));
    } else if (sortBy === "title") {
      list.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
    } else {
      list.sort((a, b) => {
        const da = a?.createdAt ? new Date(a.createdAt).getTime() : -Infinity;
        const db = b?.createdAt ? new Date(b.createdAt).getTime() : -Infinity;
        return db - da;
      });
    }

    return list;
  }, [userReflections, query, sortBy]);

  return (
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
                      active ? "border-slate-900 bg-slate-200 text-black" : "border-slate-200 bg-slate-50 hover:bg-white",
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
  );
}
