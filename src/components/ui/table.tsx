import { ReactNode } from 'react';

// For styling simplicity, exporting basic Table components inline
export function Table({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={`w-full overflow-auto rounded-xl border border-slate-200 ${className || ''}`}><table className="w-full text-sm text-left">{children}</table></div>;
}
export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-slate-50 text-slate-700">{children}</thead>;
}
export function TableRow({ children, className }: { children: ReactNode, className?: string }) {
  return <tr className={`border-b border-slate-200 last:border-0 ${className || ''}`}>{children}</tr>;
}
export function TableHead({ children, className }: { children: ReactNode, className?: string }) {
  return <th className={`px-4 py-3 font-medium ${className || ''}`}>{children}</th>;
}
export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="bg-white">{children}</tbody>;
}
export function TableCell({ children, className }: { children: ReactNode, className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className || ''}`}>{children}</td>;
}
