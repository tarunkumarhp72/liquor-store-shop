// Single source of truth for store facts shown across the site.
// Change a value here and it updates everywhere (header, footer, home page).

const address = '3106 A 4 St NW, Calgary, AB T2M 3A4';

export const STORE = {
  name: 'MH2 Liquor Store',
  phone: '(403) 769-0061',
  phoneHref: 'tel:+14037690061',
  street: '3106 A 4 St NW',
  cityLine: 'Calgary, AB T2M 3A4',
  landmark: 'Next to Pad Thai, across from the cemetery. Parking right out front.',
  hoursLabel: 'Every day, 10 AM – 2 AM',
  openHour: 10,
  closeHour: 2,
  timeZone: 'America/Edmonton',
  // Ratings as shown on each platform. Update when they change.
  uberRating: { score: '4.6', count: '130+' },
  googleRating: { score: '4.0', count: '46+' },
  uberEatsUrl: process.env.NEXT_PROD_UBER_EATS_URL || process.env.NEXT_PUBLIC_UBER_EATS_URL || '#',
  googleMapsUrl: process.env.NEXT_PROD_GOOGLE_MAPS_URL || process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || '',
  directionsUrl:
    process.env.NEXT_PROD_GOOGLE_MAPS_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`MH2 Liquor Store ${address}`)}`,
};
