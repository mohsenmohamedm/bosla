import PageShell from '@/components/PageShell';
import { STORE, formatPrice } from '@/lib/store';

export const metadata = { title: 'الشروط والأحكام' };

export default function TermsPage() {
  return (
    <PageShell title="الشروط والأحكام" subtitle="بتصفحك للموقع وطلبك منه يعني إنك وافقت على الشروط دي.">
      <div className="flex flex-col gap-8 leading-relaxed text-bosla-silver/80">
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">الطلب والدفع</h2>
          <p>
            الدفع بيكون عند الاستلام ({STORE.paymentMethod}). الطلب بيتأكد بعد ما نتواصل معاك على رقم الموبايل اللي كتبته.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">الشحن</h2>
          <p>
            الشحن موحد لكل المحافظات بمبلغ {formatPrice(STORE.shippingFee)} للطلب الواحد. مدة التوصيل بتختلف حسب المحافظة وبنتواصل معاك بالموعد.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">الأسعار والتوفر</h2>
          <p>
            الأسعار بالجنيه المصري وشاملة ضريبة القيمة المضافة لو مطبقة. بنحتفظ بحق تعديل الأسعار أو وقف بيع أي منتج دون إشعار مسبق، والطلبات المؤكدة بتتنفذ بالسعر وقت التأكيد.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">الاسترجاع</h2>
          <p>
            شروط الاسترجاع والاستبدال موضحة في صفحة الاسترجاع والاستبدال.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">التواصل</h2>
          <p>
            واتساب {STORE.whatsappDisplay} أو الإيميل {STORE.email}.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
