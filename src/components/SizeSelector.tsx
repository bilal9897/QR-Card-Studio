import { cn } from '@/lib/utils';
import { Settings2 } from 'lucide-react';
import { tableTentSizes, type CardSize, type CustomSize, type CardFormat, getDefaultCustomSize } from '@/lib/card-sizes';
import CustomSizeInput from './CustomSizeInput';

// Re-export for backwards compatibility
export type { CardSize } from '@/lib/card-sizes';
export { tableTentSizes as sizeConfigs, squareSizes as squareSizeConfigs } from '@/lib/card-sizes';

interface SizeSelectorProps {
  selected: CardSize;
  onSelect: (size: CardSize) => void;
  format: CardFormat;
  customSize?: CustomSize;
  onCustomSizeChange?: (size: CustomSize) => void;
}

export default function SizeSelector({ 
  selected, 
  onSelect, 
  format,
  customSize,
  onCustomSizeChange,
}: SizeSelectorProps) {
  const isCustomMode = selected === 'custom';
  
  const handleToggleCustom = () => {
    if (isCustomMode) {
      onSelect('medium');
    } else {
      onSelect('custom');
      if (onCustomSizeChange && !customSize) {
        onCustomSizeChange(getDefaultCustomSize(format));
      }
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Card Size
        </label>
        
        {/* Custom size toggle */}
        <button
          type="button"
          onClick={handleToggleCustom}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 text-xs transition-colors focus-ring',
            isCustomMode
              ? 'text-accent bg-accent/10 border border-accent/30'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Settings2 className="w-3 h-3" />
          Custom
        </button>
      </div>
      
      {/* Preset sizes */}
      {!isCustomMode && (
        <div className="flex gap-2">
          {(Object.keys(tableTentSizes) as Exclude<CardSize, 'custom'>[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className={cn(
                'size-option focus-ring flex-1',
                selected === size && 'active'
              )}
              aria-pressed={selected === size}
            >
              {tableTentSizes[size].label}
            </button>
          ))}
        </div>
      )}
      
      {/* Custom size inputs */}
      {isCustomMode && customSize && onCustomSizeChange && (
        <CustomSizeInput
          format={format}
          customSize={customSize}
          onChange={onCustomSizeChange}
        />
      )}
    </div>
  );
}
