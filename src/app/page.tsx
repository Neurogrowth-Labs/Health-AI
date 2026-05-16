'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, Calendar, MessageSquare } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const rolePath =
        user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient';
      router.replace(rolePath);
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Healthcare from <span className="text-primary">anywhere, anytime</span>.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Health AI connects you with expert doctors instantly. Book appointments, ask our AI
          assistant, and get virtual consultations seamlessly.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button size="lg" onClick={() => router.push('/auth/register')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push('/auth/sign-in')}>
            Login
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full pt-8 border-t border-border">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
            <p className="text-sm text-muted-foreground">
              Schedule virtual or physical appointments with top-rated doctors.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Assistance</h3>
            <p className="text-sm text-muted-foreground">
              Get free preliminary AI consultations tailored to specific medical fields.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Virtual Care</h3>
            <p className="text-sm text-muted-foreground">
              Connect securely with doctors via paid virtual chat directly on the platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
