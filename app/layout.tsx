import type { Metadata } from 'next';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';

export const metadata: Metadata = {
  title: 'EasyMeds - Genuine Online Medicine & Healthcare Store',
  description:
    'Discover genuine medicines, vitamins, healthcare monitors, and daily wellness essentials. Fast, reliable delivery across India with licensed pharmacist verification.',
  keywords: [
    'online medicine India',
    'buy medicines online',
    'prescription pharmacy',
    'OTC healthcare products',
    'EasyMeds',
    'vitamins supplements',
    'medical devices',
  ],
  authors: [{ name: 'EasyMeds Pharmacy' }],
  openGraph: {
    title: 'EasyMeds - Modern Healthcare E-Commerce',
    description: 'Safe, genuine, and transparent online pharmacy platform.',
    siteName: 'EasyMeds',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface-muted text-text-main">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
