import Reveal from './Reveal';
import type { WhyUsIconKey, WhyUsItem } from '@/lib/types';

interface WhyUsProps {
  items: WhyUsItem[];
}

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
 * "لماذا بوصلة؟" — كروت بأيقونات خطية على خلفية تيل فاتحة.
 * id="about" عشان لينك "من نحن" في الهيدر يوصله.
 */
export default function WhyUs({ items }: WhyUsProps) {
  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 md:px-8 md:pb-24">
      <div className="rounded-[24px] bg-bosla-graphite p-5 md:rounded-[32px] md:p-12">
        <Reveal className="mb-6 md:mb-10">
          <p className="text-sm tracking-wide text-bosla-gold">من نحن</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-bosla-white md:mt-3 md:text-[34px]">لماذا بوصلة؟</h2>
        </Reveal>

        <div className="grid gap-3 md:grid-cols-3 md:gap-6">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <div className="flex h-full flex-col gap-3 rounded-2xl bg-bosla-charcoal p-5 shadow-sm md:p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bosla-graphite text-bosla-gold">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {icons[item.icon]}
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-bosla-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-bosla-silver">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
