'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Star, Crown, Shield, Zap, ArrowRight } from 'lucide-react';
import { Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateUserSubscription } from '@/lib/userService';

const FeatureItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3">
        <div className="p-1 rounded-full bg-blue-100 text-blue-600">
            <Check className="w-4 h-4" />
        </div>
        <span className="text-slate-600 text-sm font-medium">{text}</span>
    </div>
);

export default function SubscriptionPage() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const isPro = user?.pro === true;

    const handleUpgrade = async () => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        setLoading(true);
        try {
            // Mock payment delay
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            await updateUserSubscription(user.uid, 'pro');
            
            // Force reload to update context or just redirect home
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Upgrade failed:', error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="container-custom max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Unlock the Full Experience
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Get exclusive benefits, earn rewards faster, and travel like a VIP with our Pro plan.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Free Tier */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-slate-100 text-slate-600">
                                <Star className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Free</h2>
                        </div>
                        
                        <div className="mb-8">
                            <span className="text-4xl font-bold text-slate-900">₹0</span>
                            <span className="text-slate-500">/month</span>
                        </div>

                        <div className="space-y-4 mb-8">
                            <FeatureItem text="Basic Trip Planning" />
                            <FeatureItem text="Standard Points (1x)" />
                            <FeatureItem text="Access to Public Itineraries" />
                        </div>

                        <button 
                            disabled={true}
                            className="w-full py-4 rounded-xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed"
                        >
                            Current Plan
                        </button>
                    </motion.div>

                    {/* Pro Tier */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden ring-4 ring-blue-500/20"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                                        <Crown className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">Pro</h2>
                                        <div className="text-xs font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
                                            Recommended
                                        </div>
                                    </div>
                                </div>
                                {isPro && (
                                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                                        <Check className="w-3 h-3" />
                                        Active
                                    </div>
                                )}
                            </div>
                            
                            <div className="mb-8">
                                <span className="text-5xl font-bold">₹499</span>
                                <span className="text-slate-400">/month</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-blue-500/20 text-blue-400">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-lg text-blue-100">3x Points on Bookings</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-base text-indigo-100">Squad Sync: Collaborative Trip Planning</span>
                                    {/* Verified Users Icon */}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-white/10 text-slate-300">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-300 text-sm">Priority Support (Coming Soon)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-white/10 text-slate-300">
                                        <Star className="w-4 h-4" />
                                    </div>
                                    <span className="text-slate-300 text-sm">Exclusive Deals (Coming Soon)</span>
                                </div>
                            </div>

                            {!isPro ? (
                                <button
                                    onClick={handleUpgrade}
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25"
                                >
                                    {loading ? 'Processing...' : (
                                        <>
                                            Upgrade Now
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        disabled={true}
                                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-emerald-500 text-white cursor-default"
                                    >
                                        With Pro
                                        <Check className="w-5 h-5" />
                                    </button>
                                    
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        disabled={loading}
                                        className="w-full py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm"
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                            )}
                            
                            {!isPro && (
                                <p className="text-xs text-center text-slate-500 mt-4">
                                    Secure payment powered by Stripe (Mock)
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !loading && setShowCancelModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-6">
                                    <Shield className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Cancel Subscription?</h3>
                                <p className="text-slate-500 mb-8">
                                    Are you sure you want to cancel? You will lose access to 3x points, Pro badge, and exclusive features immediately.
                                </p>
                                
                                <div className="space-y-3">
                                    <button 
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                await updateUserSubscription(user?.uid as string, 'free');
                                                setShowCancelModal(false);
                                                setShowToast(true);
                                                setTimeout(() => setShowToast(false), 3000);
                                                router.refresh();
                                            } catch (err) {
                                                console.error(err);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={loading}
                                        className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : 'Yes, Cancel Plan'}
                                    </button>
                                    <button 
                                        onClick={() => setShowCancelModal(false)}
                                        disabled={loading}
                                        className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-all"
                                    >
                                        No, Keep Benefits
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

             {/* Success Toast */}
             <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className="fixed bottom-8 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3"
                    >
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium">Subscription cancelled successfully.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
