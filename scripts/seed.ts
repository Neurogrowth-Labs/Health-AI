import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { hashSync } from 'bcryptjs';
import { users, appointments, chatMessages, documents } from '../src/lib/schema';

async function seed() {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const db = drizzle(sql);

  console.log('Clearing existing records...');
  await db.delete(documents);
  await db.delete(chatMessages);
  await db.delete(appointments);
  await db.delete(users);

  console.log('Seeding database with hashed passwords...');

  const hash = (pw: string) => hashSync(pw, 10);

  await db.insert(users).values([
    {
      name: 'Admin User',
      email: 'admin@healthai.com',
      password: hash('admin123'),
      role: 'ADMIN',
    },
    {
      name: 'Dr. Sarah Jenkins',
      email: 'sarah@clinic.com',
      password: hash('doctor123'),
      role: 'DOCTOR',
      practice: 'Cardiology',
      bio: 'Board-certified cardiologist with 10 years of experience.',
      virtualChatFee: 50,
    },
    {
      name: 'Dr. Mike Ross',
      email: 'mike@clinic.com',
      password: hash('doctor123'),
      role: 'DOCTOR',
      practice: 'Dermatology',
      bio: 'Specializing in skin health and cosmetic dermatology.',
      virtualChatFee: 30,
    },
    {
      name: 'Dr. Emily Chen',
      email: 'emily@clinic.com',
      password: hash('doctor123'),
      role: 'DOCTOR',
      practice: 'Neurology',
      bio: 'Expert in neurological disorders and brain health.',
      virtualChatFee: 75,
    },
    {
      name: 'John Doe',
      email: 'john@patient.com',
      password: hash('patient123'),
      role: 'PATIENT',
    },
  ]);

  console.log('Seed complete!');
}

seed().catch(console.error);
