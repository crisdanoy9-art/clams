import React, { useState } from "react";
import { Plus, Monitor, Search, X } from "lucide-react";

// ── Station PC icon (same as before) ───────────────────────────
const PCIcon = ({ status }) => {
  const colors = {
    available: { body: "#22c55e", screen: "#bbf7d0", stand: "#16a34a" },
    under_maintenance: { body: "#eab308", screen: "#fef9c3", stand: "#ca8a04" },
    unavailable: { body: "#ef4444", screen: "#fecaca", stand: "#dc2626" },
  };
  const c = colors[status] || colors.available;
  return (
    <svg
      viewBox="0 0 48 52"
      width="48"
      height="52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="2" width="40" height="30" rx="4" fill={c.body} />
      <rect x="8" y="6" width="32" height="22" rx="2" fill={c.screen} />
      <rect x="21" y="32" width="6" height="8" rx="1" fill={c.stand} />
      <rect x="13" y="40" width="22" height="4" rx="2" fill={c.stand} />
      <circle cx="24" cy="29" r="1.5" fill={c.stand} />
    </svg>
  );
};

// ── Specs Sidebar – now covers the full modal height (right side) ──
function PCSpecsSidebar({ pc, lab, onClose }) {
  const statusLabels = {
    available: "Available",
    under_maintenance: "Under Maintenance",
    unavailable: "Unavailable",
  };
  const statusColors = {
    available: "text-emerald-600 bg-emerald-50",
    under_maintenance: "text-amber-600 bg-amber-50",
    unavailable: "text-red-600 bg-red-50",
  };

  const specs = {
    cpu: "Intel Core i5-12400",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    os: "Windows 11 Pro",
    ip: `192.168.1.${100 + pc.id}`,
    mac: `00:1A:2B:3C:4D:${pc.id.toString().padStart(2, "0")}`,
    software: "MS Office, VS Code, Chrome, Zoom",
  };

  return (
    // This div is positioned relative to the modal container (which has `relative` class)
    <div className="absolute right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col animate-slide-in-right">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            PC {String(pc.id).padStart(2, "0")}
          </h3>
          <p className="text-sm text-slate-500">{lab.lab_name}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
          <X size={18} className="text-slate-400" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[pc.status]}`}
          >
            {statusLabels[pc.status]}
          </span>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            CPU
          </label>
          <p className="text-sm text-slate-700 mt-1">{specs.cpu}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            RAM
          </label>
          <p className="text-sm text-slate-700 mt-1">{specs.ram}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Storage
          </label>
          <p className="text-sm text-slate-700 mt-1">{specs.storage}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            OS
          </label>
          <p className="text-sm text-slate-700 mt-1">{specs.os}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            IP Address
          </label>
          <p className="text-sm font-mono text-slate-600 mt-1">{specs.ip}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            MAC Address
          </label>
          <p className="text-sm font-mono text-slate-600 mt-1">{specs.mac}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Installed Software
          </label>
          <p className="text-sm text-slate-600 mt-1">{specs.software}</p>
        </div>
      </div>
    </div>
  );
}

// ── Large Modal (almost full screen) ───────────────────────────
function LabStationModal({ lab, onClose }) {
  const [selectedPC, setSelectedPC] = useState(null);

  if (!lab) return null;

  const stations = Array.from({ length: lab.total_stations || 30 }, (_, i) => {
    let status = "available";
    if (i >= (lab.working || lab.total_stations - 2)) {
      status = i % 2 === 0 ? "under_maintenance" : "unavailable";
    }
    if (i === 5) status = "under_maintenance";
    if (i === 8) status = "unavailable";
    return { id: i + 1, status };
  });

  const available = stations.filter((s) => s.status === "available").length;
  const maintenance = stations.filter(
    (s) => s.status === "under_maintenance",
  ).length;
  const unavailable = stations.filter((s) => s.status === "unavailable").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop (no blur) */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal – very large, relative container for absolute sidebar */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {lab.lab_name}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {lab.building} · Room {lab.room_number}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-green-500" /> Available (
                {available})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500" /> Maintenance
                ({maintenance})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-red-500" /> Unavailable (
                {unavailable})
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 shrink-0">
          {[
            {
              label: "Total Stations",
              value: lab.total_stations,
              color: "text-slate-900",
            },
            { label: "Available", value: available, color: "text-green-600" },
            {
              label: "Maintenance",
              value: maintenance,
              color: "text-amber-600",
            },
            { label: "Unavailable", value: unavailable, color: "text-red-600" },
          ].map((s) => (
            <div key={s.label} className="px-6 py-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Station grid (scrollable) – no shift, sidebar overlays on top */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4">
            {stations.map((station) => (
              <div
                key={station.id}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => setSelectedPC(station)}
              >
                <div className="group-hover:scale-105 transition-transform">
                  <PCIcon status={station.status} />
                </div>
                <span className="text-xs font-medium text-slate-500">
                  PC {String(station.id).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-400">
                  {station.status === "available"
                    ? "Ready"
                    : station.status === "under_maintenance"
                      ? "Maint"
                      : "Offline"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar – placed at root of modal, covers full right side (including header & stats) */}
        {selectedPC && (
          <PCSpecsSidebar
            pc={selectedPC}
            lab={lab}
            onClose={() => setSelectedPC(null)}
          />
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

// ── Lab Card (unchanged) ────────────────────────────────────────
function LabCard({ lab, onClick }) {
  const pct = Math.round(
    ((lab.working || lab.total_stations - 2) / lab.total_stations) * 100,
  );
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 p-6 text-left hover:border-slate-300 hover:shadow-md transition-all w-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Monitor size={20} className="text-indigo-600" />
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${lab.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
        >
          {lab.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>
      <h3 className="text-base font-semibold text-slate-800">{lab.lab_name}</h3>
      <p className="text-sm text-slate-400 mt-0.5">
        {lab.building} · Room {lab.room_number}
      </p>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-500">Stations</span>
          <span className="text-xs font-semibold text-slate-700">
            {lab.working || lab.total_stations - 2}/{lab.total_stations}
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-indigo-500 font-medium mt-4 group-hover:underline">
        View station map →
      </p>
    </button>
  );
}

// ── Mock labs (unchanged) ───────────────────────────────────────
const MOCK_LABS = [
  {
    id: 1,
    lab_name: "CCS Lab 1",
    room_number: "101",
    building: "CCS Building",
    total_stations: 40,
    working: 38,
    status: "active",
  },
  {
    id: 2,
    lab_name: "CCS Lab 2",
    room_number: "102",
    building: "CCS Building",
    total_stations: 40,
    working: 35,
    status: "active",
  },
  {
    id: 3,
    lab_name: "CCS Lab 3",
    room_number: "201",
    building: "CCS Building",
    total_stations: 30,
    working: 28,
    status: "active",
  },
  {
    id: 4,
    lab_name: "Network Lab",
    room_number: "203",
    building: "CCS Building",
    total_stations: 25,
    working: 20,
    status: "active",
  },
  {
    id: 5,
    lab_name: "Research Lab",
    room_number: "301",
    building: "CCS Building",
    total_stations: 15,
    working: 15,
    status: "active",
  },
  {
    id: 6,
    lab_name: "Hardware Lab",
    room_number: "105",
    building: "CCS Building",
    total_stations: 20,
    working: 12,
    status: "inactive",
  },
];

// ── Main Laboratories Component ─────────────────────────────────
export default function Laboratories({ userRole }) {
  const [labs, setLabs] = useState(MOCK_LABS);
  const [selectedLab, setSelectedLab] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = labs.filter(
    (l) =>
      l.lab_name.toLowerCase().includes(search.toLowerCase()) ||
      l.room_number.includes(search),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laboratories</h1>
          <p className="text-sm text-slate-500 mt-1">
            {labs.length} labs registered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search labs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-56"
            />
          </div>
          {userRole === "admin" && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors"
            >
              <Plus size={16} /> Add Lab
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((lab) => (
          <LabCard key={lab.id} lab={lab} onClick={() => setSelectedLab(lab)} />
        ))}
      </div>

      {selectedLab && (
        <LabStationModal
          lab={selectedLab}
          onClose={() => setSelectedLab(null)}
        />
      )}

      {/* FormModal placeholder */}
    </div>
  );
}
