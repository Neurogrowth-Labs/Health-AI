import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { authUsers, userProfiles } from '@/lib/schema';
import { getAuthUser } from '@/lib/jwt';

function isMissingTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: string; cause?: { code?: string } }).code;
  const causeCode = (error as { cause?: { code?: string } }).cause?.code;
  return code === '42P01' || causeCode === '42P01';
}

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let profile = null;
    try {
      const [profileRow] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, authUser.id))
        .limit(1);
      profile = profileRow ?? null;
    } catch (error) {
      if (!isMissingTableError(error)) throw error;
      profile = null;
    }

    return NextResponse.json({
      profile: {
        name: authUser.name ?? '',
        email: authUser.email ?? '',
        role: authUser.role,
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
        gender: profile?.gender ?? '',
        dateOfBirth: profile?.dateOfBirth ?? '',
        practice: profile?.practice ?? '',
        bio: profile?.bio ?? '',
        virtualChatFee: profile?.virtualChatFee ?? 0,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const address = typeof body.address === 'string' ? body.address.trim() : '';
    const gender = typeof body.gender === 'string' ? body.gender.trim() : '';
    const dateOfBirth = typeof body.dateOfBirth === 'string' ? body.dateOfBirth.trim() : '';
    const practice = typeof body.practice === 'string' ? body.practice.trim() : '';
    const bio = typeof body.bio === 'string' ? body.bio.trim() : '';
    const virtualChatFee = Number.isFinite(Number(body.virtualChatFee))
      ? Number(body.virtualChatFee)
      : 0;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await db
      .update(authUsers)
      .set({ name })
      .where(eq(authUsers.id, authUser.id));

    try {
      const [existing] = await db
        .select({ userId: userProfiles.userId })
        .from(userProfiles)
        .where(eq(userProfiles.userId, authUser.id))
        .limit(1);

      if (existing) {
        await db
          .update(userProfiles)
          .set({
            phone: phone || null,
            address: address || null,
            gender: gender || null,
            dateOfBirth: dateOfBirth || null,
            practice: practice || null,
            bio: bio || null,
            virtualChatFee: authUser.role === 'DOCTOR' ? virtualChatFee : null,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, authUser.id));
      } else {
        await db.insert(userProfiles).values({
          userId: authUser.id,
          phone: phone || null,
          address: address || null,
          gender: gender || null,
          dateOfBirth: dateOfBirth || null,
          practice: practice || null,
          bio: bio || null,
          virtualChatFee: authUser.role === 'DOCTOR' ? virtualChatFee : null,
        });
      }
    } catch (error) {
      if (!isMissingTableError(error)) throw error;
      // Allow name-only profile updates when user_profiles is not created yet.
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
