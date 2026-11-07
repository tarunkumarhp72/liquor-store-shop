import React from 'react';
import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Store & Location | 3106 4th St NW Calgary | MH2 Liquor Store',
  description:
    'Visit MH2 Liquor Store at 3106 A 4 St NW, Calgary, AB. Open daily 10 AM to 2 AM. Call (403) 769-0061 for bottle inquiries, curbside pickup, or special allocations.',
  alternates: {
    canonical: 'https://www.mh2liquorstore.ca/contact',
  },
  openGraph: {
    title: 'Contact MH2 Liquor Store | 3106 4th St NW Calgary',
    description:
      'Visit MH2 Liquor Store at 3106 A 4 St NW, Calgary. Open daily 10 AM to 2 AM. Phone: (403) 769-0061.',
    url: 'https://www.mh2liquorstore.ca/contact',
  },
};

export default function ContactPage() {
  const googleMapUrl =
    process.env.NEXT_PROD_GOOGLE_MAPS_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
    'https://maps.app.goo.gl/3STi9P9FtXK4aUL28?g_st=aw';

  return <ContactClient googleMapUrl={googleMapUrl} />;
}
