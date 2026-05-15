import { pgTable, uuid, text, varchar, boolean, integer, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'DOCTOR', 'PATIENT']);
export const appointmentTypeEnum = pgEnum('appointment_type', ['PHYSICAL', 'VIRTUAL']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('PATIENT'),
  avatar: text('avatar'),
  // Doctor-specific fields (null for non-doctors)
  practice: varchar('practice', { length: 255 }),
  bio: text('bio'),
  virtualChatFee: integer('virtual_chat_fee'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  doctorId: uuid('doctor_id').notNull().references(() => users.id),
  patientId: uuid('patient_id').notNull().references(() => users.id),
  date: varchar('date', { length: 10 }).notNull(), // ISO date "2025-06-01"
  timeStr: varchar('time_str', { length: 5 }).notNull(), // "14:30"
  type: appointmentTypeEnum('type').notNull(),
  status: appointmentStatusEnum('status').notNull().default('PENDING'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  isAi: boolean('is_ai').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull().references(() => users.id),
  doctorId: uuid('doctor_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  url: text('url').notNull(),
  uploadDate: timestamp('upload_date').defaultNow().notNull(),
});

export const passwordResetOtps = pgTable('password_reset_otps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  otpHash: varchar('otp_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('password_reset_otps_user_id_idx').on(table.userId),
  expiresAtIdx: index('password_reset_otps_expires_at_idx').on(table.expiresAt),
}));
