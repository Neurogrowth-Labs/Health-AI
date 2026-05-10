import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Activity, Settings, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '../../components/ui/table';

const AdminOverview = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Total Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,248</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Total Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">42</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">Virtual Chat Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$12,450</div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const UserManagement = () => (
  <Card>
    <CardHeader>
      <CardTitle>User Management</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Dr. Sarah Jenkins</TableCell>
            <TableCell>sarah@clinic.com</TableCell>
            <TableCell>DOCTOR</TableCell>
            <TableCell><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">John Doe</TableCell>
            <TableCell>john@patient.com</TableCell>
            <TableCell>PATIENT</TableCell>
            <TableCell><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: Activity },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Payments', path: '/admin/payments', icon: DollarSign },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
          <div className="mb-6 px-2">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Admin Portal</h2>
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                    isActive 
                      ? "bg-slate-900 text-white" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="payments" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full"><h2 className="text-2xl font-bold mb-4 tracking-tight">Payment Monitoring</h2><p>View transaction history.</p></div>} />
          <Route path="settings" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full"><h2 className="text-2xl font-bold tracking-tight">System Settings</h2></div>} />
        </Routes>
      </div>
    </div>
  );
}
