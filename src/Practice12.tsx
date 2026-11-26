import { useMemo, useState } from 'react';
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Lock,
  XCircle,
} from 'lucide-react';
import { evaluate, minutesToLabel, timeToMinutes, type P12Result } from '@/lib/practice12';

const DAY_END = 1440; // 24:00 — valid only as an end boundary

const READ_ONLY_BOOKINGS = [
  { id: 'b1', title: 'Intro to Algorithms', label: '10:00 AM – 11:00 AM' },
  { id: 'b2', title: 'Faculty Meeting', label: '1:00 PM – 2:00 PM' },
];

// ---------- Component ----------

export default function Practice12() {
  const [startStr, setStartStr] = useState('');
  const [durationStr, setDurationStr] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<P12Result | null>(null);

  const endTime = useMemo(() => {
    const start = timeToMinutes(startStr);
    const duration = Number(durationStr);
    if (start === null || !/^\d+$/.test(durationStr.trim()) || duration < 1) return null;
    return start + duration;
  }, [startStr, durationStr]);

  const handleCheck = () => setResult(evaluate(startStr, durationStr, blocked));
  const handleReset = () => {
    setStartStr('');
    setDurationStr('');
    setBlocked(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
          <div className="bg-teal-600 rounded-xl p-2.5 text-white shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Practice #12 — Code-Based Version
            </h1>
            <p className="text-sm text-slate-500">
              Common-contract checker for room A-101 · fixed current time 08:00
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3 mb-5">
                <h2 className="text-lg font-semibold text-slate-900">Check A-101 Availability</h2>
                <a
                  href="#/"
                  className="text-xs font-medium text-teal-700 hover:text-teal-800 underline underline-offset-2"
                >
                  Back to main app
                </a>
              </div>

              {/* Fixed current time */}
              <div className="mb-5">
                <span className="block text-sm font-medium text-slate-700 mb-1.5">
                  Current Time (fixed)
                </span>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-fit">
                  <CalendarClock className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold">08:00</span>
                  <span className="text-xs text-slate-400">
                    fictional — starts must be after this
                  </span>
                </div>
              </div>

              {/* Start time + duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label
                    htmlFor="p12-start"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Start Time
                  </label>
                  <input
                    id="p12-start"
                    type="time"
                    value={startStr}
                    onChange={(e) => {
                      setStartStr(e.target.value);
                      setResult(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="p12-duration"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Duration (whole minutes)
                  </label>
                  <input
                    id="p12-duration"
                    type="number"
                    min={1}
                    max={120}
                    step={1}
                    inputMode="numeric"
                    placeholder="e.g. 60"
                    value={durationStr}
                    onChange={(e) => {
                      setDurationStr(e.target.value);
                      setResult(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>

              {endTime !== null && (
                <p className="text-xs text-slate-500 -mt-2 mb-5">
                  Derived end time: {minutesToLabel(endTime)}
                  {endTime > DAY_END && (
                    <span className="text-red-600 font-medium"> — past 24:00, not allowed</span>
                  )}
                </p>
              )}

              {/* Blocked simulation */}
              <label
                htmlFor="p12-blocked"
                className="flex items-center gap-2.5 mb-6 text-sm text-slate-700 cursor-pointer select-none"
              >
                <input
                  id="p12-blocked"
                  type="checkbox"
                  checked={blocked}
                  onChange={(e) => {
                    setBlocked(e.target.checked);
                    setResult(null);
                  }}
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                Simulate room being blocked
              </label>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCheck}
                  disabled={!startStr || !durationStr}
                  className="flex-1 bg-teal-600 text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Check Availability
                </button>
                <button
                  onClick={handleReset}
                  className="sm:w-auto w-full border border-slate-300 text-slate-600 font-medium py-2.5 px-5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Result */}
              <div role="status" aria-atomic="true">
                {result && (
                  <div
                    className={`mt-5 p-4 rounded-xl border-2 flex items-start gap-3 transition-opacity duration-200 ${
                      result.available
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    {result.available ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`font-bold text-sm ${
                          result.available ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {result.available ? 'Available' : 'Unavailable'} · {result.code}
                      </p>
                      <p
                        className={`text-sm mt-0.5 break-words ${
                          result.available ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Read-only bookings */}
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Existing bookings for A-101 (read-only)
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                These records are fixtures; checks never modify them.
              </p>
              <div className="space-y-2.5">
                {READ_ONLY_BOOKINGS.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="w-1.5 h-10 rounded-full bg-teal-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{b.title}</p>
                      <p className="text-xs text-slate-500">{b.label}</p>
                    </div>
                    <Lock className="w-3.5 h-3.5 text-slate-300 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: contract summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 sticky top-6">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Contract summary
              </h2>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>
                  <span className="font-semibold text-slate-800">Room:</span> A-101, Engineering
                  Block, capacity 40.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Current time:</span> fixed at
                  08:00 (fictional). Starts at or before 08:00 are <code>PAST_START</code>.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Duration:</span> whole minutes,
                  1–120. Zero or 121+ is <code>INVALID_DURATION</code>; so is a slot ending after
                  24:00. Ending exactly at 24:00 is allowed.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Overlap:</span> slots crossing a
                  booking are <code>OVERLAP</code>; touching an endpoint only is allowed.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Blocked:</span> an otherwise
                  valid request on a blocked room is <code>BLOCKED</code>.
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Malformed input:</span>{' '}
                  unparseable start or duration gets <code>INVALID_START</code> /{' '}
                  <code>INVALID_DURATION</code> feedback.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-400">
          Practice Work #12 · Code-based version · Fictional sample data
        </div>
      </footer>
    </div>
  );
}
