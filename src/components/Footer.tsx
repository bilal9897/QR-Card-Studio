import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Shield, Sparkles, Code2 } from 'lucide-react';

interface FooterProps {
  onAboutClick: () => void;
}

const WHATSAPP_NUMBER = '919627897600';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi, I have a query regarding QR Card Studio.'
);
const EMAIL = 'bilalsalmani600@gmail.com';

export default function Footer({ onAboutClick }: FooterProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
  const emailUrl = `mailto:${EMAIL}?subject=QR Card Studio Inquiry`;

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-serif text-lg text-foreground">QR Card Studio</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Premium QR feedback card generator for businesses
              that value their customers.
            </p>
            <div className="flex items-center gap-2 text-xs text-success">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Offline • Zero Data Collection</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onAboutClick}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring"
                >
                  About QR Studio
                </button>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring"
                >
                  About Codexa
                </Link>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring"
                >
                  Stand Gallery
                </a>
              </li>
              <li>
                <a
                  href="#create"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring"
                >
                  Create Card
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">
              Contact & Orders
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={emailUrl}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring"
                >
                  <Mail className="w-4 h-4" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order via WhatsApp
                </a>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground/60 mt-4">
              For stand orders, bulk printing, and custom branding requests.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground text-center md:text-left">
              All data stays in your browser. Nothing is stored or sent to any server.
            </p>

            {/* Brand Credit */}
            <p className="text-xs text-muted-foreground/70 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>Created with ❤️ by Bilal • © Codexa</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
