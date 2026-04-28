import React, { useState } from 'react';
import { UserPlus, Shield, User, X, Mail, Key } from 'lucide-react';

const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'Raylle', role: 'Admin', email: 'admin@jrmsu.edu.ph', idNum: 'CCS-001' },
    { id: 2, name: 'Danoy', role: 'Instructor', email: 'danoy@jrmsu.edu.ph', idNum: 'CCS-042' },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', idNum: '', role: 'Instructor' });

  const handleRegister = () => {
    if (newUser.name && newUser.idNum) {
      setUsers([...users, { ...newUser, id: Date.now() }]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">User Management</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Authorized CCS Staff Only</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
        >
          <UserPlus size={18} /> Register New User
        </button>
      </div>

      {/* Register User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden scale-100 animate-in zoom-in-95">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-tighter text-xl">New System User</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-600 transition-all" onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">ID Number</label>
                <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-600 transition-all" onChange={(e) => setNewUser({...newUser, idNum: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Role Assignment</label>
                <select className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:border-indigo-600 transition-all" onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option>Instructor</option><option>Admin</option>
                </select>
              </div>
              <button onClick={handleRegister} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm mt-4 hover:bg-indigo-700 transition-all">Create Account</button>
            </div>
          </div>
        </div>
      )}

      {/* User Cards */}
      <div className="grid gap-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center justify-between hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${u.role === 'Admin' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                {u.role === 'Admin' ? <Shield size={24} /> : <User size={24} />}
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg leading-tight">{u.name}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter flex items-center gap-1"><Key size={10}/>{u.idNum}</span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Mail size={10}/>{u.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;