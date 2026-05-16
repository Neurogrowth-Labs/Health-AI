export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  practice?: string;
  bio?: string;
  virtualChatFee?: number;
}

export interface Doctor extends User {
  role: 'DOCTOR';
  practice: string;
  bio?: string;
  virtualChatFee: number;
}

export interface Patient extends User {
  role: 'PATIENT';
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string; // ISO date string
  timeStr: string; // "14:30"
  type: 'PHYSICAL' | 'VIRTUAL';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
}

export interface DocumentRecord {
  id: string;
  patientId: string;
  doctorId?: string;
  title: string;
  url: string;
  uploadDate: string;
}
