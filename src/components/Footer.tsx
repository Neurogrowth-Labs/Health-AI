import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Separator orientation="vertical" className="h-4" />
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy & HIPAA
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">Support</span> v2.4.1
          </p>
        </div>
      </div>
    </footer>
  );
}
