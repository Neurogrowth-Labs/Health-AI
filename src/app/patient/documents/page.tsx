'use client';

import { PatientAiModuleSection } from '@/components/patient/patient-ai-module-section';
import { PatientCrossAiLayer } from '@/components/patient/patient-health-command-center';
import { patientDocumentTools } from '@/lib/patient-ai-capabilities';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, FolderOpen } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="space-y-8 text-[#0A2540]">
      <PatientAiModuleSection
        eyebrow="Documents"
        title="Intelligent Health Records"
        description="Uploads pass through OCR, categorization, plain-language simplification, and timeline building — so your story stays coherent."
        tools={patientDocumentTools}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Your files</h2>
        <Button className="gap-2 bg-sky-600 hover:bg-sky-600/90">
          <Upload className="h-4 w-4" />
          Upload document
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-teal-600" />
              Medical records
            </CardTitle>
            <CardDescription>History and clinical summaries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No records uploaded yet.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-sky-600" />
              Prescriptions
            </CardTitle>
            <CardDescription>Prescription documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No prescriptions uploaded yet.</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-emerald-600" />
              Lab results
            </CardTitle>
            <CardDescription>Laboratory reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No lab results uploaded yet.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/90 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-teal-600" />
            All documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No documents uploaded yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload medical files to trigger analyzers and timeline updates.
            </p>
          </div>
        </CardContent>
      </Card>

      <PatientCrossAiLayer />
    </div>
  );
}
