'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { TravelItem } from '@/types';
import { Star, Check, ArrowLeft, Share2, Heart } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

interface DetailsContentProps {
  item: TravelItem;
  type: string;
}

export default function DetailsContent({ item }: DetailsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const { setSingleBookingItem } = useStore();

  const handleBook = () => {
    if (user) {
      setSingleBookingItem(item);
      router.push(`/checkout?mode=single`);
    } else {
      localStorage.setItem('redirectAfterLogin', pathname);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      {/* Sticky Header */}
      <div className="bg-white border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="container-custom py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Heart className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Image Gallery */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-md">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold shadow-sm">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {item.rating} / 5.0
              </div>
            </div>

            {/* Title & Description */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <h1 className="text-3xl font-bold text-foreground mb-2">{item.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{item.subtitle}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {item.details.map((detail, idx) => (
                  <div key={idx} className="bg-secondary/50 p-3 rounded-lg border border-border/50 text-center">
                    <span className="text-sm font-medium text-foreground">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities / Features */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-6">What&apos;s Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Free Cancellation', 'Instant Confirmation', 'Mobile Voucher', '24/7 Support'].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-foreground">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl border border-border shadow-lg sticky top-32"
            >
              <div className="mb-6">
                <span className="text-sm text-muted-foreground">Total Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">₹{item.price.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">/ person</span>
                </div>
                <div className="mt-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium inline-block">
                  Earn {Math.floor(item.price * 0.03)} SkyHigh Rewards Points
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Base Fare</span>
                    <span className="font-medium">₹{item.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="font-medium">₹{(item.price * 0.18).toFixed(0)}</span>
                  </div>
                  <div className="border-t border-border/50 my-2 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{(item.price * 1.18).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBook}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Proceed to Book
              </button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By booking, you agree to our Terms & Conditions
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
