/**
 * آراء العملاء.
 * TODO: بيانات حقيقية — ضيف تقييمات حقيقية هنا بس (اسم + نجوم + جملة).
 * لو المصفوفة فاضية، قسم الآراء مش بيتعرض خالص.
 * ممنوع تضيف تقييمات وهمية.
 */
export interface Review {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
}

export const reviews: Review[] = [];
