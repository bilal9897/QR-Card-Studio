import { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import TiltWrapper from '@/components/TiltWrapper';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Download, Sparkles, AlertCircle, FileText, ChevronDown, Printer, Check, Maximize2, Layers, FolderOpen, QrCode } from 'lucide-react';
import CardPreview, { type CardFormat, getPrintSize } from '@/components/CardPreview';
import FormatSelector from '@/components/FormatSelector';
import SizeSelector, { type CardSize } from '@/components/SizeSelector';
import { type CustomSize, validateCustomSize, getSizeConfig } from '@/lib/card-sizes';
import LogoUpload from '@/components/LogoUpload';
import QRLogoUpload from '@/components/QRLogoUpload';
import BackgroundUpload from '@/components/BackgroundUpload';
import QRStyleSelector from '@/components/QRStyleSelector';
import { type QRStyleOptions } from '@/lib/qr-types';
import InputField from '@/components/InputField';
import TemplateSelector from '@/components/TemplateSelector';
import PrintGuideModal from '@/components/PrintGuideModal';
import SocialMockupModal from '@/components/SocialMockupModal';
import OfflineBadge from '@/components/OfflineBadge';
import ThemeToggle from '@/components/ThemeToggle';
import ColorCustomizer from '@/components/ColorCustomizer';
import LanguageSelector from '@/components/LanguageSelector';
import AboutModal from '@/components/AboutModal';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import InstallBanner from '@/components/InstallBanner';
import { EmailShare } from '@/components/EmailShare';

import { CopyLinkButton } from '@/components/CopyLinkButton';
import PrintSizePreview from '@/components/PrintSizePreview';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';
import PWAInstallButton from '@/components/PWAInstallButton';
import QRTypeSelector from '@/components/QRTypeSelector';
import AIMessageGenerator from '@/components/AIMessageGenerator';
import AnalyticsBuilder from '@/components/AnalyticsBuilder';
import BatchGenerator from '@/components/BatchGenerator';
import SavedDesigns from '@/components/SavedDesigns';
import { type SavedDesign } from '@/lib/storage';
import { generateQRCode } from '@/lib/qr-generator';
import { type QRType, type QRData, generateQRData, validateQRData } from '@/lib/qr-types';
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

export default function Generator() {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [qrLogoUrl, setQrLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.1);
  const [showBackground, setShowBackground] = useState(false);
  const [format, setFormat] = useState<CardFormat>('table-tent');
  const [size, setSize] = useState<CardSize>('medium');
  const [customSize, setCustomSize] = useState<CustomSize | undefined>(undefined);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // QR Style state (NEW)
  const [qrStyle, setQrStyle] = useState<QRStyleOptions>({
    dotStyle: 'square' // Default to square for robust scanning
  });

  // QR Type state (NEW)
  const [qrType, setQRType] = useState<QRType>('url');
  const [qrData, setQRData] = useState<QRData>({ url: '' });
  const [showPrintGuide, setShowPrintGuide] = useState(false);

  // Second QR state (for dual-qr format)
  const [qrType2, setQRType2] = useState<QRType>('url');
  const [qrData2, setQRData2] = useState<QRData>({ url: '' });
  const [qrContent2, setQrContent2] = useState('');
  const [qrLogoUrl2, setQrLogoUrl2] = useState<string | null>(null);

  // Color state
  const [cardColors, setCardColors] = useState<CardColors>(defaultColors);
  const [selectedColorPresetId, setSelectedColorPresetId] = useState<string>('classic');

  // PDF export options
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [includeBleed, setIncludeBleed] = useState(true);
  const [includeCropMarks, setIncludeCropMarks] = useState(true);

  // Modal states
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showBatchGenerator, setShowBatchGenerator] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSavedDesigns, setShowSavedDesigns] = useState(false);

  // Load Design Handler
  const handleLoadDesign = (design: SavedDesign) => {
    const d = design.data;
    setBusinessName(d.businessName);
    setMessage(d.message);
    setCtaText(d.ctaText);
    setQRType(d.qrType);
    setQRData(d.qrData);
    setLogoUrl(d.logoUrl);
    setQrLogoUrl(d.qrLogoUrl);
    setBackgroundUrl(d.backgroundUrl);
    setBackgroundOpacity(d.backgroundOpacity || 0.1);
    setFormat(d.format);
    setSize(d.size);
    setCustomSize(d.customSize);
    setCardColors(d.cardColors);
    setSelectedTemplateId(d.selectedTemplateId);
    setCardColors(d.cardColors);
    setSelectedTemplateId(d.selectedTemplateId);
    setSelectedColorPresetId(d.selectedColorPresetId);
    if (d.qrStyle) setQrStyle(d.qrStyle);

    toast({
      title: 'Design loaded',
      description: `Loaded "${design.name}" successfully`,
    });
  };

  // Current Design Object (for saving)
  const currentDesign = {
    name: 'Untitled Design', // Will be overwritten by user input in Save form
    data: {
      businessName,
      message,
      ctaText,
      qrType,
      qrData,
      logoUrl,
      qrLogoUrl,
      backgroundUrl,
      backgroundOpacity,
      format,
      size,
      customSize,
      cardColors,
      selectedTemplateId,
      selectedTemplateId,
      selectedColorPresetId,
      qrStyle,
    }
  };

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

  // Validate QR data based on type
  const qrDataValidation = validateQRData(qrType, qrData);
  const canDownload = businessNameValidation.isValid && qrDataValidation.isValid && qrCodeUrl && !isGenerating && customSizeValid;

  // State for raw QR content string (for ArtisticQR)
  const [qrContent, setQrContent] = useState('');

  // Generate QR code when data or colors change
  const generateQR = useCallback(async (type: QRType, data: QRData, qrColor: string, style: QRStyleOptions) => {
    const validation = validateQRData(type, data);
    if (!validation.isValid) {
      setQrCodeUrl('');
      setQrContent('');
      return;
    }

    setIsGenerating(true);
    setShowQrSuccess(false);
    try {
      // Generate QR data string based on type
      const qrDataString = generateQRData(type, data);
      setQrContent(qrDataString); // Set raw content for ArtisticQR

      // Keep generating the PNG for download/PDF purposes, and for legacy fallback
      const qr = await generateQRCode(qrDataString, {
        width: 400,
        margin: 0,
        color: { dark: qrColor, light: cardColors.background },
        logoUrl: qrLogoUrl,
        dotStyle: style.dotStyle // Use selected dot style
      });
      setQrCodeUrl(qr);

      // Show success animation briefly
      setShowQrSuccess(true);
      setTimeout(() => setShowQrSuccess(false), 1500);
    } catch {
      toast({
        title: 'QR generation failed',
        description: 'Please check your data and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast, cardColors.background, qrLogoUrl]);

  // Debounced QR generation
  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR(qrType, qrData, cardColors.qrColor, qrStyle);
    }, 500);
    return () => clearTimeout(timer);
  }, [qrType, qrData, cardColors.qrColor, qrLogoUrl, generateQR, qrStyle]);

  // Handle Second QR Generation (Content only, no PNG needed usually unless we want to download it separately)
  useEffect(() => {
    if (format === 'dual-qr') {
      const timer = setTimeout(() => {
        const validation = validateQRData(qrType2, qrData2);
        if (validation.isValid) {
          const content = generateQRData(qrType2, qrData2);
          setQrContent2(content);
        } else {
          setQrContent2('');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [format, qrType2, qrData2]);


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

  // Handle URL query parameters for loading templates
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && !selectedTemplateId) {
      const template = getTemplateById(templateId);
      if (template) {
        handleTemplateSelect(template);
        // Clear param URL without reload to avoid re-triggering
        window.history.replaceState({}, '', '/create');
      }
    }
  }, [searchParams]);

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

  // Handle download click - check requirements then show guide
  const initiateDownload = () => {
    if (!cardRef.current || !canDownload) return;
    // Show guide before actual download
    setShowPrintGuide(true);
  };

  // Perform download after guide is confirmed
  const handleDownloadConfirm = () => {
    setShowPrintGuide(false);
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
          initiateDownload();
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
  }, [canDownload, isDownloading, toast]);

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



  // Props for generic card preview usage (minimizing duplication)
  const commonCardProps = {
    format, size, customSize,
    businessName: cleanInput(businessName),
    message: cleanInput(message),
    ctaText: cleanInput(ctaText),
    qrCodeUrl, logoUrl, qrLogoUrl,
    backgroundUrl, backgroundOpacity, showBackground,
    themeId: selectedTemplateId || 'minimal',
    colors: cardColors,
    showBadge: showCodexaBadge,
    qrStyle, qrContent, qrContent2, qrLogoUrl2
  };

  const pdfPageSize = getPDFPageSize(format, size, includeBleed, includeCropMarks);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-foreground transition-colors duration-300 selection:bg-[#c9a961] selection:text-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="container py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#c9a961] rounded-md flex items-center justify-center text-black shadow-[0_0_15px_rgba(201,169,97,0.3)] transition-transform group-hover:scale-105">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="font-serif text-xl tracking-wide text-foreground">QR Card Studio</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <a href="#create" className="text-sm text-foreground font-medium px-3 py-1.5">
              Create
            </a>
            <a href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gallery
            </a>
            <button
              onClick={() => setShowSavedDesigns(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 flex items-center gap-1"
            >
              <FolderOpen className="w-4 h-4" />
              Saved
            </button>

            <button
              onClick={() => setShowBatchGenerator(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 flex items-center gap-1"
            >
              <Layers className="w-4 h-4" />
              Batch
            </button>

          </nav>
          <div className="flex items-center gap-2">
            <LanguageSelector />
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
            <div className="max-w-4xl mx-auto bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-10 sm:px-10 sm:py-14 lg:py-16 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/5 dark:hover:shadow-accent/10 hover:border-accent/30">
              {/* Decorative accent */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 text-[#c9a961]">
                  <div className="w-8 h-px bg-[#c9a961]/40" />
                  <Sparkles className="w-5 h-5" />
                  <div className="w-8 h-px bg-[#c9a961]/40" />
                </div>
              </div>
              <h1 className="font-serif text-2xl sm:text-display-md md:text-display-lg text-foreground mb-4 sm:mb-6">
                Design <span className="italic text-accent">smart</span> review cards
              </h1>
              <p className="text-muted-foreground/70 text-base sm:text-lg leading-relaxed max-w-[720px] mx-auto">
                Create professional, scan-ready cards that double your review rate.
                Includes AI message generation and analytics tracking.
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
                <div className="flex items-center justify-between mb-2">
                  <h2 id="templates-heading" className="sr-only">Quick Templates</h2>
                  <a href="/templates" className="text-xs font-medium text-accent hover:text-accent/80 flex items-center gap-1 ml-auto">
                    <Sparkles className="w-3 h-3" /> Browse Full Gallery
                  </a>
                </div>
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
              <section className="panel-section animate-fade-in transition-all duration-300 hover:shadow-md hover:border-border/80" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }} aria-labelledby="branding-heading">
                <h2 id="branding-heading" className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                  Branding
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <LogoUpload logoUrl={logoUrl} onLogoChange={setLogoUrl} />
                  <BackgroundUpload
                    backgroundUrl={backgroundUrl}
                    showBackground={showBackground}
                    backgroundOpacity={backgroundOpacity}
                    onBackgroundChange={setBackgroundUrl}
                    onToggleBackground={setShowBackground}
                    onOpacityChange={setBackgroundOpacity}
                  />
                </div>

                <div className="mb-6 border-t border-border/50 pt-4">
                  <QRStyleSelector
                    style={qrStyle}
                    onChange={setQrStyle}
                    colors={{
                      dark: cardColors.qrColor,
                      light: cardColors.background
                    }}
                    onColorChange={(newColors: any) => {
                      // Future expansion for multicolor QR support
                    }}
                  />
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

                {/* Message Field with AI Generator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="message" className="block text-sm font-medium">
                      Message
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAIGenerator(!showAIGenerator)}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-xs font-medium ${showAIGenerator
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
                        }`}
                      title="AI Message Generator"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Generator
                    </button>
                  </div>
                  <InputField
                    id="message"
                    label=""
                    value={message}
                    onChange={setMessage}
                    placeholder="Your feedback helps us serve you better. We'd love to hear about your experience."
                    maxLength={150}
                    multiline
                    validation={messageValidation}
                    showValidation={message.length > 0}
                  />
                </div>

                {/* AI Message Generator Panel */}
                {showAIGenerator && (
                  <div className="p-4 bg-secondary/30 border border-border rounded-lg animate-fade-in">
                    <AIMessageGenerator
                      onSelectMessage={(msg, cta) => {
                        setMessage(msg);
                        setCtaText(cta);
                        setShowAIGenerator(false);
                      }}
                    />
                  </div>
                )}

                {/* QR Type Selector - Replaces simple feedback URL input */}
                {/* QR Inputs Container */}
                <div className="space-y-6">
                  {/* Primary QR Code */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium">
                      Primary QR Code <span className="text-destructive">*</span>
                    </label>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <QRTypeSelector
                          selectedType={qrType}
                          qrData={qrData}
                          onTypeChange={(type) => {
                            setQRType(type);
                            setTouched({ ...touched, feedbackUrl: false });
                          }}
                          onDataChange={setQRData}
                        />
                      </div>

                      <div className="pt-0">
                        <QRLogoUpload
                          qrLogoUrl={qrLogoUrl}
                          onQRLogoChange={setQrLogoUrl}
                          compact={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Second QR Input (Conditional) */}
                  {format === 'dual-qr' && (
                    <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Secondary Link (Right Side)
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="url"
                          placeholder="https://instagram.com/your-handle"
                          className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={(qrData2 as any).url || ''}
                          onChange={(e) => {
                            setQRType2('url');
                            setQRData2({ url: e.target.value });
                          }}
                        />

                        <QRLogoUpload
                          qrLogoUrl={qrLogoUrl2}
                          onQRLogoChange={setQrLogoUrl2}
                          compact={true}
                        />
                      </div>
                    </div>
                  )}
                </div>


                {/* Analytics Builder Toggle */}
                {qrType === 'url' && (qrData as any).url && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAnalytics(!showAnalytics)}
                      className="w-full flex items-center justify-between p-3 bg-secondary/50 border border-border rounded-lg hover:bg-secondary/70 transition-colors text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="font-medium">Add Analytics Tracking</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAnalytics ? 'rotate-180' : ''}`} />
                    </button>

                    {showAnalytics && (
                      <div className="mt-3 p-4 bg-secondary/30 border border-border rounded-lg animate-fade-in">
                        <AnalyticsBuilder
                          baseUrl={(qrData as any).url}
                          businessName={businessName}
                        />
                      </div>
                    )}
                  </div>
                )}

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
              {/* Premium Preview Container */}
              <div className="relative border border-white/10 dark:border-white/10 rounded-lg p-6 bg-card/30 dark:bg-transparent backdrop-blur-sm">
                {/* Header Label */}
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-6 font-medium">
                  Live Preview
                </p>

                {/* Card preview wrapper */}
                <div
                  className="flex justify-center items-center overflow-hidden mb-6"
                  role="region"
                  aria-label="Card preview"
                  aria-live="polite"
                >
                  <div className="relative">
                    {/* Ambient shadow */}
                    <div
                      className="absolute inset-0 blur-3xl opacity-20 bg-accent/20 scale-90 translate-y-8 hidden sm:block"
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

                    <TiltWrapper intensity={10} perspective={1500}>
                      <CardPreview
                        ref={cardRef}
                        format={format}
                        size={size}
                        businessName={cleanInput(businessName)}
                        message={cleanInput(message)}
                        ctaText={cleanInput(ctaText)}
                        qrCodeUrl={qrCodeUrl}
                        logoUrl={logoUrl}
                        qrLogoUrl={qrLogoUrl}
                        backgroundUrl={backgroundUrl}
                        backgroundOpacity={backgroundOpacity}
                        showBackground={showBackground}
                        themeId={selectedTemplateId || 'minimal'}
                        colors={cardColors}
                        customSize={customSize}
                        showBadge={true}
                        qrStyle={qrStyle} // Pass artistic style
                        qrContent={qrContent} // Pass raw content
                        qrContent2={qrContent2}
                        qrLogoUrl2={qrLogoUrl2}
                      />
                    </TiltWrapper>
                  </div>
                </div>



                {/* Card Info Footer */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground/60 pt-4 mt-2 border-t border-white/5">
                  <span>
                    {getPrintSize(format, size, customSize)} at 300 DPI • Print-ready
                  </span>
                  <button
                    onClick={() => setShowPrintPreview(true)}
                    className="flex items-center gap-1.5 hover:text-muted-foreground transition-colors"
                    aria-label="Preview at actual print size"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
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
                  backgroundOpacity={backgroundOpacity}
                  showBackground={showBackground}
                  themeId={selectedTemplateId || 'minimal'}
                  colors={cardColors}
                  customSize={customSize}
                  customSize={customSize}
                  showBadge={showCodexaBadge}
                  qrStyle={qrStyle}
                  qrContent={qrContent}
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
                onClick={initiateDownload}
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
              <div className="flex gap-2 flex-wrap">
                <EmailShare
                  businessName={cleanInput(businessName)}
                  onDownloadFirst={performHDDownload}
                  isDownloading={isDownloading}
                />
                <SocialMockupModal cardProps={commonCardProps} />
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
                    feedbackUrl: qrContent || feedbackUrl.trim(),
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
        </div >
      </main >

      {/* Footer */}
      < Footer onAboutClick={() => setShowAboutModal(true)
      } />

      {/* About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Print Guide Modal */}
      <PrintGuideModal
        isOpen={showPrintGuide}
        onClose={() => setShowPrintGuide(false)}
        onConfirm={handleDownloadConfirm}
      />

      {/* Install Banner for mobile users */}
      <InstallBanner />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      {/* Batch Generator Modal */}
      {
        showBatchGenerator && (
          <BatchGenerator onClose={() => setShowBatchGenerator(false)} />
        )
      }

      {/* Saved Designs Gallery */}
      {
        showSavedDesigns && (
          <SavedDesigns
            onClose={() => setShowSavedDesigns(false)}
            onLoad={handleLoadDesign}
            currentDesign={currentDesign}
          />
        )
      }
    </div >
  );
}
