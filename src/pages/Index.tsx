import { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Download, Sparkles, AlertCircle, FileText, ChevronDown, Printer, Check, Maximize2 } from 'lucide-react';
import CardPreview, { type CardFormat, getPrintSize } from '@/components/CardPreview';
import FormatSelector from '@/components/FormatSelector';
import SizeSelector, { type CardSize } from '@/components/SizeSelector';
import { type CustomSize, validateCustomSize, getSizeConfig } from '@/lib/card-sizes';
import LogoUpload from '@/components/LogoUpload';
import BackgroundUpload from '@/components/BackgroundUpload';
import InputField from '@/components/InputField';
import TemplateSelector from '@/components/TemplateSelector';
import OfflineBadge from '@/components/OfflineBadge';
import ThemeToggle from '@/components/ThemeToggle';
import ColorCustomizer from '@/components/ColorCustomizer';
import StandGallery from '@/components/StandGallery';
import AboutModal from '@/components/AboutModal';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import InstallBanner from '@/components/InstallBanner';
import { EmailShare } from '@/components/EmailShare';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import PrintSizePreview from '@/components/PrintSizePreview';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';
import PWAInstallButton from '@/components/PWAInstallButton';
import { generateQRCode } from '@/lib/qr-generator';
import { 
  validateBusinessName, 
  validateMessage, 
  validateFeedbackUrl, 
  validateCtaText,
  isFormValid,
  cleanInput
} from '@/lib/validation';
import { defaultColors, type CardColors, type ColorPreset } from '@/lib/card-colors';
import { exportToPDF, getPDFPageSize } from '@/lib/pdf-export';
import { type CardTemplate, getTemplateById } from '@/lib/templates';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [showBackground, setShowBackground] = useState(false);
  const [format, setFormat] = useState<CardFormat>('table-tent');
  const [size, setSize] = useState<CardSize>('medium');
  const [customSize, setCustomSize] = useState<CustomSize | undefined>(undefined);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // Color state
  const [cardColors, setCardColors] = useState<CardColors>(defaultColors);
  const [selectedColorPresetId, setSelectedColorPresetId] = useState<string>('classic');

  // PDF export options
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [includeBleed, setIncludeBleed] = useState(true);
  const [includeCropMarks, setIncludeCropMarks] = useState(true);

  // About modal state
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  // Print size preview state
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  // Keyboard shortcuts help state
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  
  // Codexa badge toggle
  const [showCodexaBadge, setShowCodexaBadge] = useState(true);
  
  // Validation state
  const [touched, setTouched] = useState({
    businessName: false,
    feedbackUrl: false,
  });

  // Generated QR
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQrSuccess, setShowQrSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Computed validation
  const businessNameValidation = validateBusinessName(cleanInput(businessName));
  const messageValidation = validateMessage(cleanInput(message));
  const feedbackUrlValidation = validateFeedbackUrl(feedbackUrl.trim());
  const ctaValidation = validateCtaText(cleanInput(ctaText));
  
  // Validate custom size if in custom mode
  const customSizeValid = size !== 'custom' || (customSize && validateCustomSize(customSize).valid);
  const canDownload = isFormValid(cleanInput(businessName), feedbackUrl.trim()) && qrCodeUrl && !isGenerating && customSizeValid;

  // Generate QR code when URL or colors change
  const generateQR = useCallback(async (url: string, qrColor: string) => {
    const validation = validateFeedbackUrl(url.trim());
    if (!validation.isValid) {
      setQrCodeUrl('');
      return;
    }

    setIsGenerating(true);
    setShowQrSuccess(false);
    try {
      const qr = await generateQRCode(url, {
        width: 400,
        margin: 0,
        color: { dark: qrColor, light: cardColors.background }
      });
      setQrCodeUrl(qr);
      // Show success animation briefly
      setShowQrSuccess(true);
      setTimeout(() => setShowQrSuccess(false), 1500);
    } catch {
      toast({
        title: 'QR generation failed',
        description: 'Please check the URL and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast, cardColors.background]);

  // Debounced QR generation
  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR(feedbackUrl, cardColors.qrColor);
    }, 500);
    return () => clearTimeout(timer);
  }, [feedbackUrl, cardColors.qrColor, generateQR]);


  // Apply template (includes colors)
  const handleTemplateSelect = (template: CardTemplate) => {
    setSelectedTemplateId(template.id);
    setBusinessName(template.businessName);
    setMessage(template.message);
    setCtaText(template.ctaText);
    
    // Apply template colors to the card
    setCardColors(template.colors);
    setSelectedColorPresetId(template.id); // Use template id as color preset id
    
    setTouched({ businessName: true, feedbackUrl: touched.feedbackUrl });
    
    toast({
      title: `${template.name} applied`,
      description: 'Colors and content updated.',
    });
  };

  // Apply color preset
  const handleColorPresetSelect = (preset: ColorPreset) => {
    setSelectedColorPresetId(preset.id);
    setCardColors(preset.colors);
  };

  // Custom color change
  const handleCustomColorChange = (colors: CardColors) => {
    setSelectedColorPresetId('custom');
    setCardColors(colors);
  };

  // Get current template for display purposes
  const currentTemplate = selectedTemplateId ? getTemplateById(selectedTemplateId) : null;

  // Perform actual HD download
  const performHDDownload = async () => {
    if (!cardRef.current || !canDownload) return;

    setIsDownloading(true);
    try {
      const scale = 3;
      
      // For Elite templates with RGB border, don't set backgroundColor to avoid overriding the layered structure
      const hasRgbBorder = cardColors.borderGradient;
      
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: scale,
        quality: 1,
        // Use transparent for RGB border templates to preserve the layered gradient border effect
        backgroundColor: hasRgbBorder ? undefined : cardColors.background,
      });

      const safeName = cleanInput(businessName).replace(/[^a-zA-Z0-9]/g, '-') || 'qr-card';
      const link = document.createElement('a');
      link.download = `${safeName}-${format}-${size}-hd.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: 'HD Card downloaded',
        description: 'Your high-resolution card is ready for print.',
      });
    } catch {
      toast({
        title: 'Download failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Download card as HD PNG (always free)
  const handleDownload = async () => {
    if (!cardRef.current || !canDownload) return;
    performHDDownload();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Ctrl/Cmd + D: Download
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (canDownload && !isDownloading) {
          handleDownload();
        }
      }

      // 1/2/3: Switch sizes (only when not in custom mode)
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === '1') {
          setSize('small');
          toast({ title: 'Size: Small', duration: 1500 });
        } else if (e.key === '2') {
          setSize('medium');
          toast({ title: 'Size: Medium', duration: 1500 });
        } else if (e.key === '3') {
          setSize('large');
          toast({ title: 'Size: Large', duration: 1500 });
        }
        // S: Square format, T: Table Tent format
        else if (e.key === 's' || e.key === 'S') {
          setFormat('square');
          toast({ title: 'Format: Square', duration: 1500 });
        } else if (e.key === 't' || e.key === 'T') {
          setFormat('table-tent');
          toast({ title: 'Format: Table Tent', duration: 1500 });
        }
        // P: Print size preview
        else if (e.key === 'p' || e.key === 'P') {
          setShowPrintPreview(true);
        }
        // ?: Show keyboard shortcuts help
        else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
          setShowShortcutsHelp(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canDownload, isDownloading, handleDownload, toast]);

  // Perform PDF export
  const performPDFExport = async () => {
    if (!cardRef.current || !canDownload) return;

    setIsExportingPDF(true);
    try {
      const safeName = cleanInput(businessName).replace(/[^a-zA-Z0-9]/g, '-') || 'qr-card';
      const hasRgbBorder = !!cardColors.borderGradient;
      
      await exportToPDF({
        cardElement: cardRef.current,
        fileName: `${safeName}-print-ready`,
        format,
        size,
        includeBleed,
        includeCropMarks,
        hasRgbBorder,
      });

      toast({
        title: 'PDF exported',
        description: 'Your print-ready PDF with crop marks is ready.',
      });
    } catch {
      toast({
        title: 'PDF export failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Export as print-ready PDF (always free)
  const handlePDFExport = async () => {
    if (!cardRef.current || !canDownload) return;
    performPDFExport();
  };

  // Mark field as touched on blur
  const handleBlur = (field: 'businessName' | 'feedbackUrl') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const pdfPageSize = getPDFPageSize(format, size, includeBleed, includeCropMarks);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-serif text-xl text-foreground">QR Card Studio</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="#create" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
              Create
            </a>
            <a href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
              Gallery
            </a>
            <button 
              onClick={() => setShowAboutModal(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              About
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <PWAInstallButton />
            <OfflineBadge />
            <ThemeToggle />
            <MobileNav onAboutClick={() => setShowAboutModal(true)} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="create" className="container py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        {/* Desktop max-width wrapper for balanced layout */}
        <div className="lg:max-w-6xl lg:mx-auto">
          {/* Hero - refined container */}
          <div className="text-center mb-12 sm:mb-20 w-full animate-fade-in">
            <div className="max-w-4xl mx-auto bg-card/60 border border-border/50 rounded-2xl px-6 py-10 sm:px-10 sm:py-14 lg:py-16 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30">
              {/* Decorative accent */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 text-accent">
                  <div className="w-8 h-px bg-accent/40" />
                  <Sparkles className="w-5 h-5" />
                  <div className="w-8 h-px bg-accent/40" />
                </div>
              </div>
              <h1 className="font-serif text-2xl sm:text-display-md md:text-display-lg text-foreground mb-4 sm:mb-6">
                Create <span className="italic text-accent">premium</span> review cards
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-[720px] mx-auto">
                Design premium feedback cards for your business. 
                Print-ready, professional, and crafted to inspire trust.
              </p>
            </div>
          </div>

          {/* Mobile-first layout: Controls → Templates → Preview → Download */}
          {/* Desktop: Two-column with controls left, preview right (sticky) */}
          <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8 lg:gap-10">
            {/* Controls & Templates column - appears first on mobile */}
            <div className="space-y-6 sm:space-y-8 max-w-2xl w-full mx-auto lg:mx-0 lg:max-w-none">
            
            {/* Templates Panel */}
            <section className="panel-section animate-fade-in transition-all duration-300 hover:shadow-md hover:border-border/80" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }} aria-labelledby="templates-heading">
              <h2 id="templates-heading" className="sr-only">Quick Templates</h2>
              <TemplateSelector 
                selectedId={selectedTemplateId} 
                onSelect={handleTemplateSelect} 
              />
            </section>

            {/* Format & Size Panel */}
            <section className="panel-section space-y-6 animate-fade-in transition-all duration-300 hover:shadow-md hover:border-border/80" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }} aria-labelledby="format-heading">
              <h2 id="format-heading" className="sr-only">Card Format and Size</h2>
              <FormatSelector selected={format} onSelect={setFormat} />
              <SizeSelector 
                selected={size} 
                onSelect={setSize} 
                format={format}
                customSize={customSize}
                onCustomSizeChange={setCustomSize}
              />
            </section>

            {/* Colors Panel */}
            <section className="panel-section animate-fade-in transition-all duration-300 hover:shadow-md hover:border-border/80" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }} aria-labelledby="colors-heading">
              <h2 id="colors-heading" className="sr-only">Card Colors</h2>
              <ColorCustomizer
                colors={cardColors}
                selectedPresetId={selectedColorPresetId}
                onPresetSelect={handleColorPresetSelect}
                onCustomColorChange={handleCustomColorChange}
              />
            </section>

            {/* Branding Panel */}
            <section className="panel-section space-y-6 animate-fade-in transition-all duration-300 hover:shadow-md hover:border-border/80" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }} aria-labelledby="branding-heading">
              <h2 id="branding-heading" className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Branding
              </h2>
              <LogoUpload logoUrl={logoUrl} onLogoChange={setLogoUrl} />
              <BackgroundUpload 
                backgroundUrl={backgroundUrl}
                showBackground={showBackground}
                onBackgroundChange={setBackgroundUrl}
                onToggleBackground={setShowBackground}
              />
              
              {/* Badge Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <label htmlFor="badge-toggle" className="text-xs text-muted-foreground">
                  Show "Powered by Codexa"
                </label>
                <button
                  id="badge-toggle"
                  role="switch"
                  aria-checked={showCodexaBadge}
                  onClick={() => setShowCodexaBadge(!showCodexaBadge)}
                  className={`relative w-9 h-5 rounded-full transition-colors focus-ring ${
                    showCodexaBadge ? 'bg-accent' : 'bg-secondary'
                  }`}
                >
                  <span 
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-foreground rounded-full transition-transform ${
                      showCodexaBadge ? 'translate-x-4' : 'translate-x-0'
                    }`} 
                  />
                </button>
              </div>
            </section>

            {/* Content Panel */}
            <section className="panel-section space-y-6 animate-fade-in transition-all duration-300 hover:shadow-md hover:border-border/80" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }} aria-labelledby="content-heading">
              <h2 id="content-heading" className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Card Content
              </h2>
              
              <InputField
                id="businessName"
                label="Business Name"
                value={businessName}
                onChange={setBusinessName}
                onBlur={() => handleBlur('businessName')}
                placeholder="The Golden Spoon"
                maxLength={40}
                required
                validation={businessNameValidation}
                showValidation={touched.businessName}
              />

              <InputField
                id="message"
                label="Message"
                value={message}
                onChange={setMessage}
                placeholder="Your feedback helps us serve you better. We'd love to hear about your experience."
                maxLength={150}
                multiline
                validation={messageValidation}
                showValidation={message.length > 0}
              />

              <InputField
                id="feedbackUrl"
                label="Feedback Link"
                value={feedbackUrl}
                onChange={setFeedbackUrl}
                onBlur={() => handleBlur('feedbackUrl')}
                placeholder="https://g.page/r/..."
                hint="Google Review link, Yelp, or any feedback URL"
                required
                validation={feedbackUrlValidation}
                showValidation={touched.feedbackUrl}
              />

              <InputField
                id="ctaText"
                label="Call to Action"
                value={ctaText}
                onChange={setCtaText}
                placeholder="Scan to Review"
                maxLength={25}
                validation={ctaValidation}
                showValidation={ctaText.length > 0}
              />
            </section>

          </div>

          {/* Preview column - appears after controls on mobile, sticky on desktop */}
          <aside className="lg:sticky lg:top-8 lg:self-start w-full lg:w-[400px]">
            {/* Preview Container with visual framing */}
            <div className="preview-container">
              {/* Header */}
              <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-4">
                Live Preview
              </p>
              
              {/* Card preview wrapper */}
              <div 
                className="flex justify-center items-center overflow-hidden"
                role="region"
                aria-label="Card preview"
                aria-live="polite"
              >
                <div className="relative">
                  {/* Ambient shadow */}
                  <div 
                    className="absolute inset-0 blur-3xl opacity-30 bg-accent/20 scale-90 translate-y-8 hidden sm:block"
                    aria-hidden="true"
                  />
                  
                  {/* Loading skeleton while QR is generating */}
                  {isGenerating && (
                    <div 
                      className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-sm"
                      aria-label="Generating QR code"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                        <span className="text-xs text-muted-foreground">Generating QR...</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Success checkmark after QR generation */}
                  {showQrSuccess && !isGenerating && (
                    <div 
                      className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none animate-fade-in"
                      aria-label="QR code generated successfully"
                    >
                      <div className="flex flex-col items-center gap-2 bg-success/90 text-success-foreground px-4 py-3 rounded-lg shadow-lg animate-scale-in">
                        <Check className="w-6 h-6" />
                        <span className="text-xs font-medium">QR Ready</span>
                      </div>
                    </div>
                  )}
                  
                  <CardPreview
                    ref={cardRef}
                    format={format}
                    size={size}
                    businessName={cleanInput(businessName)}
                    message={cleanInput(message)}
                    ctaText={cleanInput(ctaText)}
                    qrCodeUrl={qrCodeUrl}
                    logoUrl={logoUrl}
                    backgroundUrl={backgroundUrl}
                    showBackground={showBackground}
                    themeId={selectedTemplateId || 'minimal'}
                    colors={cardColors}
                    customSize={customSize}
                    showBadge={showCodexaBadge}
                  />
                </div>
              </div>

              {/* Print specs and actual size button */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <p className="text-xs text-muted-foreground/60">
                  {getPrintSize(format, size, customSize)} at 300 DPI • Print-ready
                </p>
                <button
                  onClick={() => setShowPrintPreview(true)}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors focus-ring"
                  aria-label="Preview at actual print size"
                >
                  <Maximize2 className="w-3 h-3" />
                  Actual Size
                </button>
              </div>
            </div>
            
            {/* Print Size Preview Modal */}
            <PrintSizePreview
              format={format}
              size={size}
              customSize={customSize}
              isOpen={showPrintPreview}
              onClose={() => setShowPrintPreview(false)}
            >
              <CardPreview
                format={format}
                size={size}
                businessName={cleanInput(businessName)}
                message={cleanInput(message)}
                ctaText={cleanInput(ctaText)}
                qrCodeUrl={qrCodeUrl}
                logoUrl={logoUrl}
                backgroundUrl={backgroundUrl}
                showBackground={showBackground}
                themeId={selectedTemplateId || 'minimal'}
                colors={cardColors}
                customSize={customSize}
                showBadge={showCodexaBadge}
              />
            </PrintSizePreview>
          </aside>

          {/* Download section - full width on mobile, part of left column on desktop */}
          <div className="lg:col-start-1 lg:row-start-2 space-y-4 max-w-2xl w-full mx-auto lg:mx-0 lg:max-w-none">
            {/* Free info banner */}
            <div className="p-3 bg-success/10 border border-success/20 text-sm">
              <p className="text-success font-medium text-xs">
                ✓ All exports are FREE — HD PNG & Print-Ready PDF
              </p>
            </div>

            {/* Primary Download Button - HD PNG */}
            <button
              onClick={handleDownload}
              disabled={!canDownload || isDownloading}
              className="btn-primary w-full flex items-center justify-center gap-3"
              aria-describedby={!canDownload ? 'download-hint' : undefined}
            >
              <Download className="w-4 h-4" />
              {isDownloading 
                ? 'Generating...' 
                : isGenerating 
                  ? 'Creating QR...' 
                  : 'Download HD PNG'
              }
            </button>

            {/* Share Buttons Row */}
            <div className="flex gap-2">
              <EmailShare
                businessName={cleanInput(businessName)}
                onDownloadFirst={performHDDownload}
                isDownloading={isDownloading}
              />
              <CopyLinkButton
                format={format}
                size={size}
                businessName={businessName}
                message={message}
                ctaText={ctaText}
                feedbackUrl={feedbackUrl}
                logoUrl={logoUrl}
                cardColors={cardColors}
              />
            </div>

            {/* Print Preview Button */}
            <button
              onClick={() => {
                const params = new URLSearchParams({
                  format,
                  size,
                  businessName: cleanInput(businessName),
                  message: cleanInput(message),
                  ctaText: cleanInput(ctaText),
                  feedbackUrl: feedbackUrl.trim(),
                  bg: cardColors.background,
                  text: cardColors.text,
                  accent: cardColors.accent,
                  qr: cardColors.qrColor,
                });
                if (cardColors.gradient) params.set('gradient', cardColors.gradient);
                if (cardColors.borderGradient) params.set('borderGradient', cardColors.borderGradient);
                if (customSize) params.set('customSize', JSON.stringify(customSize));

                // Store logoUrl in sessionStorage to avoid URL length limits
                if (logoUrl) {
                  const logoKey = `qr-studio-logo-${Date.now()}`;
                  sessionStorage.setItem(logoKey, logoUrl);
                  params.set('logoKey', logoKey);
                }

                window.open(`/print-preview?${params.toString()}`, '_blank');
              }}
              disabled={!canDownload}
              className="btn-secondary w-full flex items-center justify-center gap-3"
            >
              <Printer className="w-4 h-4" />
              Print Preview
            </button>

            {/* PDF Export Section */}
            <div className="border border-border">
              <button
                type="button"
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors focus-ring"
                aria-expanded={showExportOptions}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-accent" />
                  <span className="font-medium text-sm">Print-Ready PDF Export</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
              </button>
              
              {showExportOptions && (
                <div className="p-4 border-t border-border space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Export with professional print shop specifications
                  </p>
                  
                  {/* PDF Options */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeBleed}
                        onChange={(e) => setIncludeBleed(e.target.checked)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm">Include 1/8" bleed area</span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeCropMarks}
                        onChange={(e) => setIncludeCropMarks(e.target.checked)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm">Add crop marks & registration</span>
                    </label>
                  </div>
                  
                  <p className="text-xs text-muted-foreground/60">
                    Final PDF size: {pdfPageSize.width} × {pdfPageSize.height}
                  </p>
                  
                  <button
                    onClick={handlePDFExport}
                    disabled={!canDownload || isExportingPDF}
                    className="btn-secondary w-full flex items-center justify-center gap-3"
                  >
                    <FileText className="w-4 h-4" />
                    {isExportingPDF ? 'Exporting...' : 'Export PDF'}
                  </button>
                </div>
              )}
            </div>
            
            {!canDownload && (touched.businessName || touched.feedbackUrl) && (
              <p id="download-hint" className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Please fill in the required fields correctly
              </p>
            )}
          </div>
        </div>
        </div>
      </main>

      {/* Stand Gallery Section */}
      <div id="gallery">
        <StandGallery />
      </div>

      {/* Footer */}
      <Footer onAboutClick={() => setShowAboutModal(true)} />

      {/* About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Install Banner for mobile users */}
      <InstallBanner />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
}
