import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface QRLogoUploadProps {
    qrLogoUrl: string | null;
    onQRLogoChange: (url: string | null) => void;
    compact?: boolean;
}

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

export default function QRLogoUpload({ qrLogoUrl, onQRLogoChange, compact = false }: QRLogoUploadProps) {
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
            onQRLogoChange(result);
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

    const removeQRLogo = () => {
        onQRLogoChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    if (compact) {
        return (
            <div>
                {qrLogoUrl ? (
                    <div className="relative inline-block w-10 h-10 group">
                        <div className="w-full h-full p-1 border border-border bg-secondary/30 flex items-center justify-center rounded-md overflow-hidden">
                            <img
                                src={qrLogoUrl}
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={removeQRLogo}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-destructive text-destructive-foreground flex items-center justify-center rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove"
                        >
                            <X className="w-2 h-2" />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="w-10 h-10 border border-dashed border-border hover:border-accent hover:bg-accent/5 rounded-md flex items-center justify-center transition-colors focus-ring"
                        title="Upload Icon"
                    >
                        <Upload className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES.join(',')}
                    onChange={handleChange}
                    className="sr-only"
                />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    QR Code Logo (Optional)
                </label>
                <span className="text-[9px] text-muted-foreground/60 hidden">
                    Embedded in center
                </span>
            </div>

            {qrLogoUrl ? (
                <div className="relative inline-block w-full h-28">
                    <div className="w-full h-full p-2 border border-border bg-secondary/30 flex items-center justify-center rounded-md">
                        <img
                            src={qrLogoUrl}
                            alt="QR code logo"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={removeQRLogo}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background flex items-center justify-center hover:bg-destructive transition-colors focus-ring rounded-full shadow-md"
                        aria-label="Remove QR logo"
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
                        Upload QR Logo
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5 max-w-[140px]">
                        Square images best
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleChange}
                className="sr-only"
                aria-label="Upload QR code logo"
            />

            {error && (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}

            <p className="text-xs text-muted-foreground/60 hidden">
                Logo will be centered in the QR code. QR remains scannable with high error correction.
            </p>
        </div>
    );
}
