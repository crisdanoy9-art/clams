import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  User,
  Lock,
  X,
  Trash2,
  GraduationCap,
  Users as UsersIcon,
  Shield,
  CreditCard,
  Loader2,
} from "lucide-react";

type UserRole = "instructor" | "admin";

interface UserForm {
  id_number: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  password_hash: string;
}

interface User extends UserForm {
  id: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Start with an empty array – no example users
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState<UserForm>({
    id_number: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "instructor",
    password_hash: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const getIdRegex = (role: UserRole) => {
    return role === "instructor" ? /^ins-main-\d{3}$/ : /^adm-main-\d{3}$/;
  };

  const getIdPlaceholder = (role: UserRole) => {
    return role === "instructor" ? "ins-main-001" : "adm-main-001";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idRegex = getIdRegex(formData.role);
    if (!idRegex.test(formData.id_number)) {
      alert(
        `Invalid ID format for ${formData.role}. Expected: ${
          formData.role === "instructor" ? "ins-main-XXX" : "adm-main-XXX"
        } (XXX = 3 digits)`
      );
      return;
    }

    if (formData.password_hash !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setUsers([newUser, ...users]);
      alert("User added successfully!");
      setShowModal(false);
      setFormData({
        id_number: "",
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "instructor",
        password_hash: "",
      });
      setConfirmPassword("");
    } catch (error) {
      console.error("Database connection failed:", error);
      alert("Failed to add user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-wider">
            <Shield size={10} /> Admin
          </span>
        );
      case "instructor":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-wider">
            <User size={10} /> Instructor
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Full-screen loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <Loader2 size={40} className="animate-spin text-indigo-600" />
            <p className="text-sm font-black text-slate-700 uppercase tracking-wider">
              Registering user...
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            User Management
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
            Manage System Access & Permissions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={16} /> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Registered Accounts ({users.length})
          </h3>
          <UsersIcon size={14} className="text-slate-300" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">ID Number</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-600">
                    {user.id_number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-all rounded-md hover:bg-rose-50"
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                   </td>
                 </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No users yet. Click "Add User" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL (unchanged) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isLoading && setShowModal(false)}
          ></div>
          <form
            onSubmit={handleSubmit}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          >
            <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tighter">
                Register New User
              </h3>
              <button
                type="button"
                onClick={() => !isLoading && setShowModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-all"
                disabled={isLoading}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  Account Role
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "instructor", id_number: "" })}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                      formData.role === "instructor"
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                        : "bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200"
                    }`}
                    disabled={isLoading}
                  >
                    Instructor
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "admin", id_number: "" })}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                      formData.role === "admin"
                        ? "bg-rose-100 text-rose-700 border border-rose-300"
                        : "bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200"
                    }`}
                    disabled={isLoading}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* ID Number */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  ID Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    required
                    placeholder={getIdPlaceholder(formData.role)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.id_number}
                    onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                    First Name
                  </label>
                  <input
                    required
                    placeholder="First"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                    Last Name
                  </label>
                  <input
                    required
                    placeholder="Last"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    required
                    placeholder="username"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    required
                    type="email"
                    placeholder="user@jrmsu.edu"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.password_hash}
                    onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex gap-2">
              <button
                type="button"
                onClick={() => !isLoading && setShowModal(false)}
                className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg font-black text-[9px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-1.5 bg-slate-900 text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;