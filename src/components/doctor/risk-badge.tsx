'use client';

import { cn } from '@/lib/utils';
import { type RiskLevel, riskColors } from '@/lib/doctor-theme';

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const r = riskColors(level);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums',
        r.border,
        r.bg,
        level === 'critical' && 'text-red-900',
        level === 'warning' && 'text-amber-900',
        level === 'stable' && 'text-emerald-900',
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', r.dot)} aria-hidden />
      {r.label} risk
    </span>
  );
}
