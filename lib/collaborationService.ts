import { db } from './firebase';
import {
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    onSnapshot,
    getDoc,
    collection
} from 'firebase/firestore';
import { Booking } from '@/types';

export const shareTrip = async (userId: string, booking: Booking): Promise<string> => {
    if (!db) throw new Error('Firebase is not configured.');
    try {
        if (booking.isShared && booking.sharedTripId) {
            return booking.sharedTripId;
        }

        const tripRef = doc(collection(db, 'trips'));
        const shareCode = tripRef.id;

        const sharedTripData = {
            ...booking,
            id: shareCode,
            userId,
            isShared: true,
            createdAt: new Date().toISOString(),
            collaborators: [userId],
            shareCode
        };

        await setDoc(tripRef, sharedTripData);

        if (booking.id) {
            const userBookingRef = doc(db, 'users', userId, 'bookings', booking.id);
            await updateDoc(userBookingRef, {
                isShared: true,
                sharedTripId: shareCode
            });
        }

        return shareCode;
    } catch (error) {
        console.error('Error sharing trip:', error);
        throw error;
    }
};

export const joinTrip = async (userId: string, shareCode: string): Promise<string> => {
    if (!db) throw new Error('Firebase is not configured.');
    try {
        if (!shareCode) throw new Error('Invalid share code');
        const tripRef = doc(db, 'trips', shareCode);
        const tripSnap = await getDoc(tripRef);

        if (!tripSnap.exists()) {
            throw new Error('Trip not found');
        }

        await updateDoc(tripRef, {
            collaborators: arrayUnion(userId)
        });

        const tripData = tripSnap.data() as Booking;
        const linkedBooking = {
            ...tripData,
            id: shareCode,
            isShared: true,
            sharedTripId: shareCode,
            role: 'collaborator',
            linkedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', userId, 'bookings', shareCode), linkedBooking);

        return shareCode;
    } catch (error) {
        console.error('Error joining trip:', error);
        throw error;
    }
};

export const subscribeToTrip = (tripId: string, onUpdate: (data: Booking) => void) => {
    if (!db || !tripId) return () => {};

    const tripRef = doc(db, 'trips', tripId);

    const unsubscribe = onSnapshot(tripRef, (d) => {
        if (d.exists()) {
            onUpdate({ ...d.data(), id: d.id } as Booking);
        }
    });

    return unsubscribe;
};

export const getCollaborators = async (userIds: string[]) => {
    return userIds.map(uid => ({ uid, name: 'Traveler', photo: null }));
};
