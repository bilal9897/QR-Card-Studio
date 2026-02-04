import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, addDoc, updateDoc, doc, increment, getDoc, type DocumentData } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Collection References
const CARDS_COLLECTION = 'cards';
const SCANS_COLLECTION = 'scans';

/**
 * proper interface for a tracked card document
 */
export interface TrackedCard {
    id?: string;
    originalUrl: string; // The destination URL
    businessName: string;
    createdAt: any; // Firestore Timestamp
    stats: {
        scans: number;
        downloads: number;
        uniqueScans: number;
    };
}

/**
 * Creates a new tracked card document
 * Returns the auto-generated ID (which acts as the short code)
 */
export async function createTrackedCard(originalUrl: string, businessName: string): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, CARDS_COLLECTION), {
            originalUrl,
            businessName,
            createdAt: new Date(),
            stats: {
                scans: 0,
                downloads: 0,
                uniqueScans: 0
            }
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

/**
 * Logs a scan for a specific card
 * Updates aggregate stats and logs individual scan event
 */
export async function logScan(cardId: string, userAgent: string) {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);

    // Log individual scan
    await addDoc(collection(db, SCANS_COLLECTION), {
        cardId,
        timestamp: new Date(),
        userAgent,
        device: /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent) ? 'mobile' : 'desktop'
    });

    // Update aggregate stats (atomic increment)
    await updateDoc(cardRef, {
        "stats.scans": increment(1)
    });
}

/**
 * Logs a download event for a card
 */
export async function logDownload(cardId: string) {
    const cardRef = doc(db, CARDS_COLLECTION, cardId);
    await updateDoc(cardRef, {
        "stats.downloads": increment(1)
    });
}

/**
 * Gets card data and stats
 */
export async function getCardStats(cardId: string): Promise<TrackedCard | null> {
    const cardDoc = await getDoc(doc(db, CARDS_COLLECTION, cardId));
    if (cardDoc.exists()) {
        return { id: cardDoc.id, ...cardDoc.data() } as TrackedCard;
    }
    return null;
}
