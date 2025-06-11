'use client';

import { GiftBuilderProvider } from '@/context/GiftBuilderContext';
import ClientProvider from './ClientProvider';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GiftBuilderProvider>
      <ClientProvider>
        {children}
      </ClientProvider>
    </GiftBuilderProvider>
  );
} 