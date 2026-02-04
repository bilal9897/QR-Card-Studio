/**
 * Internationalization (i18n) System
 * Simple translation system with language detection and RTL support
 */

import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'hi' | 'ar';

export interface LanguageInfo {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
    rtl: boolean;
}

export const LANGUAGES: LanguageInfo[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', rtl: false },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
];

// Translation type
export type TranslationKey = string;
export type Translations = Record<TranslationKey, string>;

// Event listener for language changes
type LanguageChangeListener = (lang: Language) => void;
const listeners: Set<LanguageChangeListener> = new Set();

// Current language state
let currentLanguage: Language = 'en';
let translations: Record<Language, Translations> = {
    en: {},
    es: {},
    fr: {},
    hi: {},
    ar: {},
};

/**
 * Detect browser language
 */
export function detectBrowserLanguage(): Language {
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = LANGUAGES.find(l => l.code === browserLang);
    return supportedLang ? supportedLang.code : 'en';
}

/**
 * Subscribe to language changes
 */
export function onLanguageChange(listener: LanguageChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * Get current language
 */
export function getCurrentLanguage(): Language {
    return currentLanguage;
}

/**
 * Set current language and notify listeners
 */
export function setLanguage(lang: Language): void {
    if (currentLanguage === lang) return;

    currentLanguage = lang;

    // Update document direction for RTL languages
    const langInfo = LANGUAGES.find(l => l.code === lang);
    if (langInfo) {
        document.documentElement.dir = langInfo.rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }

    // Save to localStorage
    localStorage.setItem('qr-studio-language', lang);

    // Notify listeners
    listeners.forEach(listener => listener(lang));
}

/**
 * Load language from localStorage or detect from browser
 */
export function loadLanguage(): Language {
    const saved = localStorage.getItem('qr-studio-language') as Language;
    if (saved && LANGUAGES.find(l => l.code === saved)) {
        return saved;
    }
    return detectBrowserLanguage();
}

/**
 * Register translations for a language
 */
export function registerTranslations(lang: Language, trans: Translations): void {
    translations[lang] = { ...translations[lang], ...trans };
}

/**
 * Translate a key
 */
export function t(key: TranslationKey, fallback?: string): string {
    const translation = translations[currentLanguage]?.[key];
    if (translation) return translation;

    // Fallback to English
    if (currentLanguage !== 'en') {
        const englishTranslation = translations.en?.[key];
        if (englishTranslation) return englishTranslation;
    }

    // Return fallback or key
    return fallback || key;
}

/**
 * Initialize i18n system
 */
export function initI18n(): void {
    const lang = loadLanguage();
    setLanguage(lang);
}

/**
 * React Hook for using translation
 */
export function useTranslation() {
    // Force re-render when language changes
    const [lang, setLang] = useState<Language>(currentLanguage);

    useEffect(() => {
        return onLanguageChange((newLang) => {
            setLang(newLang);
        });
    }, []);

    return {
        t,
        i18n: {
            language: lang,
            changeLanguage: setLanguage
        }
    };
}
