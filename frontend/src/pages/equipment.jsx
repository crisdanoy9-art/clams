import React, { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Monitor } from "lucide-react";
import FormModal from "../components/modal";
// import { EquipmentApi } from "../config/formApi";

const STATUS_STYLES = {
  working: "bg-emerald-50 text-emerald-700",
  for_repair: "bg-amber-50 text-amber-700",
  retired: "bg-slate-100 text-slate-500",
  lost: "bg-red-50 text-red-600",
};

const STATUS_LABELS = {
  working: "Working",
  for_repair: "For Repair",
  retired: "Retired",
  lost: "Lost",
};

const MOCK_EQUIPMENT = [
  {
    id: 1,
    asset_tag: "A-001",
    item_name: "Desktop Computer",
    brand: "Acer",
    model: "Veriton X",
    lab_id: "CCS Lab 1",
    status: "working",
    purchase_date: "2022-06-01",
  },
  {
    id: 2,
    asset_tag: "A-002",
    item_name: "Desktop Computer",
    brand: "Dell",
    model: "OptiPlex",
    lab_id: "CCS Lab 1",
    status: "working",
    purchase_date: "2022-06-01",
  },
  {
    id: 3,
    asset_tag: "A-003",
    item_name: "Projector",
    brand: "Epson",
    model: "EB-X51",
    lab_id: "CCS Lab 2",
    status: "for_repair",
    purchase_date: "2021-03-15",
  },
  {
    id: 4,
    asset_tag: "A-004",
    item_name: "Laptop",
    brand: "Lenovo",
    model: "ThinkPad",
    lab_id: "Research Lab",
    status: "working",
    purchase_date: "2023-01-10",
  },
  {
    id: 5,
    asset_tag: "A-005",
    item_name: "UPS",
    brand: "APC",
    model: "BX1500M",
    lab_id: "CCS Lab 3",
    status: "retired",
    purchase_date: "2019-08-20",
  },
  {
    id: 6,
    asset_tag: "A-006",
    item_name: "Switch",
    brand: "Cisco",
    model: "SG350",
    lab_id: "Network Lab",
    status: "working",
    purchase_date: "2023-05-05",
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
    { label: "Computer", value: "1" },
    { label: "Peripherals", value: "2" },
    { label: "Network", value: "3" },
    { label: "AV Equipment", value: "4" },
  ],
};

export default function Equipment({ userRole }) {
  const [equipment, setEquipment] = useState(MOCK_EQUIPMENT);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = equipment.filter((e) => {
    const matchSearch =
      e.item_name.toLowerCase().includes(search.toLowerCase()) ||
      e.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
      e.brand.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (data) => {
    if (editItem) {
      setEquipment((prev) =>
        prev.map((e) => (e.id === editItem.id ? { ...e, ...data } : e)),
      );
    } else {
      setEquipment((prev) => [...prev, { ...data, id: prev.length + 1 }]);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Equipment</h1>
          <p className="text-sm text-slate-500 mt-1">
            {equipment.length} assets total
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
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition w-56"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="working">Working</option>
            <option value="for_repair">For Repair</option>
            <option value="retired">Retired</option>
            <option value="lost">Lost</option>
          </select>
          {userRole === "admin" && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add Equipment
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Asset Tag
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Item
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Brand / Model
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Laboratory
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Purchase Date
                </th>
                {userRole === "admin" && <th className="px-6 py-4" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    No equipment found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                      {item.asset_tag}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Monitor size={15} className="text-slate-500" />
                        </div>
                        <span className="font-medium text-slate-800">
                          {item.item_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.brand} {item.model}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.lab_id}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[item.status]}`}
                      >
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {item.purchase_date}
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

      {/* <FormModal */}
      {/*   isOpen={isFormOpen} */}
      {/*   onClose={() => { */}
      {/*     setIsFormOpen(false); */}
      {/*     setEditItem(null); */}
      {/*   }} */}
      {/*   onSubmit={handleSubmit} */}
      {/*   title={editItem ? "Edit Equipment" : "Add Equipment"} */}
      {/*   apiConfig={EquipmentApi} */}
      {/*   initialData={editItem || {}} */}
      {/*   selectOptions={SELECT_OPTIONS} */}
      {/* /> */}
    </div>
  );
}
