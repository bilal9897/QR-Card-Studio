/**
 * QR Code Type Definitions and Data Formatters
 * Supports: URL, vCard, WiFi, Calendar, Multi-URL
 */

export type QRType = 'url' | 'vcard' | 'wifi' | 'calendar' | 'multi-url' | 'image';

// ============================================
// Type Interfaces
// ============================================

export interface URLData {
    url: string;
}

export interface VCardData {
    firstName: string;
    lastName: string;
    organization?: string;
    title?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

export interface WiFiData {
    ssid: string;
    password: string;
    encryption: 'WPA' | 'WEP' | 'nopass';
    hidden?: boolean;
}

export interface CalendarData {
    title: string;
    description?: string;
    location?: string;
    startDate: string; // ISO format
    endDate: string; // ISO format
    allDay?: boolean;
}

export interface MultiURLData {
    iosUrl: string;
    androidUrl: string;
    fallbackUrl: string;
}

export interface ImageData {
    imageUrl: string;
    title?: string;
    description?: string;
}

export type QRData = URLData | VCardData | WiFiData | CalendarData | MultiURLData | ImageData;

// ============================================
// QR Type Metadata
// ============================================

export interface QRTypeInfo {
    id: QRType;
    name: string;
    description: string;
    icon: string;
    example: string;
}

export const QR_TYPES: QRTypeInfo[] = [
    {
        id: 'url',
        name: 'Website URL',
        description: 'Link to any website, review page, or feedback form',
        icon: 'Link',
        example: 'https://example.com/feedback',
    },
    {
        id: 'vcard',
        name: 'Contact Card',
        description: 'Share contact information that saves directly to phone',
        icon: 'User',
        example: 'John Doe, CEO',
    },
    {
        id: 'wifi',
        name: 'WiFi Network',
        description: 'Auto-connect to WiFi network without typing password',
        icon: 'Wifi',
        example: 'Guest WiFi',
    },
    {
        id: 'calendar',
        name: 'Calendar Event',
        description: 'Add event directly to calendar app',
        icon: 'Calendar',
        example: 'Meeting or Appointment',
    },
    {
        id: 'multi-url',
        name: 'Smart Link',
        description: 'Different URLs for iOS, Android, and desktop',
        icon: 'Smartphone',
        example: 'App Store + Play Store',
    },
    {
        id: 'image',
        name: 'Image Gallery',
        description: 'Scan to view a photo or portfolio',
        icon: 'Image',
        example: 'Menu, Artwork, or Photo',
    },
];

// ============================================
// Data Formatters
// ============================================

export interface QRStyleOptions {
    dotStyle: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
    markerStyle?: 'square' | 'rounded' | 'extra-rounded';
    markerColor?: string;
    markerBorderColor?: string;
    markerCenterColor?: string;
    // New artistic options
    cornerSquareStyle?: 'square' | 'dot' | 'extra-rounded';
    cornerDotStyle?: 'square' | 'dot';
    cornerSquareColor?: string;
    cornerDotColor?: string;
    dotColor?: string;
    backgroundColor?: string;
}

/**
 * Format vCard data to vCard 3.0 standard
 */
export function formatVCard(data: VCardData): string {
    const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

    // Name (required)
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    lines.push(`FN:${fullName}`);
    lines.push(`N:${data.lastName};${data.firstName};;;`);

    // Organization and title
    if (data.organization) {
        lines.push(`ORG:${data.organization}`);
    }
    if (data.title) {
        lines.push(`TITLE:${data.title}`);
    }

    // Contact info
    if (data.phone) {
        lines.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
    }
    if (data.email) {
        lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
    }
    if (data.website) {
        lines.push(`URL:${data.website}`);
    }

    // Address
    if (data.address || data.city || data.state || data.zip || data.country) {
        const adr = [
            '', // PO Box
            '', // Extended address
            data.address || '',
            data.city || '',
            data.state || '',
            data.zip || '',
            data.country || '',
        ].join(';');
        lines.push(`ADR;TYPE=WORK:${adr}`);
    }

    lines.push('END:VCARD');
    return lines.join('\n');
}

/**
 * Format WiFi data to WiFi QR standard
 */
export function formatWiFi(data: WiFiData): string {
    const { ssid, password, encryption, hidden } = data;

    // Escape special characters
    const escapedSSID = ssid.replace(/([\\;,":])/g, '\\$1');
    const escapedPassword = password.replace(/([\\;,":])/g, '\\$1');

    let wifiString = `WIFI:T:${encryption};S:${escapedSSID};`;

    if (encryption !== 'nopass') {
        wifiString += `P:${escapedPassword};`;
    }

    if (hidden) {
        wifiString += 'H:true;';
    }

    wifiString += ';';

    return wifiString;
}

/**
 * Format Calendar event to iCal format
 */
export function formatCalendar(data: CalendarData): string {
    const { title, description, location, startDate, endDate } = data;

    // Convert ISO dates to iCal format (YYYYMMDDTHHMMSSZ)
    const formatDate = (isoDate: string): string => {
        return isoDate.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const lines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
    ];

    lines.push(`SUMMARY:${title}`);

    if (description) {
        lines.push(`DESCRIPTION:${description}`);
    }

    if (location) {
        lines.push(`LOCATION:${location}`);
    }

    lines.push(`DTSTART:${formatDate(startDate)}`);
    lines.push(`DTEND:${formatDate(endDate)}`);

    lines.push('END:VEVENT');
    lines.push('END:VCALENDAR');

    return lines.join('\n');
}

/**
 * Format Multi-URL data to HTML redirect with user-agent detection
 */
export function formatMultiURL(data: MultiURLData): string {
    const { iosUrl, androidUrl, fallbackUrl } = data;

    // Create a data URL with HTML that redirects based on user agent
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting...</title>
  <script>
    (function() {
      var ua = navigator.userAgent || navigator.vendor || window.opera;
      var url = '${fallbackUrl}';
      
      // iOS detection
      if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        url = '${iosUrl}';
      }
      // Android detection
      else if (/android/i.test(ua)) {
        url = '${androidUrl}';
      }
      
      window.location.href = url;
    })();
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`;

    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

// ============================================
// Validation Functions
// ============================================

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateURL(data: URLData): ValidationResult {
    if (!data.url || data.url.trim().length === 0) {
        return { isValid: false, error: 'URL is required' };
    }

    try {
        new URL(data.url);
        return { isValid: true };
    } catch {
        return { isValid: false, error: 'Invalid URL format' };
    }
}

export function validateVCard(data: VCardData): ValidationResult {
    if (!data.firstName || data.firstName.trim().length === 0) {
        return { isValid: false, error: 'First name is required' };
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
        return { isValid: false, error: 'Last name is required' };
    }

    // Validate email if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    // Validate website if provided
    if (data.website) {
        try {
            new URL(data.website);
        } catch {
            return { isValid: false, error: 'Invalid website URL' };
        }
    }

    return { isValid: true };
}

export function validateWiFi(data: WiFiData): ValidationResult {
    if (!data.ssid || data.ssid.trim().length === 0) {
        return { isValid: false, error: 'Network name (SSID) is required' };
    }

    if (data.encryption !== 'nopass' && (!data.password || data.password.trim().length === 0)) {
        return { isValid: false, error: 'Password is required for secured networks' };
    }

    return { isValid: true };
}

export function validateCalendar(data: CalendarData): ValidationResult {
    if (!data.title || data.title.trim().length === 0) {
        return { isValid: false, error: 'Event title is required' };
    }

    if (!data.startDate) {
        return { isValid: false, error: 'Start date is required' };
    }

    if (!data.endDate) {
        return { isValid: false, error: 'End date is required' };
    }

    // Validate dates
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (isNaN(start.getTime())) {
        return { isValid: false, error: 'Invalid start date' };
    }

    if (isNaN(end.getTime())) {
        return { isValid: false, error: 'Invalid end date' };
    }

    if (end < start) {
        return { isValid: false, error: 'End date must be after start date' };
    }

    return { isValid: true };
}

export function validateMultiURL(data: MultiURLData): ValidationResult {
    const urls = [
        { url: data.iosUrl, name: 'iOS URL' },
        { url: data.androidUrl, name: 'Android URL' },
        { url: data.fallbackUrl, name: 'Fallback URL' },
    ];

    for (const { url, name } of urls) {
        if (!url || url.trim().length === 0) {
            return { isValid: false, error: `${name} is required` };
        }

        try {
            new URL(url);
        } catch {
            return { isValid: false, error: `Invalid ${name} format` };
        }
    }

    return { isValid: true };
}

// ============================================
// QR Data Generator
// ============================================

export function generateQRData(type: QRType, data: QRData): string {
    switch (type) {
        case 'url':
            return (data as URLData).url;
        case 'vcard':
            return formatVCard(data as VCardData);
        case 'wifi':
            return formatWiFi(data as WiFiData);
        case 'calendar':
            return formatCalendar(data as CalendarData);
        case 'multi-url':
            return formatMultiURL(data as MultiURLData);
        case 'image':
            return (data as ImageData).imageUrl;
        default:
            throw new Error(`Unknown QR type: ${type}`);
    }
}

export function validateQRData(type: QRType, data: QRData): ValidationResult {
    switch (type) {
        case 'url':
            return validateURL(data as URLData);
        case 'vcard':
            return validateVCard(data as VCardData);
        case 'wifi':
            return validateWiFi(data as WiFiData);
        case 'calendar':
            return validateCalendar(data as CalendarData);
        case 'multi-url':
            return validateMultiURL(data as MultiURLData);
        case 'image':
            return validateURL({ url: (data as ImageData).imageUrl });
        default:
            return { isValid: false, error: `Unknown QR type: ${type}` };
    }
}
