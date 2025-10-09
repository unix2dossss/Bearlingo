import React, { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../../../lib/axios";
import events from "../../../../../backend/src/utils/networkingEvents";
import { Star as StarIcon } from "lucide-react";

// Same questions list
const questions = [
  "I connected with someone new at this event and it was useful",
  "I learned something valuable at this event",
  "I feel more confident about networking after this event",
  "I have a clear next step to follow up with people I met",
];

// (Optional) if you still want to show stars somewhere
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

export default function AddReflection({
  userEvents = [],   // [{ eventId, status, _id, ... }]
  bearSrc,           // not used here anymore; safe to remove if you like
  onSaved,           // (newReflection) => void
}) {
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [eventSelected, setEventSelected] = useState(null); // user-event record you'll post
  const [eventClicked, setEventClicked] = useState(null);   // catalog event for display
  const bearRefs = useRef([]);   // left in case you re-add the bear later
  const scaleRefs = useRef([]);  // left in case you re-add the bear later

  // Join attended user events with catalog details
  const attended = useMemo(() => {
    const list = (userEvents || [])
      .filter((ue) => ue?.status === "attended")
      .map((ue) => ({ ue, evt: (events || []).find((e) => e.id === ue.eventId) }))
      .filter(({ evt }) => !!evt);
    return list;
  }, [userEvents]);

  // Inline Likert (no external deps)
  const InlineLikert = ({ name, value, onChangeValue }) => {
    const options = [
      { label: "Strongly Agree",    value: 5 },
      { label: "Agree",             value: 4 },
      { label: "Neutral",           value: 3 },
      { label: "Disagree",          value: 2 },
      { label: "Strongly Disagree", value: 1 },
    ];
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChangeValue?.(opt.value)}
              className="radio radio-sm"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    );
  };

  const saveReflection = async () => {
    try {
      const responses = questions.map((q, index) => ({
        question: q,
        answer: answers[index], // 1..5
      }));

      const payload = {
        title,
        responses,
        event: eventSelected?._id, // same as your original
      };

      const res = await api.post("/users/me/networking/reflections", payload, { withCredentials: true });
      onSaved?.(res.data?.reflection);

      // reset
      setAnswers(Array(questions.length).fill(0));
      setEventSelected(null);
      setEventClicked(null);
      setTitle("");
      toast.success("Reflection saved!");
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Error in saving reflection!");
    }
  };

  return (
    <section className="w-full">
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.15fr,1fr]">
        {/* LEFT: Title + Event */}
        <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Create a new reflection</h3>
              <p className="text-sm text-slate-500">Choose an attended event and give it a title.</p>
            </div>
          </header>

          <div className="space-y-5 p-5">
            {/* Title */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800">
                Reflection title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Tech Careers Night — great conversations!"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            {/* Event selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">Attended events</label>

              <div className="grid max-h-72 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                {attended.map(({ ue, evt }) => {
                  const selected = eventClicked?.id === evt.id;
                  return (
                    <button
                      key={evt.id}
                      onClick={() => {
                        setEventSelected(ue);
                        setEventClicked(evt);
                      }}
                      className={[
                        "text-left rounded-lg border p-3 transition",
                        selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 hover:bg-white",
                      ].join(" ")}
                    >
                      <div className="font-medium">{evt.name}</div>
                      <div className="text-xs opacity-80">{evt.date}</div>
                      <div className="text-xs italic opacity-80">{evt.location}</div>
                    </button>
                  );
                })}

                {attended.length === 0 && (
                  <div className="col-span-full flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                    You have no attended events yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Questions */}
        <section className="rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Reflection questions</h3>
              <p className="text-sm text-slate-500">Select one option for each statement.</p>
            </div>

            {/* Progress */}
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
              {answers.filter((a) => a > 0).length}/{questions.length} answered
            </span>
          </header>

          <div className="space-y-5 p-5">
            {questions.map((question, index) => (
              <div key={index} className="rounded-lg border border-slate-200 p-3">
                <p className="mb-2 text-sm font-medium text-slate-800">
                  {index + 1}. {question}
                </p>

                <InlineLikert
                  name={`q-${index}`}
                  value={answers[index] || 0}
                  onChangeValue={(next) =>
                    setAnswers((prev) => {
                      const copy = [...prev];
                      copy[index] = next; // 1..5
                      return copy;
                    })
                  }
                />

                <div className="mt-1 text-xs text-slate-600">
                  Selected: <span className="font-medium">{answers[index] || "—"}</span>/5
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="mt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setAnswers(Array(questions.length).fill(0))}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={saveReflection}
                disabled={!title.trim() || !eventSelected?._id || answers.some((a) => a === 0)}
                className={[
                  "rounded-md px-5 py-2 text-sm font-medium",
                  !title.trim() || !eventSelected?._id || answers.some((a) => a === 0)
                    ? "cursor-not-allowed border border-slate-200 bg-slate-200 text-slate-500"
                    : "bg-slate-900 text-white hover:bg-slate-800",
                ].join(" ")}
              >
                Save Reflection
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
