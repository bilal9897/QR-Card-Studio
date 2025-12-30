import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Settings2, AlertTriangle, Lock, Unlock } from 'lucide-react';
import { 
  type CustomSize, 
  type SizeUnit, 
  validateCustomSize,
  getDefaultCustomSize,
  convertFromInches,
  convertToInches,
  SIZE_LIMITS,
  getFormatAspectRatio,
} from '@/lib/card-sizes';
import type { CardFormat } from '@/lib/card-sizes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CustomSizeInputProps {
  format: CardFormat;
  customSize: CustomSize;
  onChange: (size: CustomSize) => void;
}

const UNITS: { value: SizeUnit; label: string }[] = [
  { value: 'inch', label: 'in' },
  { value: 'mm', label: 'mm' },
  { value: 'px', label: 'px' },
];

export default function CustomSizeInput({ format, customSize, onChange }: CustomSizeInputProps) {
  const [localWidth, setLocalWidth] = useState(customSize.width.toString());
  const [localHeight, setLocalHeight] = useState(customSize.height.toString());
  const [aspectLocked, setAspectLocked] = useState(true);
  
  // Calculate and store initial aspect ratio based on format
  const [lockedAspectRatio, setLockedAspectRatio] = useState(() => {
    return getFormatAspectRatio(format);
  });
  
  const validation = validateCustomSize(customSize);
  
  // Update local state when customSize changes from parent
  useEffect(() => {
    setLocalWidth(customSize.width.toString());
    setLocalHeight(customSize.height.toString());
  }, [customSize.width, customSize.height]);
  
  // Update locked aspect ratio when format changes
  useEffect(() => {
    if (aspectLocked) {
      setLockedAspectRatio(getFormatAspectRatio(format));
      // Reset to default size for new format
      const defaultSize = getDefaultCustomSize(format, customSize.unit);
      onChange(defaultSize);
    }
  }, [format]);
  
  const handleWidthChange = useCallback((value: string) => {
    setLocalWidth(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      if (aspectLocked) {
        // Auto-adjust height based on locked aspect ratio
        const newHeight = num / lockedAspectRatio;
        setLocalHeight(newHeight.toFixed(customSize.unit === 'px' ? 0 : 1));
        onChange({ ...customSize, width: num, height: newHeight });
      } else {
        onChange({ ...customSize, width: num });
      }
    }
  }, [aspectLocked, lockedAspectRatio, customSize, onChange]);
  
  const handleHeightChange = useCallback((value: string) => {
    setLocalHeight(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      if (aspectLocked) {
        // Auto-adjust width based on locked aspect ratio
        const newWidth = num * lockedAspectRatio;
        setLocalWidth(newWidth.toFixed(customSize.unit === 'px' ? 0 : 1));
        onChange({ ...customSize, width: newWidth, height: num });
      } else {
        onChange({ ...customSize, height: num });
      }
    }
  }, [aspectLocked, lockedAspectRatio, customSize, onChange]);
  
  const handleUnitChange = (newUnit: SizeUnit) => {
    // Convert current values to new unit
    const widthInches = convertToInches(customSize.width, customSize.unit);
    const heightInches = convertToInches(customSize.height, customSize.unit);
    
    const newWidth = convertFromInches(widthInches, newUnit);
    const newHeight = convertFromInches(heightInches, newUnit);
    
    onChange({
      width: newWidth,
      height: newHeight,
      unit: newUnit,
    });
  };
  
  const handleToggleAspectLock = () => {
    if (!aspectLocked) {
      // When locking, capture current aspect ratio
      const currentRatio = customSize.width / customSize.height;
      setLockedAspectRatio(currentRatio);
    }
    setAspectLocked(!aspectLocked);
  };
  
  const handleReset = () => {
    const defaultSize = getDefaultCustomSize(format, customSize.unit);
    setLockedAspectRatio(getFormatAspectRatio(format));
    onChange(defaultSize);
  };
  
  // Get limits in current unit for display
  const minWidth = convertFromInches(SIZE_LIMITS.minWidth, customSize.unit);
  const maxWidth = convertFromInches(SIZE_LIMITS.maxWidth, customSize.unit);
  
  return (
    <div className="space-y-3 pt-3 border-t border-border/50">
      {/* Unit selector + Aspect lock */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Unit</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {UNITS.map((unit) => (
              <button
                key={unit.value}
                type="button"
                onClick={() => handleUnitChange(unit.value)}
                className={cn(
                  'px-2 py-1 text-xs font-medium transition-colors focus-ring',
                  customSize.unit === unit.value
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                )}
              >
                {unit.label}
              </button>
            ))}
          </div>
          
          {/* Aspect ratio lock toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleToggleAspectLock}
                  aria-label={aspectLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
                  aria-pressed={aspectLocked}
                  className={cn(
                    'p-1.5 transition-colors focus-ring',
                    aspectLocked
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {aspectLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {aspectLocked 
                  ? 'Lock aspect ratio to prevent distortion' 
                  : 'Aspect ratio unlocked - dimensions editable independently'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Dimension inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Width</label>
          <div className="relative">
            <input
              type="number"
              value={localWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
              min={minWidth}
              max={maxWidth}
              step={customSize.unit === 'px' ? 10 : 0.1}
              className={cn(
                'input-editorial w-full pr-8',
                !validation.valid && 'border-destructive/50'
              )}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {customSize.unit}
            </span>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Height</label>
          <div className="relative">
            <input
              type="number"
              value={localHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
              min={minWidth}
              max={maxWidth}
              step={customSize.unit === 'px' ? 10 : 0.1}
              className={cn(
                'input-editorial w-full pr-8',
                !validation.valid && 'border-destructive/50'
              )}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {customSize.unit}
            </span>
          </div>
        </div>
      </div>
      
      {/* Aspect lock indicator */}
      {aspectLocked && (
        <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5" />
          Aspect ratio locked ({format === 'table-tent' ? '2:3' : '1:1'})
        </p>
      )}
      
      {/* Validation error */}
      {!validation.valid && (
        <div className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/20 text-xs text-destructive">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{validation.error}</span>
        </div>
      )}
      
      {/* Info text */}
      <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
        <Settings2 className="w-3 h-3" />
        Recommended for professional printing • 300 DPI export
      </p>
      
      {/* Reset button */}
      <button
        type="button"
        onClick={handleReset}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Reset to default
      </button>
    </div>
  );
}
