import { 
  LayoutDashboard, BookOpen, Map, GraduationCap, 
  FileUser, Settings, ShieldCheck, LogOut 
} from 'lucide-react';

interface SidebarProps {
  role: number; // 0: Admin, 1: Student, 2: Faculty, 3: HOD
}

export default function Sidebar({ role }: SidebarProps) {
  // Mapping roles to specific navigation items
  const menuConfig = {
    0: [
      { name: 'Admin Panel', icon: ShieldCheck },
      { name: 'Manage Users', icon: Settings },
      { name: 'Verified Resumes', icon: FileUser },
    ],
    1: [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'My Notes', icon: BookOpen },
      { name: 'Roadmaps', icon: Map },
      { name: 'Skill Gap', icon: GraduationCap },
      { name: 'Resumes', icon: FileUser },
    ],
    // ... we can expand for Faculty/HOD later
  };

  const activeItems = menuConfig[role as keyof typeof menuConfig] || menuConfig[1];

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-64 bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">ARCADE</h1>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">University Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {activeItems.map((item) => (
            <li key={item.name}>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-2xl transition-all duration-300 group">
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">Swayam Patel</p>
            <p className="text-[10px] text-slate-500 truncate">24dcs088@charusat.edu.in</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer" />
        </div>
      </div>
    </aside>
  );
}