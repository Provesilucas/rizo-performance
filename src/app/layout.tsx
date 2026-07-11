import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { AppProviders } from '@/components/providers/app-providers';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RIZO Performance',
    template: '%s · RIZO Performance',
  },
  description:
    'Plataforma executiva de gestão e performance da agência RIZO — comercial, financeiro e influenciadores em um só lugar.',
  applicationName: 'RIZO Performance',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1420' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.variable, 'font-sans')}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
