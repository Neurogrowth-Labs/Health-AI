export default function Footer() {
  return (
    <footer className="w-full px-8 py-3 bg-white border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-auto">
      <div className="flex gap-6">
        <span className="hidden sm:inline">Terms of Service</span>
        <span className="hidden sm:inline">Privacy & HIPAA</span>
        <span className="text-blue-500 font-bold">Support v2.4.1</span>
      </div>
    </footer>
  );
}
