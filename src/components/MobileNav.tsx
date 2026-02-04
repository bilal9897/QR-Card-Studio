import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

interface MobileNavProps {
  onAboutClick: () => void;
}

export default function MobileNav({ onAboutClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAboutClick = () => {
    onAboutClick();
    setIsOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:text-accent transition-colors focus-ring"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            className="absolute right-0 top-0 h-full w-[280px] bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-serif text-lg text-foreground">Menu</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors focus-ring"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <a
                    href="#create"
                    onClick={handleNavClick}
                    className="block px-4 py-3 text-foreground hover:bg-secondary/50 transition-colors focus-ring"
                  >
                    Create Card
                  </a>
                </li>
                <li>
                  <a
                    href="/templates"
                    onClick={handleNavClick}
                    className="block px-4 py-3 text-foreground hover:bg-secondary/50 transition-colors focus-ring"
                  >
                    Templates Gallery
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleAboutClick}
                    className="w-full text-left px-4 py-3 text-foreground hover:bg-secondary/50 transition-colors focus-ring"
                  >
                    About
                  </button>
                </li>
              </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                100% Offline • Zero Data Collection
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
