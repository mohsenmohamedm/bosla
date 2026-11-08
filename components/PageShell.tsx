import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/** غلاف موحد للصفحات الداخلية (السلة، الطلب، الصفحات القانونية) */
export default function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-36 md:px-8">
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl font-semibold text-bosla-white md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-sm leading-relaxed text-bosla-silver/70 md:text-base">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </main>
  );
}
