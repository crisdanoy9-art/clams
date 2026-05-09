import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Keyboard,
  Mouse,
  Printer,
  Camera,
  Headphones,
  Mic,
  AlertCircle,
  CheckCircle,
  Layers,
} from "lucide-react";

const STATUS_STYLES = {
  working: "bg-emerald-50 text-emerald-700",
  damaged: "bg-red-50 text-red-600",
};

const STATUS_LABELS = {
  working: "Working",
  damaged: "Damaged",
};

// Mock data based on the new schema: peripheral_id, lab_id, category_id, item_name, brand, working_count, damaged_count, updated_at
const MOCK_PERIPHERALS = [
  {
    id: 1,
    peripheral_id: "PER-001",
    item_name: "Mechanical Keyboard",
    brand: "Logitech",
    model: "G915",
    lab_id: "CCS Lab 1",
    category_id: "1",
    working_count: 12,
    damaged_count: 2,
    updated_at: "2024-01-15",
    type: "keyboard",
  },
  {
    id: 2,
    peripheral_id: "PER-002",
    item_name: "Wireless Mouse",
    brand: "Logitech",
    model: "MX Master 3",
    lab_id: "CCS Lab 1",
    category_id: "1",
    working_count: 25,
    damaged_count: 3,
    updated_at: "2024-01-15",
    type: "mouse",
  },
  {
    id: 3,
    peripheral_id: "PER-003",
    item_name: "Document Camera",
    brand: "IPEVO",
    model: "V4K",
    lab_id: "CCS Lab 2",
    category_id: "2",
    working_count: 4,
    damaged_count: 1,
    updated_at: "2024-02-20",
    type: "camera",
  },
  {
    id: 4,
    peripheral_id: "PER-004",
    item_name: "Noise-Cancelling Headset",
    brand: "Sony",
    model: "WH-1000XM4",
    lab_id: "Research Lab",
    category_id: "2",
    working_count: 8,
    damaged_count: 0,
    updated_at: "2024-01-10",
    type: "headset",
  },
  {
    id: 5,
    peripheral_id: "PER-005",
    item_name: "USB Microphone",
    brand: "Blue",
    model: "Yeti",
    lab_id: "CCS Lab 3",
    category_id: "2",
    working_count: 3,
    damaged_count: 2,
    updated_at: "2024-03-05",
    type: "microphone",
  },
  {
    id: 6,
    peripheral_id: "PER-006",
    item_name: "Laser Printer",
    brand: "Brother",
    model: "HL-L2350DW",
    lab_id: "Network Lab",
    category_id: "3",
    working_count: 2,
    damaged_count: 1,
    updated_at: "2024-02-28",
    type: "printer",
  },
  {
    id: 7,
    peripheral_id: "PER-007",
    item_name: "Gaming Mouse",
    brand: "Razer",
    model: "DeathAdder V2",
    lab_id: "CCS Lab 1",
    category_id: "1",
    working_count: 15,
    damaged_count: 2,
    updated_at: "2024-01-20",
    type: "mouse",
  },
  {
    id: 8,
    peripheral_id: "PER-008",
    item_name: "Webcam",
    brand: "Logitech",
    model: "C920",
    lab_id: "Hardware Lab",
    category_id: "2",
    working_count: 6,
    damaged_count: 2,
    updated_at: "2024-02-14",
    type: "camera",
  },
];

const SELECT_OPTIONS = {
  lab_id: [
    { label: "CCS Lab 1", value: "CCS Lab 1" },
    { label: "CCS Lab 2", value: "CCS Lab 2" },
    { label: "CCS Lab 3", value: "CCS Lab 3" },
    { label: "Network Lab", value: "Network Lab" },
    { label: "Research Lab", value: "Research Lab" },
    { label: "Hardware Lab", value: "Hardware Lab" },
  ],
  category_id: [
    { label: "Input Devices", value: "1" },
    { label: "Output Devices", value: "2" },
    { label: "Storage Devices", value: "3" },
    { label: "Networking", value: "4" },
  ],
  type: [
    { label: "Keyboard", value: "keyboard" },
    { label: "Mouse", value: "mouse" },
    { label: "Headset", value: "headset" },
    { label: "Microphone", value: "microphone" },
    { label: "Camera", value: "camera" },
    { label: "Printer", value: "printer" },
    { label: "Monitor", value: "monitor" },
    { label: "Speakers", value: "speakers" },
  ],
};

// Icon mapping for peripheral types
const getPeripheralIcon = (type) => {
  switch (type) {
    case "keyboard":
      return <Keyboard size={15} className="text-slate-500" />;
    case "mouse":
      return <Mouse size={15} className="text-slate-500" />;
    case "printer":
      return <Printer size={15} className="text-slate-500" />;
    case "camera":
      return <Camera size={15} className="text-slate-500" />;
    case "headset":
      return <Headphones size={15} className="text-slate-500" />;
    case "microphone":
      return <Mic size={15} className="text-slate-500" />;
    default:
      return <Keyboard size={15} className="text-slate-500" />;
  }
};

export default function Peripherals({ userRole }) {
  const [peripherals, setPeripherals] = useState(MOCK_PERIPHERALS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Calculate totals
  const totalWorking = peripherals.reduce((sum, p) => sum + p.working_count, 0);
  const totalDamaged = peripherals.reduce((sum, p) => sum + p.damaged_count, 0);
  const totalPeripherals = totalWorking + totalDamaged;

  const filtered = peripherals.filter((e) => {
    const matchSearch =
      e.item_name.toLowerCase().includes(search.toLowerCase()) ||
      e.peripheral_id.toLowerCase().includes(search.toLowerCase()) ||
      e.brand.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || e.type === filterType;

    // For status filtering: "working" shows items with working_count > 0, "damaged" shows damaged_count > 0
    let matchStatus = true;
    if (filterStatus === "working") {
      matchStatus = e.working_count > 0;
    } else if (filterStatus === "damaged") {
      matchStatus = e.damaged_count > 0;
    }

    return matchSearch && matchStatus && matchType;
  });

  const handleSubmit = (data) => {
    if (editItem) {
      setPeripherals((prev) =>
        prev.map((e) => (e.id === editItem.id ? { ...e, ...data } : e)),
      );
    } else {
      setPeripherals((prev) => [
        ...prev,
        {
          ...data,
          id: prev.length + 1,
          peripheral_id: `PER-${String(prev.length + 1).padStart(3, "0")}`,
          working_count: data.working_count || 0,
          damaged_count: data.damaged_count || 0,
          updated_at: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setIsFormOpen(false);
    setEditItem(null);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };

  // Get unique types for filter dropdown
  const uniqueTypes = Array.from(new Set(peripherals.map((p) => p.type)));

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Stats Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Peripherals</h1>
          <p className="text-sm text-slate-500 mt-1">
            {peripherals.length} peripheral types • {totalPeripherals} total
            units
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search peripherals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-56"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition cursor-pointer"
          >
            <option value="all">All Types</option>
            {SELECT_OPTIONS.type.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="working">Has Working Units</option>
            <option value="damaged">Has Damaged Units</option>
          </select>
          {userRole === "admin" && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add Peripheral
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Layers size={20} className="text-slate-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Total Peripherals
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {totalPeripherals}
            </p>
            <p className="text-xs text-slate-400">{peripherals.length} types</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Working Units
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {totalWorking}
            </p>
            <p className="text-xs text-slate-400">
              {totalPeripherals > 0
                ? Math.round((totalWorking / totalPeripherals) * 100)
                : 0}
              % of total
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Damaged Units
            </p>
            <p className="text-2xl font-bold text-red-600">{totalDamaged}</p>
            <p className="text-xs text-slate-400">
              {totalPeripherals > 0
                ? Math.round((totalDamaged / totalPeripherals) * 100)
                : 0}
              % of total
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Peripheral ID
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Item
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Brand / Model
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Laboratory
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Working
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Damaged
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Total
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Last Updated
                </th>
                {userRole === "admin" && <th className="px-6 py-4" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    No peripherals found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                      {item.peripheral_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getPeripheralIcon(item.type)}
                        </div>
                        <span className="font-medium text-slate-800">
                          {item.item_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.brand} {item.model}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.lab_id}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        {item.working_count}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                        {item.damaged_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                      {item.working_count + item.damaged_count}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {item.updated_at}
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FormModal commented out - same structure as original */}
      {/* <FormModal */}
      {/*   isOpen={isFormOpen} */}
      {/*   onClose={() => { */}
      {/*     setIsFormOpen(false); */}
      {/*     setEditItem(null); */}
      {/*   }} */}
      {/*   onSubmit={handleSubmit} */}
      {/*   title={editItem ? "Edit Peripheral" : "Add Peripheral"} */}
      {/*   apiConfig={PeripheralsApi} */}
      {/*   initialData={editItem || {}} */}
      {/*   selectOptions={SELECT_OPTIONS} */}
      {/* /> */}
    </div>
  );
}
