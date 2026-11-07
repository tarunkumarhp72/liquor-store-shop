import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgeGateModal from '@/components/AgeGateModal';
import MobileBottomBar from '@/components/MobileBottomBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mh2liquorstore.ca'),
  title: {
    default: 'MH2 Liquor Store | Wine, Spirits & Craft Beer | Calgary NW',
    template: '%s | MH2 Liquor Store',
  },
  description:
    'Boutique liquor store offering curated wines, vintage champagnes, premium spirits, and cold craft beer in NW Calgary (3106 4th St NW). Open daily 10 AM to 2 AM. 15-min curbside pickup & Uber Eats delivery.',
  keywords: [
    'MH2 Liquor Store',
    'MH2 Wine & Spirits',
    'Liquor MH',
    'liquor store Calgary',
    'liquor store NW Calgary',
    'wine shop Calgary',
    'liquor store open late Calgary',
    'liquor open until 2am Calgary',
    'beer delivery Calgary',
    'craft beer Calgary',
    'whiskey shop Calgary',
    'bourbon Calgary',
    'tequila Calgary',
    'cold beer near me',
    'liquor store 4th street NW Calgary',
  ],
  authors: [{ name: 'MH2 Liquor Store' }],
  creator: 'MH2 Liquor Store',
  publisher: 'MH2 Liquor Store',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: 'https://www.mh2liquorstore.ca',
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://www.mh2liquorstore.ca',
    siteName: 'MH2 Liquor Store',
    title: 'MH2 Liquor Store | Wine, Spirits & Craft Beer | Calgary NW',
    description:
      'Premier bottle shop on 4th Street NW, Calgary. Open 10 AM to 2 AM every day with 15-minute curbside pickup & Uber Eats delivery.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'MH2 Liquor Store - Wine, Beer & Spirits Calgary',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MH2 Liquor Store | Wine, Spirits & Craft Beer Calgary',
    description:
      'Open daily 10 AM to 2 AM in NW Calgary. Curated wines, cold craft beers, and premium spirits.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/icon.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg?v=2', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#211C1C',
};

const storeSchema = {
  '@context': 'https://schema.org',
  '@type': ['LiquorStore', 'LocalBusiness', 'Store'],
  '@id': 'https://www.mh2liquorstore.ca/#store',
  name: 'MH2 Liquor Store',
  alternateName: ['MH2 Wine & Spirits', 'Liquor MH', 'MH2 Liquor Store Calgary'],
  url: 'https://www.mh2liquorstore.ca',
  logo: 'https://www.mh2liquorstore.ca/logo.png',
  image: 'https://www.mh2liquorstore.ca/logo.png',
  description:
    'Boutique bottle shop and wine cellar in NW Calgary offering fine wine allocations, imported whiskeys, agave spirits, chilled craft beer, and delivery open late 7 days a week until 2 AM.',
  telephone: '+14037690061',
  priceRange: '$$',
  currenciesAccepted: 'CAD',
  paymentAccepted: 'Cash, Credit Card, Debit Card, Apple Pay, Google Pay',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3106 A 4 St NW',
    addressLocality: 'Calgary',
    addressRegion: 'AB',
    postalCode: 'T2M 3A4',
    addressCountry: 'CA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.0805,
    longitude: -114.0685,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '10:00',
      closes: '02:00',
    },
  ],
  hasMap: 'https://maps.app.goo.gl/3STi9P9FtXK4aUL28?g_st=aw',
  sameAs: [
    'https://maps.app.goo.gl/3STi9P9FtXK4aUL28?g_st=aw',
    'https://www.ubereats.com/ca/store/mh2-liquor-store/FurwEWDqXG2txmJ3L1Kcig',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.6',
    reviewCount: '130',
    bestRating: '5',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/icon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Mulish:wght@400;500;600;700&display=swap" // unslop-ignore
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
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
