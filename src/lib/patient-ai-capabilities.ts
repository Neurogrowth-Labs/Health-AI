/** Patient portal AI microservice copy — display / product architecture only. */
import type { AiCapabilityDef } from '@/lib/ai-capability-types';
import {
  Award,
  Bell,
  BellRing,
  BookOpen,
  Brain,
  CalendarClock,
  CalendarPlus,
  GitBranch,
  Lightbulb,
  MessageSquare,
  Mic,
  ScanLine,
  Search,
  ShieldQuestion,
  SlidersHorizontal,
  Stethoscope,
  Tags,
  Timer,
  TrendingUp,
  UserSearch,
  UserX,
  Activity,
} from 'lucide-react';

export const patientOverviewTools: AiCapabilityDef[] = [
  {
    id: 'copilot',
    icon: MessageSquare,
    title: 'AI Health Copilot',
    bullets: [
      'Chat-based assistant for symptoms, health questions, and next steps.',
      'Context-aware using your full patient history when connected.',
    ],
    api: 'POST /ai/copilot/chat',
  },
  {
    id: 'health-score',
    icon: Activity,
    title: 'Personal Health Score Engine',
    bullets: [
      'Dynamic score from vitals, history, and behavior signals.',
      'Surfaces risk levels and preventative recommendations.',
    ],
    api: 'GET /ai/health-score/{patient_id}',
  },
  {
    id: 'risk-prediction',
    icon: TrendingUp,
    title: 'Predictive Risk Engine',
    bullets: [
      'Forecasts chronic disease risk and hospitalization probability.',
      'Prioritizes what to discuss with your care team.',
    ],
    api: 'POST /ai/risk-prediction',
  },
  {
    id: 'smart-alerts',
    icon: Bell,
    title: 'Smart Alerts Engine',
    bullets: [
      'AI-generated reminders: medications, follow-ups, and care gaps.',
      'Tuned to reduce noise while keeping you safe.',
    ],
  },
];

export const patientFindDoctorTools: AiCapabilityDef[] = [
  {
    id: 'recommend-doctor',
    icon: UserSearch,
    title: 'Doctor Recommendation Engine',
    bullets: [
      'Matches you to doctors using condition fit, outcomes, availability, and location.',
      'Balances urgency with your preferences.',
    ],
    api: 'POST /ai/recommend-doctor',
  },
  {
    id: 'semantic-search',
    icon: Search,
    title: 'Semantic Search (NLP)',
    bullets: [
      'Understands natural language like “skin specialist near me”.',
      'Expands intent beyond raw keywords.',
    ],
    api: 'POST /ai/search-doctors',
  },
  {
    id: 'trust-rank',
    icon: Award,
    title: 'Trust & Ranking AI',
    bullets: [
      'Ranks providers using outcomes, reviews, and engagement quality.',
      'Transparent factors you can adjust in settings.',
    ],
  },
];

export const patientConsultationTools: AiCapabilityDef[] = [
  {
    id: 'symptom-structuring',
    icon: Stethoscope,
    title: 'Real-Time Symptom Intelligence',
    bullets: [
      'Structures symptoms during consult so your doctor sees a clean summary.',
      'Highlights missing details to capture.',
    ],
    api: 'POST /ai/symptom-structuring',
  },
  {
    id: 'live-assistant',
    icon: Brain,
    title: 'Live Consultation Assistant',
    bullets: [
      'Suggests questions to ask and symptoms easy to forget.',
      'Private to you until you choose to share.',
    ],
  },
  {
    id: 'transcription',
    icon: Mic,
    title: 'Auto Transcription & Summary',
    bullets: [
      'Turns video/audio into structured notes when enabled.',
      'Delivers summary and key actions after the visit.',
    ],
    api: 'POST /ai/consultation-summary',
  },
  {
    id: 'post-consult',
    icon: Lightbulb,
    title: 'Post-Consultation Insights',
    bullets: [
      'Explains diagnoses in plain language with cited sources where available.',
      'Suggests next steps aligned with your care plan.',
    ],
  },
];

export const patientDocumentTools: AiCapabilityDef[] = [
  {
    id: 'doc-analyzer',
    icon: ScanLine,
    title: 'Medical Document Analyzer',
    bullets: [
      'OCR + NLP to extract diagnoses, medications, and lab results.',
      'Flags contradictions for clinician review.',
    ],
    api: 'POST /ai/document-analyze',
  },
  {
    id: 'categorize',
    icon: Tags,
    title: 'Smart Categorization Engine',
    bullets: [
      'Auto-tags uploads: labs, prescriptions, imaging reports.',
      'Keeps your record organized without manual folders.',
    ],
  },
  {
    id: 'simplify',
    icon: BookOpen,
    title: 'Medical Language Simplifier',
    bullets: [
      'Rewrites complex reports into plain language.',
      'Preserves clinical accuracy with disclaimers.',
    ],
    api: 'POST /ai/simplify-medical-text',
  },
  {
    id: 'timeline',
    icon: GitBranch,
    title: 'Health Timeline Builder',
    bullets: [
      'Builds a longitudinal timeline from documents and visits.',
      'Surfaces trends across time.',
    ],
  },
];

export const patientAppointmentTools: AiCapabilityDef[] = [
  {
    id: 'booking-assistant',
    icon: CalendarClock,
    title: 'Smart Booking Assistant',
    bullets: [
      'Suggests best time and provider based on urgency + live availability.',
      'Reduces back-and-forth scheduling.',
    ],
    api: 'POST /ai/appointment-suggestions',
  },
  {
    id: 'noshow',
    icon: UserX,
    title: 'No-Show Prediction Model',
    bullets: [
      'Predicts missed visits and escalates reminders appropriately.',
      'Protects access for other patients.',
    ],
  },
  {
    id: 'wait-time',
    icon: Timer,
    title: 'Wait-Time Optimization',
    bullets: [
      'Recommends slots with shortest expected wait.',
      'Updates as clinics publish live queue data.',
    ],
  },
  {
    id: 'followup',
    icon: CalendarPlus,
    title: 'Follow-Up Recommendation Engine',
    bullets: [
      'Auto-suggests follow-ups from visit notes and risk signals.',
      'Syncs to your calendar when you confirm.',
    ],
  },
];

export const patientSettingsTools: AiCapabilityDef[] = [
  {
    id: 'personalization',
    icon: SlidersHorizontal,
    title: 'Personalization Engine',
    bullets: [
      'Learns preferences and behavior to tune UI, notifications, and recommendations.',
      'You control reset and data scope at any time.',
    ],
  },
  {
    id: 'privacy-ai',
    icon: ShieldQuestion,
    title: 'Privacy & Consent AI Assistant',
    bullets: [
      'Explains data permissions with simple language.',
      'Recommends privacy presets based on how you use HealthAI.',
    ],
  },
  {
    id: 'notification-intel',
    icon: BellRing,
    title: 'Notification Intelligence',
    bullets: [
      'Sends alerts only when clinically or personally relevant.',
      'Designed to avoid notification fatigue.',
    ],
  },
  {
    id: 'behavioral',
    icon: Brain,
    title: 'Behavioral Insights Engine',
    bullets: [
      'Tracks medication adherence and appointment patterns with your consent.',
      'Surfaces gentle nudges, not guilt.',
    ],
  },
];

export const patientMicroserviceArchitecture = [
  'NLP Engine — conversational understanding across chat and consult.',
  'Recommendation Engine — doctors, slots, and self-care actions.',
  'Predictive Analytics Engine — risk, no-shows, and health trajectories.',
  'Clinical Decision Support Models — assistive, not autonomous, per policy.',
  'Personalization Engine — learns preferences to adapt the whole panel.',
];

export const patientUnifiedAiLayerBullets = [
  {
    title: 'Unified Patient Intelligence Graph',
    text: 'Connects symptoms, doctors, and treatments to power every recommendation.',
  },
  {
    title: 'Continuous Learning Loop',
    text: 'User actions → data → models → improved suggestions with governance.',
  },
  {
    title: 'Context Engine (critical)',
    text: 'Always aligns outputs with history, current session, and doctor interactions.',
  },
];

export const patientDashboardConnections = [
  { from: 'Overview', to: 'Copilot, health score, predictive risk, and alerts.' },
  { from: 'Find doctors', to: 'Matchmaking, semantic search, and trust ranking.' },
  { from: 'Consultations', to: 'Symptom intelligence, live assistant, transcription, post-visit insights.' },
  { from: 'Documents', to: 'OCR/NLP, categorization, simplification, timeline.' },
  { from: 'Appointments', to: 'Booking AI, no-show prediction, wait-time, follow-ups.' },
  { from: 'Settings', to: 'Personalization, privacy assistant, notifications, behavioral insights.' },
];
