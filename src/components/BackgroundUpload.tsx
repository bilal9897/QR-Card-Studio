import { useRef, useState } from 'react';
import { Image, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface BackgroundUploadProps {
  backgroundUrl: string | null;
  showBackground: boolean;
  backgroundOpacity: number;
  onBackgroundChange: (url: string | null) => void;
  onToggleBackground: (show: boolean) => void;
  onOpacityChange: (opacity: number) => void;
}

const MAX_SIZE = 3 * 1024 * 1024; // 3MB for backgrounds
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function BackgroundUpload({
  backgroundUrl,
  showBackground,
  backgroundOpacity,
  onBackgroundChange,
  onToggleBackground,
  onOpacityChange
}: BackgroundUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload PNG, JPG, or WebP');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('File must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onBackgroundChange(result);
      onToggleBackground(true);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeBackground = () => {
    onBackgroundChange(null);
    onToggleBackground(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Card Background (Optional)
      </label>

      {backgroundUrl ? (
        <div className="space-y-3 h-28 flex flex-col justify-center">
          {/* Preview and controls */}
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 border border-border overflow-hidden rounded-md flex-shrink-0">
              <img
                src={backgroundUrl}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <button
                type="button"
                onClick={() => onToggleBackground(!showBackground)}
                className={cn(
                  "flex items-center gap-1.5 text-xs transition-colors p-1.5 rounded-md border w-full justify-center h-8",
                  showBackground
                    ? "text-accent border-accent/20 bg-accent/5"
                    : "text-muted-foreground border-border hover:bg-secondary"
                )}
                aria-pressed={showBackground}
              >
                {showBackground ? (
                  <ToggleRight className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ToggleLeft className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="truncate">{showBackground ? 'Visible' : 'Hidden'}</span>
              </button>

              {showBackground && (
                <div className="space-y-1 px-0.5 animate-accordion-down">
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground uppercase tracking-widest">
                    <span>Opacity</span>
                    <span>{Math.round(backgroundOpacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[backgroundOpacity]}
                    min={0.05}
                    max={1}
                    step={0.05}
                    onValueChange={(vals) => onOpacityChange(vals[0])}
                    className="py-0"
                  />
                </div>
              )}

              {!showBackground && (
                <button
                  type="button"
                  onClick={removeBackground}
                  className="flex items-center gap-1.5 text-[10px] text-destructive hover:text-destructive/80 transition-colors justify-center pt-1"
                  aria-label="Remove background"
                >
                  <X className="w-3 h-3" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-28 border border-dashed border-border flex flex-col items-center justify-center p-2 text-center hover:border-muted-foreground transition-colors focus-ring rounded-md"
        >
          <Image className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-medium">
            Add Background
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-0.5 max-w-[140px]">
            Subtle texture or pattern
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="sr-only"
        aria-label="Upload background image"
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
