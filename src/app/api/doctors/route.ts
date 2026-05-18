import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userProfiles } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const baseDoctors = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        practice: userProfiles.practice,
        bio: userProfiles.bio,
        virtualChatFee: userProfiles.virtualChatFee,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.role, 'DOCTOR'));

    return NextResponse.json({ doctors: baseDoctors });
  } catch (error: unknown) {
    console.error('Fetch doctors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
