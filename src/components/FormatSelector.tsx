import { cn } from '@/lib/utils';
import type { CardFormat } from './CardPreview';

interface FormatSelectorProps {
  selected: CardFormat;
  onSelect: (format: CardFormat) => void;
}

export default function FormatSelector({ selected, onSelect }: FormatSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Card Format
      </label>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Table Tent Option */}
        <button
          type="button"
          onClick={() => onSelect('table-tent')}
          className={cn(
            'format-option p-4 flex flex-col items-center gap-3 focus-ring',
            selected === 'table-tent' && 'active'
          )}
          aria-pressed={selected === 'table-tent'}
        >
          {/* Miniature preview */}
          <div className="w-12 h-18 border-2 border-current opacity-60" style={{ height: '72px' }}>
            <div className="w-full h-full flex flex-col items-center justify-center p-1">
              <div className="w-4 h-4 border border-current mb-1" />
              <div className="w-6 h-0.5 bg-current opacity-40" />
            </div>
          </div>
          <span className="text-sm font-medium">Table Tent</span>
        </button>

        {/* Square Option */}
        <button
          type="button"
          onClick={() => onSelect('square')}
          className={cn(
            'format-option p-4 flex flex-col items-center gap-3 focus-ring',
            selected === 'square' && 'active'
          )}
          aria-pressed={selected === 'square'}
        >
          {/* Miniature preview */}
          <div className="w-14 h-14 border-2 border-current opacity-60">
            <div className="w-full h-full flex items-end justify-end p-1">
              <div className="w-4 h-4 border border-current" />
            </div>
          </div>
          <span className="text-sm font-medium">Square</span>
        </button>
      </div>
    </div>
  );
}
