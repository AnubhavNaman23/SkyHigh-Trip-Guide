import Link from 'next/link';
import { Plane, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f0f6ff] border-t border-border pt-14 pb-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                SkyHigh
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plan smarter. Travel better. Your AI-powered travel companion for personalized itineraries and seamless booking.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/ai-trip" className="hover:text-primary transition-colors flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />AI Trip Planner</Link></li>
              <li><Link href="/search/flights" className="hover:text-primary transition-colors">Flights</Link></li>
              <li><Link href="/search/hotels" className="hover:text-primary transition-colors">Hotels</Link></li>
              <li><Link href="/search/trains" className="hover:text-primary transition-colors">Trains</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About SkyHigh</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>support@skyhigh.travel</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+91 1800-SKY-HIGH</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} SkyHigh Travel, Inc. All rights reserved.</span>
          <div className="flex items-center gap-1 text-xs">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for explorers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
