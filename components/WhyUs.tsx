import Reveal from './Reveal';
import type { WhyUsIconKey, WhyUsItem } from '@/lib/types';

interface WhyUsProps {
  items: WhyUsItem[];
}

/** أيقونات خطية رفيعة بلون ذهبي */
const icons: Record<WhyUsIconKey, React.ReactNode> = {
  shipping: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </>
  ),
  authentic: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  secure: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="16" r="1" />
    </>
  ),
};

/**
 * "لماذا بوصلة؟" — id="about" عشان لينك "من نحن" في الهيدر يوصله.
 */
export default function WhyUs({ items }: WhyUsProps) {
  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <Reveal className="mb-16 text-center">
        <p className="text-sm tracking-wide text-bosla-gold">من نحن</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-bosla-white md:text-4xl">
          لماذا بوصلة؟
        </h2>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.12}>
            <div className="group h-full rounded-3xl border border-bosla-silver/10 bg-bosla-charcoal/60 p-8 text-center transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-bosla-gold/50 hover:shadow-glow">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-bosla-gold/30 text-bosla-gold transition-colors duration-500 group-hover:bg-bosla-gold/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {icons[item.icon]}
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-bosla-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bosla-silver/70">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
