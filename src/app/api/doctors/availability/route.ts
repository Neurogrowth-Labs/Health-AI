import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { doctorAvailability } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/doctors/availability?doctorId=<uuid>
 * Returns all weekly availability slots for a given doctor.
 */
export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get('doctorId');
    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId query param required' }, { status: 400 });
    }

    const slots = await db
      .select()
      .from(doctorAvailability)
      .where(eq(doctorAvailability.doctorId, doctorId));

    return NextResponse.json({ slots });
  } catch (error: unknown) {
    console.error('GET availability error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/doctors/availability
 * Body: { doctorId, dayOfWeek, timeSlot, isAvailable, autoSchedule? }
 * Toggles a single slot's availability (upserts).
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, dayOfWeek, timeSlot, isAvailable, autoSchedule } = body;

    if (!doctorId || dayOfWeek == null || !timeSlot || isAvailable == null) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, dayOfWeek, timeSlot, isAvailable' },
        { status: 400 },
      );
    }

    // Check if slot already exists
    const existing = await db
      .select()
      .from(doctorAvailability)
      .where(
        and(
          eq(doctorAvailability.doctorId, doctorId),
          eq(doctorAvailability.dayOfWeek, dayOfWeek),
          eq(doctorAvailability.timeSlot, timeSlot),
        ),
      );

    if (existing.length > 0) {
      // Update
      await db
        .update(doctorAvailability)
        .set({
          isAvailable,
          ...(autoSchedule !== undefined && { autoSchedule }),
        })
        .where(
          and(
            eq(doctorAvailability.doctorId, doctorId),
            eq(doctorAvailability.dayOfWeek, dayOfWeek),
            eq(doctorAvailability.timeSlot, timeSlot),
          ),
        );
    } else {
      // Insert
      await db.insert(doctorAvailability).values({
        doctorId,
        dayOfWeek,
        timeSlot,
        isAvailable,
        autoSchedule: autoSchedule ?? false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('PUT availability error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/doctors/availability
 * Body: { doctorId, slots: Array<{ dayOfWeek, timeSlot, isAvailable, autoSchedule? }> }
 * Bulk upsert availability for a doctor (replaces all their slots).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, slots } = body;

    if (!doctorId || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, slots[]' },
        { status: 400 },
      );
    }

    // Delete existing slots for this doctor
    await db.delete(doctorAvailability).where(eq(doctorAvailability.doctorId, doctorId));

    // Insert new slots
    if (slots.length > 0) {
      const rows = slots.map((s: { dayOfWeek: number; timeSlot: string; isAvailable: boolean; autoSchedule?: boolean }) => ({
        doctorId,
        dayOfWeek: s.dayOfWeek,
        timeSlot: s.timeSlot,
        isAvailable: s.isAvailable,
        autoSchedule: s.autoSchedule ?? false,
      }));

      await db.insert(doctorAvailability).values(rows);
    }

    return NextResponse.json({ success: true, count: slots.length });
  } catch (error: unknown) {
    console.error('POST availability error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
