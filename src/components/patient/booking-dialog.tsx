'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CalendarDays, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  timeSlot: string;
  isAvailable: boolean;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: {
    id: string;
    name: string;
    practice: string | null;
  };
  onBooked?: () => void;
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dayIndexMap: Record<number, string> = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri' };

function getNextWeekDates(): { dayOfWeek: number; label: string; date: string }[] {
  const today = new Date();
  const dates: { dayOfWeek: number; label: string; date: string }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const jsDay = d.getDay(); // 0=Sun, 1=Mon...6=Sat
    if (jsDay >= 1 && jsDay <= 5) {
      const isoDate = d.toISOString().split('T')[0];
      dates.push({
        dayOfWeek: jsDay, // 1=Mon...5=Fri matches our schema
        label: `${dayNames[jsDay - 1]} ${d.getDate()}/${d.getMonth() + 1}`,
        date: isoDate,
      });
    }
  }
  return dates;
}

export function BookingDialog({ open, onOpenChange, doctor, onBooked }: BookingDialogProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const weekDates = getNextWeekDates();

  const fetchAvailability = useCallback(async () => {
    if (!doctor.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/availability?doctorId=${doctor.id}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots?.filter((s: AvailabilitySlot) => s.isAvailable) ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setLoading(false);
    }
  }, [doctor.id]);

  useEffect(() => {
    if (open) {
      fetchAvailability();
      setSelectedDay(null);
      setSelectedTime(null);
      setSelectedDate(null);
      setResult(null);
      setErrorMsg('');
    }
  }, [open, fetchAvailability]);

  const availableTimesForDay = selectedDay
    ? slots.filter((s) => s.dayOfWeek === selectedDay).map((s) => s.timeSlot).sort()
    : [];

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;
    setBooking(true);
    setResult(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctor.id,
          date: selectedDate,
          timeStr: selectedTime,
          type: 'PHYSICAL',
        }),
      });

      if (res.ok) {
        setResult('success');
        onBooked?.();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Booking failed');
        setResult('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setResult('error');
    } finally {
      setBooking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-teal-600" />
            Book Appointment
          </DialogTitle>
          <DialogDescription>
            Schedule a visit with <strong>Dr. {doctor.name}</strong>
            {doctor.practice && (
              <Badge variant="secondary" className="ml-2">{doctor.practice}</Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        {result === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <p className="text-center font-medium text-emerald-700">Appointment booked!</p>
            <p className="text-center text-sm text-slate-500">
              {selectedDate} at {selectedTime}
            </p>
            <Button onClick={() => onOpenChange(false)} className="mt-2">
              Done
            </Button>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                <span className="ml-2 text-sm text-slate-500">Loading slots...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No available slots for this doctor this week.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Day picker */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Select a day
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weekDates.map((wd) => {
                      const hasSlots = slots.some((s) => s.dayOfWeek === wd.dayOfWeek);
                      return (
                        <button
                          key={wd.date}
                          type="button"
                          disabled={!hasSlots}
                          onClick={() => {
                            setSelectedDay(wd.dayOfWeek);
                            setSelectedDate(wd.date);
                            setSelectedTime(null);
                          }}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-xs font-medium transition',
                            selectedDay === wd.dayOfWeek && selectedDate === wd.date
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : hasSlots
                                ? 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50'
                                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed',
                          )}
                        >
                          {wd.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time picker */}
                {selectedDay && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Clock className="mr-1 inline h-3 w-3" />
                      Available times
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimesForDay.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium transition',
                            selectedTime === time
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50',
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {result === 'error' && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMsg}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime || booking}
                className="gap-2 bg-teal-600 text-white hover:bg-teal-700"
              >
                {booking && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Booking
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
