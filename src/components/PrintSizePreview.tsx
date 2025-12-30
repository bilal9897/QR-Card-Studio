import { forwardRef, type ReactNode, useEffect } from 'react';
import { X, Maximize2, Monitor } from 'lucide-react';
import { getSizeConfig, type CardSize, type CardFormat, type CustomSize } from '@/lib/card-sizes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PrintSizePreviewProps {
  format: CardFormat;
  size: CardSize;
  customSize?: CustomSize;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Standard screen DPI (CSS pixels)
const SCREEN_DPI = 96;

/**
 * Calculate actual print dimensions in screen pixels
 */
function getActualPrintPixels(
  format: CardFormat,
  size: CardSize,
  customSize?: CustomSize
): { width: number; height: number } {
  const config = getSizeConfig(format, size, customSize);
  return {
    width: Math.round(config.width * SCREEN_DPI),
    height: Math.round(config.height * SCREEN_DPI),
  };
}

const PrintSizePreview = forwardRef<HTMLDivElement, PrintSizePreviewProps>(
  ({ format, size, customSize, isOpen, onClose, children }, ref) => {
    // Handle Escape key to close
    useEffect(() => {
      if (!isOpen) return;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;

    const printPixels = getActualPrintPixels(format, size, customSize);
    const config = getSizeConfig(format, size, customSize);

    return (
      <div 
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
        role="dialog"
        aria-label="Print size preview"
        aria-modal="true"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Maximize2 className="w-4 h-4 text-accent" />
            <div>
              <h2 className="text-sm font-medium">Actual Print Size Preview</h2>
              <p className="text-xs text-muted-foreground">
                {config.width.toFixed(1)}" × {config.height.toFixed(1)}" at {SCREEN_DPI} DPI (screen)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary/50 text-xs text-muted-foreground">
                    <Monitor className="w-3 h-3" />
                    {SCREEN_DPI} DPI
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs max-w-xs">
                  Standard screen resolution. Actual size may vary based on your display's pixel density.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary transition-colors focus-ring"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable preview area */}
        <div 
          className="absolute top-[65px] bottom-0 left-0 right-0 overflow-auto p-8"
          style={{ 
            background: 'repeating-conic-gradient(hsl(var(--muted)) 0% 25%, transparent 0% 50%) 50% / 20px 20px'
          }}
        >
          <div className="min-h-full flex items-center justify-center">
            <div 
              ref={ref}
              className="relative shadow-2xl"
              style={{
                width: `${printPixels.width}px`,
                height: `${printPixels.height}px`,
              }}
            >
              {/* Scale children to fill print dimensions */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: 'scale(1)',
                  transformOrigin: 'center center',
                }}
              >
                <div 
                  className="origin-top-left"
                  style={{
                    transform: `scale(${printPixels.width / 320})`, // Scale from base size
                  }}
                >
                  {children}
                </div>
              </div>
              
              {/* Dimension labels */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
                {printPixels.width}px ({config.width.toFixed(1)}")
              </div>
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground whitespace-nowrap origin-center rotate-90">
                {printPixels.height}px ({config.height.toFixed(1)}")
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1.5 border border-border">
          Press <kbd className="px-1 py-0.5 bg-secondary text-foreground mx-1">Esc</kbd> or click × to close
        </div>
      </div>
    );
  }
);

PrintSizePreview.displayName = 'PrintSizePreview';

export default PrintSizePreview;
