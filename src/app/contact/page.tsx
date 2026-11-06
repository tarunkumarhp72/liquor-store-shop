'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, ExternalLink, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const googleMapUrl = process.env.NEXT_PROD_GOOGLE_MAPS_URL || process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.app.goo.gl/3STi9P9FtXK4aUL28?g_st=aw';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="border-b border-cellar-border pb-6">
        <div className="text-xs font-bold tracking-widest uppercase text-gold-700 mb-1">
          Store Information & Inquiries
        </div>
        <h1 className="disp text-3xl sm:text-5xl font-bold text-cellar-charcoal">
          Visit Us or Get in Touch
        </h1>
        <p className="text-sm text-cellar-muted mt-2 max-w-xl">
          Have questions about a rare vintage, event catering, or in-store inventory? Reach out directly or drop by during store hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Map Link */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-cellar-border p-6 sm:p-8 rounded-sm shadow-xs space-y-5">
            <h2 className="disp text-2xl font-bold text-cellar-charcoal border-b border-cellar-border pb-3">
              Store Details
            </h2>

            <div className="space-y-4 text-sm text-cellar-muted">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-wine-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-cellar-charcoal">Address</div>
                  <div>3106 A 4 St NW</div>
                  <div>Calgary, AB T2M 3A4, Canada</div>
                  <div className="text-xs text-gold-700 mt-1 font-medium">Beside Pad Thai, across from cemetery</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-wine-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-cellar-charcoal">Phone</div>
                  <a href="tel:+14037690061" className="hover:text-wine-700 font-semibold transition">
                    +1 (403) 769-0061
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-wine-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-cellar-charcoal">Operating Hours</div>
                  <div className="text-emerald-800 font-semibold">10:00 AM – 2:00 AM Daily</div>
                  <div className="text-xs text-cellar-muted mt-0.5">Open all 7 days, including all holidays</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-cellar-border">
              <a
                href={googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-cellar-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-wider text-center rounded-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4 text-gold-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white border border-cellar-border p-6 sm:p-8 rounded-sm shadow-xs">
          <h2 className="disp text-2xl font-bold text-cellar-charcoal mb-4">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-sm">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="disp text-2xl font-bold text-emerald-950">Message Sent Successfully</h3>
              <p className="text-sm text-emerald-800">
                Thank you for contacting MH2 Liquor Store. Our staff will respond to your inquiry shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-emerald-800 text-white text-xs font-bold rounded-sm uppercase tracking-wider"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-cellar-charcoal mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-cellar-charcoal mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Special Order Request, Event Catering"
                  className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-cellar-charcoal mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our wine and beverage selection?"
                  className="w-full p-2.5 bg-cellar-cream border border-cellar-border rounded-sm focus:border-gold-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-wine-700 hover:bg-wine-800 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition shadow-md"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

