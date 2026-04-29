import React, { useState } from 'react';
import { UserPlus, Shield, Mail, CreditCard, User, Lock, X, CheckCircle } from 'lucide-react';

interface UserForm {
  id_number: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'instructor';
  password_hash: string; // Plain text here, hash on the backend
}

const Users: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<UserForm>({
    id_number: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'instructor',
    password_hash: ''
  });

  // Validation Logic based on your specific requirements
  const idRegex = /^(24|25)-A-\d{5}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation Check
    if (!idRegex.test(formData.id_number)) {
      alert("Invalid ID Format. Please use the JRMSU standard (e.g., 24-A-12345).");
      return;
    }

    try {
      // 2. Database Connection (POST to your API)
      const response = await fetch('/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User added successfully to CLAMS database!");
        setShowModal(false);
        // Reset form
        setFormData({ id_number: '', username: '', first_name: '', last_name: '', email: '', role: 'instructor', password_hash: '' });
      }
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">User Management</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Manage System Access & Permissions</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <UserPlus size={16} /> Add New Faculty
        </button>
      </div>

      {/* --- ADD USER MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Registration Form</h3>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20}/></button>
            </div>

            <div className="p-10 grid grid-cols-2 gap-6">
              {/* ID Number Input */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Number (JRMSU Format)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    placeholder="24-A-12345"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.id_number}
                    onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                  />
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Login Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    placeholder="raylle_admin"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              {/* Names */}
              <input required placeholder="First Name" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
              <input required placeholder="Last Name" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />

              {/* Role Selection */}
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Permission</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'instructor'})}
                    className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${formData.role === 'instructor' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    <User size={18}/> <span className="font-black text-[10px] uppercase">Instructor</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, role: 'admin'})}
                    className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${formData.role === 'admin' ? 'bg-rose-50 border-rose-500 text-rose-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    <Shield size={18}/> <span className="font-black text-[10px] uppercase">ADMIN</span>
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporary Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.password_hash}
                    onChange={(e) => setFormData({...formData, password_hash: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex gap-4">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all">Finalize & Store</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;