'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Utensils,
  Search,
  X
} from 'lucide-react';

interface DestinationGuide {
  id: string;
  name: string;
  country: string;
  category: 'coastal' | 'culture' | 'mountains' | 'food' | 'urban' | 'adventure';
  tagline: string;
  image: string;
  bestSeason: string;
  recommendedDays: string;
  avgBudget: string;
  attractions: string[];
  signatureFood: string[];
  vibe: string;
}

const curatedDestinations: DestinationGuide[] = [
  {
    id: 'amalfi-coast',
    name: 'Amalfi Coast',
    country: 'Italy',
    category: 'coastal',
    tagline: 'Dramatic cliffs, pastel villages & azure Mediterranean waters.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=85&w=1200',
    bestSeason: 'May – Sep',
    recommendedDays: '5–7 Days',
    avgBudget: '₹18,000 / day',
    attractions: ['Positano Cliffs', 'Villa Cimbrone Gardens', 'Capri Day Boat', 'Path of the Gods'],
    signatureFood: ['Limoncello Sorbet', 'Fresh Spaghetti alle Vongole', 'Caprese Salad'],
    vibe: 'Romantic & Scenic'
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    category: 'culture',
    tagline: 'Centuries of tranquil temples, bamboo groves & tea traditions.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=85&w=1200',
    bestSeason: 'Mar – May & Oct – Nov',
    recommendedDays: '4–6 Days',
    avgBudget: '₹14,000 / day',
    attractions: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Forest', 'Kinkaku-ji Golden Pavilion', 'Gion Historic District'],
    signatureFood: ['Kaiseki Multi-course', 'Matcha Parfait', 'Yudofu Tofu Hotpot'],
    vibe: 'Zen & Historic'
  },
  {
    id: 'swiss-alps',
    name: 'Interlaken & Swiss Alps',
    country: 'Switzerland',
    category: 'mountains',
    tagline: 'Glacial lakes, snow-capped peaks & fairytale alpine pastures.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=85&w=1200',
    bestSeason: 'Jun – Sep (Hike) / Dec – Mar (Ski)',
    recommendedDays: '5–8 Days',
    avgBudget: '₹22,000 / day',
    attractions: ['Jungfraujoch Top of Europe', 'Lake Brienz Cruise', 'Lauterbrunnen 72 Waterfalls', 'First Cliff Walk'],
    signatureFood: ['Cheese Fondue', 'Swiss Rösti', 'Artisan Alpine Chocolate'],
    vibe: 'Majestic Alpine'
  },
  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    category: 'coastal',
    tagline: 'Golden beaches, Portuguese architecture & sunset shack vibes.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=85&w=1200',
    bestSeason: 'Nov – Mar',
    recommendedDays: '4–5 Days',
    avgBudget: '₹6,000 / day',
    attractions: ['Palolem & Morjim Beaches', 'Fontainhas Latin Quarter', 'Dudhsagar Waterfalls', 'Old Goa Cathedrals'],
    signatureFood: ['Goan Fish Curry Rice', 'Pork Vindaloo', 'Bebinca Layered Dessert'],
    vibe: 'Relaxed & Beachy'
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    category: 'adventure',
    tagline: 'Terraced rice fields, spiritual temples & cliffside surf spots.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1200',
    bestSeason: 'Apr – Oct',
    recommendedDays: '7–10 Days',
    avgBudget: '₹8,500 / day',
    attractions: ['Uluwatu Sunset Temple', 'Tegallalang Rice Terraces', 'Nusa Penida Day Trip', 'Seminyak Beach Clubs'],
    signatureFood: ['Nasi Goreng', 'Babi Guling', 'Fresh Young Coconut'],
    vibe: 'Tropical & Vibrant'
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    category: 'culture',
    tagline: 'The Pink City: royal forts, palace courtyards & gemstone bazaars.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=85&w=1200',
    bestSeason: 'Oct – Mar',
    recommendedDays: '3–4 Days',
    avgBudget: '₹7,000 / day',
    attractions: ['Amber Palace Fort', 'Hawa Mahal Palace of Winds', 'City Palace & Jantar Mantar', 'Nahargarh Sunset Point'],
    signatureFood: ['Dal Baati Churma', 'Laal Maas', 'Ghewar Sweet'],
    vibe: 'Regal & Heritage'
  }
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = useMemo(() => {
    return curatedDestinations.filter((dest) => {
      const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8faff] pb-24">
      
      {/* ── HERO BANNER (Light Background) ── */}
      <div className="relative bg-gradient-to-b from-sky-50 via-blue-50/40 to-[#f8faff] border-b border-slate-200/80 pt-12 pb-20 px-4 overflow-hidden">
        {/* Subtle sunlit background overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-8 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-[#f8faff]" />

        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-100/70 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-blue-200/60 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Curated Destination Discovery</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4"
          >
            Where will your next journey take you?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed"
          >
            Browse handpicked world destinations, signature culinary guides, and curated experiences. When inspiration strikes, plan your custom itinerary in one tap.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search cities, countries, or vibes (e.g. Italy, Bali, Heritage)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container-custom px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Category Filter Pills */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs mb-10 overflow-x-auto no-scrollbar flex items-center gap-2">
          {[
            { id: 'all', label: 'All Destinations' },
            { id: 'coastal', label: '🏖️ Coastal & Islands' },
            { id: 'culture', label: '🏛️ Heritage & Culture' },
            { id: 'mountains', label: '🏔️ Mountain Escapes' },
            { id: 'adventure', label: '🏄 Adventure & Nature' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Cover Image & Tags */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {dest.vibe}
                </span>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-sky-200 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="text-2xl font-bold leading-snug drop-shadow-md">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {dest.tagline}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 text-slate-600 mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Best Time</span>
                      <span className="font-medium text-slate-800">{dest.bestSeason}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                      <span className="font-medium text-slate-800">{dest.recommendedDays}</span>
                    </div>
                  </div>

                  {/* Top Attractions Preview */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Must-See Attractions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.attractions.slice(0, 3).map((att, i) => (
                        <span key={i} className="text-xs bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg">
                          {att}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Signature Food */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Utensils className="w-3 h-3 text-orange-500" />
                      Culinary Highlights
                    </span>
                    <p className="text-xs text-slate-600 italic">
                      {dest.signatureFood.join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Avg</span>
                    <span className="text-sm font-bold text-slate-900">{dest.avgBudget}</span>
                  </div>

                  <Link
                    href={`/ai-trip?destination=${encodeURIComponent(dest.name)}`}
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plan Trip Here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Travel Tips Callout Banner */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Have a unique destination in mind?
              </h3>
              <p className="text-sm text-slate-600 max-w-xl">
                Our Gemini AI itinerary generator can craft personalized, day-by-day travel schedules for any city, village, or island worldwide.
              </p>
            </div>
          </div>

          <Link
            href="/ai-trip"
            className="btn-primary text-sm px-6 py-3 whitespace-nowrap shrink-0"
          >
            Create Custom Trip
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
