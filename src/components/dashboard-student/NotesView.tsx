"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  UploadCloud,
  Eye,
  Download,
  CheckCircle,
  ShieldCheck,
  User,
  Filter,
  BookOpen,
  Link as LinkIcon,
  AlertCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface NotesViewProps {
  isDark: boolean;
  user: any;
}

const SEMESTERS_LIST = [
  "All Semesters",
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export default function NotesView({ isDark, user }: NotesViewProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "uploads">("browse");

  const [allResources, setAllResources] = useState<any[]>([]);
  const [myUploads, setMyUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");

  const [dynamicSubjects, setDynamicSubjects] = useState<string[]>(["All Subjects"]);

  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    subject_name: "Select Subject",
    semester: "Semester 4",
    file_path: "",
  });

  const getAuthToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const fetchNotes = async () => {
    // 1. Check if user is fully loaded
    if (!user || !user.user_id) return;

    setLoading(true);
    try {
      // 2. Safely grab session directly instead of via wrapper function
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.warn("Session not ready yet, pausing fetch...");
        setLoading(false);
        return; // Abort cleanly, it will retry
      }

      const dept = user.department || "Computer Engineering";

      const res = await fetch(
        `/api/notes?user_id=${user.user_id}&department=${encodeURIComponent(dept)}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch notes");
      }

      const data = await res.json();
      setAllResources(data.vaultData || []);
      setMyUploads(data.myUploadsData || []);
    } catch (error: any) {
      console.error("Error fetching notes:", error.message);
      setAllResources([]);
      setMyUploads([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    if (!user || !user.department) return;
    try {
      const res = await fetch(`/api/subjects?department=${encodeURIComponent(user.department)}`);
      if (res.ok) {
        const data = await res.json();
        // Extract names, remove duplicates, and sort
        const subjectNames = data.subjects.map((s: any) => s.subject_name);
        const uniqueSubjects = Array.from(new Set(subjectNames)).sort() as string[];
        
        setDynamicSubjects(["All Subjects", ...uniqueSubjects]);

        // Auto-select the first valid subject for the upload form to prevent empty submissions
        if (uniqueSubjects.length > 0) {
          setUploadData((prev) => ({ ...prev, subject_name: uniqueSubjects[0] }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch dynamic subjects:", error);
    }
  };

  useEffect(() => {
    // Add a slight 500ms delay to give Supabase time to mount the auth token
    const timer = setTimeout(() => {
      fetchNotes();
      fetchSubjects();
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const token = await getAuthToken();
      const payload = {
        ...uploadData,
        user_id: user.user_id,
        role: user.role,
      };

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Reset form and refresh list
      setUploadData({
        title: "",
        description: "",
        subject_name: dynamicSubjects.length > 1 ? dynamicSubjects[1] : "", // Reset to first valid subject
        semester: "Semester 4",
        file_path: "",
      });
      setActiveTab("uploads"); // Switch to uploads tab to show the pending note
      fetchNotes();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResources = allResources.filter(res => {
      // 1. Ensure the resource exists
      if (!res || !res.title) return false;

      // 2. Search query filter
      const matchesSearch = 
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (res.subjects?.subject_name && res.subjects.subject_name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // 3. Semester filter
      const matchesSem = selectedSemester === "All Semesters" || res.semester === selectedSemester;
      
      // 4. Subject filter
      const subjName = res.subjects?.subject_name || "General";
      const matchesSubj = selectedSubject === "All Subjects" || subjName === selectedSubject;
      
      return matchesSearch && matchesSem && matchesSubj;
  });

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div
        className={`p-4 md:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isDark ? "border-zinc-800 bg-[#0a0a0a]" : "border-zinc-200 bg-white"} rounded-t-2xl`}
      >
        <div>
          <h2 className="text-xl font-bold mb-1">Resource Vault</h2>
          <p
            className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
          >
            Access verified study materials or contribute your own.
          </p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl self-start md:self-auto border dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "browse" ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            Browse Vault
          </button>
          <button
            onClick={() => setActiveTab("uploads")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "uploads" ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
          >
            My Uploads
          </button>
        </div>
      </div>

      <div
        className={`flex-1 p-4 md:p-6 overflow-y-auto ${isDark ? "bg-[#050505]" : "bg-slate-50"} rounded-b-2xl border border-t-0 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Loading secure vault...</p>
          </div>
        ) : activeTab === "browse" ? (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search notes, topics, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${isDark ? "bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white placeholder-zinc-500" : "bg-white border-zinc-200 focus:border-blue-400 text-zinc-900"}`}
                />
              </div>
              <div className="flex gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}
                >
                  <Filter size={16} className="text-zinc-400" />
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className={`bg-transparent outline-none text-sm font-medium ${isDark ? "text-white" : "text-zinc-800"}`}
                  >
                    {SEMESTERS_LIST.map((sem) => (
                      <option
                        key={sem}
                        value={sem}
                        className={isDark ? "bg-zinc-900" : ""}
                      >
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}
                >
                  <BookOpen size={16} className="text-zinc-400" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className={`bg-transparent outline-none text-sm font-medium ${isDark ? "text-white" : "text-zinc-800"}`}
                  >
                    {dynamicSubjects.map((sub) => (
                      <option
                        key={sub}
                        value={sub}
                        className={isDark ? "bg-zinc-900" : ""}
                      >
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredResources.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                <p>No materials found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredResources.map((data, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-xl ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/30 hover:shadow-blue-900/10" : "bg-white border-zinc-200 hover:border-blue-300 hover:shadow-blue-100/50"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}
                      >
                        {data.subjects?.subject_name || "General"}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-1 rounded-md ${isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}
                      >
                        {data.semester}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 leading-tight line-clamp-2">
                      {data.title}
                    </h3>
                    <p
                      className={`text-sm mb-4 line-clamp-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                    >
                      {data.description || "No description provided."}
                    </p>

                    <div
                      className={`flex items-center justify-between py-3 border-t border-b mb-4 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          Uploaded By
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <User size={12} className="text-blue-500" />
                          {data.uploader?.full_name || "Student"}
                        </div>
                      </div>
                      <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800"></div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          Verified By
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <ShieldCheck size={12} className="text-emerald-500" />
                          {data.verifier?.full_name || "Faculty"}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => window.open(data.file_path, "_blank")}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors bg-blue-600 hover:bg-blue-500 text-white`}
                    >
                      <LinkIcon size={16} /> Open Drive Link
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div
                className={`p-5 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}
              >
                <h3 className="font-bold text-lg mb-1">Contribute</h3>
                <p
                  className={`text-xs mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  Upload your well-structured notes via a Google Drive link. All
                  materials require faculty verification.
                </p>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleUploadSubmit}>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                    >
                      Note Title
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadData.title}
                      onChange={(e) =>
                        setUploadData({ ...uploadData, title: e.target.value })
                      }
                      placeholder="e.g., Chapter 3: Scheduling"
                      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${isDark ? "bg-zinc-950 border-zinc-800 focus:border-blue-500 text-white" : "bg-slate-50 border-zinc-200 focus:border-blue-400"}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={uploadData.description}
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Briefly describe what this covers..."
                      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors resize-none ${isDark ? "bg-zinc-950 border-zinc-800 focus:border-blue-500 text-white" : "bg-slate-50 border-zinc-200 focus:border-blue-400"}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        className={`block text-xs font-bold mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                      >
                        Subject
                      </label>
                      <select
                        value={uploadData.subject_name}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            subject_name: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-slate-50 border-zinc-200 text-zinc-900"}`}
                      >
                        {dynamicSubjects.filter((s) => s !== "All Subjects").map(
                          (sub) => (
                            <option key={sub}>{sub}</option>
                          ),
                        )}
                      </select>
                    </div>
                    <div>
                      <label
                        className={`block text-xs font-bold mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                      >
                        Semester
                      </label>
                      <select
                        value={uploadData.semester}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            semester: e.target.value,
                          })
                        }
                        className={`w-full px-3 py-2 text-sm rounded-lg border outline-none ${isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-slate-50 border-zinc-200 text-zinc-900"}`}
                      >
                        {SEMESTERS_LIST.filter(
                          (s) => s !== "All Semesters",
                        ).map((sem) => (
                          <option key={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      className={`block text-xs font-bold mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}
                    >
                      Google Drive URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={uploadData.file_path}
                      onChange={(e) =>
                        setUploadData({
                          ...uploadData,
                          file_path: e.target.value,
                        })
                      }
                      placeholder="https://drive.google.com/file/d/..."
                      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition-colors ${isDark ? "bg-zinc-950 border-zinc-800 focus:border-blue-500 text-white" : "bg-slate-50 border-zinc-200 focus:border-blue-400"}`}
                    />
                    <p
                      className={`text-[10px] mt-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      Make sure access is set to "Anyone with the link can
                      view".
                    </p>
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className={`w-full py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 shadow-md"} text-white`}
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <UploadCloud size={16} />
                    )}
                    {isSubmitting ? "Uploading..." : "Submit for Review"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-lg mb-4">My Upload History</h3>
              {myUploads.length === 0 ? (
                <div
                  className={`p-8 rounded-2xl border text-center ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-400"}`}
                >
                  <UploadCloud size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    You haven't uploaded any materials yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myUploads.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}
                          >
                            {item.subjects?.subject_name || "General"}
                          </span>
                          <span
                            className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                          >
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm truncate">
                          {item.title}
                        </h4>
                        {item.status === "rejected" &&
                          item.rejection_reason && (
                            <p className="text-xs text-red-500 mt-1">
                              Reason: {item.rejection_reason}
                            </p>
                          )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border
                                            ${
                                              item.status === "approved"
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : item.status === "pending"
                                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                  : "bg-red-500/10 text-red-500 border-red-500/20"
                                            }
                                        `}
                        >
                          {item.status === "approved" ? (
                            <CheckCircle size={14} />
                          ) : item.status === "pending" ? (
                            <Clock size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          <span className="capitalize">{item.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}