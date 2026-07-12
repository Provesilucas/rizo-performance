import type { Metadata, Viewport } from 'next';
import { Lexend, Unbounded } from 'next/font/google';

import { AppProviders } from '@/components/providers/app-providers';
import { cn } from '@/lib/utils';
import './globals.css';

// Lexend — família de apoio da marca, usada no corpo/UI (legibilidade).
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Unbounded — fonte principal/display da marca (logo e títulos de marca).
const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
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
    { media: '(prefers-color-scheme: light)', color: '#faf6f9' },
    { media: '(prefers-color-scheme: dark)', color: '#171319' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(lexend.variable, unbounded.variable, 'font-sans')}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
