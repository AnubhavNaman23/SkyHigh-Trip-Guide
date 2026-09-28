'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { pointsToRupees } from '@/lib/points';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TravelItem } from '@/types';

interface CheckoutFormProps {
  item: TravelItem;
}

export default function CheckoutForm({ item }: CheckoutFormProps) {
  const router = useRouter();
  const { addBooking } = useStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const pointsEarned = Math.floor(item.price * 0.03);
  const taxes = item.price * 0.18;
  const total = item.price + taxes;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addBooking({
      id: crypto.randomUUID(),
      type: item.type,
      title: item.title,
      date: new Date().toISOString(),
      price: total,
      pointsEarned: pointsEarned,
      status: 'confirmed'
    });

    setIsProcessing(false);
    setIsSuccess(true);

    // Redirect after delay
    setTimeout(() => {
      router.push('/profile');
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your booking for <span className="font-bold text-foreground">{item.title}</span> has been confirmed.
          </p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 p-4 rounded-xl mb-6"
          >
            <p className="text-sm text-blue-600 font-medium">You earned</p>
            <p className="text-3xl font-bold text-primary">{pointsEarned} Points <span className="text-sm text-muted-foreground">(₹{pointsToRupees(pointsEarned)})</span></p>
          </motion.div>
          <p className="text-sm text-muted-foreground">Redirecting to your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.details.slice(0, 2).map((d, i) => (
                      <span key={i} className="text-xs bg-secondary px-2 py-1 rounded">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Traveler Details</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input type="text" className="w-full p-2 border border-border rounded-md" defaultValue="Alex" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input type="text" className="w-full p-2 border border-border rounded-md" defaultValue="Traveler" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input type="email" className="w-full p-2 border border-border rounded-md" defaultValue="alex.traveler@example.com" />
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="p-4 border border-primary bg-blue-50 rounded-lg flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-border">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Credit / Debit Card</p>
                  <p className="text-xs text-muted-foreground">Ending in 4242</p>
                </div>
                <div className="ml-auto w-4 h-4 rounded-full border-4 border-primary"></div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Price Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span>₹{item.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees (18%)</span>
                  <span>₹{taxes.toFixed(0)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="mt-4 bg-green-50 p-3 rounded-lg text-center">
                <p className="text-xs text-green-800 font-medium">
                  You will earn <span className="font-bold">{pointsEarned} Points</span>
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
