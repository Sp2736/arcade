"use client";

import React, { useState, useMemo } from "react";
import { Check, X, Eye, Filter, RefreshCw, Download, FileText, Award } from "lucide-react";

interface FacultyVerificationProps {
  isDark: boolean;
}

const ALL_SUBJECTS = [
    "Calculus", "Basic Electronics", "Physics", "Intro to Programming",
    "Vector Calculus", "Digital Logic", "Environmental Science", "OOP",
    "Data Structures", "DBMS", "Discrete Math", "Digital Electronics",
    "Operating Systems", "Computer Networks", "Computer Organization", "Python Programming",
    "Algorithms (DAA)", "Web Technologies", "Software Engineering", "Microprocessors",
    "Artificial Intelligence", "Compiler Design", "Mobile App Dev", "Cloud Computing",
    "Information Security", "Big Data Analytics", "Machine Learning", "IoT",
    "Project Phase II", "DevOps", "BlockChain Technology"
];

const SEMESTERS = [
    "Semester 1", "Semester 2", "Semester 3", "Semester 4", 
    "Semester 5", "Semester 6", "Semester 7", "Semester 8"
];

// Mock Data
const PENDING_ITEMS = [
  { id: 101, student: "Swayam Patel", id_no: "24DCS088", title: "OS: Process Scheduling", subject: "Operating Systems", semester: "Semester 4", date: "Oct 24, 2025" },
  { id: 102, student: "Rohan Das", id_no: "24DCS092", title: "AWS Cloud Practitioner", subject: "Cloud Computing", semester: "Semester 6", date: "Oct 23, 2025" },
];

export default function FacultyVerification({ isDark }: FacultyVerificationProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const filteredItems = useMemo(() => {
    return PENDING_ITEMS.filter(item => {
        const matchesSem = selectedSemester === "All Semesters" || item.semester === selectedSemester;
        const matchesSub = selectedSubject === "All Subjects" || item.subject === selectedSubject;
        return matchesSem && matchesSub;
    });
  }, [selectedSemester, selectedSubject]);

  const cardClass = `border rounded-md overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const tableHeadClass = `text-left text-xs font-bold uppercase tracking-wider p-4 border-b ${isDark ? "bg-slate-950 text-slate-400 border-slate-800" : "bg-slate-50 text-slate-500 border-slate-200"}`;
  const tableCellClass = `p-4 text-sm border-b align-middle ${isDark ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-700"}`;
  
  const selectClass = `h-9 px-3 rounded-md border text-xs font-medium outline-none cursor-pointer transition-colors ${
    isDark ? "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600" : "bg-white border-slate-300 text-slate-700 hover:border-slate-400"
  }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Verification Console</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Review and approve student submissions.</p>
        </div>
        <div className={`flex p-1 rounded-md border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <button onClick={() => setActiveTab("pending")} className={`px-4 py-1.5 text-xs font-bold rounded-[4px] transition-all ${activeTab === "pending" ? (isDark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900") : "text-slate-500"}`}>Pending ({filteredItems.length})</button>
            <button onClick={() => setActiveTab("history")} className={`px-4 py-1.5 text-xs font-bold rounded-[4px] transition-all ${activeTab === "history" ? (isDark ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900") : "text-slate-500"}`}>History</button>
        </div>
      </div>

      <div className={`p-3 rounded-md border flex flex-wrap gap-3 items-center ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
            <Filter size={14} /> Filters:
        </div>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className={selectClass}>
            <option>All Semesters</option>
            {SEMESTERS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
        </select>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={selectClass}>
            <option>All Subjects</option>
            {ALL_SUBJECTS.sort().map(sub => (<option key={sub} value={sub}>{sub}</option>))}
        </select>
        {(selectedSemester !== "All Semesters" || selectedSubject !== "All Subjects") && (
            <button onClick={() => { setSelectedSemester("All Semesters"); setSelectedSubject("All Subjects"); }} className="ml-auto text-xs text-blue-500 hover:underline flex items-center gap-1">
                <RefreshCw size={12} /> Reset
            </button>
        )}
      </div>

      <div className={cardClass}>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
                <thead>
                    <tr>
                        <th className={`${tableHeadClass} w-16 text-center`}>#</th>
                        <th className={tableHeadClass}>Student Profile</th>
                        <th className={tableHeadClass}>Submission Details</th>
                        <th className={tableHeadClass}>Date</th>
                        <th className={tableHeadClass}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <tr key={item.id} className={`group transition-colors ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                                <td className={`${tableCellClass} text-center`}>
                                    <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-md font-bold text-xs shadow-sm border ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                </td>
                                <td className={tableCellClass}>
                                    <div>
                                        <div className={`font-bold text-sm ${isDark ? "text-slate-200" : "text-slate-900"}`}>{item.student}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-0.5">{item.id_no}</div>
                                    </div>
                                </td>
                                <td className={tableCellClass}>
                                    <div>
                                        <div className={`font-medium text-sm ${isDark ? "text-blue-400" : "text-blue-700"}`}>{item.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>{item.semester}</span>
                                            <span className="text-xs text-slate-500">•</span>
                                            <span className="text-xs text-slate-500">{item.subject}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className={tableCellClass}><span className="text-xs font-medium text-slate-500">{item.date}</span></td>
                                <td className={tableCellClass}>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1.5 rounded hover:bg-emerald-100 text-emerald-600 border border-transparent hover:border-emerald-200 transition-all"><Check size={16} /></button>
                                        <button className="p-1.5 rounded hover:bg-red-100 text-red-600 border border-transparent hover:border-red-200 transition-all"><X size={16} /></button>
                                        <button className={`p-1.5 rounded ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}><Eye size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            {/* FIX: colSpan 5 ensures it stretches across the whole table */}
                            <td colSpan={5} className={`p-16 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                <div className="flex flex-col items-center justify-center">
                                    <Filter size={40} className="mb-4 opacity-20" />
                                    <span className="text-sm font-medium">No items found matching the selected filters.</span>
                                    <button onClick={() => { setSelectedSemester("All Semesters"); setSelectedSubject("All Subjects"); }} className="mt-2 text-xs text-blue-500 hover:underline">Clear Filters</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}