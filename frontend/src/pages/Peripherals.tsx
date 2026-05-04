import React, { useState } from "react";
import {
  MousePointer2,
  Plus,
  RefreshCw,
  Package,
  X,
  Check,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { AddModal } from "../components/reusableModal";
import { PeripheralFields } from "../lib/validations/peripherals";
import { useTableData } from "../lib/hooks/useTableData";

const Peripherals: React.FC = () => {
  const [showModal, setModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch laboratories for dropdown options
  const { data: labData } = useTableData("laboratories");
  // Fetch peripherals data from API
  const { data: peripheralsData } = useTableData("peripherals");

  const labOptions =
    labData?.map((lab: any) => ({
      value: String(lab.lab_id),
      label: lab.lab_name,
    })) ?? [];

  // Use fetched peripherals (or empty array if not loaded yet)
  const peripherals = peripheralsData ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Peripherals Inventory
          </h2>
          <p className="text-xs font-bold text-slate-400">
            Inventory tracking for Lab 1, 2, and 3
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-md font-black text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {/* Modal Overlay - kept as original comment */}
      {/* {showModal && ( */}
      {/*   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-none h-full"> */}
      {/*     <div className="bg-white w-full max-w-md rounded-md shadow-2xl border border-slate-200 overflow-hidden animate-[drop_0.6s_cubic-bezier(0.34,1.56,0.64,1)]"> */}
      {/*       <div className="bg-indigo-600 p-8 text-white flex justify-between items-center"> */}
      {/*         <h3 className="font-black uppercase tracking-tighter text-xl"> */}
      {/*           Add Peripheral */}
      {/*         </h3> */}
      {/*         <button */}
      {/*           onClick={() => setModal(false)} */}
      {/*           className="hover:rotate-90 transition-transform" */}
      {/*         > */}
      {/*           <X size={24} /> */}
      {/*         </button> */}
      {/*       </div> */}
      {/*       <div className="p-8 space-y-4"> */}
      {/*         <input */}
      {/*           type="text" */}
      {/*           placeholder="Item Name" */}
      {/*           className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-md text-sm font-bold outline-none focus:border-indigo-600 transition-all" */}
      {/*           onChange={(e) => */}
      {/*             setNewItem({ ...newItem, name: e.target.value }) */}
      {/*           } */}
      {/*         /> */}
      {/*         <select */}
      {/*           className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-md text-sm font-bold outline-none focus:border-indigo-600 transition-all" */}
      {/*           onChange={(e) => */}
      {/*             setNewItem({ ...newItem, lab: e.target.value }) */}
      {/*           } */}
      {/*         > */}
      {/*           <option>Lab 1</option> */}
      {/*           <option>Lab 2</option> */}
      {/*           <option>Lab 3</option> */}
      {/*         </select> */}
      {/*         <input */}
      {/*           type="text" */}
      {/*           placeholder="Category (e.g. Audio)" */}
      {/*           className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-md text-sm font-bold outline-none focus:border-indigo-600 transition-all" */}
      {/*           onChange={(e) => */}
      {/*             setNewItem({ ...newItem, category: e.target.value }) */}
      {/*           } */}
      {/*         /> */}
      {/*         <input */}
      {/*           type="number" */}
      {/*           placeholder="Working Units (Stock)" */}
      {/*           min="1" */}
      {/*           className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-md text-sm font-bold outline-none focus:border-indigo-600 transition-all" */}
      {/*           value={newItem.working || ""} */}
      {/*           onChange={(e) => */}
      {/*             setNewItem({ */}
      {/*               ...newItem, */}
      {/*               working: parseInt(e.target.value) || 0, */}
      {/*             }) */}
      {/*           } */}
      {/*         /> */}
      {/*         <button */}
      {/*           onClick={handleAdd} */}
      {/*           className="w-full bg-indigo-600 text-white py-4 rounded-md font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all" */}
      {/*         > */}
      {/*           Confirm Entry */}
      {/*         </button> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* )} */}

      {/* Table Section with empty state */}
      <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b">
            <tr>
              <th className="px-8 py-6">Peripheral</th>
              <th className="px-8 py-6 text-center">Lab</th>
              <th className="px-8 py-6 text-center">Stock (Working)</th>
              <th className="px-8 py-6 text-center">Total Count</th>
              <th className="px-8 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-bold text-xs">
            {peripherals.map((p: any) => (
              <tr key={p.peripheral_id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Package size={14} />
                  </div>
                  <div>
                    <p className="text-slate-900">{p.item_name}</p>
                    <p className="text-[9px] text-slate-400 uppercase">
                      {p.brand}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg">
                    {labData?.find((lab: any) => lab.lab_id === p.lab_id)?.lab_name ?? "N/A"}
                  </span>
                </td>
                <td className="px-8 py-5 text-center text-indigo-600 font-black text-lg">
                  {p.working_count}
                </td>
                <td className="px-8 py-5 text-center text-indigo-600 font-black text-lg">
                  {p.total_count}
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-3 bg-slate-50 rounded-md hover:text-indigo-600 transition-all">
                    <RefreshCw size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {peripherals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center text-slate-400">
                  No peripherals added yet. Click "Add New Item" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <AddModal
          fields={PeripheralFields(labOptions)}
          table="peripherals"
          onClose={() => setModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["peripherals"] });
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Peripherals;