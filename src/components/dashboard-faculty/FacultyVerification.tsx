"use client";

import React, { useState } from "react";
import { Check, X, FileText, Award, Eye, Filter, Download } from "lucide-react";

interface FacultyVerificationProps {
  isDark: boolean;
}

// Mock Data
const PENDING_ITEMS = [
  { id: 1, type: "Note", student: "Swayam Patel", id_no: "24DCS088", title: "OS: Process Scheduling", date: "Oct 24, 2025", status: "Pending" },
  { id: 2, type: "Cert", student: "Rohan Das", id_no: "24DCS092", title: "AWS Cloud Practitioner", date: "Oct 23, 2025", status: "Pending" },
  { id: 3, type: "Note", student: "Priya Shah", id_no: "24DCS015", title: "CN: TCP/IP Model", date: "Oct 22, 2025", status: "Pending" },
  { id: 4, type: "Note", student: "Amit Kumar", id_no: "24DCS045", title: "DBMS: Normalization", date: "Oct 22, 2025", status: "Pending" },
  { id: 5, type: "Cert", student: "Neha Gupta", id_no: "24DCS102", title: "Oracle Java SE 8", date: "Oct 21, 2025", status: "Pending" },
];

export default function FacultyVerification({ isDark }: FacultyVerificationProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  // Theme Constants
  const cardClass = `border rounded-md overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const tableHeadClass = `text-left text-xs font-bold uppercase tracking-wider p-4 border-b ${isDark ? "bg-slate-950 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"}`;
  const tableCellClass = `p-4 text-sm border-b ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-700"}`;
  const btnClass = `flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors border`;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Verification Console</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Review and approve student submissions.</p>
        </div>
        
        <div className={`flex p-1 rounded-md border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <button 
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-1.5 text-xs font-bold rounded-[4px] transition-all ${activeTab === "pending" ? (isDark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900") : "text-slate-500"}`}
            >
                Pending Review (5)
            </button>
            <button 
                onClick={() => setActiveTab("history")}
                className={`px-4 py-1.5 text-xs font-bold rounded-[4px] transition-all ${activeTab === "history" ? (isDark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900") : "text-slate-500"}`}
            >
                History
            </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className={`p-3 rounded-md border flex gap-3 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <button className={btnClass + ` ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-300 hover:bg-slate-50"}`}>
            <Filter size={14} /> Filter
        </button>
        <div className={`h-8 w-px ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
        <select className={`bg-transparent text-sm outline-none ${isDark ? "text-slate-300" : "text-slate-700"}`}>
            <option>All Types</option>
            <option>Notes</option>
            <option>Certificates</option>
        </select>
      </div>

      {/* Data Table */}
      <div className={cardClass}>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr>
                        <th className={tableHeadClass}>Request Type</th>
                        <th className={tableHeadClass}>Student Details</th>
                        <th className={tableHeadClass}>Content Title</th>
                        <th className={tableHeadClass}>Submission Date</th>
                        <th className={tableHeadClass}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {PENDING_ITEMS.map((item) => (
                        <tr key={item.id} className={`group transition-colors ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                            
                            {/* Type */}
                            <td className={tableCellClass}>
                                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    item.type === "Note" 
                                        ? (isDark ? "bg-blue-900/20 text-blue-400 border-blue-900/50" : "bg-blue-50 text-blue-700 border-blue-100")
                                        : (isDark ? "bg-amber-900/20 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-700 border-amber-100")
                                }`}>
                                    {item.type === "Note" ? <FileText size={12} /> : <Award size={12} />}
                                    {item.type}
                                </div>
                            </td>

                            {/* Student */}
                            <td className={tableCellClass}>
                                <div>
                                    <div className={`font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{item.student}</div>
                                    <div className="text-xs text-slate-500 font-mono">{item.id_no}</div>
                                </div>
                            </td>

                            {/* Title */}
                            <td className={tableCellClass}>
                                <span className={`font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>{item.title}</span>
                            </td>

                            {/* Date */}
                            <td className={tableCellClass}>
                                <span className="text-slate-500">{item.date}</span>
                            </td>

                            {/* Actions */}
                            <td className={tableCellClass}>
                                <div className="flex items-center gap-2">
                                    <button className={`p-1.5 rounded hover:bg-emerald-100 text-emerald-600 border border-transparent hover:border-emerald-200 transition-all`} title="Approve">
                                        <Check size={16} strokeWidth={3} />
                                    </button>
                                    <button className={`p-1.5 rounded hover:bg-red-100 text-red-600 border border-transparent hover:border-red-200 transition-all`} title="Reject">
                                        <X size={16} strokeWidth={3} />
                                    </button>
                                    <div className={`h-4 w-px mx-1 ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />
                                    <button className={`p-1.5 rounded ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`} title="View">
                                        <Eye size={16} />
                                    </button>
                                    <button className={`p-1.5 rounded ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`} title="Download">
                                        <Download size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Footer Pagination */}
        <div className={`px-4 py-3 border-t flex justify-between items-center text-xs ${isDark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-500"}`}>
            <span>Showing 1-5 of 12</span>
            <div className="flex gap-2">
                <button className="hover:underline">Previous</button>
                <button className="hover:underline">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}