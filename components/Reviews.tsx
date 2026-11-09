import Reveal from './Reveal';
import { reviews } from '@/lib/reviews';

/** آراء العملاء: بتتعرض بس لما يكون فيه تقييمات حقيقية في lib/reviews.ts */
export default function Reviews() {
  if (reviews.length === 0) return null;

  return (
    <section aria-label="آراء العملاء" className="mx-auto max-w-7xl px-4 pb-12 md:px-8 md:pb-24">
      <Reveal className="mb-6 md:mb-10">
        <p className="text-sm tracking-wide text-bosla-gold">آراء العملاء</p>
      </Reveal>
      <div className="grid gap-3 md:grid-cols-3 md:gap-6">
        {reviews.map((review) => (
          <figure key={review.name} className="rounded-2xl border border-bosla-gold/10 bg-bosla-charcoal p-5 shadow-sm md:p-6">
            <p className="text-sm text-bosla-gold" aria-label={`${review.rating} من 5 نجوم`}>
              {'★'.repeat(review.rating)}
              <span className="text-bosla-silver/40">{'★'.repeat(5 - review.rating)}</span>
            </p>
            <blockquote className="mt-3 text-sm leading-relaxed text-bosla-white">{review.text}</blockquote>
            <figcaption className="mt-4 text-xs font-bold text-bosla-silver">{review.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
