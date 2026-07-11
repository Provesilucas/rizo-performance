'use client';

import * as React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './theme-provider';

/**
 * Agrupa os providers de cliente da aplicação num único ponto,
 * mantendo o `RootLayout` (Server Component) enxuto.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200} skipDelayDuration={300}>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
