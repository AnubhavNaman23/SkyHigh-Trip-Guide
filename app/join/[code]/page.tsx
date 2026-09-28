'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { joinTrip } from '@/lib/collaborationService';
import { Loader2, Plane, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function JoinTripPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [status, setStatus] = useState<'loading' | 'joining' | 'success' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Just a small delay for effect
        const timer = setTimeout(() => {
            setStatus('joining');
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleJoin = async () => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        setStatus('loading');
        try {
            // Join the trip explicitly
            await joinTrip(user.uid, code);
            setStatus('success');
            
            // Redirect after success animation
            setTimeout(() => {
                // Redirect to the shared trip view
                router.push(`/trip/shared/${code}`);
            }, 1500);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMsg('Unable to join trip. The link might be invalid or expired.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
             <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] max-w-md w-full text-center shadow-2xl relative z-10"
            >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/30">
                    <Plane className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Join the Squad</h1>
                <p className="text-slate-300 mb-8 leading-relaxed">
                    You&apos;ve been invited to collaborate on a trip! Join now to see the itinerary and plan together.
                </p>

                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-3 py-4">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                        <span className="text-sm text-slate-400 font-medium">Verifying invite...</span>
                    </div>
                )}

                {status === 'joining' && (
                    <div className="space-y-4">
                         <button
                            onClick={handleJoin}
                            className="w-full py-4 rounded-xl bg-white text-slate-900 font-bold text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                        >
                            {user ? (
                                <>
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    Join Trip
                                </>
                            ) : (
                                <>
                                    <Image src="https://www.google.com/favicon.ico" alt="G" width={20} height={20} className="w-5 h-5" />
                                    Sign in to Join
                                </>
                            )}
                        </button>
                        <p className="text-xs text-slate-500">
                            By joining, you will be added to the trip collaborators list.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-2"
                    >
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">You&apos;re in!</h3>
                        <p className="text-slate-400 text-sm mt-2">Redirecting to your trips...</p>
                    </motion.div>
                )}

                {status === 'error' && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-200 text-sm">{errorMsg}</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="mt-4 text-xs font-bold text-white/50 hover:text-white uppercase tracking-wider"
                        >
                            Go Home
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
