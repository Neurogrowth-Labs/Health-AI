import type { LucideIcon } from 'lucide-react';

/** Shared shape for AI capability cards (doctor + patient dashboards). */
export type AiCapabilityDef = {
  id: string;
  title: string;
  bullets: string[];
  icon: LucideIcon;
  outputHint?: string;
  /** Example API route — display only */
  api?: string;
};
