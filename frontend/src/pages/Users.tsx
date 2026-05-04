import React, { useState } from "react";
import {
  UserPlus,
  User,
  Users as UsersIcon,
  Shield,
  Loader2,
} from "lucide-react";
import { AddModal } from "../components/reusableModal";
import { useQueryClient } from "@tanstack/react-query";
import { UserFields } from "../lib/validations/users";
import { useTableData } from "../lib/hooks/useTableData";
import { UserManager } from "./users/management";

type UserRole = "instructor" | "admin";

const Users: React.FC = () => {
  const [showModal, setModal] = useState(false);
  const queryClient = useQueryClient();

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

  const { data: users, isLoading, isError } = useTableData("users");

  return (
    // Main container: added relative to avoid z-index issues, and padding adjustments
    <div className="relative p-6 md:p-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            User Management
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic mt-1">
            Manage System Access & Permissions
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={16} /> Add User
        </button>
      </div>

      {/* Users Table Container – softer corners → rounded-2xl, no sharp edges */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Registered Accounts ({users?.length || 0})
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
              {users &&
                users.map((u: any) => (
                  <UserManager key={u.id} user={u} getRoleBadge={getRoleBadge} />
                ))}
              {users?.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 text-xs"
                  >
                    No users yet. Click "Add User" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal – ensure it's rendered with high z-index, no overlap issues */}
      {showModal && (
        <AddModal
          fields={UserFields}
          table="users"
          onClose={() => setModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Users; 