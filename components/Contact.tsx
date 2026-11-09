import { STORE } from '@/lib/store';

/**
 * قسم التواصل (id="contact"): زرار واتساب كبير، والإيميل، وزرار واتساب عائم على الموبايل.
 */
export default function Contact() {
  const waHref = `https://wa.me/${STORE.whatsappNumber}`;

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 md:px-8 md:pb-24">
      <div className="flex flex-col items-start gap-5 rounded-[24px] bg-bosla-gold-deep p-6 text-bosla-black md:flex-row md:items-center md:justify-between md:gap-8 md:rounded-[32px] md:p-12">
        <div>
          <p className="text-sm tracking-wide text-bosla-sun">تواصل معانا</p>
          <h2 className="mt-2 font-display text-2xl font-bold md:text-[34px]">محتاج مساعدة؟</h2>
          <p className="mt-2 text-sm text-[#E3F1F0] md:text-base">
            ابعتلنا على واتساب أو الإيميل، وهنرد عليك في أقرب وقت.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:min-w-[18rem]">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center rounded-xl bg-[#25D366] text-base font-bold text-[#06302E] transition-transform duration-200 hover:-translate-y-0.5"
          >
            واتساب: {STORE.whatsappDisplay}
          </a>
          <a
            href={`mailto:${STORE.email}`}
            className="flex h-12 items-center justify-center rounded-xl border-2 border-bosla-sun text-sm font-bold text-bosla-sun transition-colors duration-200 hover:bg-bosla-sun hover:text-bosla-gold-deep"
          >
            {STORE.email}
          </a>
        </div>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل على واتساب"
        className="fixed bottom-4 start-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#06302E] shadow-md md:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
      </a>
    </section>
  );
}
