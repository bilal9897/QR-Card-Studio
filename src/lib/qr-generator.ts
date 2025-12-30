import QRCode from 'qrcode';

export interface QROptions {
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

export async function generateQRCode(
  url: string,
  options: QROptions = {
    width: 400,
    margin: 0,
    color: { dark: '#1a1815', light: '#ffffff' }
  }
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: options.width,
      margin: options.margin,
      color: options.color,
      errorCorrectionLevel: 'H', // High error correction for logo overlay
    });
    return dataUrl;
  } catch {
    throw new Error('Failed to generate QR code');
  }
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
