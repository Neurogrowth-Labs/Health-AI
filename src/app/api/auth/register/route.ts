import { NextResponse } from 'next/server';
import { hashSync } from 'bcryptjs';
import { db } from '@/lib/db';
import { authUsers } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { signToken, authCookieOptions } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await db
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.email, email))
      .limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const [newUser] = await db
      .insert(authUsers)
      .values({
        name,
        email,
        password: hashSync(password, 10),
        role: role || 'PATIENT',
      })
      .returning({
        id: authUsers.id,
        name: authUsers.name,
        email: authUsers.email,
        role: authUsers.role,
      });

    const token = await signToken(newUser);
    const res = NextResponse.json({ user: newUser });
    res.cookies.set(authCookieOptions(token));
    return res;
  } catch (error: unknown) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
