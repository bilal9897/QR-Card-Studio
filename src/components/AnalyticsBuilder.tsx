import { useState } from 'react';
import { BarChart3, Copy, Download, Check } from 'lucide-react';
import {
    type UTMParameters,
    addUTMParameters,
    generateCampaignName,
    UTM_PRESETS,
    downloadTrackingGuide,
} from '@/lib/analytics-helper';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsBuilderProps {
    baseUrl: string;
    businessName: string;
}

export default function AnalyticsBuilder({ baseUrl, businessName }: AnalyticsBuilderProps) {
    const { toast } = useToast();
    const [usePreset, setUsePreset] = useState(true);
    const [selectedPreset, setSelectedPreset] = useState<keyof typeof UTM_PRESETS>('tableCard');
    const [customUTM, setCustomUTM] = useState<UTMParameters>({
        source: 'qr-card',
        medium: 'offline',
        campaign: generateCampaignName(businessName),
    });
    const [copied, setCopied] = useState(false);

    const currentUTM = usePreset ? UTM_PRESETS[selectedPreset] : customUTM;
    const trackedUrl = baseUrl ? addUTMParameters(baseUrl, {
        ...currentUTM,
        campaign: currentUTM.campaign || generateCampaignName(businessName),
    }) : '';

    const handleCopy = async () => {
        if (!trackedUrl) return;

        try {
            await navigator.clipboard.writeText(trackedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            toast({
                title: 'Copied!',
                description: 'Tracked URL copied to clipboard',
            });
        } catch (error) {
            toast({
                title: 'Copy failed',
                description: 'Please copy the URL manually',
                variant: 'destructive',
            });
        }
    };

    const handleDownloadGuide = () => {
        if (!baseUrl) return;

        downloadTrackingGuide({
            baseUrl,
            utm: {
                ...currentUTM,
                campaign: currentUTM.campaign || generateCampaignName(businessName),
            },
        });

        toast({
            title: 'Guide downloaded',
            description: 'Analytics tracking guide saved',
        });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-medium">Analytics Tracking</h3>
            </div>

            <p className="text-xs text-muted-foreground">
                Add UTM parameters to track QR code scans in Google Analytics. All tracking is privacy-first and managed through your own analytics account.
            </p>

            {/* Preset vs Custom Toggle */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setUsePreset(true)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${usePreset
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                >
                    Use Preset
                </button>
                <button
                    type="button"
                    onClick={() => setUsePreset(false)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${!usePreset
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                >
                    Custom
                </button>
            </div>

            {/* Preset Selector */}
            {usePreset && (
                <div>
                    <label htmlFor="utm-preset" className="block text-sm font-medium mb-2">
                        Campaign Preset
                    </label>
                    <select
                        id="utm-preset"
                        value={selectedPreset}
                        onChange={(e) => setSelectedPreset(e.target.value as keyof typeof UTM_PRESETS)}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                        <option value="tableCard">Table Card (In-Store)</option>
                        <option value="googleReview">Google Review Campaign</option>
                        <option value="receipt">Receipt Insert</option>
                        <option value="packaging">Product Packaging</option>
                    </select>
                </div>
            )}

            {/* Custom UTM Parameters */}
            {!usePreset && (
                <div className="space-y-3">
                    <div>
                        <label htmlFor="utm-source" className="block text-xs font-medium mb-1">
                            Source
                        </label>
                        <input
                            id="utm-source"
                            type="text"
                            value={customUTM.source}
                            onChange={(e) => setCustomUTM({ ...customUTM, source: e.target.value })}
                            placeholder="qr-card"
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                    </div>

                    <div>
                        <label htmlFor="utm-medium" className="block text-xs font-medium mb-1">
                            Medium
                        </label>
                        <input
                            id="utm-medium"
                            type="text"
                            value={customUTM.medium}
                            onChange={(e) => setCustomUTM({ ...customUTM, medium: e.target.value })}
                            placeholder="offline"
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                    </div>

                    <div>
                        <label htmlFor="utm-campaign" className="block text-xs font-medium mb-1">
                            Campaign
                        </label>
                        <input
                            id="utm-campaign"
                            type="text"
                            value={customUTM.campaign}
                            onChange={(e) => setCustomUTM({ ...customUTM, campaign: e.target.value })}
                            placeholder={generateCampaignName(businessName)}
                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                    </div>
                </div>
            )}

            {/* Tracked URL Preview */}
            {trackedUrl && (
                <div className="space-y-2">
                    <label className="block text-xs font-medium">Tracked URL</label>
                    <div className="flex gap-2">
                        <div className="flex-1 px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg overflow-x-auto">
                            <code className="text-accent">{trackedUrl}</code>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                            aria-label="Copy URL"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Download Guide Button */}
            {baseUrl && (
                <button
                    type="button"
                    onClick={handleDownloadGuide}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download Tracking Guide
                </button>
            )}

            {/* Info Box */}
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                    <strong>Privacy First:</strong> UTM parameters are added to your URL. No data is sent to QR Card Studio. Track scans in your own Google Analytics account.
                </p>
            </div>
        </div>
    );
}
