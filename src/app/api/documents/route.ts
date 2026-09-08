import { NextResponse } from 'next/server';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import { appointments, documents } from '@/lib/schema';
import { getAuthUser } from '@/lib/jwt';

const maxDataUrlLength = 2_800_000;
const categories = ['MEDICAL_RECORD', 'PRESCRIPTION', 'LAB_RESULT', 'OTHER'] as const;

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    if (user.role === 'PATIENT') {
      return NextResponse.json({ documents: await db.select().from(documents).where(eq(documents.patientId, user.id)) });
    }
    if (user.role === 'DOCTOR') {
      const records = await db.select().from(documents).where(eq(documents.doctorId, user.id));
      return NextResponse.json({ documents: records });
    }
    return NextResponse.json({ error: 'Unsupported role' }, { status: 403 });
  } catch (error) { console.error('List documents failed', error); return NextResponse.json({ error: 'Unable to load documents' }, { status: 500 }); }
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== 'PATIENT') return NextResponse.json({ error: 'Only patient accounts can upload care documents.' }, { status: user ? 403 : 401 });
  try {
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 255) : '';
    const url = typeof body.url === 'string' ? body.url : '';
    const category = categories.includes(body.category) ? body.category : 'OTHER';
    const doctorId = typeof body.doctorId === 'string' && body.doctorId ? body.doctorId : null;
    if (!title || !url.startsWith('data:') || url.length > maxDataUrlLength) return NextResponse.json({ error: 'Upload a document smaller than 2 MB with a file name.' }, { status: 400 });
    if (doctorId) {
      const [consultation] = await db.select({ id: appointments.id }).from(appointments).where(and(eq(appointments.patientId, user.id), eq(appointments.doctorId, doctorId), inArray(appointments.status, ['PENDING', 'CONFIRMED', 'COMPLETED']))).limit(1);
      if (!consultation) return NextResponse.json({ error: 'Select a doctor with whom you have a consultation.' }, { status: 403 });
    }
    const [document] = await db.insert(documents).values({ patientId: user.id, doctorId, title, url, category }).returning();
    return NextResponse.json({ document }, { status: 201 });
  } catch (error) { console.error('Upload document failed', error); return NextResponse.json({ error: 'Unable to save document.' }, { status: 500 }); }
}
