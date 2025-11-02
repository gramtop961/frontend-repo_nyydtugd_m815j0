import { Calendar, Scissors, Settings, User } from "lucide-react";
import PropTypes from "prop-types";

export default function Navbar({ active, onChange }) {
  const tabs = [
    { key: "home", label: "Home", icon: Scissors },
    { key: "book", label: "Book", icon: Calendar },
    { key: "appointments", label: "My Appointments", icon: User },
    { key: "admin", label: "Admin", icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-semibold tracking-tight">Hair-Formation</div>
          <div className="flex items-center gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onChange(t.key)}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-md ring-2 ring-neutral-900/30" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};