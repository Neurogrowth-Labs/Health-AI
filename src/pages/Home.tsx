import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Stethoscope, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    const rolePath = user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient';
    return <Navigate to={rolePath} replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Healthcare from <span className="text-blue-600">anywhere, anytime</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Health AI connects you with expert doctors instantly. Book appointments, ask our AI assistant, and get virtual consultations seamlessly.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full pt-8 border-t border-slate-200">
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900 tracking-tight">Easy Booking</h3>
          <p className="text-slate-600 text-sm">Schedule virtual or physical appointments with top-rated doctors.</p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900 tracking-tight">AI Assistance</h3>
          <p className="text-slate-600 text-sm">Get free preliminary AI consultations tailored to specific medical fields.</p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900 tracking-tight">Virtual Care</h3>
          <p className="text-slate-600 text-sm">Connect securely with doctors via paid virtual chat directly on the platform.</p>
        </div>
      </div>
    </div>
  );
}
