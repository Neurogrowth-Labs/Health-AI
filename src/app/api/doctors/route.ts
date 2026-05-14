import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const doctors = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        practice: users.practice,
        bio: users.bio,
        virtualChatFee: users.virtualChatFee,
      })
      .from(users)
      .where(eq(users.role, 'DOCTOR'));

    return NextResponse.json({ doctors });
  } catch (error: any) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
