import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  RefreshCw,
  Layers,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useRefresh } from "../contexts/RefreshContext";

// Add Category Modal
function AddCategoryModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({ category_name: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/create/categories", {
        data: { category_name: formData.category_name.trim() }
      });
      toast.success("Category added successfully");
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Category</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.category_name}
              onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
              placeholder="e.g., Computing Devices, Input Devices, Display"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
              autoFocus
            />
            <p className="text-xs text-slate-400 mt-1">
              Categories help organize equipment and peripherals
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Category Modal
function EditCategoryModal({ category, onClose, onSave }) {
  const [formData, setFormData] = useState({ category_name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({ category_name: category.category_name || "" });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.put(`/update/categories/${category.category_id}`, {
        data: { category_name: formData.category_name.trim() }
      });
      toast.success("Category updated successfully");
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit Category</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X size={18} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.category_name}
              onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteCategoryModal({ category, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Delete Category</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to delete category{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{category?.category_name}</span>?
          </p>
          <p className="text-xs text-red-500 mt-4">
            Warning: Equipment and peripherals using this category will lose their category assignment.
          </p>
        </div>
        <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Delete Category</button>
        </div>
      </div>
    </div>
  );
}

// Main Categories Page
export default function Categories({ userRole, onRefresh }) {
  const { triggerRefresh } = useRefresh();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/categories");
      setCategories(response.data || []);
      triggerRefresh();
      onRefresh();
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Categories</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage equipment and peripheral categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white w-56 transition"
            />
          </div>
          <button onClick={fetchCategories} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition transform hover:scale-105" title="Refresh">
            <RefreshCw size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
          {userRole === "admin" && (
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition transform hover:scale-105">
              <Plus size={16} /> Add Category
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Total Categories</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{categories.length}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">For equipment & peripherals</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Equipment Categories</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{categories.length}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Active classifications</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Layers size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Used In</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Equipment & Peripherals</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Asset classification</p>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Category Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Used For</th>
                {userRole === "admin" && <th className="px-6 py-4"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={userRole === "admin" ? 3 : 2} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    {search ? "No matching categories found." : "No categories available. Click 'Add Category' to create one."}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.category_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {category.category_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                          <Layers size={15} className="text-indigo-500" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{category.category_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      Equipment & Peripherals
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditCategory(category)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit Category"
                          >
                            <Edit size={16} className="text-slate-500 dark:text-slate-400" />
                          </button>
                          <button
                            onClick={() => setDeleteCategory(category)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                            title="Delete Category"
                          >
                            <Trash2 size={16} className="text-red-500" />
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

   

      {/* Modals */}
      {isAddModalOpen && (
        <AddCategoryModal onClose={() => setIsAddModalOpen(false)} onSave={fetchCategories} />
      )}
      {editCategory && (
        <EditCategoryModal category={editCategory} onClose={() => setEditCategory(null)} onSave={fetchCategories} />
      )}
      {deleteCategory && (
        <DeleteCategoryModal category={deleteCategory} onClose={() => setDeleteCategory(null)} onConfirm={async () => {
          try {
            await axiosInstance.delete(`/remove/categories/${deleteCategory.category_id}`);
            toast.success("Category deleted successfully");
            fetchCategories();
            setDeleteCategory(null);
          } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete category");
          }
        }} />
      )}
    </div>
  );
}