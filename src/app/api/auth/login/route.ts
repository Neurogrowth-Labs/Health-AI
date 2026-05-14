import { NextResponse } from 'next/server';
import { compareSync } from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { signToken, authCookieOptions } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const conditions = [eq(users.email, email)];
    if (role) {
      conditions.push(eq(users.role, role));
    }

    const [user] = await db.select().from(users).where(and(...conditions)).limit(1);

    if (!user || !compareSync(password, user.password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _, createdAt, ...safeUser } = user;
    const token = await signToken(safeUser);
    const res = NextResponse.json({ user: safeUser });
    res.cookies.set(authCookieOptions(token));
    return res;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
