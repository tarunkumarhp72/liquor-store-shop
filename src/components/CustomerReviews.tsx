import React from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { STORE } from '@/lib/store';

interface Review {
  author: string;
  source: 'Google' | 'Uber Eats';
  text: string;
}

// IMPORTANT: replace these with real reviews, copied word for word from your
// Google Business Profile / Uber Eats page. Keep the reviewer's name as shown there.
const reviews: Review[] = [
  {
    author: 'Zachary Wall',
    source: 'Google',
    text: 'Great selection of cold beers, coolers, and high-end spirits. Friendly staff always ready to help and recommend excellent wines!',
  },
  {
    author: 'Adrian Cornish',
    source: 'Google',
    text: 'Fast 15-minute pickup, free parking right in front of the door, and wide variety of tequila and chilled beer. Best liquor store in the neighborhood.',
  },
  {
    author: 'Sean O’Connor',
    source: 'Uber Eats',
    text: 'Lightning fast Uber Eats delivery. Cold beers arrived ice-cold and bottles were packed securely with care.',
  },
];

export default function CustomerReviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-xl font-bold text-cellar-charcoal sm:text-2xl">What customers say</h2>
        <p className="text-sm text-cellar-muted">
          {STORE.uberRating.score} on Uber Eats ({STORE.uberRating.count} ratings) · {STORE.googleRating.score} on Google ({STORE.googleRating.count} reviews)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 sm:gap-4">
        {reviews.map((r) => (
          <figure key={r.author} className="flex flex-col justify-between rounded-sm border border-cellar-border bg-white p-5">
            <blockquote className="text-sm leading-relaxed text-cellar-charcoal">&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center justify-between text-xs text-cellar-muted">
              <span className="font-semibold text-cellar-charcoal">{r.author}</span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-gold-500 text-gold-500" aria-hidden="true" />
                {r.source}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {STORE.googleMapsUrl && (
        <a
          href={STORE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-wine-700 hover:text-wine-800"
        >
          Read all reviews on Google <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
