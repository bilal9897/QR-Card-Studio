import { X, Shield, Smartphone, Users, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: 'Premium Card Design',
    description: 'Create beautiful, professional feedback cards that reflect your brand quality.',
  },
  {
    icon: Users,
    title: 'Built for Businesses',
    description: 'Perfect for salons, restaurants, cafes, clinics, retail stores, and service providers.',
  },
  {
    icon: Smartphone,
    title: '100% Offline',
    description: 'Works entirely in your browser. No internet required after the page loads.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'No data is stored, collected, or sent to any server. Your content stays private.',
  },
];

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border max-w-lg w-full p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors focus-ring"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-accent mb-2">
            About
          </p>
          <h2 id="about-title" className="font-serif text-2xl lg:text-3xl text-foreground mb-4">
            QR Card Studio
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            QR Card Studio is a privacy-first, design-led tool built to help 
            businesses create professional, print-ready QR feedback cards. 
            Collect reviews, build trust, and elevate your brand.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-accent/10 text-accent">
                <feature.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Who it's for */}
        <div className="p-4 bg-secondary/50 border border-border mb-6">
          <h3 className="font-medium text-foreground mb-2">Who is this for?</h3>
          <p className="text-sm text-muted-foreground">
            Any business that values customer feedback: salons, spas, restaurants, 
            cafes, clinics, dental offices, retail stores, hotels, auto services, 
            gyms, and more.
          </p>
        </div>

        {/* Privacy note */}
        <div className="p-4 bg-success/5 border border-success/20 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-success" />
            <h3 className="font-medium text-foreground">Privacy Promise</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            All data stays in your browser. Nothing is stored or sent to any server. 
            Your business information and designs remain completely private.
          </p>
        </div>

        {/* Attribution */}
        <p className="text-xs text-muted-foreground/60 text-center">
          A product by Codexa
        </p>
      </div>
    </div>
  );
}
