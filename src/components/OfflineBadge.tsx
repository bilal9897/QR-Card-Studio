import { Shield, Info } from 'lucide-react';
import { useState } from 'react';

export default function OfflineBadge() {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        type="button"
        className="offline-badge focus-ring"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-describedby="offline-tooltip"
      >
        <Shield className="w-3 h-3" aria-hidden="true" />
        <span>100% Offline</span>
        <Info className="w-3 h-3 opacity-60" aria-hidden="true" />
      </button>
      
      {showTooltip && (
        <div
          id="offline-tooltip"
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-card border border-border text-sm text-foreground max-w-xs z-50 shadow-elevated"
        >
          <p className="font-medium mb-1">Your data stays private</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            All data stays in your browser. Nothing is stored or sent to any server. 
            Works completely offline after initial load.
          </p>
          {/* Tooltip arrow */}
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-card"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
