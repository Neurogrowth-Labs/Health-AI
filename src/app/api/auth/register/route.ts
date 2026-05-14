import { NextResponse } from 'next/server';
import { hashSync } from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { signToken, authCookieOptions } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashSync(password, 10),
      role: role || 'PATIENT',
    }).returning();

    const { password: _, createdAt, ...safeUser } = newUser;
    const token = await signToken(safeUser);
    const res = NextResponse.json({ user: safeUser });
    res.cookies.set(authCookieOptions(token));
    return res;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
