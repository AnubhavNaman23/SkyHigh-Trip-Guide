'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { ArrowRight, Check, Wallet, Users, Plane, Globe, Map, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateUserPreferences } from '@/lib/userService';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    travelStyle: '',
    companions: '',
    interests: [] as string[]
  });

  const nextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save preferences to Firestore
      if (user) {
        try {
          await updateUserPreferences(user.uid, preferences);
        } catch (error) {
          console.error('Error saving preferences:', error);
        }
      }
      
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        router.push('/');
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const backgrounds = [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000', // Nature/Travel
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000', // Friends/Group
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000'  // Beach/Interests
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgrounds[step - 1]})` }}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-4xl relative z-10 flex flex-col md:flex-row gap-8 items-center">
        
        {/* Left Side: Context/Progress */}
        <div className="w-full md:w-1/3 text-white space-y-6">
          <motion.div
            key={`text-${step}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {step === 1 && "Start Your Journey"}
              {step === 2 && "Better Together"}
              {step === 3 && "Your Interests"}
            </h1>
            <p className="text-lg text-white/80">
              {step === 1 && "Tell us how you like to explore the world."}
              {step === 2 && "Who are you bringing along for the ride?"}
              {step === 3 && "What makes your heart beat faster?"}
            </p>
          </motion.div>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <motion.div 
                key={s}
                className={`h-1.5 rounded-full ${s <= step ? 'bg-white' : 'bg-white/20'}`}
                initial={{ width: 16 }}
                animate={{ width: s === step ? 48 : 16 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Card */}
        <div className="w-full md:w-2/3">
          <motion.div
            key={`card-${step}`}
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {[
                    { label: 'Budget Friendly', icon: Wallet, desc: 'Maximize value' },
                    { label: 'Luxury', icon: StarIcon, desc: 'Indulge yourself' },
                    { label: 'Adventure', icon: Map, desc: 'Seek thrills' },
                    { label: 'Relaxed', icon: Heart, desc: 'Take it easy' }
                  ].map((style) => (
                    <button
                      key={style.label}
                      onClick={() => setPreferences({ ...preferences, travelStyle: style.label })}
                      className={`p-6 rounded-2xl border text-left transition-all group relative overflow-hidden ${
                        preferences.travelStyle === style.label 
                          ? 'bg-white text-primary border-white' 
                          : 'bg-black/20 text-white border-white/10 hover:bg-black/30'
                      }`}
                    >
                      <div className="relative z-10">
                        <style.icon className={`w-8 h-8 mb-4 ${preferences.travelStyle === style.label ? 'text-primary' : 'text-white'}`} />
                        <h3 className="font-bold text-lg mb-1">{style.label}</h3>
                        <p className={`text-sm ${preferences.travelStyle === style.label ? 'text-gray-600' : 'text-white/60'}`}>
                          {style.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {[
                    { label: 'Solo', icon: Users, desc: 'Just me and the world' },
                    { label: 'Couple', icon: Heart, desc: 'Romantic getaways' },
                    { label: 'Family', icon: Users, desc: 'Fun for everyone' },
                    { label: 'Friends', icon: Globe, desc: 'Group adventures' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setPreferences({ ...preferences, companions: item.label })}
                      className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                        preferences.companions === item.label 
                          ? 'bg-white text-primary border-white scale-105 shadow-lg' 
                          : 'bg-black/20 text-white border-white/10 hover:bg-black/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        preferences.companions === item.label ? 'bg-primary/10' : 'bg-white/10'
                      }`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-bold text-lg">{item.label}</h3>
                        <p className={`text-sm ${preferences.companions === item.label ? 'text-gray-600' : 'text-white/60'}`}>
                          {item.desc}
                        </p>
                      </div>
                      {preferences.companions === item.label && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="w-6 h-6 text-primary" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-wrap gap-3 mb-8 justify-center">
                    {['Beaches', 'Mountains', 'City Life', 'Food', 'History', 'Nature', 'Shopping', 'Nightlife', 'Art', 'Wellness'].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-6 py-3 rounded-full border transition-all ${
                          preferences.interests.includes(interest)
                            ? 'bg-white text-primary border-white font-bold shadow-lg scale-110'
                            : 'bg-black/20 text-white border-white/10 hover:bg-black/30'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white/10 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Plane className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Ready for takeoff?</h4>
                      <p className="text-sm text-white/60">
                        We&apos;ll customize your feed based on your choices.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between items-center">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="text-white/60 hover:text-white flex items-center gap-2 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button
                onClick={nextStep}
                className="bg-white text-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-lg hover:scale-105 active:scale-95 transform duration-200"
              >
                {step === 3 ? 'Get Started' : 'Continue'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Helper icon component since Star is not imported from lucide-react in the original code
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
