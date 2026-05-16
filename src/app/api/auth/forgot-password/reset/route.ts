import { NextResponse } from 'next/server';
import { compareSync, hashSync } from 'bcryptjs';
import { and, desc, eq, gt, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { authUsers, passwordResetOtps } from '@/lib/schema';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, OTP, and new password are required' }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof otp !== 'string' || typeof newPassword !== 'string') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const [user] = await db
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.email, email))
      .limit(1);
    if (!user) {
      return NextResponse.json({ error: 'Invalid OTP or email' }, { status: 400 });
    }

    const now = new Date();
    const [otpRecord] = await db
      .select()
      .from(passwordResetOtps)
      .where(
        and(
          eq(passwordResetOtps.userId, user.id),
          isNull(passwordResetOtps.usedAt),
          gt(passwordResetOtps.expiresAt, now),
        ),
      )
      .orderBy(desc(passwordResetOtps.createdAt))
      .limit(1);

    if (!otpRecord || !compareSync(otp, otpRecord.otpHash)) {
      return NextResponse.json({ error: 'Invalid OTP or email' }, { status: 400 });
    }

    await db.update(authUsers).set({ password: hashSync(newPassword, 10) }).where(eq(authUsers.id, user.id));
    await db.update(passwordResetOtps).set({ usedAt: now }).where(eq(passwordResetOtps.id, otpRecord.id));

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Forgot password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
