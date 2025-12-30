import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { generateQRCode } from '@/lib/qr-generator';
import { sanitizeText } from '@/lib/validation';
import { getSizeConfig, getPixelDimensions, type CardSize, type CardFormat } from '@/lib/card-sizes';
import type { CardColors } from '@/lib/card-colors';

export default function PrintPreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse URL parameters
  const format = (searchParams.get('format') || 'table-tent') as CardFormat;
  const size = (searchParams.get('size') || 'medium') as CardSize;
  const customSizeParam = searchParams.get('customSize');
  const customSize = customSizeParam ? JSON.parse(customSizeParam) : undefined;
  const businessName = sanitizeText(searchParams.get('businessName') || 'Your Business');
  const message = sanitizeText(searchParams.get('message') || 'We value your feedback. Scan to share your experience.');
  const ctaText = sanitizeText(searchParams.get('ctaText') || 'Scan to Review');
  const feedbackUrl = searchParams.get('feedbackUrl') || '';
  const logoKey = searchParams.get('logoKey');
  const logoUrl = logoKey ? sessionStorage.getItem(logoKey) : null;

  // Parse colors from URL
  const colors: CardColors = {
    background: searchParams.get('bg') || '#ffffff',
    text: searchParams.get('text') || '#1a1a1a',
    accent: searchParams.get('accent') || '#1a1a1a',
    qrColor: searchParams.get('qr') || '#1a1a1a',
    gradient: searchParams.get('gradient') || undefined,
    borderGradient: searchParams.get('borderGradient') || undefined,
  };

  // Get dimensions from shared config
  const config = getSizeConfig(format, size, customSize);
  const { width: widthPx, height: heightPx } = getPixelDimensions(format, size, 96, customSize);

  // Generate QR code on mount
  useEffect(() => {
    if (feedbackUrl) {
      generateQRCode(feedbackUrl, {
        width: 400,
        margin: 0,
        color: { dark: colors.qrColor, light: colors.background }
      }).then(setQrCodeUrl).catch(() => setQrCodeUrl(''));
    }
  }, [feedbackUrl, colors.qrColor, colors.background]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const cardElement = document.getElementById('print-card');
    if (!cardElement) return;

    setIsDownloading(true);
    try {
      const hasRgbBorder = colors.borderGradient;
      const dataUrl = await toPng(cardElement, {
        pixelRatio: 3,
        quality: 1,
        backgroundColor: hasRgbBorder ? undefined : colors.background,
      });

      const safeName = businessName.replace(/[^a-zA-Z0-9]/g, '-') || 'qr-card';
      const link = document.createElement('a');
      link.download = `${safeName}-print-ready.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate('/');
    }
  };

  const hasRgbBorder = colors.borderGradient;

  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white">
      {/* Header - hidden when printing */}
      <header className="bg-white border-b border-neutral-200 py-4 px-6 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Close Preview</span>
            </button>
            <div className="h-4 w-px bg-neutral-300" />
            <h1 className="text-lg font-medium text-neutral-900">Print Preview</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? 'Saving...' : 'Download HD'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </header>

      {/* Print info - hidden when printing */}
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-6 print:hidden">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-amber-800">
            <strong>Print at 100% scale</strong> — Card size: {config.width}" × {config.height}" at 300 DPI
          </p>
        </div>
      </div>

      {/* Card Preview Area */}
      <main className="py-12 px-6 print:p-0 print:m-0">
        <div className="max-w-4xl mx-auto flex flex-col items-center print:max-w-none">
          {/* Paper simulation - hidden when printing */}
          <div 
            className="bg-white shadow-2xl p-8 print:shadow-none print:p-0"
            style={{ minWidth: widthPx + 64 }}
          >
            {/* The actual card at print size */}
            <div
              id="print-card"
              className="relative mx-auto"
              style={{
                width: `${widthPx}px`,
                height: `${heightPx}px`,
              }}
            >
              {/* RGB Border layer for Elite templates */}
              {hasRgbBorder && (
                <div 
                  className="absolute inset-0"
                  style={{ background: colors.borderGradient }}
                  aria-hidden="true"
                />
              )}
              
              {/* Main card content with solid background */}
              <div 
                className="absolute overflow-hidden"
                style={{
                  top: hasRgbBorder ? '2px' : '0',
                  left: hasRgbBorder ? '2px' : '0',
                  right: hasRgbBorder ? '2px' : '0',
                  bottom: hasRgbBorder ? '2px' : '0',
                  background: colors.gradient || colors.background,
                  color: colors.text,
                  boxShadow: hasRgbBorder ? 'none' : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                }}
              >
                {/* Regular border for non-RGB templates */}
                {!hasRgbBorder && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ border: `1px solid ${colors.text}20` }}
                  />
                )}

                {format === 'table-tent' ? (
                  <div className="relative h-full flex flex-col p-6">
                    {logoUrl && (
                      <div className="flex justify-center mb-4">
                        <img src={logoUrl} alt="" className="max-h-12 max-w-24 object-contain" />
                      </div>
                    )}
                    <h2 
                      className="font-serif text-center leading-tight mb-3"
                      style={{ fontSize: '1.5rem', color: colors.text }}
                    >
                      {businessName}
                    </h2>
                    <p 
                      className="text-center leading-relaxed mb-auto"
                      style={{ fontSize: '0.875rem', color: colors.text, opacity: 0.8 }}
                    >
                      {message}
                    </p>
                    <div className="flex flex-col items-center mt-4">
                      <div 
                        className="p-2"
                        style={{ backgroundColor: colors.background, border: `1px solid ${colors.text}20` }}
                      >
                        {qrCodeUrl ? (
                          <img src={qrCodeUrl} alt="QR Code" style={{ width: '120px', height: '120px' }} />
                        ) : (
                          <div 
                            className="flex items-center justify-center"
                            style={{ width: '120px', height: '120px', backgroundColor: `${colors.text}10` }}
                          >
                            <span className="text-xs text-center px-2" style={{ color: colors.text }}>No QR</span>
                          </div>
                        )}
                      </div>
                      <p 
                        className="font-medium uppercase tracking-widest mt-3"
                        style={{ fontSize: '0.65rem', color: colors.text }}
                      >
                        {ctaText}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full flex flex-col p-5">
                    <div className="flex items-start justify-between mb-3">
                      {logoUrl ? (
                        <img src={logoUrl} alt="" className="max-h-8 max-w-16 object-contain" />
                      ) : (
                        <div style={{ width: '32px', height: '32px' }} />
                      )}
                      <h2 
                        className="font-serif text-right leading-tight"
                        style={{ fontSize: '1.1rem', maxWidth: '60%', color: colors.text }}
                      >
                        {businessName}
                      </h2>
                    </div>
                    <p 
                      className="leading-relaxed flex-1"
                      style={{ fontSize: '0.75rem', color: colors.text, opacity: 0.8 }}
                    >
                      {message}
                    </p>
                    <div className="flex items-end justify-between mt-3">
                      <div className="flex-1 pr-3">
                        <p 
                          className="font-medium uppercase tracking-widest"
                          style={{ fontSize: '0.55rem', color: colors.text }}
                        >
                          {ctaText}
                        </p>
                      </div>
                      <div 
                        className="p-1.5"
                        style={{ backgroundColor: colors.background, border: `1px solid ${colors.text}20` }}
                      >
                        {qrCodeUrl ? (
                          <img src={qrCodeUrl} alt="QR Code" style={{ width: '80px', height: '80px' }} />
                        ) : (
                          <div 
                            className="flex items-center justify-center"
                            style={{ width: '80px', height: '80px', backgroundColor: `${colors.text}10` }}
                          >
                            <span className="text-xs" style={{ color: colors.text }}>No QR</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Print instructions */}
          <div className="mt-8 text-center text-sm text-neutral-500 print:hidden">
            <p>Use your browser's print dialog (Ctrl+P / ⌘P) for best results</p>
            <p className="mt-1">Recommended: Borderless printing on cardstock</p>
          </div>
        </div>
      </main>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          @page {
            size: ${config.width}in ${config.height}in;
            margin: 0;
          }
          body { margin: 0; padding: 0; }
          #print-card { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
