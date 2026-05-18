'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type AiInsightChipProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle';
};

export function AiInsightChip({ children, className, variant = 'default' }: AiInsightChipProps) {
  return (
    <div
      className={cn(
        'inline-flex max-w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm leading-snug shadow-sm',
        variant === 'default' && 'border-[#00C2A8]/35 bg-[#00C2A8]/12 text-[#0A2540]',
        variant === 'subtle' && 'border-slate-200/80 bg-white/90 text-slate-700',
        className,
      )}
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#00C2A8]" aria-hidden />
      <span className="min-w-0 font-medium">{children}</span>
    </div>
  );
}
