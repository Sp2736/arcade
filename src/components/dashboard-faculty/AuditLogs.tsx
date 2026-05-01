// src/components/dashboard-faculty/AuditLogs.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Activity, CheckCircle, XCircle, FileText, BookOpen, Loader2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

interface AuditLogsProps {
  isDark: boolean;
  user?: any;
}

export default function AuditLogs({ isDark, user }: AuditLogsProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.is_hod) {
          setLoading(false);
          return;
      }
      
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`/api/admin/audit`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  if (!user?.is_hod) {
      return (
          <div className="h-full flex flex-col items-center justify-center animate-fade-in text-center p-8">
              <ShieldAlert size={64} className="text-red-500/50 mb-4" />
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Access Denied</h2>
              <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                  The Audit Command Center is restricted to Heads of Department (HOD) only.
              </p>
          </div>
      );
  }

  const getActionStyles = (action: string) => {
      if (action.includes("APPROVED")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      if (action.includes("REJECTED")) return "bg-red-500/10 text-red-500 border-red-500/20";
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  };

  const getActionIcon = (action: string) => {
      if (action.includes("APPROVED")) return <CheckCircle size={14} />;
      if (action.includes("REJECTED")) return <XCircle size={14} />;
      if (action.includes("NOTE")) return <BookOpen size={14} />;
      if (action.includes("RESUME")) return <FileText size={14} />;
      return <Activity size={14} />;
  };

  const formatActionName = (action: string) => {
      return action.replace("_", " ");
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className={`p-5 md:p-8 border-b ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className="text-blue-500" size={28} />
                    <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
                </div>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    HOD Command Center. Monitor system verifications and moderation actions across your department.
                </p>
            </div>
        </div>
      </div>

      <div className={`p-4 md:p-8 flex-1 overflow-y-auto ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}>
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className={`border-b font-semibold ${isDark ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    <tr>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Faculty Member</th>
                        <th className="p-4">Action</th>
                        <th className="p-4 w-full">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="p-16 text-center text-slate-500">
                                <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                                Compiling audit trail...
                            </td>
                        </tr>
                    ) : logs.length > 0 ? (
                        logs.map((log) => (
                            <tr key={log.log_id} className={`transition-colors ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                                <td className="p-4 text-xs font-mono text-slate-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <p className="font-bold">{log.users?.full_name}</p>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{log.users?.department}</p>
                                </td>
                                <td className="p-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getActionStyles(log.action)}`}>
                                        {getActionIcon(log.action)} {formatActionName(log.action)}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium">{log.details?.title || 'Unknown Document'}</p>
                                    {log.details?.rejection_reason && (
                                        <p className="text-xs text-red-500 mt-1 truncate max-w-sm">
                                            Reason: {log.details.rejection_reason}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className={`p-16 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                <Activity size={40} className="mx-auto mb-4 opacity-20" />
                                <span className="text-sm font-medium">No actions logged in the system yet.</span>
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