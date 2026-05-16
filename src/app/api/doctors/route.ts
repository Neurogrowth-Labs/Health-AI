import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const baseDoctors = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.role, 'DOCTOR'));

    const doctors = baseDoctors.map((doctor) => ({
      ...doctor,
      practice: null,
      bio: null,
      virtualChatFee: null,
    }));

    return NextResponse.json({ doctors });
  } catch (error: unknown) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
