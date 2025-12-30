import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface LogoUploadProps {
  logoUrl: string | null;
  onLogoChange: (url: string | null) => void;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export default function LogoUpload({ logoUrl, onLogoChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload PNG, JPG, SVG, or WebP');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('File must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onLogoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeLogo = () => {
    onLogoChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Logo (Optional)
      </label>

      {logoUrl ? (
        <div className="relative inline-block">
          <div className="p-4 border-2 border-border bg-secondary/30">
            <img
              src={logoUrl}
              alt="Uploaded logo"
              className="max-h-16 max-w-40 object-contain"
            />
          </div>
          <button
            type="button"
            onClick={removeLogo}
            className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background flex items-center justify-center hover:bg-destructive transition-colors focus-ring"
            aria-label="Remove logo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`
            border-2 border-dashed p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-foreground bg-secondary/50' : 'border-border hover:border-muted-foreground'}
          `}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop logo here or click to upload
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            PNG, JPG, SVG, WebP • Max 2MB
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleChange}
        className="sr-only"
        aria-label="Upload logo"
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
