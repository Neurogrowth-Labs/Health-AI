/** Product capability copy for the doctor AI dashboards — not live patient data. */
import type { AiCapabilityDef } from '@/lib/ai-capability-types';
import {
  Activity,
  AlarmClock,
  Brain,
  CalendarSync,
  ClipboardList,
  FileStack,
  Gauge,
  Heart,
  LineChart,
  MessageSquare,
  Mic,
  Pill,
  ScanLine,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  UserCog,
  Video,
  Wallet,
} from 'lucide-react';

export type { AiCapabilityDef } from '@/lib/ai-capability-types';

export const overviewHubTools: AiCapabilityDef[] = [
  {
    id: 'risk-radar',
    icon: Activity,
    title: 'Patient Risk Radar',
    bullets: [
      'AI reviews assigned patients for acuity signals.',
      'Flags high-risk patients, chronic deterioration, and missed medication patterns.',
    ],
    outputHint: 'Live output (example): patients needing urgent follow-up today.',
  },
  {
    id: 'briefing',
    icon: ClipboardList,
    title: 'Smart Daily Briefing',
    bullets: [
      'Auto-generated each morning from your schedule and charts.',
      'Surfaces appointments, critical cases, and follow-ups that need action.',
    ],
  },
  {
    id: 'workload',
    icon: Gauge,
    title: 'Predictive Workload Engine',
    bullets: [
      'Forecasts patient inflow and expected consultation duration.',
      'Suggests schedule adjustments before the day overloads.',
    ],
  },
  {
    id: 'performance',
    icon: LineChart,
    title: 'Clinical Performance Insights',
    bullets: [
      'Tracks recovery trends and diagnosis-quality signals over time.',
      'Surfaces AI-backed improvements without extra charting work.',
    ],
  },
  {
    id: 'revenue',
    icon: Wallet,
    title: 'Revenue Intelligence',
    bullets: [
      'Projects earnings for the day and week from booked work.',
      'Highlights missed billing and under-coded encounters when data is connected.',
    ],
  },
];

export const availabilityTools: AiCapabilityDef[] = [
  {
    id: 'calendar-opt',
    icon: CalendarSync,
    title: 'Smart Calendar Optimization',
    bullets: [
      'Weighs urgency, historical visit length, and panel mix.',
      'Recommends best open slots before you publish the day.',
    ],
  },
  {
    id: 'noshow',
    icon: AlarmClock,
    title: 'No-Show Prediction Engine',
    bullets: [
      'Scores no-show risk from history and lead times.',
      'Suggests light overbooking and reminder intensity — you stay in control.',
    ],
  },
  {
    id: 'slots',
    icon: Target,
    title: 'Dynamic Slot Allocation',
    bullets: [
      'Reserves longer blocks for complex cases.',
      'Keeps short slots for stable, routine visits.',
    ],
  },
  {
    id: 'burnout',
    icon: Heart,
    title: 'Burnout Prevention AI',
    bullets: [
      'Detects over-scheduling and charting pile-up early.',
      'Recommends breaks and load-balancing across the week.',
    ],
  },
  {
    id: 'reschedule',
    icon: Sparkles,
    title: 'Auto-Rescheduling Assistant',
    bullets: [
      'Rebooks cancellations into high-fit openings.',
      'Reduces idle time while respecting clinical buffers.',
    ],
  },
];

export const virtualConsultTools: AiCapabilityDef[] = [
  {
    id: 'assistant',
    icon: Stethoscope,
    title: 'Real-Time Clinical Assistant',
    bullets: [
      'Suggests differentials, questions to ask, and red-flag symptoms during the visit.',
      'Everything is advisory — your judgment is final.',
    ],
  },
  {
    id: 'scribe',
    icon: Mic,
    title: 'Live Transcription & Auto Notes',
    bullets: [
      'Speech → structured draft notes in near real time.',
      'SOAP-oriented templates when you enable them in settings.',
    ],
  },
  {
    id: 'symptom',
    icon: Video,
    title: 'Symptom Intelligence Overlay',
    bullets: [
      'Pulls in problem list, risk factors, and recent vitals beside the video.',
      'Keeps context visible without tab switching.',
    ],
  },
  {
    id: 'sentiment',
    icon: MessageSquare,
    title: 'Emotion & Sentiment (Advanced)',
    bullets: [
      'Surfaces stress or anxiety cues from speech and pace.',
      'Optional coaching to soften tone or pace when appropriate.',
    ],
  },
  {
    id: 'rx',
    icon: Pill,
    title: 'Instant Prescription Generator',
    bullets: [
      'Drafts medication options with dosing context.',
      'Checks allergies and major interactions when the chart is linked.',
    ],
  },
];

export const emrTools: AiCapabilityDef[] = [
  {
    id: 'summary',
    icon: FileStack,
    title: 'Smart Medical Summary',
    bullets: [
      'Condenses long charts into a one-minute read.',
      'Emphasizes critical conditions and repeating patterns.',
    ],
  },
  {
    id: 'longitudinal',
    icon: TrendingUp,
    title: 'Longitudinal Health Analysis',
    bullets: [
      'Tracks trajectories for key conditions and labs.',
      'Surfaces progression or improvement you might miss in busy weeks.',
    ],
  },
  {
    id: 'risk-pred',
    icon: Shield,
    title: 'Risk Prediction Engine',
    bullets: [
      'Models likelihood of common comorbid progressions (e.g. diabetes, hypertension).',
      'Flags relapse risk when data supports it.',
    ],
  },
  {
    id: 'cds',
    icon: Brain,
    title: 'Clinical Decision Support',
    bullets: [
      'Suggests next tests and care pathways grounded in evidence.',
      'Always auditable and tied to your org’s policies when configured.',
    ],
  },
  {
    id: 'docs',
    icon: ScanLine,
    title: 'Document Intelligence',
    bullets: [
      'Ingests labs, PDFs, and uploads.',
      'Extracts key values and trends into structured fields.',
    ],
  },
];

export const settingsPersonalizationTools: AiCapabilityDef[] = [
  {
    id: 'style',
    icon: UserCog,
    title: 'AI Personalization Engine',
    bullets: [
      'Learns your practice style, common orders, and phrasing.',
      'Tightens recommendations to how you actually work.',
    ],
  },
  {
    id: 'voice',
    icon: Mic,
    title: 'Voice Command Configuration',
    bullets: [
      'Dictate notes and navigate the EMR hands-free.',
      'Mapped to your vocabulary and languages.',
    ],
  },
  {
    id: 'notify',
    icon: Sparkles,
    title: 'Smart Notification Control',
    bullets: [
      'Prioritizes urgent patients and safety signals first.',
      'Throttles noisy operational alerts.',
    ],
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy & Access Intelligence',
    bullets: [
      'Recommends least-privilege sharing for integrations.',
      'Surfaces risky permission drift across teams.',
    ],
  },
  {
    id: 'coach',
    icon: TrendingUp,
    title: 'Performance Coaching AI',
    bullets: [
      'Suggests efficiency moves (schedule, templates, delegation).',
      'Patient engagement nudges where metrics lag.',
    ],
  },
];

export const unifiedAiLayerBullets = [
  'NLP on doctor–patient conversations (with consent and policy).',
  'Predictive analytics for demand, risk, and revenue.',
  'Recommendation engine tuned by your settings and panel.',
  'Future: computer vision for imaging and document-heavy workflows.',
];

export const dashboardConnections = [
  { from: 'Overview', to: 'Aggregates scheduling, telemedicine, EMR, and personalization.' },
  { from: 'Availability', to: 'AI + appointment & capacity services.' },
  { from: 'Virtual consults', to: 'AI + communications + clinical context.' },
  { from: 'Patient records', to: 'AI + structured EMR and documents.' },
  { from: 'Settings', to: 'Personalizes every surface above.' },
];
