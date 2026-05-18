'use client';

import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AiCapabilityDef } from '@/lib/doctor-ai-capabilities';

type AiCapabilityCardProps = {
  capability: AiCapabilityDef;
  children?: ReactNode;
  className?: string;
};

export function AiCapabilityCard({ capability, children, className }: AiCapabilityCardProps) {
  const Icon = capability.icon;
  return (
    <Card className={cn('flex h-full flex-col border-slate-200/90 shadow-md', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start gap-2 text-base font-bold text-[#0A2540]">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#00C2A8]" aria-hidden />
          <span>{capability.title}</span>
        </CardTitle>
        {capability.outputHint ? (
          <CardDescription className="text-xs">{capability.outputHint}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <ul className="list-inside list-disc space-y-1.5 text-xs leading-snug text-slate-600">
          {capability.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        {children ? <div className="mt-auto border-t border-slate-100 pt-3">{children}</div> : null}
      </CardContent>
    </Card>
  );
}
