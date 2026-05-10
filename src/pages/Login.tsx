import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('PATIENT');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    await login(email, role);
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
          <CardDescription>Enter your email to login to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Login As
              </label>
              <select 
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Sign In</Button>
            <div className="text-sm text-center text-slate-500">
              Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
            </div>
            
            {(role === 'PATIENT' || role === 'DOCTOR') && (
              <div className="w-full pt-4 border-t border-slate-100 flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-2">Or continue with</span>
                <div className="flex gap-2">
                  <Button variant="outline" type="button" className="text-xs">Google</Button>
                  <Button variant="outline" type="button" className="text-xs">Facebook</Button>
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
