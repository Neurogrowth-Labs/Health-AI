'use client';

import { cn } from '@/lib/utils';

type ToggleProps = {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id?: string;
  disabled?: boolean;
  label: string;
  description?: string;
};

export function DoctorToggle({ checked, onCheckedChange, id, disabled, label, description }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-[#0A2540]">
          {label}
        </label>
        {description && <p className="mt-1 text-xs text-slate-600">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2A8]/50 focus-visible:ring-offset-2',
          checked ? 'border-[#00C2A8] bg-[#00C2A8]' : 'border-slate-300 bg-slate-200',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <span
          className={cn(
            'pointer-events-none absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}
