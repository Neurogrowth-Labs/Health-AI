import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { HeartPulse, UserCircle, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen w-full font-sans text-slate-900 bg-[#F5F7FA] select-none">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-10 w-full">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center gap-2">
              <HeartPulse className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Health<span className="text-blue-600">AI</span></span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right flex-col hidden md:flex">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient')} className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-slate-300">
                  <UserCircle className="h-6 w-6 text-slate-600" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <Outlet />
      </main>
      
      <footer className="w-full px-8 py-3 bg-white border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-auto">
        <div>Connected to Primary Node: Frankfurt-01</div>
        <div className="flex gap-6">
          <span className="hidden sm:inline">Terms of Service</span>
          <span className="hidden sm:inline">Privacy & HIPAA</span>
          <span className="text-blue-500 font-bold">Support v2.4.1</span>
        </div>
      </footer>
    </div>
  );
}
