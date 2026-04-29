"use client";

import React, { useState, useEffect } from "react";
import { Users, Activity, ShieldAlert, CheckCircle, Search, Trash2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function AdminDashboard({ isDark, user }: { isDark: boolean, user: any }) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSystemUsers();
  }, []);

  const fetchSystemUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    if (!error && data) setUsersList(data);
  };

  const toggleVerification = async (userId: number, currentStatus: boolean) => {
    const { error } = await supabase.from('users').update({ is_verified: !currentStatus }).eq('user_id', userId);
    if (!error) {
        setUsersList(usersList.map(u => u.user_id === userId ? { ...u, is_verified: !currentStatus } : u));
    }
  };

  const bgCard = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";
  const textMain = isDark ? "text-white" : "text-slate-900";

  const filteredUsers = usersList.filter(u => 
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.college_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${bgCard}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase">Total Users</p>
                    <h2 className={`text-4xl font-black mt-2 ${textMain}`}>{usersList.length}</h2>
                </div>
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users size={24} /></div>
            </div>
        </div>
        <div className={`p-6 rounded-2xl border ${bgCard}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase">Pending Verification</p>
                    <h2 className={`text-4xl font-black mt-2 ${textMain}`}>{usersList.filter(u => !u.is_verified).length}</h2>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><ShieldAlert size={24} /></div>
            </div>
        </div>
        <div className={`p-6 rounded-2xl border ${bgCard}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-bold text-slate-500 uppercase">System Status</p>
                    <h2 className="text-xl font-black mt-4 text-emerald-500 flex items-center gap-2"><Activity size={20}/> Optimal</h2>
                </div>
            </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className={`rounded-2xl border overflow-hidden ${bgCard}`}>
        <div className="p-5 border-b dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className={`text-lg font-bold ${textMain}`}>Access Control Directory</h3>
            <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search ID or Name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none ${isDark ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className={`text-xs uppercase font-bold text-slate-500 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">College ID</th>
                        <th className="px-6 py-4">Role / Dept</th>
                        <th className="px-6 py-4">Verification</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                    {filteredUsers.map((u) => (
                        <tr key={u.user_id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
                            <td className="px-6 py-4">
                                <div className={`font-bold ${textMain}`}>{u.full_name}</div>
                                <div className="text-xs text-slate-500">{u.college_email}</div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{u.college_id}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'faculty' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                    {u.role}
                                </span>
                                <div className="text-xs text-slate-500 mt-1">{u.department}</div>
                            </td>
                            <td className="px-6 py-4">
                                <button 
                                    onClick={() => toggleVerification(u.user_id, u.is_verified)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${u.is_verified ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}
                                >
                                    {u.is_verified ? <><CheckCircle size={14}/> Verified</> : "Unverified"}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors" title="Revoke Access">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}