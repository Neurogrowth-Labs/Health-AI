'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Loader2, ShieldCheck, Upload } from 'lucide-react';

type Document = { id: string; title: string; category: string; doctorId: string | null; uploadDate: string; url: string };
type Doctor = { id: string; name: string };

function readFile(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }); }

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState('none');
  const [category, setCategory] = useState('MEDICAL_RECORD');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => { const [documentRes, appointmentRes, doctorRes] = await Promise.all([fetch('/api/documents'), fetch('/api/appointments'), fetch('/api/doctors')]); if (documentRes.ok) setDocuments((await documentRes.json()).documents ?? []); const appointments = appointmentRes.ok ? (await appointmentRes.json()).appointments ?? [] : []; const allDoctors = doctorRes.ok ? (await doctorRes.json()).doctors ?? [] : []; const ids = new Set(appointments.map((item: { doctorId: string }) => item.doctorId)); setDoctors(allDoctors.filter((doctor: Doctor) => ids.has(doctor.id))); setLoading(false); };
  useEffect(() => { load().catch(() => setLoading(false)); }, []);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMessage('Choose a file smaller than 2 MB.'); return; }
    setUploading(true); setMessage('');
    try { const url = await readFile(file); const response = await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: file.name, url, category, doctorId: doctorId === 'none' ? null : doctorId }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setDocuments((items) => [data.document, ...items]); setMessage(doctorId === 'none' ? 'Document saved to your health record.' : 'Document shared with your consulting doctor.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.'); } finally { setUploading(false); event.target.value = ''; }
  };

  return <div className="mx-auto max-w-5xl space-y-6 text-[#071A2B]"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#008f7a]">Health records</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em]">Your documents, in the right hands.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Upload a result, referral, or record and choose whether to share it with a doctor you are consulting.</p></div><Card className="health-card border-[#d9e8e4]"><CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-[#008f7a]" /> Upload a health document</CardTitle><CardDescription>PDF, image, or document file up to 2 MB. You control who can see it.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MEDICAL_RECORD">Medical record</SelectItem><SelectItem value="LAB_RESULT">Lab result</SelectItem><SelectItem value="PRESCRIPTION">Prescription</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent></Select><Select value={doctorId} onValueChange={setDoctorId}><SelectTrigger><SelectValue placeholder="Share with doctor" /></SelectTrigger><SelectContent><SelectItem value="none">Keep private to my record</SelectItem>{doctors.map((doctor) => <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>)}</SelectContent></Select><label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-[#071A2B] px-4 text-sm font-medium text-white hover:bg-[#163B4D]"><input type="file" className="sr-only" onChange={upload} disabled={uploading} accept=".pdf,image/*,.doc,.docx" />{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Choose file'}</label>{message && <p role="status" className="sm:col-span-3 text-sm text-slate-600">{message}</p>}</CardContent></Card><Card className="border-[#d9e8e4]"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-[#008f7a]" /> Documents</CardTitle></CardHeader><CardContent>{loading ? <div className="health-skeleton h-28 rounded-2xl" /> : documents.length === 0 ? <div className="rounded-2xl border border-dashed border-[#cfe0db] bg-[#f8fbfa] px-5 py-12 text-center"><ShieldCheck className="mx-auto h-7 w-7 text-[#008f7a]" /><p className="mt-3 font-medium">No documents yet</p><p className="mt-1 text-sm text-slate-500">When you upload a document, it will appear here and can be shared with your consulting doctor.</p></div> : <div className="divide-y divide-[#e5eaea]">{documents.map((document) => <div key={document.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium">{document.title}</p><p className="mt-1 text-xs text-slate-500">{document.category.replaceAll('_', ' ').toLowerCase()} · {document.doctorId ? 'Shared with consulting doctor' : 'Private to your record'}</p></div><a href={document.url} target="_blank" rel="noreferrer"><Button variant="outline" size="sm">Open</Button></a></div>)}</div>}</CardContent></Card></div>;
}
