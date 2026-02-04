/**
 * Card size configurations - single source of truth
 */

export type CardSize = 'small' | 'medium' | 'large' | 'custom';
export type CardFormat = 'table-tent' | 'square' | 'dual-qr';
export type SizeUnit = 'mm' | 'inch' | 'px';

interface SizeConfig {
  width: number;  // inches
  height: number; // inches
  label: string;
  scale: number;  // preview scale factor (deprecated, use tokens)
}

// Token-based sizing for each card size
export interface CardSizeTokens {
  cardWidth: number;      // px - base width for preview
  cardHeight: number;     // px - base height for preview  
  padding: number;        // px
  titleSize: number;      // px
  bodySize: number;       // px
  ctaSize: number;        // px
  qrSize: number;         // px
  qrPadding: number;      // px
  logoMaxHeight: number;  // px
  logoMaxWidth: number;   // px
  spacing: number;        // px - general spacing
}

// Table tent token configurations
// Max preview width is 360px to fit in 400px container with padding
export const tableTentTokens: Record<Exclude<CardSize, 'custom'>, CardSizeTokens> = {
  small: {
    cardWidth: 200,
    cardHeight: 300,
    padding: 16,
    titleSize: 16,
    bodySize: 9,
    ctaSize: 7,
    qrSize: 80,
    qrPadding: 6,
    logoMaxHeight: 36,
    logoMaxWidth: 72,
    spacing: 10,
  },
  medium: {
    cardWidth: 260,
    cardHeight: 390,
    padding: 24,
    titleSize: 22,
    bodySize: 11,
    ctaSize: 9,
    qrSize: 110,
    qrPadding: 9,
    logoMaxHeight: 50,
    logoMaxWidth: 100,
    spacing: 14,
  },
  large: {
    cardWidth: 320,
    cardHeight: 480,
    padding: 32,
    titleSize: 28,
    bodySize: 14,
    ctaSize: 11,
    qrSize: 140,
    qrPadding: 12,
    logoMaxHeight: 64,
    logoMaxWidth: 128,
    spacing: 18,
  },
};

// Square token configurations
// Max preview width is 320px to fit in ~380px preview area with container padding
export const squareTokens: Record<Exclude<CardSize, 'custom'>, CardSizeTokens> = {
  small: {
    cardWidth: 220,
    cardHeight: 220,
    padding: 12,
    titleSize: 12,
    bodySize: 8,
    ctaSize: 7,
    qrSize: 64,
    qrPadding: 4,
    logoMaxHeight: 22,
    logoMaxWidth: 44,
    spacing: 8,
  },
  medium: {
    cardWidth: 270,
    cardHeight: 270,
    padding: 16,
    titleSize: 15,
    bodySize: 10,
    ctaSize: 8,
    qrSize: 84,
    qrPadding: 6,
    logoMaxHeight: 30,
    logoMaxWidth: 60,
    spacing: 10,
  },
  large: {
    cardWidth: 320,
    cardHeight: 320,
    padding: 22,
    titleSize: 19,
    bodySize: 12,
    ctaSize: 10,
    qrSize: 104,
    qrPadding: 8,
    logoMaxHeight: 38,
    logoMaxWidth: 76,
    spacing: 14,
  },
};

// Dual QR token configurations (Vertical split)
export const dualTokens: Record<Exclude<CardSize, 'custom'>, CardSizeTokens> = {
  small: {
    cardWidth: 200,
    cardHeight: 320,
    padding: 16,
    titleSize: 14,
    bodySize: 9,
    ctaSize: 7,
    qrSize: 60, // Smaller QRs to fit two
    qrPadding: 6,
    logoMaxHeight: 20,
    logoMaxWidth: 40,
    spacing: 8,
  },
  medium: {
    cardWidth: 260,
    cardHeight: 400,
    padding: 24,
    titleSize: 18,
    bodySize: 11,
    ctaSize: 9,
    qrSize: 75,
    qrPadding: 8,
    logoMaxHeight: 28,
    logoMaxWidth: 56,
    spacing: 12,
  },
  large: {
    cardWidth: 320,
    cardHeight: 500,
    padding: 32,
    titleSize: 22,
    bodySize: 14,
    ctaSize: 11,
    qrSize: 90,
    qrPadding: 10,
    logoMaxHeight: 36,
    logoMaxWidth: 72,
    spacing: 16,
  },
};

/**
 * Get base aspect ratio for a format
 */
export function getFormatAspectRatio(format: CardFormat): number {
  if (format === 'square') return 1;
  return 2 / 3; // table-tent & dual-qr (portrait)
}

/**
 * Get size tokens for a format and size
 * Properly calculates dimensions based on actual width/height
 * Constrains preview to fit in container (max 360px width)
 */
export function getSizeTokens(
  format: CardFormat,
  size: CardSize,
  customSize?: CustomSize
): CardSizeTokens {
  if (size === 'custom' && customSize) {
    const widthInches = convertToInches(customSize.width, customSize.unit);
    const heightInches = convertToInches(customSize.height, customSize.unit);

    // Use medium preset as base reference
    const baseTokens = format === 'square' ? squareTokens.medium : tableTentTokens.medium;
    const refWidth = format === 'square' ? 3.6 : 3.2;
    const refHeight = format === 'square' ? 3.6 : 4.8;

    // Calculate scale based on the smaller dimension ratio to prevent overflow
    const widthRatio = widthInches / refWidth;
    const heightRatio = heightInches / refHeight;
    const scaleRatio = Math.min(widthRatio, heightRatio);
    const clampedRatio = Math.max(0.6, Math.min(scaleRatio, 1.5));

    // Calculate preview dimensions preserving custom aspect ratio
    const customAspectRatio = widthInches / heightInches;

    // Constrain to fit in 320px max width, 420px max height for container fit
    const maxPreviewWidth = 320;
    const maxPreviewHeight = 420;
    const minPreviewHeight = 180;

    // Start with scaled dimensions
    let previewWidth = baseTokens.cardWidth * widthRatio;
    let previewHeight = baseTokens.cardHeight * heightRatio;

    // Constrain width first
    if (previewWidth > maxPreviewWidth) {
      previewWidth = maxPreviewWidth;
      previewHeight = previewWidth / customAspectRatio;
    }

    // Then constrain height if needed
    if (previewHeight > maxPreviewHeight) {
      previewHeight = maxPreviewHeight;
      previewWidth = previewHeight * customAspectRatio;
    }

    // Ensure minimum size
    if (previewHeight < minPreviewHeight) {
      previewHeight = minPreviewHeight;
      previewWidth = previewHeight * customAspectRatio;
    }

    return {
      cardWidth: Math.round(previewWidth),
      cardHeight: Math.round(previewHeight),
      padding: Math.round(baseTokens.padding * clampedRatio),
      titleSize: Math.round(baseTokens.titleSize * clampedRatio),
      bodySize: Math.round(baseTokens.bodySize * clampedRatio),
      ctaSize: Math.round(baseTokens.ctaSize * clampedRatio),
      qrSize: Math.round(baseTokens.qrSize * clampedRatio),
      qrPadding: Math.round(baseTokens.qrPadding * clampedRatio),
      logoMaxHeight: Math.round(baseTokens.logoMaxHeight * clampedRatio),
      logoMaxWidth: Math.round(baseTokens.logoMaxWidth * clampedRatio),
      spacing: Math.round(baseTokens.spacing * clampedRatio),
    };
  }

  const presetSize = size === 'custom' ? 'medium' : size;
  if (format === 'square') return squareTokens[presetSize];
  if (format === 'dual-qr') return dualTokens[presetSize];
  return tableTentTokens[presetSize];
}

export interface CustomSize {
  width: number;
  height: number;
  unit: SizeUnit;
}

// Table tent size configurations
export const tableTentSizes: Record<Exclude<CardSize, 'custom'>, SizeConfig> = {
  small: { width: 2.5, height: 3.8, label: 'Small', scale: 0.8 },
  medium: { width: 3.2, height: 4.8, label: 'Medium', scale: 1 },
  large: { width: 4, height: 6, label: 'Large', scale: 1.25 },
};

// Dual QR size configurations (Same physical approx as table tent, usually)
export const dualSizes: Record<Exclude<CardSize, 'custom'>, SizeConfig> = {
  small: { width: 3, height: 5, label: 'Small', scale: 0.8 },
  medium: { width: 4, height: 6, label: 'Medium', scale: 1 },
  large: { width: 5, height: 7, label: 'Large', scale: 1.25 },
};

// Square size configurations
export const squareSizes: Record<Exclude<CardSize, 'custom'>, SizeConfig> = {
  small: { width: 2.8, height: 2.8, label: 'Small', scale: 0.8 },
  medium: { width: 3.6, height: 3.6, label: 'Medium', scale: 1 },
  large: { width: 4.5, height: 4.5, label: 'Large', scale: 1.25 },
};

// Size limits (in inches) - ensures QR remains scannable and print-safe
export const SIZE_LIMITS = {
  minWidth: 2,      // 2 inches minimum
  minHeight: 2,     // 2 inches minimum
  maxWidth: 12,     // 12 inches maximum
  maxHeight: 18,    // 18 inches maximum
  qrMargin: 0.5,    // Minimum margin for QR code
};

/**
 * Convert custom size to inches
 */
export function convertToInches(value: number, unit: SizeUnit): number {
  switch (unit) {
    case 'mm':
      return value / 25.4;
    case 'px':
      return value / 300; // Assuming 300 DPI
    case 'inch':
    default:
      return value;
  }
}

/**
 * Convert inches to specified unit
 */
export function convertFromInches(inches: number, unit: SizeUnit): number {
  switch (unit) {
    case 'mm':
      return Math.round(inches * 25.4 * 10) / 10;
    case 'px':
      return Math.round(inches * 300);
    case 'inch':
    default:
      return Math.round(inches * 100) / 100;
  }
}

/**
 * Get size config for a format and size (handles custom sizes)
 */
export function getSizeConfig(
  format: CardFormat,
  size: CardSize,
  customSize?: CustomSize
): SizeConfig {
  if (size === 'custom' && customSize) {
    const widthInches = convertToInches(customSize.width, customSize.unit);
    const heightInches = convertToInches(customSize.height, customSize.unit);

    // Calculate scale based on medium size reference
    const referenceWidth = format === 'square' ? 3.6 : 3.2;
    const scale = Math.min(widthInches / referenceWidth, 1.5);

    return {
      width: widthInches,
      height: heightInches,
      label: 'Custom',
      scale: Math.max(0.6, Math.min(scale, 1.5)),
    };
  }

  const presetSize = size === 'custom' ? 'medium' : size;
  if (format === 'square') return squareSizes[presetSize];
  if (format === 'dual-qr') return dualSizes[presetSize];
  return tableTentSizes[presetSize];
}

/**
 * Validate custom size
 */
export function validateCustomSize(customSize: CustomSize): { valid: boolean; error?: string } {
  const widthInches = convertToInches(customSize.width, customSize.unit);
  const heightInches = convertToInches(customSize.height, customSize.unit);

  if (customSize.width <= 0 || customSize.height <= 0) {
    return { valid: false, error: 'Dimensions must be positive' };
  }

  if (widthInches < SIZE_LIMITS.minWidth || heightInches < SIZE_LIMITS.minHeight) {
    return { valid: false, error: `Minimum size: ${SIZE_LIMITS.minWidth}" × ${SIZE_LIMITS.minHeight}" for scannable QR` };
  }

  if (widthInches > SIZE_LIMITS.maxWidth || heightInches > SIZE_LIMITS.maxHeight) {
    return { valid: false, error: `Maximum size: ${SIZE_LIMITS.maxWidth}" × ${SIZE_LIMITS.maxHeight}" for print safety` };
  }

  return { valid: true };
}

/**
 * Get print size string (e.g. '3.2" × 4.8"')
 */
export function getPrintSizeLabel(
  format: CardFormat,
  size: CardSize,
  customSize?: CustomSize
): string {
  const config = getSizeConfig(format, size, customSize);
  return `${config.width.toFixed(1)}" × ${config.height.toFixed(1)}"`;
}

/**
 * Get pixel dimensions at a given DPI
 */
export function getPixelDimensions(
  format: CardFormat,
  size: CardSize,
  dpi: number = 96,
  customSize?: CustomSize
): { width: number; height: number } {
  const config = getSizeConfig(format, size, customSize);
  return {
    width: Math.round(config.width * dpi),
    height: Math.round(config.height * dpi),
  };
}

/**
 * Get default custom size for a format
 */
export function getDefaultCustomSize(format: CardFormat, unit: SizeUnit = 'inch'): CustomSize {
  const baseSize = format === 'square'
    ? { width: 3.6, height: 3.6 }
    : { width: 3.2, height: 4.8 }; // Default for table-tent and dual-qr

  if (format === 'dual-qr') {
    // maybe slightly larger for dual?
    baseSize.width = 4;
    baseSize.height = 6;
  }

  return {
    width: convertFromInches(baseSize.width, unit),
    height: convertFromInches(baseSize.height, unit),
    unit,
  };
}
