import { NextResponse } from 'next/server';
import { hashSync } from 'bcryptjs';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { authUsers, passwordResetOtps } from '@/lib/schema';

const OTP_LENGTH = 6;
const DEFAULT_OTP_EXPIRY_MINUTES = 10;

function generateNumericOtp(length: number) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const [user] = await db
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.email, email))
      .limit(1);
    if (!user) {
      return NextResponse.json({
        message: 'If this email is registered, an OTP has been sent.',
      });
    }

    const otp = generateNumericOtp(OTP_LENGTH);
    const otpHash = hashSync(otp, 10);
    const otpExpiryMinutes = Number(process.env.OTP_EXPIRES_MINUTES || DEFAULT_OTP_EXPIRY_MINUTES);
    const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);
    const now = new Date();

    await db
      .update(passwordResetOtps)
      .set({ usedAt: now })
      .where(
        and(
          eq(passwordResetOtps.userId, user.id),
          isNull(passwordResetOtps.usedAt),
          gt(passwordResetOtps.expiresAt, now),
        ),
      );

    await db.insert(passwordResetOtps).values({
      userId: user.id,
      otpHash,
      expiresAt,
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY is not configured' }, { status: 500 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: 'Health AI password reset OTP',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Reset your password</h2>
            <p>Use this OTP to reset your Health AI account password:</p>
            <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
            <p>This OTP expires in ${otpExpiryMinutes} minutes.</p>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend send OTP failed:', errorText);
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 502 });
    }

    return NextResponse.json({
      message: 'If this email is registered, an OTP has been sent.',
    });
  } catch (error) {
    console.error('Forgot password send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
