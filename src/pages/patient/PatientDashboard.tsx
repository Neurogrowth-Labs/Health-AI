import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MessageSquare, Video, FileText, Search, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import AIChat from './AIChat';
import FindDoctors from './FindDoctors';
import VirtualChat from './VirtualChat';

// Stubs for inner pages
const Overview = () => <div className="bg-white p-6 rounded-2xl shadow-sm w-full border border-slate-200"><h2 className="text-2xl font-bold mb-4 tracking-tight">Patient Overview</h2><p>Welcome to your portal.</p></div>;
const Documents = () => <div className="bg-white p-6 rounded-2xl shadow-sm w-full border border-slate-200"><h2 className="text-2xl font-bold mb-4 tracking-tight">Documents</h2></div>;

export default function PatientDashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/patient', icon: Calendar },
    { label: 'Find Doctors', path: '/patient/find', icon: Search },
    { label: 'AI Chat', path: '/patient/ai-chat', icon: MessageSquare },
    { label: 'Virtual Consults', path: '/patient/virtual', icon: Video },
    { label: 'Documents', path: '/patient/documents', icon: FileText },
    { label: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
          <div className="mb-6 px-2">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Patient Portal</h2>
            <p className="text-sm font-semibold text-slate-900">Welcome, {user?.name}</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/patient' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="find" element={<FindDoctors />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="virtual/*" element={<VirtualChat />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h2 className="text-2xl font-bold tracking-tight">Settings</h2></div>} />
        </Routes>
      </div>
    </div>
  );
}
