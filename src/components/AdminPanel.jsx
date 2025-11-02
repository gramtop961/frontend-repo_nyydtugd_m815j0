import PropTypes from "prop-types";
import { Plus, MinusCircle } from "lucide-react";

export default function AdminPanel({
  appointmentTypes,
  workingDays,
  startTime,
  endTime,
  onUpdateConfig,
}) {
  const toggleDay = (d) => {
    const set = new Set(workingDays);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    onUpdateConfig({ workingDays: Array.from(set).sort((a, b) => a - b) });
  };

  const updateTime = (key, val) => onUpdateConfig({ [key]: val });

  const addType = () => {
    const id = crypto.randomUUID();
    const name = prompt("Service name (e.g., Haircut + Beard)");
    if (!name) return;
    const duration = parseInt(prompt("Duration (minutes)"), 10);
    if (!duration || duration <= 0) return;
    const price = parseFloat(prompt("Price (USD)"));
    if (!price || price < 0) return;
    onUpdateConfig({
      appointmentTypes: [
        ...appointmentTypes,
        { id, name, duration: Number(duration), price: Number(price) },
      ],
    });
  };

  const removeType = (id) => {
    onUpdateConfig({
      appointmentTypes: appointmentTypes.filter((t) => t.id !== id),
    });
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-2xl border border-neutral-200 p-5 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Admin Controls</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium mb-2">Working Days</p>
          <div className="flex flex-wrap gap-2">
            {dayNames.map((d, i) => {
              const active = workingDays.includes(i);
              return (
                <button
                  key={d}
                  onClick={() => toggleDay(i)}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    active
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white hover:bg-neutral-50 border-neutral-300"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => updateTime("startTime", e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => updateTime("endTime", e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Appointment Types</p>
            <button
              onClick={addType}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-900 text-white"
            >
              <Plus size={16} /> Add Type
            </button>
          </div>
          <ul className="space-y-2">
            {appointmentTypes.map((t) => (
              <li
                key={t.id}
                className="p-3 rounded-lg border flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-neutral-600">
                    {t.duration}m • ${t.price}
                  </p>
                </div>
                <button
                  onClick={() => removeType(t.id)}
                  className="text-red-600 inline-flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-neutral-50"
                >
                  <MinusCircle size={16} /> Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

AdminPanel.propTypes = {
  appointmentTypes: PropTypes.array.isRequired,
  workingDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  onUpdateConfig: PropTypes.func.isRequired,
};
