import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { templates, type TemplateTier, getTierInfo } from '@/lib/templates';
import CardPreview from '@/components/CardPreview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, Check, Sparkles, Filter, ChevronRight, Palette, Search, Star, User, Globe, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function Templates() {
    const navigate = useNavigate();
    const [selectedTier, setSelectedTier] = useState<TemplateTier | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'official' | 'community'>('official');
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

    // Filtering Logic
    const filteredTemplates = templates.filter(t => {
        // 1. View Mode Filter (Official vs Community)
        if (viewMode === 'official' && t.isCommunity) return false;
        if (viewMode === 'community' && !t.isCommunity) return false;

        // 2. Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return t.name.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query) ||
                t.author?.toLowerCase().includes(query);
        }

        // 3. Tier Filter (Only for Official)
        if (viewMode === 'official' && selectedTier !== 'all' && t.tier !== selectedTier) {
            return false;
        }

        return true;
    });

    // Mock data for preview
    const previewProps = {
        format: 'table-tent' as const,
        size: 'medium' as const,
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Demo',
        logoUrl: null,
        backgroundUrl: null,
        showBackground: true,
        backgroundOpacity: 0.1,
        showBadge: true,
        qrContent: 'https://qr-card-studio.com', // Enable ArtisticQR rendering
        qrType: 'url' as const,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-background" />
                        </div>
                        <span className="font-display text-xl font-bold tracking-tight">QR Card Studio</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/create')}>
                            Open Generator
                        </Button>
                        <Button size="sm" onClick={() => navigate('/create')} className="gap-2">
                            Create New <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 sm:py-12">
                {/* Page Intro */}
                <div className="max-w-3xl mx-auto text-center mb-10 space-y-4">
                    <Badge variant="outline" className="px-3 py-1 border-accent/30 text-accent gap-1">
                        <Sparkles className="w-3 h-3" /> Template Marketplace
                    </Badge>
                    <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-foreground">
                        Find your perfect look.
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Discover official designs and community creations. <br className="hidden sm:inline" />
                    </p>
                </div>

                {/* Search & Controls */}
                <div className="max-w-4xl mx-auto mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search templates, styles, or authors..."
                            className="pl-10 h-12 text-lg bg-secondary/30 border-border focus:border-accent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* View Mode Tabs (Official vs Community) */}
                        <div className="flex bg-secondary/50 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('official')}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                    viewMode === 'official' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Sparkles className="w-4 h-4" /> Official
                            </button>
                            <button
                                onClick={() => setViewMode('community')}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                    viewMode === 'community' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Globe className="w-4 h-4" /> Community
                            </button>
                        </div>

                        {/* Tier Filter (Only for Official) */}
                        {viewMode === 'official' && (
                            <Tabs defaultValue="all" onValueChange={(val) => setSelectedTier(val as any)}>
                                <TabsList className="bg-secondary/50">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="premium">Premium</TabsTrigger>
                                    <TabsTrigger value="luxury">Luxury</TabsTrigger>
                                    <TabsTrigger value="elite">Elite</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        )}
                    </div>
                </div>

                {/* Grid */}
                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
                        <AnimatePresence mode="popLayout">
                            {filteredTemplates.map((template) => {
                                const tierInfo = getTierInfo(template.tier);
                                const isHovered = hoveredTemplate === template.id;

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        key={template.id}
                                        className="group relative flex flex-col gap-4"
                                        onMouseEnter={() => setHoveredTemplate(template.id)}
                                        onMouseLeave={() => setHoveredTemplate(null)}
                                    >
                                        {/* Card Preview Container */}
                                        <div
                                            className="relative aspect-[4/5] bg-card/30 rounded-xl border border-border p-6 flex items-center justify-center overflow-hidden cursor-pointer group-hover:border-accent/30 transition-colors"
                                            onClick={() => setSelectedTemplate(template)}
                                        >
                                            {/* Background Glow */}
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                                style={{
                                                    background: `radial-gradient(circle at 50% 50%, ${template.colors.accent}15, transparent 70%)`
                                                }}
                                            />

                                            {/* 3D Tilt Wrapper */}
                                            <div
                                                className="relative w-full max-w-[280px] transition-transform duration-500 ease-out preserve-3d"
                                                style={{
                                                    transform: isHovered
                                                        ? 'perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(1.05)'
                                                        : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)',
                                                    transformStyle: 'preserve-3d'
                                                }}
                                            >
                                                <div className="pointer-events-none shadow-2xl">
                                                    <CardPreview
                                                        {...previewProps}
                                                        themeId={template.id}
                                                        businessName={template.businessName}
                                                        message={template.message}
                                                        ctaText={template.ctaText}
                                                        colors={template.colors}
                                                    />
                                                </div>
                                            </div>

                                            {/* Quick View Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 bg-gradient-to-t from-background/90 to-transparent">
                                                <div className="flex items-center justify-center">
                                                    <span className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                                        Preview Details
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Template Info */}
                                        <div className="space-y-2 px-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-serif text-lg text-foreground hover:text-accent transition-colors cursor-pointer" onClick={() => setSelectedTemplate(template)}>
                                                        {template.name}
                                                    </h3>
                                                    {template.author && (
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            by <span className="text-foreground font-medium">{template.author}</span>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className={cn("text-xs font-bold uppercase tracking-widest block mb-1", tierInfo.color)}>
                                                        {tierInfo.label}
                                                    </span>
                                                    {/* Rating */}
                                                    {(template.rating) && (
                                                        <div className="flex items-center justify-end gap-1 text-xs text-amber-400">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            <span className="font-medium text-foreground">{template.rating}</span>
                                                            <span className="text-muted-foreground">({template.reviews})</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-2">No templates found</h3>
                        <p className="text-muted-foreground">Try adjusting your search filters.</p>
                        <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setViewMode('official'); }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </main>

            {/* Template Details Modal */}
            <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
                    {selectedTemplate && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 h-[80vh] lg:h-[600px]">
                            {/* Left: Preview */}
                            <div className="relative bg-secondary/20 p-8 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0" style={{ background: selectedTemplate.colors.background, opacity: 0.05 }} />
                                <div className="relative z-10 scale-125 origin-center shadow-2xl">
                                    <div className="pointer-events-none">
                                        <CardPreview
                                            {...previewProps}
                                            themeId={selectedTemplate.id}
                                            businessName={selectedTemplate.businessName}
                                            message={selectedTemplate.message}
                                            ctaText={selectedTemplate.ctaText}
                                            colors={selectedTemplate.colors}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="p-8 flex flex-col h-full overflow-y-auto">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <Badge variant="outline" className={cn("mb-3 border-border", getTierInfo(selectedTemplate.tier).color)}>
                                            {getTierInfo(selectedTemplate.tier).label}
                                        </Badge>
                                        <h2 className="font-display text-3xl font-bold mb-1">{selectedTemplate.name}</h2>
                                        {selectedTemplate.author && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                                                    <User className="w-3 h-3 text-accent" />
                                                </div>
                                                <span>Designed by <span className="font-medium text-foreground">{selectedTemplate.author}</span></span>
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedTemplate(null)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Rating Data */}
                                {(selectedTemplate.rating) && (
                                    <div className="flex items-center gap-4 py-4 border-b border-border mb-6">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                            <span className="text-xl font-bold">{selectedTemplate.rating}</span>
                                        </div>
                                        <div className="h-4 w-px bg-border" />
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">{selectedTemplate.reviews}+</span> used this template
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">Description</h3>
                                        <p className="text-foreground/80 leading-relaxed">
                                            {selectedTemplate.description}
                                            <br className="mb-2" />
                                            Perfect for businesses looking to make a lasting impression.
                                            This template features a {selectedTemplate.category.toLowerCase()} design with customizable colors.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3">Color Palette</h3>
                                        <div className="flex gap-3">
                                            {Object.entries(selectedTemplate.colors).map(([key, value]) => {
                                                if (typeof value === 'string' && value.startsWith('#')) {
                                                    return (
                                                        <div key={key} className="group relative">
                                                            <div
                                                                className="w-10 h-10 rounded-full border border-border shadow-sm"
                                                                style={{ background: value }}
                                                            />
                                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 whitespace-nowrap bg-popover text-popover-foreground px-2 py-0.5 rounded shadow-sm transition-opacity z-20">
                                                                {key}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                                return null;
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-border">
                                    <Button
                                        className="w-full h-12 text-base shadow-lg hover:shadow-accent/20 transition-all hover:scale-[1.01]"
                                        onClick={() => navigate(`/create?template=${selectedTemplate.id}`)}
                                    >
                                        Use This Template
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
