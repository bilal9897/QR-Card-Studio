import { type CardFormat } from '@/components/CardPreview';
import { type CardSize } from '@/components/SizeSelector';
import { type CustomSize } from '@/lib/card-sizes';
import { type CardColors } from '@/lib/card-colors';
import { type QRType, type QRData } from '@/lib/qr-types';

export interface SavedDesign {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    data: {
        businessName: string;
        message: string;
        ctaText: string;
        qrType: QRType;
        qrData: QRData;
        logoUrl: string | null;
        qrLogoUrl: string | null;
        backgroundUrl: string | null;
        backgroundOpacity?: number; // Optional for backward compatibility
        format: CardFormat;
        size: CardSize;
        customSize?: CustomSize;
        cardColors: CardColors;
        selectedTemplateId: string | null;
        selectedColorPresetId: string;
    };
}

const STORAGE_KEY = 'qr-card-studio-designs';

export function saveDesign(design: Omit<SavedDesign, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): string {
    const designs = getDesigns();
    const now = Date.now();

    if (design.id) {
        // Update existing
        const index = designs.findIndex(d => d.id === design.id);
        if (index !== -1) {
            designs[index] = {
                ...designs[index],
                ...design,
                id: design.id, // Ensure ID is preserved
                updatedAt: now,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
            return design.id;
        }
    }

    // Create new
    const newDesign: SavedDesign = {
        ...design,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
    };

    designs.unshift(newDesign); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return newDesign.id;
}

export function getDesigns(): SavedDesign[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to load designs', error);
        return [];
    }
}

export function deleteDesign(id: string): void {
    const designs = getDesigns().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
}

export function loadDesign(id: string): SavedDesign | undefined {
    return getDesigns().find(d => d.id === id);
}

export function exportDesigns(): string {
    const designs = getDesigns();
    return JSON.stringify(designs, null, 2);
}

export function importDesigns(json: string): { success: boolean; count: number; error?: string } {
    try {
        const imported = JSON.parse(json);
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        // Simple validation could be added here
        const current = getDesigns();
        const uniqueImported = imported.filter(i => !current.find(c => c.id === i.id));

        localStorage.setItem(STORAGE_KEY, JSON.stringify([...uniqueImported, ...current]));
        return { success: true, count: uniqueImported.length };
    } catch (error) {
        return { success: false, count: 0, error: (error as Error).message };
    }
}
