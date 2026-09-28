'use client';

import React, { useState } from 'react';
import { Users, Link as LinkIcon, Check, Copy, Crown, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Booking, TripPlannerForm, User } from '@/types';
import { shareTrip } from '@/lib/collaborationService';
import { useAuth } from '@/context/AuthContext';

interface SquadSyncBarProps {
    booking: Booking;
    onUpdate?: (updatedBooking: Booking) => void;
    tripSearchParams?: TripPlannerForm | null;
    user?: User;
}

export default function SquadSyncBar({ booking, user: propUser }: SquadSyncBarProps) {
    const { user: contextUser } = useAuth();
    const router = useRouter();
    const user = propUser || contextUser;
    const [isSharing, setIsSharing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showProModal, setShowProModal] = useState(false);
    
    // Derived state
    const isShared = booking.isShared || false;
    const collaborators = (booking.collaborators as string[]) || [];
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${booking.sharedTripId || ''}` : '';

    const handleInvite = async () => {
        if (!user || !booking) return;

        // Pro Check
        if (!user.pro) {
            setShowProModal(true);
            return;
        }
        
        setIsSharing(true);
        try {
            const code = await shareTrip(user.uid, booking);
            const url = `${window.location.origin}/join/${code}`;
            await navigator.clipboard.writeText(url);
            triggerCopyAnimation();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSharing(false);
        }
    };

    const copyLink = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        triggerCopyAnimation();
    };

    const triggerCopyAnimation = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-b border-border sticky top-0 z-40 shadow-sm"
            >
                <div className="container-custom py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {/* Current User */}
                            {user && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700 relative z-20" title="You">
                                    {user.photoURL ? <img src={user.photoURL} alt={user.displayName || "User avatar"} className="w-full h-full rounded-full" /> : user.displayName?.charAt(0)}
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                            )}
                            
                            {/* Collaborators */}
                            {collaborators.filter((uid: string) => uid !== user?.uid).map((uid: string, i: number) => (
                                <div key={uid} className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-bold text-pink-700 relative z-10" style={{ zIndex: 10 - i }}>
                                    {uid.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            
                            {/* Add Button if empty */}
                            {!isShared && (
                                 <button onClick={handleInvite} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:border-slate-400 transition-all z-0">
                                    <Users className="w-3 h-3" />
                                </button>
                            )}
                        </div>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
                                <Crown className="w-4 h-4 text-indigo-600" />
                                Squad Sync
                            </span>
                            {isShared && (
                                <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Live
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isShared ? (
                             <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 relative">
                                <span className="text-xs text-muted-foreground px-2 font-mono hidden sm:inline-block max-w-[100px] truncate">
                                    {shareUrl.replace('https://', '')}
                                </span>
                                <button
                                    onClick={copyLink}
                                    className="p-1.5 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200 relative overflow-hidden"
                                    title="Copy Invite Link"
                                >
                                    <AnimatePresence mode='wait'>
                                        {copied ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                            >
                                                <Check className="w-3.5 h-3.5 text-green-600" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                            >
                                                <Copy className="w-3.5 h-3.5 text-slate-600" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                                <AnimatePresence>
                                    {copied && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, x: '-50%' }}
                                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                                            exit={{ opacity: 0, y: -10, x: '-50%' }}
                                            className="absolute -bottom-8 left-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
                                        >
                                            Link Copied!
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={handleInvite}
                                disabled={isSharing}
                                className="btn-primary text-sm py-2 px-4 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-500/20"
                            >
                                {isSharing ? (
                                    <span className="animate-spin opacity-50">⏳</span>
                                ) : (
                                    <LinkIcon className="w-3.5 h-3.5" />
                                )}
                                Invite Squad
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Pro Feature Modal */}
            <AnimatePresence>
                {showProModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                            
                            <button 
                                onClick={() => setShowProModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 rotate-3">
                                    <Crown className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    Unlock Squad Sync
                                </h3>
                                <p className="text-slate-500 mb-8 max-w-[280px]">
                                    Collaborative trip planning is a Pro feature. Upgrade now to plan together with your friends!
                                </p>

                                <div className="w-full space-y-3">
                                    <button 
                                        onClick={() => router.push('/subscription')}
                                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Upgrade to Pro
                                    </button>
                                    <button 
                                        onClick={() => setShowProModal(false)}
                                        className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-all"
                                    >
                                        Maybe Later
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
