import { useState } from 'react';
import { type QRStyleOptions } from '@/lib/qr-types';
import { Square, Circle, Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRStyleSelectorProps {
    style: QRStyleOptions;
    onChange: (style: QRStyleOptions) => void;
    colors: {
        dark: string;
        light: string;
        markerBorder?: string;
        markerCenter?: string;
    };
    onColorChange: (colors: any) => void;
}

export default function QRStyleSelector({
    style,
    onChange,
    colors,
    onColorChange
}: QRStyleSelectorProps) {

    const handleDotStyleChange = (dotStyle: 'square' | 'dots' | 'rounded') => {
        onChange({
            ...style,
            dotStyle
        });
    };

    return (
        <div className="space-y-3">
            {/* Pattern & Dots Group */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        Pattern
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                        <button
                            onClick={() => handleDotStyleChange('square')}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-md border transition-all h-20",
                                style.dotStyle === 'square'
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border hover:border-gray-400 text-muted-foreground"
                            )}
                            title="Square Pattern"
                        >
                            <Square className="w-4 h-4 mb-1 fill-current" />
                            <span className="text-[9px] font-medium">Square</span>
                        </button>

                        <button
                            onClick={() => handleDotStyleChange('rounded')}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-md border transition-all h-20",
                                style.dotStyle === 'rounded'
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border hover:border-gray-400 text-muted-foreground"
                            )}
                            title="Rounded Pattern"
                        >
                            <Square className="w-4 h-4 mb-1 fill-current rounded-[2px]" />
                            <span className="text-[9px] font-medium">Round</span>
                        </button>

                        <button
                            onClick={() => handleDotStyleChange('dots')}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-md border transition-all h-20",
                                style.dotStyle === 'dots'
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border hover:border-gray-400 text-muted-foreground"
                            )}
                            title="Dots Pattern"
                        >
                            <Circle className="w-4 h-4 mb-1 fill-current" />
                            <span className="text-[9px] font-medium">Dots</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        Corners
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                        <button
                            onClick={() => onChange({ ...style, cornerSquareStyle: 'square' })}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-md border transition-all h-20",
                                style.cornerSquareStyle === 'square'
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border hover:border-gray-400 text-muted-foreground"
                            )}
                            title="Square Corner"
                        >
                            <div className="w-4 h-4 border-2 border-current mb-1" />
                            <span className="text-[9px] font-medium">Square</span>
                        </button>

                        <button
                            onClick={() => onChange({ ...style, cornerSquareStyle: 'dot' })}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-md border transition-all h-20",
                                style.cornerSquareStyle === 'dot'
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border hover:border-gray-400 text-muted-foreground"
                            )}
                            title="Circle Corner"
                        >
                            <div className="w-4 h-4 border-2 border-current rounded-full mb-1" />
                            <span className="text-[9px] font-medium">Circle</span>
                        </button>

                        <button
                            onClick={() => onChange({ ...style, cornerSquareStyle: 'extra-rounded' })}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-md border transition-all h-20",
                                style.cornerSquareStyle === 'extra-rounded'
                                    ? "border-accent bg-accent/10 text-accent"
                                    : "border-border hover:border-gray-400 text-muted-foreground"
                            )}
                            title="Soft Corner"
                        >
                            <div className="w-4 h-4 border-2 border-current rounded-lg mb-1" />
                            <span className="text-[9px] font-medium">Soft</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Inner Dots - Horizontal Row */}
            <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground whitespace-nowrap w-16">
                    Inner Dot
                </label>
                <div className="flex-1 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onChange({ ...style, cornerDotStyle: 'square' })}
                        className={cn(
                            "flex items-center justify-center gap-2 p-1.5 rounded-md border transition-all",
                            style.cornerDotStyle === 'square'
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border hover:border-gray-400 text-muted-foreground"
                        )}
                    >
                        <Square className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-medium">Square</span>
                    </button>

                    <button
                        onClick={() => onChange({ ...style, cornerDotStyle: 'dot' })}
                        className={cn(
                            "flex items-center justify-center gap-2 p-1.5 rounded-md border transition-all",
                            style.cornerDotStyle === 'dot'
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border hover:border-gray-400 text-muted-foreground"
                        )}
                    >
                        <Circle className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-medium">Circle</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
