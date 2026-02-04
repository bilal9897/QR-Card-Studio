import QRCode from 'qrcode';

export interface QROptions {
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  logoUrl?: string | null;
  dotStyle?: 'square' | 'rounded' | 'dots';
}

export async function generateQRCode(
  url: string,
  options: QROptions = {
    width: 400,
    margin: 0,
    color: { dark: '#1a1815', light: '#ffffff' },
    dotStyle: 'dots'
  }
): Promise<string> {
  try {
    // Generate QR code data
    const qrData = await QRCode.create(url, {
      errorCorrectionLevel: 'H', // High error correction for logo overlay
    });

    // Draw custom styled QR code
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas not supported');
    }

    const moduleCount = qrData.modules.size;
    const dotStyle = options.dotStyle || 'dots';

    // Add margin
    const marginModules = options.margin || 0;
    const totalModules = moduleCount + (marginModules * 2);
    const moduleSize = options.width / totalModules;

    canvas.width = options.width;
    canvas.height = options.width;

    // Fill background
    ctx.fillStyle = options.color.light;
    ctx.fillRect(0, 0, options.width, options.width);

    // Draw QR modules with custom style
    ctx.fillStyle = options.color.dark;

    const offset = marginModules * moduleSize;

    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrData.modules.data[row * moduleCount + col]) {
          const x = offset + col * moduleSize;
          const y = offset + row * moduleSize;

          // Check if this is part of a position marker (corners)
          const isPosMarker = isInPositionMarker(row, col, moduleCount);

          if (isPosMarker) {
            // For position markers, we draw them as connected blocks to form the square 
            // but we apply style to the outer corners
            const isOuterCorner = isPositionMarkerOuterCorner(row, col, moduleCount);

            if (dotStyle === 'rounded' || dotStyle === 'dots') {
              if (isOuterCorner) {
                drawRoundedCorner(ctx, x, y, moduleSize, row, col, moduleCount);
              } else {
                ctx.fillRect(x, y, moduleSize, moduleSize);
              }
            } else {
              ctx.fillRect(x, y, moduleSize, moduleSize);
            }
          } else {
            // Draw data modules based on style
            switch (dotStyle) {
              case 'dots':
                // Perfect circular dots with slight spacing
                const dotRadius = moduleSize * 0.45; // Slightly smaller for spacing
                ctx.beginPath();
                ctx.arc(
                  x + moduleSize / 2,
                  y + moduleSize / 2,
                  dotRadius,
                  0,
                  Math.PI * 2
                );
                ctx.fill();
                break;

              case 'rounded':
                // Rounded squares with generous corner radius
                drawRoundedSquare(ctx, x, y, moduleSize, moduleSize * 0.4);
                break;

              case 'square':
              default:
                // Standard squares
                ctx.fillRect(x, y, moduleSize, moduleSize);
                break;
            }
          }
        }
      }
    }

    // Helper to draw specific rounded corners for position markers
    function drawRoundedCorner(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      row: number,
      col: number,
      count: number
    ) {
      const r = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);

      // Top-Left Marker
      if (row === 0 && col === 0) {
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + size, y);
      }
      else if (row === 0 && col === 6) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x + size, y + r);
        ctx.quadraticCurveTo(x + size, y, x + size - r, y);
        ctx.lineTo(x, y);
      }
      else if (row === 6 && col === 0) {
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x + r, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - r);
        ctx.lineTo(x, y);
        ctx.lineTo(x + size, y);
      }
      // Top-Right Marker
      else if (row === 0 && col === count - 7) {
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.lineTo(x + size, y);
      }
      else if (row === 0 && col === count - 1) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x + size, y + r);
        ctx.quadraticCurveTo(x + size, y, x + size - r, y);
        ctx.lineTo(x, y);
      }
      else if (row === 6 && col === count - 7) {
        // Bottom left of top right marker - inner corner, usually square
        ctx.rect(x, y, size, size);
      }
      // Bottom-Left Marker
      else if (row === count - 7 && col === 0) {
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y); // Top left (actually this is top left of bottom marker)
        ctx.lineTo(x + size, y);
      }
      // Note: Simplified logic for standard "rounded corners" look on markers
      // Real implementation for position markers is complex because they are rings.
      // For now, simpler robust approach:
      else {
        ctx.rect(x, y, size, size);
      }

      ctx.fill();
    }

    const dataUrl = canvas.toDataURL('image/png');

    // If no logo, return the styled QR code as-is
    if (!options.logoUrl) {
      return dataUrl;
    }

    // Overlay logo on QR code
    return await overlayLogoOnQR(dataUrl, options.logoUrl, options.width);
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

function isInPositionMarker(row: number, col: number, size: number): boolean {
  // Top-left corner (7x7 area)
  if (row < 7 && col < 7) return true;
  // Top-right corner
  if (row < 7 && col >= size - 7) return true;
  // Bottom-left corner
  if (row >= size - 7 && col < 7) return true;
  return false;
}

function drawRoundedSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  radius: number
): void {
  // Ensure radius doesn't exceed half the size
  const r = Math.min(radius, size / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + size - r, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + r);
  ctx.lineTo(x + size, y + size - r);
  ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
  ctx.lineTo(x + r, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function isPositionMarkerOuterCorner(row: number, col: number, size: number): boolean {
  // Top Left Marker Outer Corners
  if ((row === 0 && col === 0) || (row === 0 && col === 6) || (row === 6 && col === 0) || (row === 6 && col === 6)) return true;

  // Top Right Marker Outer Corners
  if ((row === 0 && col === size - 7) || (row === 0 && col === size - 1) || (row === 6 && col === size - 7) || (row === 6 && col === size - 1)) return true;

  // Bottom Left Marker Outer Corners
  if ((row === size - 7 && col === 0) || (row === size - 7 && col === 6) || (row === size - 1 && col === 0) || (row === size - 1 && col === 6)) return true;

  return false;
}

async function overlayLogoOnQR(qrDataUrl: string, logoUrl: string, qrWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    // Set canvas size to match QR code
    canvas.width = qrWidth;
    canvas.height = qrWidth;

    // Load QR code image
    const qrImage = new Image();
    qrImage.onload = () => {
      // Draw QR code
      ctx.drawImage(qrImage, 0, 0, qrWidth, qrWidth);

      // Load logo image
      const logoImage = new Image();
      logoImage.onload = () => {
        // Calculate sizes - logo fills the white circle completely
        const bgSize = qrWidth * 0.25; // White circle background size (25% of QR)
        const logoSize = bgSize * 0.9; // Logo is 90% of circle (small padding)
        const logoX = (qrWidth - logoSize) / 2;
        const logoY = (qrWidth - logoSize) / 2;

        // Draw white circular background for logo (for better contrast)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(qrWidth / 2, qrWidth / 2, bgSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw logo as a circle (fills most of the white background)
        ctx.save();
        ctx.beginPath();
        ctx.arc(qrWidth / 2, qrWidth / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();

        // Draw the logo image
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();

        // Return the final composite image
        resolve(canvas.toDataURL('image/png'));
      };

      logoImage.onerror = () => {
        // If logo fails to load, return QR without logo
        resolve(qrDataUrl);
      };

      logoImage.src = logoUrl;
    };

    qrImage.onerror = () => {
      reject(new Error('Failed to load QR code'));
    };

    qrImage.src = qrDataUrl;
  });
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
