import React from 'react';
import Link from 'next/link';
import { Wine, MapPin, Phone, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const googleMapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.app.goo.gl/3STi9P9FtXK4aUL28?g_st=aw';

  return (
    <footer className="bg-cellar-charcoal text-[#D9D2C6] border-t border-white/10 mt-20">
      {/* Legal & Age Compliance Notice Bar */}
      <div className="bg-[#1A1616] border-b border-white/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 text-xs text-[#B8ADA1] leading-relaxed">
          <div className="flex-shrink-0 flex items-center gap-2 text-gold-400 font-bold uppercase tracking-wider text-[11px] border border-gold-600/30 px-3 py-1.5 rounded-sm">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            18+ Compliance Notice
          </div>
          <p className="flex-1 text-center md:text-left">
            <strong>GOVERNMENT WARNING:</strong> (1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems. Valid government photo ID verifying age (18+) is required at delivery and in-store pickup.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo size={48} />
              <span className="disp text-2xl text-white font-bold">MH2 Liquor Store</span>
            </div>
            <p className="text-sm text-[#A89E92] leading-relaxed mb-4">
              The premier neighbourhood bottle shop and wine cellar. Curated allocations, imported spirits, craft brews, and everyday essentials open late 7 days a week.
            </p>
            <div className="text-xs text-gold-400/90 font-medium">
              Rated 4.6 on Uber Eats (130+ Customer Reviews)
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="disp text-lg text-white font-semibold mb-4 tracking-wide border-b border-white/10 pb-2">
              Browse Cellar
            </h4>
            <ul className="space-y-2 text-sm text-[#CFC7B8]">
              <li><Link href="/shop?category=wine" className="hover:text-gold-400 transition">Fine Wines & Rosé</Link></li>
              <li><Link href="/shop?category=champagne" className="hover:text-gold-400 transition">Champagne & Sparkling</Link></li>
              <li><Link href="/shop?category=whiskey" className="hover:text-gold-400 transition">Whiskies & Bourbon</Link></li>
              <li><Link href="/shop?category=tequila" className="hover:text-gold-400 transition">Tequila & Agave Spirits</Link></li>
              <li><Link href="/shop?category=vodka" className="hover:text-gold-400 transition">Vodka & Gins</Link></li>
              <li><Link href="/shop?category=beer" className="hover:text-gold-400 transition">Domestic & Craft Beer</Link></li>
            </ul>
          </div>

          {/* Col 3: Hours & Operations */}
          <div>
            <h4 className="disp text-lg text-white font-semibold mb-4 tracking-wide border-b border-white/10 pb-2">
              Hours of Operation
            </h4>
            <div className="space-y-3 text-sm text-[#CFC7B8]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Daily: 10:00 AM – 2:00 AM</div>
                  <div className="text-xs text-[#8E8478] mt-0.5">Open late 365 days a year</div>
                </div>
              </div>
              <div className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-sm">
                Open regular hours (10 AM – 2 AM) on Christmas Eve, Christmas Day, and New Year's Eve.
              </div>
            </div>
          </div>

          {/* Col 4: Store Location & Contact */}
          <div>
            <h4 className="disp text-lg text-white font-semibold mb-4 tracking-wide border-b border-white/10 pb-2">
              Visit Store
            </h4>
            <div className="space-y-3 text-sm text-[#CFC7B8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div>3106 A 4 St NW</div>
                  <div>Calgary, AB T2M 3A4</div>
                  <div className="text-xs text-[#8E8478] mt-0.5">Beside Pad Thai, parking right at store</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <a href="tel:+14037690061" className="hover:text-white font-semibold transition">
                  +1 (403) 769-0061
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 border border-gold-500/40 px-3 py-2 rounded-sm transition"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8478]">
          <div>
            &copy; {new Date().getFullYear()} MH2 Wine & Spirits. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition">About Store</Link>
            <Link href="/delivery" className="hover:text-white transition">Delivery Policy</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/admin/login" className="hover:text-gold-400 transition text-[11px] font-mono">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

