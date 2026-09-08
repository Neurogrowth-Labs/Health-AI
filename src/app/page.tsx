'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  HeartPulse,
  Languages,
  LockKeyhole,
  Network,
  Radio,
  ShieldCheck,
  Signal,
  Smartphone,
  Stethoscope,
  UsersRound,
  WifiOff,
} from 'lucide-react';

const layers = [
  { title: 'People & care', copy: 'Patients, families and community health workers.', icon: UsersRound },
  { title: 'Clinical services', copy: 'Clinicians, facilities, labs and pharmacies.', icon: Stethoscope },
  { title: 'Health intelligence', copy: 'Governments, partners and researchers.', icon: BrainCircuit },
];

const capabilities = [
  { kicker: 'AI Health Navigator', title: 'A better first step into care.', copy: 'Guides people through structured symptom conversations and connects them to the right next step — without confusing guidance with diagnosis.', action: 'Explore care navigation', icon: HeartPulse, tone: 'teal' },
  { kicker: 'Clinical intelligence', title: 'Give every clinician more context.', copy: 'A patient timeline, evidence-linked AI summaries and human-led decision support designed for the realities of clinical care.', action: 'Explore clinical services', icon: Stethoscope, tone: 'navy' },
  { kicker: 'Health intelligence', title: 'See signals before they become crises.', copy: 'Authorized data becomes early warning, access-gap analysis and clearer decisions for health systems.', action: 'Explore health intelligence', icon: Radio, tone: 'gold' },
];

const trustPoints = ['Evidence-linked AI insights', 'Human review at every clinical decision', 'Consent-led data sharing', 'Built for interoperable health systems'];

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === 'ADMIN' ? '/admin' : user.role === 'DOCTOR' ? '/doctor' : '/patient');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-[#071A2B]"><HeartPulse className="h-10 w-10 animate-pulse text-[#00A88F]" /></div>;
  if (user) return null;

  const register = () => router.push('/auth/register');
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="overflow-hidden bg-[#F7F9F8] text-[#071A2B]">
      <section className="relative isolate overflow-hidden bg-[#071A2B] px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:px-12 lg:pb-32">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(137,217,205,.25)_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-[#00A88F]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-[#D7A928]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[.18em] text-[#91dfd3]"><Network className="h-3.5 w-3.5" /> Africa AI Health</div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">Intelligence for a <span className="text-[#55cfc0]">healthier Africa.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">One intelligent health infrastructure connecting people, clinicians, communities and health systems — from the first symptom to national health intelligence.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => scrollTo('platform')} className="h-12 rounded-full bg-[#00A88F] px-6 font-semibold text-[#071A2B] hover:bg-[#24bba5]">Explore the platform <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button size="lg" variant="outline" onClick={register} className="h-12 rounded-full border-white/25 bg-white/[.03] px-6 text-white hover:bg-white/10 hover:text-white">For health organizations</Button>
            </div>
            <div className="mt-11 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300"><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#55cfc0]" /> Offline-first by design</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#55cfc0]" /> Built for 54 countries</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0">
            <div className="absolute inset-8 rounded-full border border-[#55cfc0]/20" />
            <div className="absolute inset-20 rounded-full border border-[#D7A928]/20" />
            <div className="relative grid min-h-[410px] place-items-center">
              <div className="relative grid h-52 w-52 place-items-center rounded-full border border-[#7be0d3]/40 bg-[#0c3144] shadow-[0_0_90px_rgba(0,168,143,.22)]">
                <div className="grid h-36 w-36 place-items-center rounded-full border border-[#7be0d3]/30 bg-[#0d4051]"><HeartPulse className="h-12 w-12 text-[#55cfc0]" /><span className="mt-[-24px] text-[10px] font-bold tracking-[.2em] text-white">AI CORE</span></div>
              </div>
              <div className="absolute left-0 top-12 rounded-2xl border border-white/10 bg-[#0b2a3c]/90 p-4 shadow-xl backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#D7A928]">Early signal</p><p className="mt-1 text-sm font-medium text-white">Community health</p><div className="mt-2 flex items-center gap-2 text-xs text-[#8bddd1]"><span className="h-1.5 w-1.5 rounded-full bg-[#00A88F]" /> Monitoring</div></div>
              <div className="absolute bottom-8 right-0 rounded-2xl border border-white/10 bg-[#0b2a3c]/90 p-4 shadow-xl backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#8bddd1]">Care coordination</p><p className="mt-1 text-sm font-medium text-white">Next step found</p><p className="mt-2 text-xs text-slate-400">Human care, when needed</p></div>
              <div className="absolute right-6 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#D7A928]/40 bg-[#D7A928]/10 text-[#f0cf65]"><Radio className="h-4 w-4" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dce5e1] bg-white px-5 py-6 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5"><p className="text-sm font-medium text-slate-600">Designed around health access, not just digital access.</p><div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-[.14em] text-slate-400"><span>Mobile</span><span>Offline</span><span>Cloud</span><span>SMS fallback</span></div></div></section>

      <section id="platform" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#008f7a]">One shared infrastructure</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.045em] sm:text-5xl">Different experiences.<br />One connected system.</h2></div><p className="max-w-xl self-end text-lg leading-8 text-slate-600">A role-aware platform gives every person the experience they need while preserving the continuity of care and the context health systems need to act.</p></div><div className="mt-14 grid gap-4 md:grid-cols-3">{layers.map(({ title, copy, icon: Icon }, index) => <article key={title} className="rounded-2xl border border-[#dce5e1] bg-white p-7 transition-transform hover:-translate-y-1"><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.16em] text-[#a17d16]">0{index + 1}</span><Icon className="h-5 w-5 text-[#008f7a]" /></div><h3 className="mt-12 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p><div className="mt-7 h-px bg-[#dce5e1]" /><p className="mt-4 text-xs font-medium text-[#008f7a]">Connected through the AI core</p></article>)}</div></div></section>

      <section className="bg-[#eaf4f1] px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#008f7a]">Action, not just information</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Understand what is happening. Know what to do next.</h2></div><div className="mt-14 grid gap-5 lg:grid-cols-3">{capabilities.map(({ kicker, title, copy, action, icon: Icon, tone }) => <article key={kicker} className={`flex min-h-[380px] flex-col rounded-3xl p-7 ${tone === 'navy' ? 'bg-[#071A2B] text-white' : 'bg-white'}`}><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone === 'gold' ? 'bg-[#f8edc6] text-[#a17d16]' : tone === 'navy' ? 'bg-white/10 text-[#55cfc0]' : 'bg-[#e4f6f2] text-[#008f7a]'}`}><Icon className="h-5 w-5" /></div><p className={`mt-8 text-xs font-bold uppercase tracking-[.16em] ${tone === 'navy' ? 'text-[#8bddd1]' : 'text-[#008f7a]'}`}>{kicker}</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.03em]">{title}</h3><p className={`mt-4 text-sm leading-6 ${tone === 'navy' ? 'text-slate-300' : 'text-slate-600'}`}>{copy}</p><button onClick={() => scrollTo('governance')} className={`mt-auto flex items-center gap-2 pt-8 text-sm font-semibold ${tone === 'navy' ? 'text-white' : 'text-[#071A2B]'}`}>{action}<ChevronRight className="h-4 w-4" /></button></article>)}</div></div></section>

      <section id="governance" className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-7xl gap-12 rounded-[2rem] bg-[#071A2B] p-8 text-white sm:p-12 lg:grid-cols-[1fr_.9fr] lg:p-16"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#8bddd1]">Responsible intelligence</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">AI that keeps people in the loop.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Health AI is designed to support—not replace—clinical judgment. Every AI-assisted insight is clearly labeled, reviewable and connected to its underlying evidence.</p><Button onClick={register} className="mt-9 h-12 rounded-full bg-[#00A88F] px-6 font-semibold text-[#071A2B] hover:bg-[#24bba5]">Build with Health AI <ArrowRight className="ml-2 h-4 w-4" /></Button></div><div className="grid content-center gap-4">{trustPoints.map((point, index) => <div key={point} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#00A88F]/15 text-[#62d5c6]">{index === 0 ? <BrainCircuit className="h-4 w-4" /> : index === 1 ? <UsersRound className="h-4 w-4" /> : index === 2 ? <LockKeyhole className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}</div><span className="text-sm font-medium">{point}</span></div>)}</div></div></section>

      <section className="px-5 py-24 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#008f7a]">Built for African realities</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Care should continue, even when connection does not.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Low bandwidth, shared devices and many languages are not edge cases. They are design inputs for every care journey.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-[#dce5e1] bg-white p-6"><WifiOff className="h-5 w-5 text-[#008f7a]" /><h3 className="mt-8 font-semibold">Offline-first workflows</h3><p className="mt-2 text-sm leading-6 text-slate-600">Records, screenings and referrals can wait safely to sync.</p></div><div className="rounded-2xl border border-[#dce5e1] bg-white p-6"><Languages className="h-5 w-5 text-[#008f7a]" /><h3 className="mt-8 font-semibold">Language-ready care</h3><p className="mt-2 text-sm leading-6 text-slate-600">Voice and text experiences that meet people where they are.</p></div><div className="rounded-2xl border border-[#dce5e1] bg-white p-6"><Smartphone className="h-5 w-5 text-[#008f7a]" /><h3 className="mt-8 font-semibold">Mobile by default</h3><p className="mt-2 text-sm leading-6 text-slate-600">Lightweight experiences for low-cost Android devices.</p></div><div className="rounded-2xl border border-[#dce5e1] bg-white p-6"><Signal className="h-5 w-5 text-[#008f7a]" /><h3 className="mt-8 font-semibold">SMS fallback</h3><p className="mt-2 text-sm leading-6 text-slate-600">Critical confirmations and alerts remain accessible.</p></div></div></div></section>

      <section className="border-t border-[#dce5e1] bg-white px-5 py-24 text-center sm:px-8 lg:px-12"><div className="mx-auto max-w-3xl"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4f6f2] text-[#008f7a]"><Building2 className="h-6 w-6" /></div><h2 className="mt-6 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Health infrastructure for the future of care.</h2><p className="mt-6 text-lg leading-8 text-slate-600">Join the people and organizations building a more connected, equitable health system across Africa.</p><div className="mt-9 flex flex-wrap justify-center gap-3"><Button size="lg" onClick={register} className="h-12 rounded-full bg-[#071A2B] px-6 font-semibold text-white hover:bg-[#12334a]">Get started <ArrowRight className="ml-2 h-4 w-4" /></Button><Button size="lg" variant="outline" onClick={() => router.push('/auth/sign-in')} className="h-12 rounded-full border-[#cbdad5] px-6">Sign in</Button></div><p className="mt-6 flex justify-center gap-2 text-xs text-slate-500"><CircleAlert className="h-3.5 w-3.5" /> AI guidance does not replace professional medical care.</p></div></section>
    </div>
  );
}
