import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User, UserPreferences, Booking } from '@/types';

export const createUser = async (
    uid: string,
    email: string,
    displayName: string,
    photoURL: string | null
): Promise<void> => {
    if (!db) return;
    try {
        const userRef = doc(db, 'users', uid);
        const userData: Omit<User, 'uid'> = {
            email, displayName, photoURL,
            preferences: null, pro: false, points: 0,
            createdAt: serverTimestamp(), updatedAt: serverTimestamp()
        };
        await setDoc(userRef, userData);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const getUserData = async (uid: string): Promise<User | null> => {
    if (!db) return null;
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { uid, ...userSnap.data() } as User;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const updateUserPreferences = async (
    uid: string,
    preferences: UserPreferences
): Promise<void> => {
    if (!db) return;
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { preferences, updatedAt: serverTimestamp() });
    } catch (error) {
        console.error('Error updating preferences:', error);
        throw error;
    }
};

export const updateUserPoints = async (uid: string, points: number): Promise<void> => {
    if (!db) return;
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { points, updatedAt: serverTimestamp() });
    } catch (error) {
        console.error('Error updating user points:', error);
        throw error;
    }
};

export const userExists = async (uid: string): Promise<boolean> => {
    if (!db) return false;
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists();
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
};

export const addUserPoints = async (uid: string, pointsToAdd: number): Promise<void> => {
    if (!db) return;
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const currentPoints = userSnap.data().points || 0;
            await updateDoc(userRef, {
                points: currentPoints + pointsToAdd,
                updatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error adding points:', error);
        throw error;
    }
};

export const saveBooking = async (uid: string, bookingData: Record<string, unknown>): Promise<void> => {
    if (!db) return;
    try {
        const { collection, addDoc } = await import('firebase/firestore');
        const bookingsRef = collection(db, 'users', uid, 'bookings');
        await addDoc(bookingsRef, {
            ...bookingData,
            createdAt: serverTimestamp(),
            status: 'confirmed'
        });
    } catch (error) {
        console.error('Error saving booking:', error);
        throw error;
    }
};

export const getUserBookings = async (uid: string): Promise<Booking[]> => {
    if (!db) return [];
    try {
        const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
        const bookingsRef = collection(db, 'users', uid, 'bookings');
        const q = query(bookingsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const bookings: Booking[] = [];
        snap.forEach((d) => {
            bookings.push({ ...d.data() as Booking, id: d.id });
        });
        return bookings;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
    }
};

export const updateUserSubscription = async (
    uid: string,
    status: 'free' | 'pro'
): Promise<void> => {
    if (!db) return;
    try {
        const userRef = doc(db, 'users', uid);
        const isPro = status === 'pro';
        await updateDoc(userRef, { pro: isPro, updatedAt: serverTimestamp() });
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
    }
};
