import React, { useState, useRef } from "react";
import {
  Search,
  Plus,
  Filter,
  X,
  CheckCircle2,
  Package,
  MapPin,
  Cpu,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AddModal } from "../components/reusableModal";
import { useQueryClient } from "@tanstack/react-query";
import { EquipmentFields } from "../lib/validations/equipment";
import { useTableData } from "../lib/hooks/useTableData";

const Equipment: React.FC = () => {
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [expandedLabId, setExpandedLabId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);
  const [showModal, setModal] = useState(false);

  const queryClient = useQueryClient();
  const { data: labData } = useTableData("laboratories");
  const { data: categoryData } = useTableData("categories");
  const { data: equipmentData } = useTableData("equipment");
  const { data: peripheralData } = useTableData("peripherals"); // ADD THIS

  // 1. Filter out deleted items and prepare data
  const activeEquipment =
    equipmentData?.filter((e: any) => !e.is_deleted) ?? [];

  const categoryOptions =
    categoryData?.map((cat: any) => ({
      value: String(cat.category_id),
      label: cat.category_name,
    })) ?? [];

  const labOptions =
    labData?.map((lab: any) => ({
      value: String(lab.lab_id),
      label: lab.lab_name,
    })) ?? [];

  // 3. Dashboard Totals (matching DB status strings)
  const totalItems = activeEquipment.length;
  const availableCount = activeEquipment.filter(
    (a: any) => a.status === "available",
  ).length;
  const inUseCount = activeEquipment.filter(
    (a: any) => a.status === "in_use",
  ).length;
  const maintenanceCount = activeEquipment.filter(
    (a: any) => a.status === "unavailable",
  ).length;

  // 4. Per-lab Statistics Mapping
  const labStats =
    labData?.map((lab: any) => {
      const assetsInLab = activeEquipment.filter(
        (e: any) => e.lab_id === lab.lab_id,
      );
      return {
        ...lab,
        total: assetsInLab.length,
        available: assetsInLab.filter((e: any) => e.status === "available")
          .length,
        inUse: assetsInLab.filter((e: any) => e.status === "in_use").length,
        maintenance: assetsInLab.filter((e: any) => e.status === "unavailable")
          .length,
        assets: assetsInLab,
      };
    }) ?? [];

  // 5. Table Filtering Logic
  const filteredAssets = activeEquipment.filter((asset: any) => {
    const matchesLab = selectedLabId ? asset.lab_id === selectedLabId : true;
    const matchesSearch =
      asset.asset_tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLab && matchesSearch;
  });

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLabClick = (id: number) => {
    setSelectedLabId(id);
    setTimeout(scrollToTable, 100);
  };

  const toggleExpand = (id: number) => {
    setExpandedLabId(expandedLabId === id ? null : id);
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Equipment Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            CLAMS / Admin / Inventory Management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-md hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-bold text-[11px] uppercase tracking-wider"
          >
            <Plus size={18} /> Add New Asset
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => setSelectedLabId(null)}
          className="bg-white p-4 rounded-md border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-200 transition-all"
        >
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Package size={16} />
            <p className="text-[10px] font-bold uppercase">Total Stock</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{totalItems}</p>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <CheckCircle2 size={16} />
            <p className="text-[10px] font-bold uppercase">Available</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{availableCount}</p>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Cpu size={16} />
            <p className="text-[10px] font-bold uppercase">In Use</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{inUseCount}</p>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Wrench size={16} />
            <p className="text-[10px] font-bold uppercase">Maintenance</p>
          </div>
          <p className="text-xl font-bold text-slate-800">{maintenanceCount}</p>
        </div>
      </div>

      {/* Laboratories Summary */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-indigo-500" /> Laboratories Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labStats.map((lab: any) => (
            <div
              key={lab.lab_id}
              className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              <div
                className="p-4 cursor-pointer hover:bg-slate-50 flex items-center justify-between"
                onClick={() => toggleExpand(lab.lab_id)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {lab.lab_name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-slate-700">{lab.lab_name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLabClick(lab.lab_id);
                    }}
                    className="text-xs font-bold bg-indigo-100 hover:bg-indigo-200 px-2 py-1 rounded-full text-indigo-700"
                  >
                    {lab.total} total
                  </button>
                  {expandedLabId === lab.lab_id ? (
                    <ChevronUp size={18} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400" />
                  )}
                </div>
              </div>

              <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-emerald-50 rounded-md p-2">
                  <p className="text-emerald-600 font-bold">{lab.available}</p>
                  <p className="text-[10px] text-slate-500">Available</p>
                </div>
                <div className="bg-blue-50 rounded-md p-2">
                  <p className="text-blue-600 font-bold">{lab.inUse}</p>
                  <p className="text-[10px] text-slate-500">In Use</p>
                </div>
                <div className="bg-rose-50 rounded-md p-2">
                  <p className="text-rose-600 font-bold">{lab.maintenance}</p>
                  <p className="text-[10px] text-slate-500">Maint.</p>
                </div>
              </div>

              {expandedLabId === lab.lab_id && (
                <div className="border-t border-zinc-200 bg-slate-50/50 p-3 space-y-2 max-h-64 overflow-y-auto">
                  {lab.assets.map((asset: any) => (
                    <div
                      key={asset.equipment_id}
                      className="bg-white rounded-md p-2 flex items-center justify-between shadow-sm border border-zinc-200"
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          {asset.item_name} {asset.model}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {asset.asset_tag}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          asset.status === "available"
                            ? "bg-emerald-100 text-emerald-700"
                            : asset.status === "in_use"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {asset.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div
        ref={tableRef}
        className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-zinc-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Asset Tag, Name, or Model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2">
            {selectedLabId && (
              <button
                onClick={() => setSelectedLabId(null)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-sm font-semibold"
              >
                <X size={18} /> Clear Lab Filter
              </button>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 font-semibold">
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4">Asset Tag</th>
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Model</th>
                <th className="px-6 py-4">Laboratory</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((item: any) => (
                <tr
                  key={item.equipment_id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                    {item.asset_tag}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {item.item_name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {item.model}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    {labData?.find((l: any) => l.lab_id === item.lab_id)
                      ?.lab_name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                          item.status === "available"
                            ? "bg-emerald-50 text-emerald-600"
                            : item.status === "in_use"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddModal
          fields={EquipmentFields(
            categoryOptions,
            labOptions,
            peripheralData || [], // Pass everything here
          )}
          table={"equipment"}
          onClose={() => setModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["equipment"] });
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Equipment;
