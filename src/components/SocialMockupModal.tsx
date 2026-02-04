
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Image as ImageIcon, Sparkles, Type, Move, Layers, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toJpeg } from 'html-to-image';
import CardPreview from '@/components/CardPreview';

interface SocialMockupModalProps {
    cardProps: any;
}

const BACKGROUNDS = [
    { id: 'marble', name: 'Marble', style: { backgroundImage: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)' } },
    { id: 'wood', name: 'Dark Wood', style: { background: 'url(https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=2070&auto=format&fit=crop) center/cover' } },
    { id: 'concrete', name: 'Concrete', style: { background: 'url(https://images.unsplash.com/photo-1518640165980-d3e0e2aa2c19?q=80&w=2000&auto=format&fit=crop) center/cover' } },
    { id: 'neon', name: 'Neon Flow', style: { background: 'conic-gradient(at 0% 0%, rgb(33, 29, 36) 0, transparent 83%), padding-box, conic-gradient(from 180deg at 50% 50%, rgb(18, 14, 21) 0, transparent 40%), padding-box, radial-gradient(at 50% 50%, rgb(43, 29, 61) 0, transparent 50%)' } },
    { id: 'gradient', name: 'Soft Gradient', style: { background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' } },
    { id: 'bokeh', name: 'Night Bokeh', style: { background: 'url(https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=1931&auto=format&fit=crop) center/cover' } },
];

export default function SocialMockupModal({ cardProps }: SocialMockupModalProps) {
    const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0]);
    const [scale, setScale] = useState([1]);
    const [rotation, setRotation] = useState([-5]);
    const [shadow, setShadow] = useState([30]);
    const [caption, setCaption] = useState('');
    const [captionColor, setCaptionColor] = useState('#ffffff');
    const [isGenerating, setIsGenerating] = useState(false);

    const mockupRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!mockupRef.current) return;
        setIsGenerating(true);

        try {
            const images = mockupRef.current.getElementsByTagName('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
            }));
            await new Promise(resolve => setTimeout(resolve, 800));

            const dataUrl = await toJpeg(mockupRef.current, {
                quality: 0.95,
                width: 1080,
                height: 1080,
            });

            const link = document.createElement('a');
            link.download = 'social-mockup.jpg';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed', err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto border-dashed">
                    <ImageIcon className="w-4 h-4" />
                    Create Social Mockup
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl">
                <DialogHeader className="p-6 pb-4 border-b border-border/40 shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        Social Studio
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* Setting Panel */}
                    <div className="w-full md:w-80 border-r border-border/40 bg-card/30 flex flex-col shrink-0">
                        <Tabs defaultValue="scene" className="flex-1 flex flex-col">
                            <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent border-b border-border/40 px-2">
                                <TabsTrigger value="scene" className="text-xs data-[state=active]:bg-accent/10 data-[state=active]:text-accent">Scene</TabsTrigger>
                                <TabsTrigger value="position" className="text-xs data-[state=active]:bg-accent/10 data-[state=active]:text-accent">Card</TabsTrigger>
                                <TabsTrigger value="text" className="text-xs data-[state=active]:bg-accent/10 data-[state=active]:text-accent">Text</TabsTrigger>
                            </TabsList>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <TabsContent value="scene" className="mt-0 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Background</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {BACKGROUNDS.map(bg => (
                                                <button
                                                    key={bg.id}
                                                    onClick={() => setSelectedBg(bg)}
                                                    className={cn(
                                                        "group relative aspect-video rounded-lg overflow-hidden border transition-all",
                                                        selectedBg.id === bg.id
                                                            ? "border-accent ring-2 ring-accent/20"
                                                            : "border-border/50 hover:border-accent/50"
                                                    )}
                                                >
                                                    <div className="absolute inset-0 transition-transform group-hover:scale-110" style={bg.style} />
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                    <span className="absolute bottom-2 left-2 text-xs font-medium text-white shadow-sm">{bg.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="position" className="mt-0 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <Label>Size</Label>
                                                <span className="text-xs text-muted-foreground">{Math.round(scale[0] * 100)}%</span>
                                            </div>
                                            <Slider value={scale} onValueChange={setScale} min={0.5} max={1.5} step={0.05} />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <Label>Rotation</Label>
                                                <span className="text-xs text-muted-foreground">{rotation[0]}°</span>
                                            </div>
                                            <Slider value={rotation} onValueChange={setRotation} min={-45} max={45} step={1} />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <Label>Shadow Intensity</Label>
                                                <span className="text-xs text-muted-foreground">{shadow[0]}px</span>
                                            </div>
                                            <Slider value={shadow} onValueChange={setShadow} min={0} max={100} step={5} />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="text" className="mt-0 space-y-6">
                                    <div className="space-y-3">
                                        <Label>Caption Overlay</Label>
                                        <Input
                                            placeholder="Enter caption..."
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            maxLength={40}
                                        />
                                        <div className="flex items-center gap-2 mt-2">
                                            <Label className="text-xs">Color:</Label>
                                            <div className="flex gap-2">
                                                {['#ffffff', '#000000', '#c9a961', '#ff0000'].map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setCaptionColor(c)}
                                                        className={cn("w-6 h-6 rounded-full border border-white/20", captionColor === c && "ring-2 ring-accent")}
                                                        style={{ background: c }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>

                            <div className="p-4 border-t border-border/40 bg-card/50">
                                <Button onClick={handleDownload} disabled={isGenerating} size="lg" className="w-full gap-2 shadow-lg hover:shadow-accent/20 transition-all">
                                    <Download className="w-4 h-4" />
                                    {isGenerating ? 'Rendering...' : 'Download HD Image'}
                                </Button>
                            </div>
                        </Tabs>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 bg-black/50 p-8 flex items-center justify-center overflow-auto relative select-none">
                        <div
                            ref={mockupRef}
                            className="relative shrink-0 shadow-2xl flex items-center justify-center overflow-hidden bg-black ring-1 ring-white/10"
                            style={{
                                ...selectedBg.style,
                                width: '1080px',
                                height: '1080px',
                                transform: 'scale(0.55)', // Viewport scale
                            }}
                        >
                            {/* Caption Layer */}
                            {caption && (
                                <div
                                    className="absolute top-24 left-0 w-full text-center z-20 px-12"
                                    style={{
                                        color: captionColor,
                                        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    <h2 className="text-6xl font-bold font-serif italic">{caption}</h2>
                                </div>
                            )}

                            {/* Card container with transforms */}
                            <div
                                className="relative transition-all duration-300 ease-out z-10"
                                style={{
                                    transform: `scale(${scale[0]}) rotate(${rotation[0]}deg)`,
                                    filter: `drop-shadow(0 ${shadow[0]}px ${shadow[0] * 1.5}px rgba(0,0,0,0.4))`
                                }}
                            >
                                <CardPreview {...cardProps} />
                            </div>
                        </div>

                        <p className="absolute bottom-4 text-xs text-muted-foreground/50 pointer-events-none">
                            Preview scaled to fit screen. Downloads at 1080x1080px.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
