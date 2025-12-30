import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Code2, Zap, Globe, Lock, Smartphone } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const products = [
  {
    name: 'QR Card Studio',
    description: 'Professional QR feedback cards for businesses. Print-ready, beautiful, and privacy-first.',
    status: 'Live',
    url: '/',
  },
];

const values = [
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data stays on your device. No servers, no tracking, no compromises.',
  },
  {
    icon: Zap,
    title: 'Performance Focused',
    description: 'Fast, lightweight applications that work even on slow connections.',
  },
  {
    icon: Globe,
    title: 'Offline Ready',
    description: 'Full functionality without internet. Install as a native app on any device.',
  },
  {
    icon: Smartphone,
    title: 'Universal Access',
    description: 'Built for all devices and screen sizes with accessibility in mind.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container flex items-center justify-between py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-16 lg:py-24">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Code2 className="w-8 h-8 text-accent" />
            <span className="font-serif text-3xl lg:text-4xl text-foreground">Codexa</span>
          </div>
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8">
            Building privacy-first web products that respect users and just work.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-success">
            <Shield className="w-4 h-4" />
            <span>Zero data collection. Ever.</span>
          </div>
        </div>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-xs uppercase tracking-widest text-accent mb-8 text-center">
            Our Principles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div 
                key={value.title}
                className="p-6 bg-card border border-border"
              >
                <value.icon className="w-6 h-6 text-accent mb-4" />
                <h3 className="font-medium text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="mb-20">
          <h2 className="text-xs uppercase tracking-widest text-accent mb-8 text-center">
            Products
          </h2>
          <div className="max-w-2xl mx-auto">
            {products.map((product) => (
              <Link
                key={product.name}
                to={product.url}
                className="block p-6 bg-card border border-border hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-xs uppercase tracking-wider px-2 py-1 bg-success/10 text-success border border-success/20">
                    {product.status}
                  </span>
                </div>
                <p className="text-muted-foreground">{product.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-2xl mx-auto">
          <div className="p-8 bg-secondary/30 border border-border text-center">
            <h2 className="font-serif text-2xl text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We believe great software should be simple, fast, and private by default. 
              Every product we build processes data locally on your device—no servers 
              storing your information, no analytics tracking your behavior.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Based in India. Building for the world.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center">
          <p className="text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>© Codexa — Building privacy-first web products.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
