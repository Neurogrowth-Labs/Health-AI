import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { neonAuthUsers, userProfiles, doctorAvailability } from '../src/lib/schema';

/**
 * Seeds weekly availability slots for every doctor.
 *
 * Each doctor gets a row for every combination of:
 *   dayOfWeek: 1 (Mon) – 5 (Fri)
 *   timeSlot:  08:00 – 16:00 (9 hourly slots)
 *
 * Existing rows are preserved (uses onConflictDoNothing via unique index).
 */
async function seedAvailability() {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const db = drizzle(sql);

  console.log('Fetching doctors...');

  const doctors = await db
    .select({ userId: userProfiles.userId })
    .from(userProfiles)
    .where(eq(userProfiles.role, 'DOCTOR'));

  if (doctors.length === 0) {
    console.log('No doctors found in user_profiles. Please assign at least one user the DOCTOR role first.');
    return;
  }

  console.log(`Found ${doctors.length} doctor(s). Seeding weekly availability...`);

  const days = [1, 2, 3, 4, 5]; // Mon–Fri
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  let inserted = 0;

  for (const doctor of doctors) {
    const rows = days.flatMap((day) =>
      hours.map((hour) => ({
        doctorId: doctor.userId,
        dayOfWeek: day,
        timeSlot: hour,
        isAvailable: true,
        autoSchedule: false,
      }))
    );

    await db.insert(doctorAvailability).values(rows).onConflictDoNothing();
    inserted += rows.length;
    console.log(`  ✓ Doctor ${doctor.userId}: ${rows.length} slots`);
  }

  console.log(`\nDone! Inserted up to ${inserted} availability slots.`);
}

seedAvailability().catch(console.error);
