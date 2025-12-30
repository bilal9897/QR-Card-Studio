import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Smartphone, CheckCircle, Wifi, Share, Plus, ArrowLeft, Monitor, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    setIsAndroid(/Android/.test(ua));
    
    // Check if already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(isInStandaloneMode);
    setIsInstalled(isInStandaloneMode);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-serif text-xl text-foreground">QR Card Studio</span>
          </Link>
          <Link 
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </header>

      <main className="container py-12 px-4 max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
            Install QR Card Studio
          </h1>
          <p className="text-muted-foreground text-lg">
            Add to your home screen for instant access, offline use, and a native app experience.
          </p>
        </div>

        {/* Already installed */}
        {isInstalled && (
          <div className="p-6 bg-success/10 border border-success/20 text-center mb-8">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h2 className="text-xl font-medium text-foreground mb-2">Already Installed!</h2>
            <p className="text-muted-foreground mb-4">
              QR Card Studio is installed on your device. Open it from your home screen.
            </p>
            <Link 
              to="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Open App
            </Link>
          </div>
        )}

        {/* Install button for Android/Chrome */}
        {!isInstalled && deferredPrompt && (
          <div className="p-6 bg-card border border-border text-center mb-8">
            <button
              onClick={handleInstall}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 text-lg px-8 py-4"
            >
              <Download className="w-5 h-5" />
              Install App
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              Quick install — no app store needed
            </p>
          </div>
        )}

        {/* iOS Instructions */}
        {!isInstalled && isIOS && !isStandalone && (
          <div className="p-6 bg-card border border-border mb-8">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Share className="w-5 h-5 text-accent" />
              Install on iPhone/iPad
            </h2>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span>Tap the <strong className="text-foreground">Share</strong> button <Share className="w-4 h-4 inline" /> in Safari's toolbar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span>Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong> <Plus className="w-4 h-4 inline" /></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <span>Tap <strong className="text-foreground">"Add"</strong> in the top right</span>
              </li>
            </ol>
          </div>
        )}

        {/* Android manual instructions */}
        {!isInstalled && isAndroid && !deferredPrompt && (
          <div className="p-6 bg-card border border-border mb-8">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-accent" />
              Install on Android
            </h2>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span>Tap the <strong className="text-foreground">menu</strong> (⋮) in Chrome</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span>Tap <strong className="text-foreground">"Add to Home screen"</strong> or <strong className="text-foreground">"Install app"</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <span>Confirm by tapping <strong className="text-foreground">"Add"</strong></span>
              </li>
            </ol>
          </div>
        )}

        {/* Desktop instructions */}
        {!isInstalled && !isIOS && !isAndroid && !deferredPrompt && (
          <div className="p-6 bg-card border border-border mb-8">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-accent" />
              Install on Desktop
            </h2>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span>Look for the <strong className="text-foreground">install icon</strong> in your browser's address bar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-accent/10 text-accent text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span>Click it and select <strong className="text-foreground">"Install"</strong></span>
              </li>
            </ol>
          </div>
        )}

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="p-4 bg-card/50 border border-border/50 text-center">
            <Wifi className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-medium text-foreground text-sm mb-1">Works Offline</h3>
            <p className="text-xs text-muted-foreground">Create cards without internet</p>
          </div>
          <div className="p-4 bg-card/50 border border-border/50 text-center">
            <Smartphone className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-medium text-foreground text-sm mb-1">Native Feel</h3>
            <p className="text-xs text-muted-foreground">Full-screen app experience</p>
          </div>
          <div className="p-4 bg-card/50 border border-border/50 text-center">
            <Download className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-medium text-foreground text-sm mb-1">Instant Access</h3>
            <p className="text-xs text-muted-foreground">Launch from home screen</p>
          </div>
        </div>

        {/* Back to app */}
        <div className="text-center">
          <Link 
            to="/"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            ← Continue using in browser
          </Link>
        </div>
      </main>
    </div>
  );
}
