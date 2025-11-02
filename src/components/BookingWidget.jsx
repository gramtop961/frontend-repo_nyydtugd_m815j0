import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CheckCircle2, Clock4, CalendarDays } from "lucide-react";

function timeStringToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTimeString(mins) {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function BookingWidget({
  appointmentTypes,
  workingDays,
  startTime,
  endTime,
  appointments,
  onBook,
}) {
  const [selectedTypeId, setSelectedTypeId] = useState(
    appointmentTypes[0]?.id ?? ""
  );
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState("");
  const selectedType = appointmentTypes.find((t) => t.id === selectedTypeId);

  const availableSlots = useMemo(() => {
    if (!selectedType) return [];
    const dow = date.getDay();
    if (!workingDays.includes(dow)) return [];

    const start = timeStringToMinutes(startTime);
    const end = timeStringToMinutes(endTime);
    const step = 15; // finer stepping for collision detection

    // Build blocked intervals from existing appointments
    const blocks = appointments
      .filter((a) => isSameDate(new Date(a.date), date))
      .map((a) => {
        const s = timeStringToMinutes(a.time);
        const e = s + a.duration;
        return [s, e];
      });

    const slots = [];
    for (let t = start; t + selectedType.duration <= end; t += step) {
      const s = t;
      const e = t + selectedType.duration;
      const overlaps = blocks.some(([bs, be]) => !(e <= bs || s >= be));
      if (!overlaps && (t - start) % 30 === 0) {
        // expose on 30-min grid for UX
        slots.push(minutesToTimeString(t));
      }
    }
    return slots;
  }, [appointments, date, endTime, selectedType, startTime, workingDays]);

  const handleBook = () => {
    if (!selectedType || !selectedTime) return;
    onBook({
      id: crypto.randomUUID(),
      typeId: selectedType.id,
      typeName: selectedType.name,
      duration: selectedType.duration,
      price: selectedType.price,
      date: date.toISOString(),
      time: selectedTime,
    });
    setSelectedTime("");
  };

  const dayOpen = workingDays.includes(date.getDay());

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-neutral-200 p-5 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2 space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              Service
            </label>
            <select
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
            >
              {appointmentTypes.map((t) => (
                <option key={t.id} value={t.id}>{`${t.name} • ${t.duration}m • $${t.price}`}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-neutral-700 mt-4">
              Date
            </label>
            <input
              aria-label="Date"
              type="date"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              value={date.toISOString().slice(0, 10)}
              onChange={(e) => setDate(new Date(`${e.target.value}T00:00:00`))}
            />

            <p className="text-xs text-neutral-500 mt-2 flex items-center gap-2">
              <Clock4 size={14} />
              Working hours: {startTime}–{endTime}
            </p>
          </div>

          <div className="md:w-1/2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Available Times
            </label>
            {!dayOpen ? (
              <div className="p-4 rounded-lg border border-dashed text-neutral-600">
                Closed this day. Please choose another.
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed text-neutral-600">
                No slots available. Try a different time or service.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                      selectedTime === t
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white hover:bg-neutral-50 border-neutral-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleBook}
              disabled={!selectedType || !selectedTime}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={18} /> Confirm Booking
            </button>

            <p className="text-xs text-neutral-500 mt-3 flex items-center gap-2">
              <CalendarDays size={14} /> You can add it to your calendar after
              booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

BookingWidget.propTypes = {
  appointmentTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  workingDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      typeId: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  onBook: PropTypes.func.isRequired,
};
