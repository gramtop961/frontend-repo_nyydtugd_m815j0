import PropTypes from "prop-types";
import { Trash2, CalendarPlus, CalendarDays } from "lucide-react";

function buildICS(appointment) {
  const d = new Date(appointment.date);
  const [h, m] = appointment.time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  const start = d;
  const end = new Date(start.getTime() + appointment.duration * 60000);

  function toICSDate(dt) {
    const pad = (n) => n.toString().padStart(2, "0");
    return (
      dt.getUTCFullYear().toString() +
      pad(dt.getUTCMonth() + 1) +
      pad(dt.getUTCDate()) +
      "T" +
      pad(dt.getUTCHours()) +
      pad(dt.getUTCMinutes()) +
      pad(dt.getUTCSeconds()) +
      "Z"
    );
  }

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hair-Formation//EN",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@hair-formation`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:Hair-Formation • ${appointment.typeName}`,
    `DESCRIPTION:Service: ${appointment.typeName}\\nPrice: $${appointment.price}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Blob([body], { type: "text/calendar;charset=utf-8" });
}

export default function AppointmentsPanel({ appointments, onRemove }) {
  const handleDownloadICS = (appt) => {
    const blob = buildICS(appt);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hair-formation-${appt.id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays size={18} /> Your Appointments
        </h3>
      </div>
      {appointments.length === 0 ? (
        <p className="text-neutral-600">No appointments yet.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((a) => (
            <li
              key={a.id}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{a.typeName}</p>
                <p className="text-sm text-neutral-600">
                  {new Date(a.date).toLocaleDateString()} at {a.time} • {a.duration}
                  m • ${a.price}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadICS(a)}
                  className="px-3 py-2 rounded-md border bg-white hover:bg-neutral-50 flex items-center gap-2"
                >
                  <CalendarPlus size={16} /> Add to Calendar
                </button>
                <button
                  onClick={() => onRemove(a.id)}
                  className="px-3 py-2 rounded-md border bg-white hover:bg-neutral-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

AppointmentsPanel.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      typeName: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
};
