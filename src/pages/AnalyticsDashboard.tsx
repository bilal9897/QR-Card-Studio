import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCardStats, type TrackedCard } from '@/lib/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, BarChart3, Scan, Download, Globe } from 'lucide-react';

export default function AnalyticsDashboard() {
    const { id } = useParams<{ id: string }>();
    const [card, setCard] = useState<TrackedCard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            if (!id) return;
            try {
                const data = await getCardStats(id);
                setCard(data);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    if (!card) {
        return <div className="p-8 text-center">Stats not found</div>;
    }

    // Mock chart data (since we only store aggregate counts for now)
    // In a real version, we'd query the 'scans' sub-collection for time-series data
    const chartData = [
        { name: 'Total Scans', value: card.stats.scans },
        { name: 'Downloads', value: card.stats.downloads }
    ];

    return (
        <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8">
            <header>
                <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Stats for <span className="font-medium text-foreground">{card.businessName}</span></p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-accent/10 text-accent">
                            <Scan className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Scans</p>
                            <h3 className="text-2xl font-bold">{card.stats.scans}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                            <Download className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Card Downloads</p>
                            <h3 className="text-2xl font-bold">{card.stats.downloads}</h3>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Original Destination</p>
                            <a href={card.originalUrl} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline truncate max-w-[150px] block">
                                {card.originalUrl}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="p-6 rounded-xl bg-card border border-border/50 shadow-sm min-h-[300px]">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Engagement Overview
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
