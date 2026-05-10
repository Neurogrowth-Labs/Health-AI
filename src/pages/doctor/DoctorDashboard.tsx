import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Video, FileText, Settings, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '../../components/ui/table';

const Overview = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500 text-center py-8">No appointments scheduled for today.</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="h-5 w-5 text-purple-600" />
            Upcoming Virtual Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500 text-center py-8">No virtual chats scheduled.</div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const Availability = () => (
  <Card>
    <CardHeader>
      <CardTitle>Manage Availability</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-sm text-slate-600 mb-4">Set your 30-minute interval slots for physical appointments.</div>
      <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
        <p className="text-center text-slate-500">Availability calendar interface would go here.</p>
      </div>
    </CardContent>
  </Card>
);

const DoctorSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Profile & Settings</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Virtual Chat Fee ($)</label>
        <input type="number" className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue={50} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Practice/Specialty</label>
        <input type="text" className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue="Cardiology" />
      </div>
      <button className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium mt-4">Save Changes</button>
    </CardContent>
  </Card>
);

export default function DoctorDashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/doctor', icon: Calendar },
    { label: 'Availability', path: '/doctor/availability', icon: Clock },
    { label: 'Virtual Consults', path: '/doctor/virtual', icon: Video },
    { label: 'Patient Records', path: '/doctor/records', icon: FileText },
    { label: 'Settings', path: '/doctor/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
          <div className="mb-6 px-2">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Doctor Portal</h2>
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/doctor' && location.pathname.startsWith(item.path));
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
          <Route path="availability" element={<Availability />} />
          <Route path="virtual" element={<div className="bg-white p-6 rounded-2xl shadow-sm w-full border border-slate-200"><h2 className="text-2xl font-bold mb-4 tracking-tight">Virtual Consultations</h2><p>View upcoming and past virtual chats.</p></div>} />
          <Route path="records" element={<div className="bg-white p-6 rounded-2xl shadow-sm w-full border border-slate-200"><h2 className="text-2xl font-bold mb-4 tracking-tight">Patient Records</h2><p>Access patient treatment documents.</p></div>} />
          <Route path="settings" element={<DoctorSettings />} />
        </Routes>
      </div>
    </div>
  );
}
