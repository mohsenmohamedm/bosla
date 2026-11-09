import PageShell from '@/components/PageShell';

export const metadata = { title: 'الاسترجاع والاستبدال' };

export default function ReturnsPage() {
  return (
    <PageShell title="الاسترجاع والاستبدال" subtitle="عشان تطمّن على طلبك قبل ما تستلمه.">
      <div className="flex flex-col gap-8 leading-relaxed text-bosla-silver/80">
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">مدة الاسترجاع</h2>
          <p>
            تقدر تطلب استرجاع أو استبدال المنتج خلال 14 يوم من تاريخ الاستلام، بشرط إن المنتج يكون في حالته الأصلية وبالتغليف الأصلي.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">المنتجات اللي مابترجعش</h2>
          <p>
            المنتجات اللي اتركّبت أو اتستخدمت، أو اتقطع عنها الغلاف الأصلي لأسباب صحية أو أمنية، مابتقبلش استرجاع إلا لو فيها عيب مصنعي.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">طريقة الطلب</h2>
          <p>
            بعد تأكيد الأوردر هنتواصل معاك على رقم الموبايل اللي سجلته، وقتها ابعتلنا رقم الطلب والمنتج وسبب الاسترجاع، وهنرد عليك بالخطوات الجاية.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-bosla-white">تكلفة الشحن</h2>
          <p>
            لو المنتج فيه عيب أو غلط في الطلب، بنتحمل تكلفة الشحن للإرجاع. غير كده، تكلفة إرجاع الشحن على العميل.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
