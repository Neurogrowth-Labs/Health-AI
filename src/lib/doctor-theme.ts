/** Design tokens for doctor portal — Clinical Intelligence Hub */
export const doctorTheme = {
  primary: '#0A2540',
  accent: '#00C2A8',
  primaryFg: '#F8FAFC',
  critical: '#DC2626',
  warning: '#CA8A04',
  stable: '#16A34A',
} as const;

export type RiskLevel = 'critical' | 'warning' | 'stable';

export function riskColors(level: RiskLevel) {
  switch (level) {
    case 'critical':
      return {
        dot: 'bg-[#DC2626]',
        border: 'border-red-200',
        bg: 'bg-red-50/80',
        label: 'High',
      };
    case 'warning':
      return {
        dot: 'bg-[#CA8A04]',
        border: 'border-amber-200',
        bg: 'bg-amber-50/80',
        label: 'Medium',
      };
    default:
      return {
        dot: 'bg-[#16A34A]',
        border: 'border-emerald-200',
        bg: 'bg-emerald-50/80',
        label: 'Low',
      };
  }
}
