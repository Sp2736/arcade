import { Search, Bell, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/40 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search subjects, roadmaps, or faculty..." 
            className="w-full bg-slate-100/50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 hover:bg-white rounded-xl transition-colors relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2" />
        <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all">
          <UserCircle className="w-6 h-6 text-slate-400" />
          <span className="text-sm font-bold text-slate-700">Student Portal</span>
        </button>
      </div>
    </header>
  );
}