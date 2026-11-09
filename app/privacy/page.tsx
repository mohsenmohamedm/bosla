import PageShell from '@/components/PageShell';

export const metadata = { title: 'سياسة الخصوصية' };

export default function PrivacyPage() {
  return (
    <PageShell title="سياسة الخصوصية" subtitle={`آخر تحديث: نوفمبر 2026`}>
      <div className="flex flex-col gap-8 leading-relaxed text-bosla-silver/80">
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">البيانات اللي بنجمعها</h2>
          <p>
            بنجمع البيانات اللي بتدخلها في صفحة الطلب بس: الاسم، رقم الموبايل، المحافظة، والعنوان، وأي ملاحظات تكتبها. دي البيانات اللي محتاجينها عشان نوصّل طلبك.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">استخدام البيانات</h2>
          <p>
            بنستخدم بياناتك عشان نأكد الطلب ونتواصل معاك بخصوصه وعشان نوصّله. مش هنبيع بياناتك ولا هنشاركها مع أي طرف تالت لأغراض تسويقية.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">السلة والتخزين</h2>
          <p>
            محتويات سلتك بتتحفظ على جهازك بس (localStorage) عشان ماتضيعش لو قفلت الصفحة، ومش بتتبعت لأي سيرفر.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">التواصل</h2>
          <p>
            لأي استفسار عن بياناتك، اذكر ده في ملاحظات الطلب أو لما نتواصل معاك بعد تأكيد الأوردر.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
