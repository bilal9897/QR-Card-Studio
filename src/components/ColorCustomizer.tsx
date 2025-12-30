import { cn } from '@/lib/utils';
import { colorPresets, type CardColors, type ColorPreset } from '@/lib/card-colors';
import { Palette } from 'lucide-react';
import { useState } from 'react';

interface ColorCustomizerProps {
  colors: CardColors;
  selectedPresetId: string | null;
  onPresetSelect: (preset: ColorPreset) => void;
  onCustomColorChange: (colors: CardColors) => void;
}

export default function ColorCustomizer({
  colors,
  selectedPresetId,
  onPresetSelect,
  onCustomColorChange,
}: ColorCustomizerProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent" />
          <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Card Colors
          </label>
        </div>
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs text-accent hover:underline focus-ring"
        >
          {showCustom ? 'Show Presets' : 'Custom Colors'}
        </button>
      </div>

      {!showCustom ? (
        /* Color presets */
        <div className="grid grid-cols-3 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onPresetSelect(preset)}
              className={cn(
                'p-3 border transition-all focus-ring text-left',
                selectedPresetId === preset.id
                  ? 'border-accent ring-1 ring-accent'
                  : 'border-border hover:border-muted-foreground'
              )}
              aria-pressed={selectedPresetId === preset.id}
            >
              {/* Color preview swatches */}
              <div className="flex gap-1 mb-2">
                <div
                  className="w-4 h-4 border border-border/50"
                  style={{ backgroundColor: preset.colors.background }}
                  aria-hidden="true"
                />
                <div
                  className="w-4 h-4 border border-border/50"
                  style={{ backgroundColor: preset.colors.text }}
                  aria-hidden="true"
                />
                <div
                  className="w-4 h-4 border border-border/50"
                  style={{ backgroundColor: preset.colors.accent }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs text-foreground truncate">{preset.name}</p>
            </button>
          ))}
        </div>
      ) : (
        /* Custom color pickers */
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="bg-color" className="text-xs text-muted-foreground">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="bg-color"
                  value={colors.background}
                  onChange={(e) => onCustomColorChange({ ...colors, background: e.target.value })}
                  className="w-10 h-10 border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.background}
                  onChange={(e) => onCustomColorChange({ ...colors, background: e.target.value })}
                  className="flex-1 bg-secondary border-none px-2 py-1 text-sm font-mono focus-ring"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="text-color" className="text-xs text-muted-foreground">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="text-color"
                  value={colors.text}
                  onChange={(e) => onCustomColorChange({ ...colors, text: e.target.value })}
                  className="w-10 h-10 border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.text}
                  onChange={(e) => onCustomColorChange({ ...colors, text: e.target.value })}
                  className="flex-1 bg-secondary border-none px-2 py-1 text-sm font-mono focus-ring"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="accent-color" className="text-xs text-muted-foreground">
                Accent
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="accent-color"
                  value={colors.accent}
                  onChange={(e) => onCustomColorChange({ ...colors, accent: e.target.value })}
                  className="w-10 h-10 border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.accent}
                  onChange={(e) => onCustomColorChange({ ...colors, accent: e.target.value })}
                  className="flex-1 bg-secondary border-none px-2 py-1 text-sm font-mono focus-ring"
                  placeholder="#b8956e"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="qr-color" className="text-xs text-muted-foreground">
                QR Code
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="qr-color"
                  value={colors.qrColor}
                  onChange={(e) => onCustomColorChange({ ...colors, qrColor: e.target.value })}
                  className="w-10 h-10 border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={colors.qrColor}
                  onChange={(e) => onCustomColorChange({ ...colors, qrColor: e.target.value })}
                  className="flex-1 bg-secondary border-none px-2 py-1 text-sm font-mono focus-ring"
                  placeholder="#1a1815"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
