import React from 'react';
import { UserPlus, Shield, MoreVertical } from 'lucide-react';

const Users: React.FC = () => {
  const userList = [
    { name: 'Raylle', role: 'Super Admin', email: 'raylle@jrmsu.edu.ph', status: 'Active' },
    { name: 'Staff Neil', role: 'Lab Technician', email: 'neil@jrmsu.edu.ph', status: 'Active' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-xs text-slate-500 mt-1">CLAMS / Admin / Team</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800">
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userList.map((user, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                {user.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{user.name}</h4>
                <p className="text-xs text-slate-500 mb-2">{user.email}</p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md w-fit">
                  <Shield size={12} className="text-slate-600" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{user.role}</span>
                </div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;