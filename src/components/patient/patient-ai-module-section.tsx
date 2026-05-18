'use client';

import { AiCapabilityCard } from '@/components/doctor/ai-capability-card';
import type { AiCapabilityDef } from '@/lib/ai-capability-types';

export function PatientAiModuleSection({
  eyebrow,
  title,
  description,
  tools,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tools: AiCapabilityDef[];
}) {
  return (
    <div className="mb-8 space-y-4 text-[#0A2540]">
      <div className="rounded-xl border border-sky-100/80 bg-white/90 p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-pretty text-sm text-slate-600">{description}</p>
      </div>
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">AI tools</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {tools.map((cap) => (
            <AiCapabilityCard key={cap.id} capability={cap} />
          ))}
        </div>
      </div>
    </div>
  );
}
