// frontend/src/pages/peripherals.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Keyboard,
  Mouse,
  Printer,
  Camera,
  Headphones,
  Mic,
  AlertCircle,
  CheckCircle,
  Layers,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Monitor,
  MapPin,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

// Icon mapping - KEEP YOUR EXISTING ICON LOGIC
const getPeripheralIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("keyboard"))
    return <Keyboard size={15} className="text-slate-500" />;
  if (name.includes("mouse"))
    return <Mouse size={15} className="text-slate-500" />;
  if (name.includes("printer"))
    return <Printer size={15} className="text-slate-500" />;
  if (name.includes("camera"))
    return <Camera size={15} className="text-slate-500" />;
  if (name.includes("head"))
    return <Headphones size={15} className="text-slate-500" />;
  if (name.includes("mic")) return <Mic size={15} className="text-slate-500" />;
  return <Keyboard size={15} className="text-slate-500" />;
};

// Add/Edit Modal - KEEP YOUR EXISTING MODAL STYLE
function PeripheralModal({
  peripheral,
  laboratories,
  categories,
  equipmentList,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    item_name: "",
    brand: "",
    category_id: "",
    lab_id: "",
    equipment_id: "",
    working_count: 0,
    damaged_count: 0,
  });
  const [locationType, setLocationType] = useState("lab");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (peripheral) {
      setFormData({
        item_name: peripheral.item_name || "",
        brand: peripheral.brand || "",
        category_id: peripheral.category_id || "",
        lab_id: peripheral.lab_id || "",
        equipment_id: peripheral.equipment_id || "",
        working_count: peripheral.working_count || 0,
        damaged_count: peripheral.damaged_count || 0,
      });
      if (peripheral.equipment_id) setLocationType("equipment");
      else if (peripheral.lab_id) setLocationType("lab");
      else setLocationType("none");
    }
  }, [peripheral]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        item_name: formData.item_name,
        brand: formData.brand || null,
        category_id: formData.category_id
          ? parseInt(formData.category_id)
          : null,
        lab_id:
          locationType === "lab"
            ? formData.lab_id
              ? parseInt(formData.lab_id)
              : null
            : null,
        equipment_id:
          locationType === "equipment"
            ? formData.equipment_id
              ? parseInt(formData.equipment_id)
              : null
            : null,
        working_count: parseInt(formData.working_count) || 0,
        damaged_count: parseInt(formData.damaged_count) || 0,
      };

      if (peripheral) {
        await axiosInstance.put(
          `/update/peripherals/${peripheral.peripheral_id}`,
          { data: submitData },
        );
        toast.success("Peripheral updated successfully");
      } else {
        await axiosInstance.post("/create/peripherals", { data: submitData });
        toast.success("Peripheral added successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save peripheral");
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipmentList.filter(
    (eq) => !formData.lab_id || eq.lab_id === parseInt(formData.lab_id),
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {peripheral ? "Edit Peripheral" : "Add Peripheral"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) =>
                  setFormData({ ...formData, item_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({ ...formData, category_id: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Working Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.working_count}
                onChange={(e) =>
                  setFormData({ ...formData, working_count: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Damaged Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.damaged_count}
                onChange={(e) =>
                  setFormData({ ...formData, damaged_count: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <label className="block text-xs font-medium text-slate-600 mb-3">
              Assign To (Optional)
            </label>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setLocationType("none")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${locationType === "none" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                None (Stock)
              </button>
              <button
                type="button"
                onClick={() => setLocationType("lab")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${locationType === "lab" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                Laboratory
              </button>
              <button
                type="button"
                onClick={() => setLocationType("equipment")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${locationType === "equipment" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                Specific PC
              </button>
            </div>

            {locationType === "lab" && (
              <select
                value={formData.lab_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lab_id: e.target.value,
                    equipment_id: "",
                  })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="">Select Laboratory</option>
                {laboratories.map((lab) => (
                  <option key={lab.lab_id} value={lab.lab_id}>
                    {lab.lab_name}
                  </option>
                ))}
              </select>
            )}

            {locationType === "equipment" && (
              <>
                <select
                  value={formData.lab_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lab_id: e.target.value,
                      equipment_id: "",
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl mb-3"
                >
                  <option value="">All Laboratories</option>
                  {laboratories.map((lab) => (
                    <option key={lab.lab_id} value={lab.lab_id}>
                      {lab.lab_name}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.equipment_id}
                  onChange={(e) =>
                    setFormData({ ...formData, equipment_id: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                >
                  <option value="">Select a PC</option>
                  {filteredEquipment.map((eq) => (
                    <option key={eq.equipment_id} value={eq.equipment_id}>
                      {eq.asset_tag} - {eq.item_name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-700 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {peripheral ? "Save Changes" : "Add Peripheral"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Modal
function ViewPeripheralModal({ peripheral, onClose }) {
  const getLocation = () => {
    if (peripheral.equipment_id)
      return `PC: ${peripheral.equipment_asset_tag || peripheral.equipment_id}`;
    if (peripheral.lab_id) return `Lab: ${peripheral.lab_name}`;
    return "Lab Stock";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Peripheral Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Item
            </label>
            <p>{peripheral.item_name}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Brand
            </label>
            <p>{peripheral.brand || "N/A"}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Category
            </label>
            <p>{peripheral.category_name || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Working
              </label>
              <p className="text-emerald-600 font-bold">
                {peripheral.working_count}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">
                Damaged
              </label>
              <p className="text-red-600 font-bold">
                {peripheral.damaged_count}
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Location
            </label>
            <p>{getLocation()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Modal
function DeleteConfirmModal({ peripheral, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            Delete Peripheral
          </h2>
        </div>
        <div className="p-6">
          <p>
            Delete{" "}
            <span className="font-semibold">{peripheral?.item_name}</span>?
          </p>
          <p className="text-red-500 text-xs mt-4">Cannot be undone.</p>
        </div>
        <div className="px-6 py-5 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-xl">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Peripherals({ userRole }) {
  const [peripherals, setPeripherals] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [peripheralsRes, labsRes, categoriesRes, equipmentRes] =
        await Promise.all([
          axiosInstance.get("/peripherals"),
          axiosInstance.get("/laboratories"),
          axiosInstance.get("/categories"),
          axiosInstance.get("/equipment-list"),
        ]);
      setPeripherals(peripheralsRes.data || []);
      setLaboratories(labsRes.data || []);
      setCategories(categoriesRes.data || []);
      setEquipmentList(equipmentRes.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = peripherals.filter((item) => {
    const matchSearch =
      item.item_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.brand?.toLowerCase().includes(search.toLowerCase());
    let matchStatus = true;
    if (filterStatus === "working") matchStatus = item.working_count > 0;
    else if (filterStatus === "damaged") matchStatus = item.damaged_count > 0;
    return matchSearch && matchStatus;
  });

  const totalWorking = peripherals.reduce(
    (sum, p) => sum + (p.working_count || 0),
    0,
  );
  const totalDamaged = peripherals.reduce(
    (sum, p) => sum + (p.damaged_count || 0),
    0,
  );
  const totalPeripherals = totalWorking + totalDamaged;

  const handleDelete = async () => {
    if (deleteItem) {
      try {
        await axiosInstance.delete(
          `/remove/peripherals/${deleteItem.peripheral_id}`,
        );
        toast.success("Deleted");
        fetchData();
        setIsDeleteModalOpen(false);
        setDeleteItem(null);
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER - KEEP YOUR EXACT UI */}
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
              onClick={() => {
                setEditItem(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Plus size={16} /> Add Peripheral
            </button>
          )}
        </div>
      </div>

      {/* SUMMARY CARDS - KEEP YOUR EXACT UI */}
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

      {/* TABLE - KEEP YOUR EXACT UI */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Item
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Brand
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Location
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
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-slate-400 text-sm"
                  >
                    No peripherals found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.peripheral_id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getPeripheralIcon(item.category_name)}
                        </div>
                        <span className="font-medium text-slate-800">
                          {item.item_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.brand || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.category_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.equipment_asset_tag || item.lab_name || "Lab Stock"}
                    </td>
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
                      {(item.working_count || 0) + (item.damaged_count || 0)}
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setViewItem(item);
                              setIsViewModalOpen(true);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditItem(item);
                              setIsFormOpen(true);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteItem(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {isFormOpen && (
        <PeripheralModal
          peripheral={editItem}
          laboratories={laboratories}
          categories={categories}
          equipmentList={equipmentList}
          onClose={() => {
            setIsFormOpen(false);
            setEditItem(null);
          }}
          onSave={fetchData}
        />
      )}
      {isViewModalOpen && viewItem && (
        <ViewPeripheralModal
          peripheral={viewItem}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewItem(null);
          }}
        />
      )}
      {isDeleteModalOpen && deleteItem && (
        <DeleteConfirmModal
          peripheral={deleteItem}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteItem(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
