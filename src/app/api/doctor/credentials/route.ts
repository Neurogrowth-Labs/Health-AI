import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { doctorCredentials } from '@/lib/schema';
import { getAuthUser } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const user = await getAuthUser();
  const doctorId = request.nextUrl.searchParams.get('doctorId');
  if (doctorId) return NextResponse.json({ credentials: await db.select().from(doctorCredentials).where(and(eq(doctorCredentials.doctorId, doctorId), eq(doctorCredentials.isPublic, true))) });
  if (!user || user.role !== 'DOCTOR') return NextResponse.json({ error: 'Doctor access required.' }, { status: user ? 403 : 401 });
  return NextResponse.json({ credentials: await db.select().from(doctorCredentials).where(eq(doctorCredentials.doctorId, user.id)) });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== 'DOCTOR') return NextResponse.json({ error: 'Doctor access required.' }, { status: user ? 403 : 401 });
  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 255) : '';
    const issuer = typeof body.issuer === 'string' ? body.issuer.trim().slice(0, 255) : '';
    const url = typeof body.url === 'string' ? body.url : '';
    if (!title || !issuer || !url.startsWith('data:') || url.length > 2_800_000) return NextResponse.json({ error: 'Add a title, issuer, and a credential file smaller than 2 MB.' }, { status: 400 });
    const [credential] = await db.insert(doctorCredentials).values({ doctorId: user.id, title, issuer, url, credentialNumber: typeof body.credentialNumber === 'string' ? body.credentialNumber.slice(0, 120) : null, expiresAt: typeof body.expiresAt === 'string' ? body.expiresAt.slice(0, 10) : null, isPublic: body.isPublic !== false }).returning();
    return NextResponse.json({ credential }, { status: 201 });
  } catch (error) { console.error('Credential upload failed', error); return NextResponse.json({ error: 'Unable to save credential.' }, { status: 500 }); }
}
