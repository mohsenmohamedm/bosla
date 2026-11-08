import CategoryCard from './CategoryCard';
import Reveal from './Reveal';
import type { Category } from '@/lib/types';

interface CategoriesProps {
  categories: Category[];
}

/**
 * شبكة الأقسام.
 * - CSS Grid بـ auto-fit وminmax: تستوعب من 1 لـ 6+ كروت بسلاسة من غير تعديل.
 * - لو فيه قسم واحد بس، بيتعرض كارت عريض في النص بدل ما يبان ناقص.
 * - مفيش كروت "قريباً" فاضية.
 */
export default function Categories({ categories }: CategoriesProps) {
  if (categories.length === 0) return null;

  const isSingle = categories.length === 1;

  return (
    <section
      id="categories"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32"
    >
      <Reveal className="mb-14 text-center">
        <p className="text-sm tracking-wide text-bosla-gold">تسوق حسب القسم</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-bosla-white md:text-4xl">
          أقسام بوصلة
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 md:gap-8 ${
            isSingle ? 'mx-auto max-w-4xl' : ''
          }`}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} wide={isSingle} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
