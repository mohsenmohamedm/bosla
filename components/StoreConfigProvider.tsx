'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_PUBLIC_CONFIG, type PublicStoreConfig } from '@/lib/shipping';

const StoreConfigContext = createContext<PublicStoreConfig>(DEFAULT_PUBLIC_CONFIG);

/** بيوصّل إعدادات المتجر (الشحن والدفع) من الـ layout لكل الصفحات */
export function StoreConfigProvider({ value, children }: { value: PublicStoreConfig; children: ReactNode }) {
  return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>;
}

export const useStoreConfig = () => useContext(StoreConfigContext);
