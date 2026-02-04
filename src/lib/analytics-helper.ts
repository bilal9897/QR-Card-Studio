/**
 * Analytics Helper
 * Privacy-first analytics with UTM parameters and URL shortener integration
 */

export interface UTMParameters {
    source: string;
    medium: string;
    campaign: string;
    term?: string;
    content?: string;
}

export interface AnalyticsConfig {
    baseUrl: string;
    utm: UTMParameters;
}

/**
 * Generate URL with UTM parameters
 */
export function addUTMParameters(baseUrl: string, utm: UTMParameters): string {
    try {
        const url = new URL(baseUrl);

        url.searchParams.set('utm_source', utm.source);
        url.searchParams.set('utm_medium', utm.medium);
        url.searchParams.set('utm_campaign', utm.campaign);

        if (utm.term) {
            url.searchParams.set('utm_term', utm.term);
        }

        if (utm.content) {
            url.searchParams.set('utm_content', utm.content);
        }

        return url.toString();
    } catch (error) {
        console.error('Invalid URL:', error);
        return baseUrl;
    }
}

/**
 * Generate campaign name based on business and location
 */
export function generateCampaignName(businessName: string, location?: string): string {
    const sanitized = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const locationPart = location ? `-${location.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : '';
    return `qr-card-${sanitized}${locationPart}`;
}

/**
 * Common UTM presets for different use cases
 */
export const UTM_PRESETS = {
    googleReview: {
        source: 'qr-card',
        medium: 'offline',
        campaign: 'google-reviews',
    },
    tableCard: {
        source: 'table-card',
        medium: 'in-store',
        campaign: 'feedback',
    },
    receipt: {
        source: 'receipt',
        medium: 'print',
        campaign: 'post-purchase',
    },
    packaging: {
        source: 'packaging',
        medium: 'product',
        campaign: 'unboxing',
    },
};

/**
 * URL Shortener Integration Helpers
 */

export interface ShortenerConfig {
    service: 'bitly' | 'tinyurl' | 'custom';
    apiKey?: string;
    domain?: string;
}

/**
 * Generate Bitly short URL (requires API key)
 */
export async function shortenWithBitly(longUrl: string, apiKey: string): Promise<string> {
    try {
        const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ long_url: longUrl }),
        });

        if (!response.ok) {
            throw new Error('Bitly API error');
        }

        const data = await response.json();
        return data.link;
    } catch (error) {
        console.error('Bitly shortening failed:', error);
        throw error;
    }
}

/**
 * Generate TinyURL short URL (no API key required)
 */
export async function shortenWithTinyURL(longUrl: string): Promise<string> {
    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);

        if (!response.ok) {
            throw new Error('TinyURL API error');
        }

        return await response.text();
    } catch (error) {
        console.error('TinyURL shortening failed:', error);
        throw error;
    }
}

/**
 * Analytics tracking guide generator
 */
export function generateTrackingGuide(config: AnalyticsConfig): string {
    const trackedUrl = addUTMParameters(config.baseUrl, config.utm);

    return `
# QR Code Analytics Tracking Guide

## Your Tracked URL
${trackedUrl}

## UTM Parameters
- **Source**: ${config.utm.source}
- **Medium**: ${config.utm.medium}
- **Campaign**: ${config.utm.campaign}
${config.utm.term ? `- **Term**: ${config.utm.term}` : ''}
${config.utm.content ? `- **Content**: ${config.utm.content}` : ''}

## How to Track Scans

### Google Analytics
1. Go to Google Analytics
2. Navigate to: Acquisition → Campaigns → All Campaigns
3. Look for campaign name: "${config.utm.campaign}"
4. View metrics: Sessions, Users, Conversions

### URL Shortener Analytics
If you used a URL shortener (Bitly, TinyURL):
1. Log into your shortener dashboard
2. Find your shortened link
3. View click statistics and geographic data

## Privacy Note
All tracking is done through standard URL parameters. No personal data is collected by QR Card Studio. Analytics are managed through your own Google Analytics or URL shortener account.
  `.trim();
}

/**
 * Export tracking guide as text file
 */
export function downloadTrackingGuide(config: AnalyticsConfig): void {
    const guide = generateTrackingGuide(config);
    const blob = new Blob([guide], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `qr-analytics-guide-${config.utm.campaign}.txt`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
