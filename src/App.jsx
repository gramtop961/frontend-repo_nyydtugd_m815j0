import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookingWidget from "./components/BookingWidget";
import AppointmentsPanel from "./components/AppointmentsPanel";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [active, setActive] = useState("home");

  // Configurable by Admin
  const [appointmentTypes, setAppointmentTypes] = useState([
    { id: crypto.randomUUID(), name: "Classic Cut", duration: 30, price: 25 },
    { id: crypto.randomUUID(), name: "Skin Fade", duration: 45, price: 35 },
    { id: crypto.randomUUID(), name: "Cut + Beard", duration: 60, price: 45 },
  ]);
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5, 6]); // Mon-Sat
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  // Appointments state (client-side demo)
  const [appointments, setAppointments] = useState([]);

  const onBook = (appt) => {
    setAppointments((prev) => [...prev, appt]);
    setActive("appointments");
  };

  const onRemove = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const onUpdateConfig = (changes) => {
    if (changes.appointmentTypes) setAppointmentTypes(changes.appointmentTypes);
    if (changes.workingDays) setWorkingDays(changes.workingDays);
    if (changes.startTime) setStartTime(changes.startTime);
    if (changes.endTime) setEndTime(changes.endTime);
  };

  const section = useMemo(() => {
    switch (active) {
      case "home":
        return (
          <div className="space-y-10">
            <Hero />
            <div id="book" className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-semibold mb-4">
                Book your next look
              </h2>
              <BookingWidget
                appointmentTypes={appointmentTypes}
                workingDays={workingDays}
                startTime={startTime}
                endTime={endTime}
                appointments={appointments}
                onBook={onBook}
              />
            </div>
          </div>
        );
      case "book":
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <BookingWidget
              appointmentTypes={appointmentTypes}
              workingDays={workingDays}
              startTime={startTime}
              endTime={endTime}
              appointments={appointments}
              onBook={onBook}
            />
          </div>
        );
      case "appointments":
        return (
          <div id="appointments" className="max-w-6xl mx-auto px-4 py-8">
            <AppointmentsPanel appointments={appointments} onRemove={onRemove} />
          </div>
        );
      case "admin":
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <AdminPanel
              appointmentTypes={appointmentTypes}
              workingDays={workingDays}
              startTime={startTime}
              endTime={endTime}
              onUpdateConfig={onUpdateConfig}
            />
          </div>
        );
      default:
        return null;
    }
  }, [active, appointmentTypes, appointments, endTime, startTime, workingDays]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 text-neutral-900">
      <Navbar active={active} onChange={setActive} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {section}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="mt-16 border-t border-neutral-200 py-8 text-center text-sm text-neutral-600">
        © {new Date().getFullYear()} Hair-Formation. All rights reserved.
      </footer>
    </div>
  );
}
