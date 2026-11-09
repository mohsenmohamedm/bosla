import CategoryCard from './CategoryCard';
import Reveal from './Reveal';
import type { Category } from '@/lib/types';

interface CategoriesProps {
  categories: Category[];
}

/**
 * الأقسام: على الموبايل شرايح (chips) بتلف على سطور من غير سكرول أفقي،
 * وعلى الديسكتوب كروت بصورة. لو قسم واحد بس، بيتعرض كارت عريض في النص.
 */
export default function Categories({ categories }: CategoriesProps) {
  if (categories.length === 0) return null;

  const isSingle = categories.length === 1;

  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 md:px-8 md:py-24">
      <Reveal className="mb-6 md:mb-12">
        <p className="text-sm tracking-wide text-bosla-gold">تسوق حسب القسم</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-bosla-white md:mt-3 md:text-[34px]">أقسام بوصلة</h2>
      </Reveal>

      <div className="flex flex-wrap gap-2 md:hidden">
        <a href="#products" className="rounded-full bg-bosla-gold px-4 py-2 text-sm font-bold text-white">
          الكل
        </a>
        {categories.map((category) => (
          <a
            key={category.id}
            href={`/category/${category.slug}`}
            className="rounded-full border border-bosla-gold/20 bg-bosla-charcoal px-4 py-2 text-sm font-semibold text-bosla-white"
          >
            {category.name}
          </a>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className={`hidden gap-6 md:grid ${isSingle ? 'mx-auto max-w-3xl md:grid-cols-1' : 'md:grid-cols-3'}`}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} wide={isSingle} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
