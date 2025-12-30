import { forwardRef, CSSProperties } from 'react';
import { sanitizeText } from '@/lib/validation';
import { getSizeTokens, getPrintSizeLabel, type CardSize, type CardFormat, type CustomSize, type CardSizeTokens } from '@/lib/card-sizes';
import type { CardColors } from '@/lib/card-colors';

// Re-export for backwards compatibility
export type { CardFormat } from '@/lib/card-sizes';

interface CardPreviewProps {
  format: CardFormat;
  size: CardSize;
  businessName: string;
  message: string;
  ctaText: string;
  qrCodeUrl: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  showBackground: boolean;
  themeId: string;
  colors?: CardColors;
  customSize?: CustomSize;
  showBadge?: boolean;
}

/**
 * Generate CSS variables from size tokens
 */
function getTokenCssVars(tokens: CardSizeTokens): CSSProperties {
  return {
    '--card-width': `${tokens.cardWidth}px`,
    '--card-height': `${tokens.cardHeight}px`,
    '--card-padding': `${tokens.padding}px`,
    '--card-title-size': `${tokens.titleSize}px`,
    '--card-body-size': `${tokens.bodySize}px`,
    '--card-cta-size': `${tokens.ctaSize}px`,
    '--card-qr-size': `${tokens.qrSize}px`,
    '--card-qr-padding': `${tokens.qrPadding}px`,
    '--card-logo-height': `${tokens.logoMaxHeight}px`,
    '--card-logo-width': `${tokens.logoMaxWidth}px`,
    '--card-spacing': `${tokens.spacing}px`,
  } as CSSProperties;
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(
  ({ format, size, businessName, message, ctaText, qrCodeUrl, logoUrl, backgroundUrl, showBackground, themeId, colors, customSize, showBadge = true }, ref) => {
    // Get tokens for current size
    const tokens = getSizeTokens(format, size, customSize);
    
    const safeName = sanitizeText(businessName) || 'Your Business';
    const safeMessage = sanitizeText(message) || 'We value your feedback. Scan to share your experience.';
    const safeCta = sanitizeText(ctaText) || 'Scan to Review';

    // Color CSS variables
    const colorVars: CSSProperties = colors ? {
      '--card-preview-bg': colors.background,
      '--card-preview-text': colors.text,
      '--card-preview-accent': colors.accent,
      '--card-preview-muted': colors.text,
      '--card-preview-border': `${colors.text}20`,
    } as CSSProperties : {};

    // Combine token and color variables
    const cssVars: CSSProperties = {
      ...getTokenCssVars(tokens),
      ...colorVars,
    };

    const hasRgbBorder = colors?.borderGradient;
    
    const cardStyle: CSSProperties = {
      backgroundColor: colors?.background || 'var(--card-preview-bg)',
      background: hasRgbBorder 
        ? (colors?.gradient || colors?.background || 'var(--card-preview-bg)')
        : (colors?.gradient || 'var(--card-preview-bg)'),
      color: 'var(--card-preview-text)',
      boxShadow: 'var(--shadow-product)',
    };

    if (format === 'table-tent') {
      return (
        <div
          ref={ref}
          data-theme={themeId}
          className="relative flex-shrink-0"
          style={{ 
            ...cssVars,
            width: 'var(--card-width)', 
            height: 'var(--card-height)',
          }}
          role="img"
          aria-label={`Preview of feedback card for ${safeName}`}
        >
          {hasRgbBorder && (
            <div 
              className="absolute inset-0"
              style={{ background: colors.borderGradient }}
              aria-hidden="true"
            />
          )}
          
          <div 
            className="absolute overflow-hidden"
            style={{
              ...cardStyle,
              top: hasRgbBorder ? '2px' : '0',
              left: hasRgbBorder ? '2px' : '0',
              right: hasRgbBorder ? '2px' : '0',
              bottom: hasRgbBorder ? '2px' : '0',
              boxShadow: hasRgbBorder ? 'none' : 'var(--shadow-product)',
            }}
          >
            {!hasRgbBorder && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ border: '1px solid var(--card-preview-border)' }}
              />
            )}
          
            {showBackground && backgroundUrl && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url(${backgroundUrl})` }}
                aria-hidden="true"
              />
            )}
            
            <div 
              className="relative h-full flex flex-col" 
              style={{ padding: 'var(--card-padding)' }}
            >
              {logoUrl && (
                <div 
                  className="flex justify-center" 
                  style={{ marginBottom: 'var(--card-spacing)' }}
                >
                  <img
                    src={logoUrl}
                    alt=""
                    className="object-contain"
                    style={{ 
                      maxHeight: 'var(--card-logo-height)', 
                      maxWidth: 'var(--card-logo-width)' 
                    }}
                  />
                </div>
              )}
              
              <h2 
                className="font-serif text-center leading-tight"
                style={{ 
                  fontSize: 'var(--card-title-size)', 
                  marginBottom: 'var(--card-spacing)', 
                  color: 'var(--card-preview-text)' 
                }}
              >
                {safeName}
              </h2>
              
              <p 
                className="text-center leading-relaxed mb-auto"
                style={{ 
                  fontSize: 'var(--card-body-size)', 
                  color: 'var(--card-preview-muted)' 
                }}
              >
                {safeMessage}
              </p>
              
              <div 
                className="flex flex-col items-center" 
                style={{ marginTop: 'var(--card-spacing)' }}
              >
                <div 
                  style={{ 
                    padding: 'var(--card-qr-padding)',
                    backgroundColor: 'var(--card-preview-bg)',
                    border: '1px solid var(--card-preview-border)',
                  }}
                >
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      style={{ 
                        width: 'var(--card-qr-size)', 
                        height: 'var(--card-qr-size)' 
                      }}
                    />
                  ) : (
                    <div 
                      className="flex items-center justify-center"
                      style={{ 
                        width: 'var(--card-qr-size)', 
                        height: 'var(--card-qr-size)',
                        backgroundColor: 'var(--card-preview-border)',
                      }}
                    >
                      <span 
                        className="text-center px-4"
                        style={{ 
                          fontSize: 'var(--card-cta-size)', 
                          color: 'var(--card-preview-muted)' 
                        }}
                      >
                        Enter a link to generate QR
                      </span>
                    </div>
                  )}
                </div>
                
                <p 
                  className="font-medium uppercase tracking-widest"
                  style={{ 
                    fontSize: 'var(--card-cta-size)', 
                    marginTop: 'var(--card-spacing)', 
                    color: 'var(--card-preview-text)' 
                  }}
                >
                  {safeCta}
                </p>
                {showBadge && (
                  <p 
                    className="opacity-40"
                    style={{ 
                      fontSize: 'calc(var(--card-cta-size) * 0.7)', 
                      marginTop: 'calc(var(--card-spacing) * 0.5)',
                      color: 'var(--card-preview-muted)' 
                    }}
                  >
                    Powered by Codexa
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Square format
    return (
      <div
        ref={ref}
        data-theme={themeId}
        className="relative flex-shrink-0"
        style={{ 
          ...cssVars,
          width: 'var(--card-width)', 
          height: 'var(--card-height)',
        }}
        role="img"
        aria-label={`Preview of square feedback card for ${safeName}`}
      >
        {hasRgbBorder && (
          <div 
            className="absolute inset-0"
            style={{ background: colors?.borderGradient }}
            aria-hidden="true"
          />
        )}
        
        <div 
          className="absolute overflow-hidden"
          style={{
            ...cardStyle,
            top: hasRgbBorder ? '2px' : '0',
            left: hasRgbBorder ? '2px' : '0',
            right: hasRgbBorder ? '2px' : '0',
            bottom: hasRgbBorder ? '2px' : '0',
            boxShadow: hasRgbBorder ? 'none' : 'var(--shadow-product)',
          }}
        >
          {!hasRgbBorder && (
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ border: '1px solid var(--card-preview-border)' }}
            />
          )}
          
          {showBackground && backgroundUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url(${backgroundUrl})` }}
              aria-hidden="true"
            />
          )}
          
          <div 
            className="relative h-full flex flex-col" 
            style={{ padding: 'var(--card-padding)' }}
          >
            <div 
              className="flex items-start justify-between" 
              style={{ marginBottom: 'var(--card-spacing)' }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="object-contain"
                  style={{ 
                    maxHeight: 'var(--card-logo-height)', 
                    maxWidth: 'var(--card-logo-width)' 
                  }}
                />
              ) : (
                <div style={{ 
                  width: 'var(--card-logo-height)', 
                  height: 'var(--card-logo-height)' 
                }} />
              )}
              
              <h2 
                className="font-serif text-right leading-tight"
                style={{ 
                  fontSize: 'var(--card-title-size)', 
                  maxWidth: '60%', 
                  color: 'var(--card-preview-text)' 
                }}
              >
                {safeName}
              </h2>
            </div>
            
            <p 
              className="leading-relaxed flex-1"
              style={{ 
                fontSize: 'var(--card-body-size)', 
                color: 'var(--card-preview-muted)' 
              }}
            >
              {safeMessage}
            </p>
            
            <div 
              className="flex items-end justify-between" 
              style={{ marginTop: 'var(--card-spacing)' }}
            >
              <div 
                className="flex-1" 
                style={{ paddingRight: 'var(--card-spacing)' }}
              >
                <p 
                  className="font-medium uppercase tracking-widest"
                  style={{ 
                    fontSize: 'var(--card-cta-size)', 
                    color: 'var(--card-preview-text)' 
                  }}
                >
                  {safeCta}
                </p>
                {showBadge && (
                  <p 
                    className="opacity-40"
                    style={{ 
                      fontSize: 'calc(var(--card-cta-size) * 0.7)', 
                      marginTop: 'calc(var(--card-spacing) * 0.3)',
                      color: 'var(--card-preview-muted)' 
                    }}
                  >
                    Powered by Codexa
                  </p>
                )}
              </div>
              
              <div 
                style={{ 
                  padding: 'var(--card-qr-padding)',
                  backgroundColor: 'var(--card-preview-bg)',
                  border: '1px solid var(--card-preview-border)',
                }}
              >
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    style={{ 
                      width: 'var(--card-qr-size)', 
                      height: 'var(--card-qr-size)' 
                    }}
                  />
                ) : (
                  <div 
                    className="flex items-center justify-center"
                    style={{ 
                      width: 'var(--card-qr-size)', 
                      height: 'var(--card-qr-size)',
                      backgroundColor: 'var(--card-preview-border)',
                    }}
                  >
                    <span 
                      className="text-center"
                      style={{ 
                        fontSize: 'var(--card-cta-size)', 
                        padding: 'var(--card-qr-padding)', 
                        color: 'var(--card-preview-muted)' 
                      }}
                    >
                      Enter link
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CardPreview.displayName = 'CardPreview';

export default CardPreview;

// Helper to get print size string
export function getPrintSize(format: CardFormat, size: CardSize, customSize?: CustomSize): string {
  return getPrintSizeLabel(format, size, customSize);
}