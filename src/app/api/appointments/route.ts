import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/jwt';

/**
 * GET /api/appointments?patientId=<uuid>
 * Returns all appointments for the current patient.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patientId = req.nextUrl.searchParams.get('patientId') || user.id;

    const results = await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId));

    return NextResponse.json({ appointments: results });
  } catch (error: unknown) {
    console.error('GET appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/appointments
 * Body: { doctorId, date, timeStr, type, notes? }
 * Creates a new appointment for the authenticated patient.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { doctorId, date, timeStr, type, notes } = body;

    if (!doctorId || !date || !timeStr || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, date, timeStr, type' },
        { status: 400 },
      );
    }

    if (!['PHYSICAL', 'VIRTUAL'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be PHYSICAL or VIRTUAL.' }, { status: 400 });
    }

    // Check if the slot is already booked
    const existing = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.date, date),
          eq(appointments.timeStr, timeStr),
        ),
      );

    const activeBooking = existing.find((a) => a.status !== 'CANCELLED');
    if (activeBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose another.' },
        { status: 409 },
      );
    }

    // Create the appointment
    const [appointment] = await db
      .insert(appointments)
      .values({
        doctorId,
        patientId: user.id,
        date,
        timeStr,
        type,
        status: 'PENDING',
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
