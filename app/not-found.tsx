import Link from 'next/link';
import PageShell from '@/components/PageShell';

export default function NotFound() {
  return (
    <PageShell title="الصفحة مش موجودة" subtitle="الرابط ده مش موجود أو اتنقل لمكان تاني.">
      <div className="text-center">
        <Link
          href="/"
          className="inline-block rounded-full bg-gradient-to-l from-bosla-gold to-bosla-gold-deep px-8 py-3.5 text-sm font-medium text-bosla-black transition-all duration-500 ease-smooth hover:-translate-y-0.5 hover:shadow-glow"
        >
          الرجوع للرئيسية
        </Link>
      </div>
    </PageShell>
  );
}
