import { forwardRef, CSSProperties } from 'react';
import { sanitizeText } from '@/lib/validation';
import { getSizeTokens, getPrintSizeLabel, type CardSize, type CardFormat, type CustomSize, type CardSizeTokens } from '@/lib/card-sizes';
import type { CardColors } from '@/lib/card-colors';
import ArtisticQR from './ArtisticQR';

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
  backgroundOpacity?: number;
  showBackground: boolean;
  themeId: string;
  colors?: CardColors;
  customSize?: CustomSize;
  showBadge?: boolean;
  qrStyle?: any;
  qrContent?: string; // Raw content for ArtisticQR
  qrLogoUrl?: string | null; // Different from business logoUrl
  qrContent2?: string; // Raw content for 2nd QR
  qrLogoUrl2?: string | null; // Logo for 2nd QR
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
  ({ format, size, businessName, message, ctaText, qrCodeUrl, logoUrl, backgroundUrl, backgroundOpacity = 0.1, showBackground, themeId, colors, customSize, showBadge = true, qrStyle, qrContent, qrLogoUrl, qrContent2, qrLogoUrl2 }, ref) => {
    // Get tokens for current size
    const tokens = getSizeTokens(format, size, customSize);

    // Prevent crash if invalid size passed
    if (!tokens) {
      console.error('Invalid card size or tokens missing', { format, size });
      return null;
    }

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

    if (format === 'dual-qr') {
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
          aria-label={`Preview of dual QR card for ${safeName}`}
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

            {/* Noise Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />

            {showBackground && backgroundUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${backgroundUrl}")`,
                  opacity: backgroundOpacity
                }}
                aria-hidden="true"
              />
            )}

            <div
              className="relative h-full flex flex-col justify-between backdrop-blur-[2px]"
              style={{
                padding: 'var(--card-padding)',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)'
              }}
            >
              {/* Header Section */}
              <div className="flex flex-col min-h-0 overflow-hidden text-center mb-4">
                {logoUrl ? (
                  <div
                    className="flex justify-center flex-shrink-0"
                    style={{ marginBottom: 'calc(var(--card-spacing) * 0.5)' }}
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
                ) : null}

                <h2
                  className="font-serif leading-tight flex-shrink-0"
                  style={{
                    fontSize: 'var(--card-title-size)',
                    marginBottom: 'calc(var(--card-spacing) * 0.5)',
                    color: 'var(--card-preview-text)'
                  }}
                >
                  {safeName}
                </h2>
                <p
                  className="leading-relaxed overflow-hidden text-ellipsis line-clamp-2"
                  style={{
                    fontSize: 'var(--card-body-size)',
                    color: 'var(--card-preview-muted)'
                  }}
                >
                  {safeMessage}
                </p>
              </div>

              {/* Dual QR Section - Horizontal at Bottom */}
              <div className="flex-1 flex flex-col justify-end pb-8">
                <div className="flex flex-row items-end justify-center gap-8">

                  {/* QR 1 Group */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-2"> {/* CHANGED: flex-col for Vertical stack */}
                      {/* External Logo (Top of QR) */}
                      {qrLogoUrl && (
                        <div className="w-8 h-8 flex-shrink-0 bg-white/10 rounded-full p-1.5 backdrop-blur-sm border border-white/10 shadow-sm">
                          <img src={qrLogoUrl} alt="" className="w-full h-full object-contain" />
                        </div>
                      )}

                      {/* QR Code Frame */}
                      <div
                        style={{
                          padding: 'var(--card-qr-padding)',
                          backgroundColor: 'var(--card-preview-bg)',
                          border: '1px solid var(--card-preview-border)',
                          borderRadius: '4px', // Slight rounding
                        }}
                      >
                        {qrCodeUrl ? (
                          <div style={{ width: 'var(--card-qr-size)', height: 'var(--card-qr-size)' }}>
                            {qrContent ? (
                              <ArtisticQR
                                data={qrContent}
                                size={parseInt(tokens.qrSize.toString()) * 2}
                                dotsColor={qrStyle?.dotColor || colors?.qrColor || '#000000'}
                                backgroundColor={qrStyle?.backgroundColor || 'transparent'}
                                dotsType={qrStyle?.dotStyle || 'square'}
                              // No embedded logo
                              />
                            ) : (
                              <img src={qrCodeUrl} alt="QR 1" style={{ width: '100%', height: '100%' }} />
                            )}
                          </div>
                        ) : (
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 'var(--card-qr-size)',
                              height: 'var(--card-qr-size)',
                              backgroundColor: 'var(--card-preview-border)',
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: 'calc(var(--card-body-size) * 0.9)', opacity: 0.9, fontWeight: 600, marginTop: '4px' }}>Review Us</span>
                  </div>

                  {/* QR 2 Group */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-2"> {/* CHANGED: flex-col for Vertical stack */}
                      {/* External Logo (Top of QR) */}
                      {qrLogoUrl2 && (
                        <div className="w-8 h-8 flex-shrink-0 bg-white/10 rounded-full p-1.5 backdrop-blur-sm border border-white/10 shadow-sm">
                          <img src={qrLogoUrl2} alt="" className="w-full h-full object-contain" />
                        </div>
                      )}

                      <div
                        style={{
                          padding: 'var(--card-qr-padding)',
                          backgroundColor: 'var(--card-preview-bg)',
                          border: '1px solid var(--card-preview-border)',
                          borderRadius: '4px',
                        }}
                      >
                        {qrCodeUrl ? (
                          <div style={{ width: 'var(--card-qr-size)', height: 'var(--card-qr-size)' }}>
                            {(qrContent2 || qrContent) ? (
                              <ArtisticQR
                                data={qrContent2 || qrContent || ''}
                                size={parseInt(tokens.qrSize.toString()) * 2}
                                dotsColor={qrStyle?.dotColor || colors?.qrColor || '#000000'}
                                backgroundColor={qrStyle?.backgroundColor || 'transparent'}
                                dotsType={qrStyle?.dotStyle || 'square'}
                              // No embedded logo
                              />
                            ) : (
                              <img src={qrCodeUrl} alt="QR 2" style={{ width: '100%', height: '100%' }} />
                            )}
                          </div>
                        ) : (
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 'var(--card-qr-size)',
                              height: 'var(--card-qr-size)',
                              backgroundColor: 'var(--card-preview-border)',
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize: 'calc(var(--card-body-size) * 0.9)', opacity: 0.9, fontWeight: 600, marginTop: '4px' }}>Follow Us</span>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
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
                    Powered by Bilal
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

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

            {/* Noise Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />

            {showBackground && backgroundUrl && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${backgroundUrl}")`,
                  opacity: backgroundOpacity
                }}
                aria-hidden="true"
              />
            )}

            <div
              className="relative h-full flex flex-col justify-between backdrop-blur-[2px]"
              style={{
                padding: 'var(--card-padding)',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)'
              }}
            >
              {/* Top Content: Logo, Title, Message (Can shrink) */}
              <div className="flex flex-col min-h-0 overflow-hidden">
                {logoUrl && (
                  <div
                    className="flex justify-center flex-shrink-0"
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
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <h2
                  className="font-serif text-center leading-tight flex-shrink-0"
                  style={{
                    fontSize: 'var(--card-title-size)',
                    marginBottom: 'var(--card-spacing)',
                    color: 'var(--card-preview-text)'
                  }}
                >
                  {safeName}
                </h2>

                <p
                  className="text-center leading-relaxed overflow-hidden text-ellipsis"
                  style={{
                    fontSize: 'var(--card-body-size)',
                    color: 'var(--card-preview-muted)'
                  }}
                >
                  {safeMessage}
                </p>
              </div>

              {/* Bottom Content: QR & CTA (Fixed visibility) */}
              <div
                className="flex flex-col items-center flex-shrink-0"
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
                    <div style={{ width: 'var(--card-qr-size)', height: 'var(--card-qr-size)' }}>
                      {qrContent ? (
                        <ArtisticQR
                          data={qrContent}
                          size={parseInt(tokens.qrSize.toString()) * 2}
                          dotsColor={qrStyle?.dotColor || colors?.qrColor || '#000000'}
                          backgroundColor={qrStyle?.backgroundColor || 'transparent'}
                          dotsType={qrStyle?.dotStyle || 'square'}
                          cornerSquareType={qrStyle?.cornerSquareStyle || 'square'}
                          cornerDotType={qrStyle?.cornerDotStyle || 'square'}
                          cornerSquareColor={qrStyle?.cornerSquareColor || qrStyle?.dotColor || colors?.qrColor || '#000000'}
                          cornerDotColor={qrStyle?.cornerDotColor || qrStyle?.dotColor || colors?.qrColor || '#000000'}
                          logo={qrLogoUrl || undefined}
                          logoSize={0.4}
                          logoMargin={5}
                        />
                      ) : (
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          style={{ width: '100%', height: '100%' }}
                        />
                      )}
                    </div>
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
                    Powered by Bilal
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

          {/* Noise Texture Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />

          {showBackground && backgroundUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${backgroundUrl}")`,
                opacity: backgroundOpacity
              }}
              aria-hidden="true"
            />
          )}

          <div
            className="relative h-full flex flex-col backdrop-blur-[2px]"
            style={{
              padding: 'var(--card-padding)',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)'
            }}
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
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
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
                    Powered by Bilal
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
                  <div style={{ width: 'var(--card-qr-size)', height: 'var(--card-qr-size)' }}>
                    {qrContent ? (
                      <ArtisticQR
                        data={qrContent}
                        size={parseInt(tokens.qrSize.toString()) * 2}
                        dotsColor={qrStyle?.dotColor || colors?.qrColor || '#000000'}
                        backgroundColor={qrStyle?.backgroundColor || 'transparent'}
                        dotsType={qrStyle?.dotStyle || 'square'}
                        cornerSquareType={qrStyle?.cornerSquareStyle || 'square'}
                        cornerDotType={qrStyle?.cornerDotStyle || 'square'}
                        cornerSquareColor={qrStyle?.cornerSquareColor || qrStyle?.dotColor || colors?.qrColor || '#000000'}
                        cornerDotColor={qrStyle?.cornerDotColor || qrStyle?.dotColor || colors?.qrColor || '#000000'}
                        logo={qrLogoUrl || undefined}
                        logoSize={0.4}
                        logoMargin={5}
                      />
                    ) : (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        style={{ width: '100%', height: '100%' }}
                      />
                    )}
                  </div>
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