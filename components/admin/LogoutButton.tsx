'use client';

import { useRouter } from 'next/navigation';

/** زرار تسجيل الخروج من الداشبورد */
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-bosla-silver/20 px-5 py-2 text-sm text-bosla-silver transition-colors duration-300 hover:border-bosla-gold hover:text-bosla-gold"
    >
      تسجيل الخروج
    </button>
  );
}
