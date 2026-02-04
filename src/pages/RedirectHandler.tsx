import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCardStats, logScan } from '@/lib/firebase';
import { Loader2, AlertCircle } from 'lucide-react';

export default function RedirectHandler() {
    const { id } = useParams<{ id: string }>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handleRedirect() {
            if (!id) return;

            try {
                // 1. Get destination URL
                const card = await getCardStats(id);

                if (!card) {
                    setError('QR Code not found');
                    return;
                }

                if (!card.originalUrl) {
                    setError('Invalid destination URL');
                    return;
                }

                // 2. Log Scan (Fire and forget, don't await blocking redirect)
                // We await it briefly just to ensure the request is queued, but don't hold up too long
                logScan(id, navigator.userAgent).catch(console.error);

                // 3. Redirect
                // Use replace to avoid back-button loops
                window.location.replace(card.originalUrl);

            } catch (err) {
                console.error('Redirect error:', err);
                setError('Failed to redirect. Please try again.');
            }
        }

        handleRedirect();
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center max-w-md space-y-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold">Link Expired or Invalid</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-sm text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
}
