import { useRef, useState } from 'react';
import { Image, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackgroundUploadProps {
  backgroundUrl: string | null;
  showBackground: boolean;
  onBackgroundChange: (url: string | null) => void;
  onToggleBackground: (show: boolean) => void;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB for backgrounds
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function BackgroundUpload({ 
  backgroundUrl, 
  showBackground,
  onBackgroundChange, 
  onToggleBackground 
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
      <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Card Background (Optional)
      </label>

      {backgroundUrl ? (
        <div className="space-y-3">
          {/* Preview and controls */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 border border-border overflow-hidden">
              <img
                src={backgroundUrl}
                alt="Background preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleBackground(!showBackground)}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  showBackground ? "text-accent" : "text-muted-foreground"
                )}
                aria-pressed={showBackground}
              >
                {showBackground ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
                {showBackground ? 'Visible' : 'Hidden'}
              </button>
            </div>
            
            <button
              type="button"
              onClick={removeBackground}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors focus-ring"
              aria-label="Remove background"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border border-dashed border-border p-4 text-center hover:border-muted-foreground transition-colors focus-ring"
        >
          <Image className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Add background image
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Subtle texture or pattern • Max 5MB
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
