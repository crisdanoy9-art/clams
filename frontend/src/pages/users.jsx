// frontend/src/pages/users.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  User,
  Shield,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
} from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ROLE_STYLES = {
  admin: "bg-purple-50 text-purple-700",
  instructor: "bg-blue-50 text-blue-700",
};
const ROLE_LABELS = { admin: "Administrator", instructor: "Instructor" };

// Add/Edit User Modal
function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id_number: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "instructor",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        id_number: user.id_number || "",
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "instructor",
        password: "",
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.id_number.trim())
      newErrors.id_number = "ID Number is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!user && !formData.password)
      newErrors.password = "Password is required for new users";
    if (formData.password && formData.password.length < 4)
      newErrors.password = "Password must be at least 4 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const submitData = {
        id_number: formData.id_number,
        username: formData.username,
        first_name: formData.first_name || null,
        last_name: formData.last_name || null,
        email: formData.email || null,
        role: formData.role,
      };

      if (formData.password) {
        submitData.password_hash = formData.password;
      }

      if (user) {
        await axiosInstance.put(`/update/users/${user.user_id}`, {
          data: submitData,
        });
        toast.success("User updated successfully");
      } else {
        await axiosInstance.post("/create/users", { data: submitData });
        toast.success("User created successfully");
      }
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {user ? "Edit User" : "Add User"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              ID Number *
            </label>
            <input
              type="text"
              value={formData.id_number}
              onChange={(e) =>
                setFormData({ ...formData, id_number: e.target.value })
              }
              className={`w-full px-3 py-2 text-sm bg-white border ${errors.id_number ? "border-red-500" : "border-slate-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900`}
            />
            {errors.id_number && (
              <p className="text-xs text-red-500 mt-1">{errors.id_number}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={`w-full px-3 py-2 text-sm bg-white border ${errors.username ? "border-red-500" : "border-slate-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900`}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
            >
              <option value="instructor">Instructor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              Password {!user && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={
                user ? "Leave empty to keep current password" : "Enter password"
              }
              className={`w-full px-3 py-2 text-sm bg-white border ${errors.password ? "border-red-500" : "border-slate-200"} rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
            {user && (
              <p className="text-xs text-slate-400 mt-1">
                Leave empty to keep existing password
              </p>
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
              {user ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Delete User</h2>
        </div>
        <div className="p-6">
          <p className="text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{user?.username}</span>?
          </p>
          <p className="text-xs text-red-500 mt-4">
            This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.first_name} ${u.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.id_number?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = async () => {
    if (deletingUser) {
      try {
        await axiosInstance.delete(`/remove/users/${deletingUser.user_id}`);
        toast.success("User deleted successfully");
        setDeletingUser(null);
        fetchUsers();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            {users.length} total users
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
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl w-64"
            />
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700"
          >
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">
                  ID Number
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">
                  Username
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400">
                  Created
                </th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedUsers.map((u) => (
                <tr key={u.user_id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">
                    {u.id_number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        {u.role === "admin" ? (
                          <Shield size={15} className="text-slate-500" />
                        ) : (
                          <User size={15} className="text-slate-500" />
                        )}
                      </div>
                      <span className="font-medium text-slate-800">
                        {u.first_name} {u.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{u.username}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_STYLES[u.role]}`}
                    >
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-slate-100"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingUser(u);
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={fetchUsers}
        />
      )}

      {deletingUser && (
        <DeleteConfirmModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
