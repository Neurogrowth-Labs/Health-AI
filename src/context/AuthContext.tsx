import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Doctor, Patient } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Temporary mock user data
const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@healthai.com', role: 'ADMIN' },
  { id: '2', name: 'Dr. Sarah Jenkins', email: 'sarah@clinic.com', role: 'DOCTOR', practice: 'Cardiology', virtualChatFee: 50 } as Doctor,
  { id: '3', name: 'John Doe', email: 'john@patient.com', role: 'PATIENT' } as Patient,
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: string) => {
    // In a real app we'd verify password, but here we just find by email or create mock
    const found = MOCK_USERS.find(u => u.email === email && u.role === role);
    const loggedUser = found || {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email,
      role: role as any,
    };
    
    setUser(loggedUser);
    localStorage.setItem('auth_user', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
