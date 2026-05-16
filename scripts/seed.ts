import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  neonAuthUsers,
  userProfiles,
  subscriptions,
  appointments,
  chatMessages,
  documents
} from '../src/lib/schema';

/**
 * Seed script for Health AI database.
 *
 * With Neon Auth, users are created through the authentication flow.
 * This script sets up user profiles for existing Neon Auth users.
 *
 * To seed doctor profiles:
 * 1. First, create users through Neon Auth (sign up via the app)
 * 2. Run this script with the user IDs to assign roles and doctor profiles
 */
async function seed() {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const db = drizzle(sql);

  console.log('Clearing existing app records (keeping Neon Auth users)...');
  await db.delete(documents);
  await db.delete(chatMessages);
  await db.delete(appointments);
  await db.delete(subscriptions);
  await db.delete(userProfiles);

  console.log('Fetching existing Neon Auth users...');
  const authUsers = await db.select().from(neonAuthUsers);

  if (authUsers.length === 0) {
    console.log('No Neon Auth users found. Please sign up users through the app first.');
    console.log('Seed complete (no profiles created).');
    return;
  }

  console.log(`Found ${authUsers.length} Neon Auth user(s).`);

  // Create user profiles with default PATIENT role
  // You can manually update roles in the database or add logic here
  for (const user of authUsers) {
    console.log(`Creating profile for: ${user.email}`);

    await db.insert(userProfiles).values({
      userId: user.id,
      role: 'PATIENT', // Default role, update manually for doctors/admins
    }).onConflictDoNothing();

    // Create a free subscription for each user
    await db.insert(subscriptions).values({
      userId: user.id,
      plan: 'FREE',
      status: 'ACTIVE',
    }).onConflictDoNothing();
  }

  console.log('Seed complete!');
  console.log('\nTo set up doctor profiles, update the user_profiles table:');
  console.log("  UPDATE user_profiles SET role = 'DOCTOR', practice = 'Cardiology', bio = '...', virtual_chat_fee = 50 WHERE user_id = '<user-id>';");
}

seed().catch(console.error);
