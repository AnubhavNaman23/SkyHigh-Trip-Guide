'use client';

import SearchWidget from "@/components/SearchWidget";
import { Star, Plane, ArrowRight, Sparkles, MapPin, Shield, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { TravelItem } from "@/types";
import { useEffect, useRef } from "react";

interface HomeContentProps {
  hotels: TravelItem[];
  flights: TravelItem[];
}

const featureCards = [
  {
    icon: Sparkles,
    title: "AI-Powered Itineraries",
    description: "Get a full day-by-day travel plan crafted by Gemini AI based on your preferences, budget, and travel style.",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: MapPin,
    title: "Curated Destinations",
    description: "Browse hand-picked hotels, top-rated flights, and hidden gems — all in one place.",
    color: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Shield,
    title: "Secure & Personalized",
    description: "All your trips and bookings are safely stored in your personal account, accessible anytime.",
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Clock,
    title: "Plan in Minutes",
    description: "Skip hours of research. Enter your destination and let SkyHigh build your perfect trip instantly.",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

const howItWorks = [
  { step: "01", title: "Tell us where you're going", desc: "Enter your destination, travel dates, and number of travelers." },
  { step: "02", title: "Choose your preferences", desc: "Select your budget, travel style, and interests — beach, culture, adventure, and more." },
  { step: "03", title: "AI generates your itinerary", desc: "Our AI instantly creates a personalized day-by-day plan with activities, restaurants, and logistics." },
  { step: "04", title: "Customize & explore", desc: "Edit any part of your plan, save it, and enjoy your perfectly planned trip." },
];

export default function HomeContent({ hotels, flights }: HomeContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const flightsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadGsap = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".hotel-card");
        gsap.fromTo(cards, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 85%" }
        });
      }
      if (flightsRef.current) {
        const cards = flightsRef.current.querySelectorAll(".flight-card");
        gsap.fromTo(cards, { x: -40, opacity: 0 }, {
          x: 0, opacity: 1, stagger: 0.12, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: flightsRef.current, start: "top 80%" }
        });
      }
    };
    loadGsap();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">

      {/* ── HERO ── */}
      <motion.div
        ref={heroRef}
        className="relative min-h-[680px] md:min-h-[720px] flex items-center overflow-hidden bg-gradient-to-b from-white via-sky-50/30 to-[#f8faff]"
      >
        {/* Background photo with light airy overlay */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=85&w=2400"
            alt="Beautiful sunlit travel destination"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Light airy overlays for crisp readability and sunlit glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#f8faff]" />
        </motion.div>

        {/* Floating decorative ambient light blobs */}
        <motion.div
          animate={{ y: [-12, 12, -12], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-[10%] w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"
        />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-20"
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-7"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-50/90 text-blue-700 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-blue-200/80 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>AI-Powered Travel Planning</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight"
            >
              Plan Smarter.
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 mt-1"
              >
                Travel Better.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed font-normal"
            >
              SkyHigh uses Gemini AI to craft personalized day-by-day itineraries, recommend the best stays, and discover hidden gems — all tailored to you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/ai-trip" className="btn-primary text-base px-7 py-3 group shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
                Plan My Trip
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/explore" className="btn-secondary text-base px-7 py-3 border border-slate-200 hover:border-primary/40 shadow-xs">
                Explore Destinations
              </Link>
            </motion.div>

            {/* Trust signal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex items-center gap-4 text-sm text-slate-500"
            >
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&h=64"
                ].map((img, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm relative z-10 hover:z-20 transition-transform hover:scale-110 cursor-pointer">
                    <Image src={img} alt={`User ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm relative z-0">
                  +10k
                </div>
              </div>
              <span className="font-medium">Trusted by thousands of explorers worldwide</span>
            </motion.div>
          </motion.div>

          {/* Right — floating UI card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[420px]">
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-72 bg-white/95 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-slate-200/80"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">AI Itinerary Ready!</p>
                    <p className="text-xs text-gray-500">Goa · 5 days · ₹45,000</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {["Day 1: Calangute & Baga Beach", "Day 2: Old Goa & Spice Farm", "Day 3: Dudhsagar Falls Trek"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8], x: [-4, 4, -4] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-4 w-60 bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-slate-200/80"
              >
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-medium">&quot;Best travel planning tool I&apos;ve used!&quot;</p>
                <p className="text-xs text-gray-400 mt-1">— Priya S., Mumbai</p>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-28 left-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold"
              >
                ✈ Flight found · ₹6,200
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── SEARCH WIDGET ── */}
      <div className="container-custom px-4 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <SearchWidget />
        </motion.div>
      </div>

      {/* ── FEATURES ── */}
      <section className="container-custom mt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5 border border-blue-100">
            <Sparkles className="w-4 h-4" /> Everything you need to travel well
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why travelers choose SkyHigh</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine AI intelligence with real travel data to help you plan trips that actually feel right.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mt-28 py-20 bg-[#f0f6ff] border-y border-border">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How SkyHigh works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From idea to itinerary in under 60 seconds. No complicated forms. No guessing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative"
              >
                <div className="text-5xl font-black text-primary/10 mb-3">{step.step}</div>
                <h3 className="font-bold text-foreground text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-5 h-5 text-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING HOTELS ── */}
      <section className="container-custom mt-24 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Trending Getaways</h2>
            <p className="text-muted-foreground mt-1">Handpicked destinations for your next adventure</p>
          </div>
          <Link href="/search/hotels" className="text-primary font-semibold hover:underline flex items-center gap-1 group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          ref={cardsRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-5"
        >
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`hotel-card card group overflow-hidden cursor-pointer relative h-full ${
                index === 0 ? 'md:col-span-2 md:row-span-2' :
                index === 3 ? 'md:col-span-2' : ''
              }`}
            >
              <Link href={`/details/hotel/${hotel.id}`} className="absolute inset-0 z-10" />
              <div className="absolute inset-0">
                <Image
                  src={hotel.image}
                  alt={hotel.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-lg">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>{hotel.rating ?? '4.8'}</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg md:text-xl group-hover:text-blue-200 transition-colors">
                  {hotel.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-white/80">
                    From <span className="font-bold text-white">₹{hotel.price?.toLocaleString() ?? '2,999'}</span>/night
                  </p>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    Book now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── POPULAR FLIGHTS ── */}
      <section className="container-custom mt-20 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Popular Flights</h2>
            <p className="text-muted-foreground mt-1">Best deals on domestic and international routes</p>
          </div>
          <Link href="/search/flights" className="text-primary font-semibold hover:underline flex items-center gap-1 group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div ref={flightsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {flights.slice(0, 6).map((flight) => (
            <motion.div
              key={flight.id}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              className="flight-card bg-white border border-border rounded-2xl p-5 cursor-pointer group"
            >
              <Link href={`/details/flight/${flight.id}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{flight.title}</p>
                      <p className="text-xs text-muted-foreground">{flight.subtitle ?? 'Direct Flight'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{flight.price?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-foreground">{flight.rating ?? '4.5'}</span>
                  </div>
                  <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Book now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="container-custom mt-24 px-4"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 p-10 md:p-16">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=70&w=1600"
              alt="Beach"
              fill
              className="object-cover opacity-15"
            />
          </div>
          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              AI-Powered · Personalized · Instant
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Your next adventure<br />starts here.
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Tell SkyHigh where you want to go and we&apos;ll handle everything else — from itinerary to bookings.
            </p>
            <Link
              href="/ai-trip"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-xl text-base"
            >
              <Sparkles className="w-5 h-5" />
              Start Planning for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
