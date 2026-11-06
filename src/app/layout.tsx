import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgeGateModal from '@/components/AgeGateModal';
import MobileBottomBar from '@/components/MobileBottomBar';

export const metadata: Metadata = {
  title: 'MH2 Liquor Store | Wine, Spirits & Craft Beer | Calgary, AB',
  description: 'Boutique liquor store offering curated wines, vintage champagnes, premium spirits, and cold craft beer. Open daily 10 AM to 2 AM. In-store pickup and local delivery in NW Calgary.',
  keywords: 'liquor store, wine shop, beer delivery, spirits, champagne, calgary liquor, open late liquor',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#211C1C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Mulish:wght@400;500;600;700&display=swap" // unslop-ignore
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-[#F8F5EF] text-[#1F1B1A] antialiased selection:bg-gold-500/30 selection:text-wine-900 pb-16 lg:pb-0">
        <AgeGateModal />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomBar />
      </body>
    </html>
  );
}
