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
    if (file) {
      handleFile(file);
    }
    // Always reset the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  const removeLogo = () => {
    onLogoChange(null); // This updates the parent state
    // No need to manually reset input value here as we do it in handleChange, 
    // but good to keep it clean just in case.
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Logo (Optional)
      </label>

      {logoUrl ? (
        <div className="relative inline-block w-full h-28">
          <div className="w-full h-full p-2 border border-border bg-secondary/30 flex items-center justify-center rounded-md">
            <img
              src={logoUrl}
              alt="Uploaded logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={removeLogo}
            className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background flex items-center justify-center hover:bg-destructive transition-colors focus-ring rounded-full shadow-md"
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
            border border-dashed h-28 flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors rounded-md
            ${isDragging ? 'border-foreground bg-secondary/50' : 'border-border hover:border-muted-foreground'}
          `}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-medium">
            Upload Logo
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-0.5 max-w-[140px]">
            PNG, JPG, SVG
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
