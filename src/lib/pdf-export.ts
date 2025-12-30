import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { getSizeConfig, type CardFormat, type CardSize } from './card-sizes';

interface PDFExportOptions {
  cardElement: HTMLElement;
  fileName: string;
  format: CardFormat;
  size: CardSize;
  includeBleed: boolean;
  includeCropMarks: boolean;
  hasRgbBorder?: boolean;
}

const BLEED = 0.125; // 1/8 inch bleed
const CROP_MARK_LENGTH = 0.25; // 1/4 inch crop marks
const CROP_MARK_OFFSET = 0.1; // Gap between mark and card edge

export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const { cardElement, fileName, format, size, includeBleed, includeCropMarks, hasRgbBorder } = options;
  
  // Get card dimensions from shared config
  const cardSize = getSizeConfig(format, size);
  const bleedAmount = includeBleed ? BLEED : 0;
  
  // Calculate page size with bleed and crop mark space
  const pageWidth = cardSize.width + (bleedAmount * 2) + (includeCropMarks ? CROP_MARK_LENGTH * 2 + CROP_MARK_OFFSET * 2 : 0);
  const pageHeight = cardSize.height + (bleedAmount * 2) + (includeCropMarks ? CROP_MARK_LENGTH * 2 + CROP_MARK_OFFSET * 2 : 0);
  
  // Create PDF (dimensions in inches)
  const pdf = new jsPDF({
    orientation: pageWidth > pageHeight ? 'landscape' : 'portrait',
    unit: 'in',
    format: [pageWidth, pageHeight],
  });
  
  // Capture card as high-res image
  const scale = 4;
  const dataUrl = await toPng(cardElement, {
    pixelRatio: scale,
    quality: 1,
    backgroundColor: hasRgbBorder ? undefined : undefined,
  });
  
  // Calculate positions
  const offsetX = includeCropMarks ? CROP_MARK_LENGTH + CROP_MARK_OFFSET : 0;
  const offsetY = includeCropMarks ? CROP_MARK_LENGTH + CROP_MARK_OFFSET : 0;
  
  // Add card image (with bleed area)
  const imageX = offsetX;
  const imageY = offsetY;
  const imageWidth = cardSize.width + (bleedAmount * 2);
  const imageHeight = cardSize.height + (bleedAmount * 2);
  
  pdf.addImage(dataUrl, 'PNG', imageX, imageY, imageWidth, imageHeight);
  
  // Draw crop marks if enabled
  if (includeCropMarks) {
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.01);
    
    const cardLeft = offsetX + bleedAmount;
    const cardRight = offsetX + bleedAmount + cardSize.width;
    const cardTop = offsetY + bleedAmount;
    const cardBottom = offsetY + bleedAmount + cardSize.height;
    
    // Top-left corner
    pdf.line(cardLeft, offsetY - CROP_MARK_OFFSET, cardLeft, offsetY - CROP_MARK_OFFSET - CROP_MARK_LENGTH);
    pdf.line(offsetX - CROP_MARK_OFFSET, cardTop, offsetX - CROP_MARK_OFFSET - CROP_MARK_LENGTH, cardTop);
    
    // Top-right corner
    pdf.line(cardRight, offsetY - CROP_MARK_OFFSET, cardRight, offsetY - CROP_MARK_OFFSET - CROP_MARK_LENGTH);
    pdf.line(pageWidth - offsetX + CROP_MARK_OFFSET, cardTop, pageWidth - offsetX + CROP_MARK_OFFSET + CROP_MARK_LENGTH, cardTop);
    
    // Bottom-left corner
    pdf.line(cardLeft, pageHeight - offsetY + CROP_MARK_OFFSET, cardLeft, pageHeight - offsetY + CROP_MARK_OFFSET + CROP_MARK_LENGTH);
    pdf.line(offsetX - CROP_MARK_OFFSET, cardBottom, offsetX - CROP_MARK_OFFSET - CROP_MARK_LENGTH, cardBottom);
    
    // Bottom-right corner
    pdf.line(cardRight, pageHeight - offsetY + CROP_MARK_OFFSET, cardRight, pageHeight - offsetY + CROP_MARK_OFFSET + CROP_MARK_LENGTH);
    pdf.line(pageWidth - offsetX + CROP_MARK_OFFSET, cardBottom, pageWidth - offsetX + CROP_MARK_OFFSET + CROP_MARK_LENGTH, cardBottom);
  }
  
  // Add registration marks
  if (includeCropMarks) {
    pdf.setFillColor(0, 0, 0);
    const markRadius = 0.03;
    const cornerOffset = 0.15;
    
    pdf.circle(cornerOffset, cornerOffset, markRadius, 'F');
    pdf.circle(pageWidth - cornerOffset, cornerOffset, markRadius, 'F');
    pdf.circle(cornerOffset, pageHeight - cornerOffset, markRadius, 'F');
    pdf.circle(pageWidth - cornerOffset, pageHeight - cornerOffset, markRadius, 'F');
  }
  
  pdf.setProperties({
    title: `${fileName} - QR Card Studio`,
    subject: 'Print-ready QR feedback card',
    creator: 'QR Card Studio',
    keywords: 'QR code, feedback card, review card',
  });
  
  pdf.save(`${fileName}.pdf`);
}

export function getPDFPageSize(
  format: CardFormat,
  size: CardSize,
  includeBleed: boolean,
  includeCropMarks: boolean
): { width: string; height: string } {
  const cardSize = getSizeConfig(format, size);
  const bleedAmount = includeBleed ? BLEED : 0;
  const markSpace = includeCropMarks ? (CROP_MARK_LENGTH + CROP_MARK_OFFSET) * 2 : 0;
  
  const width = cardSize.width + (bleedAmount * 2) + markSpace;
  const height = cardSize.height + (bleedAmount * 2) + markSpace;
  
  return {
    width: `${width.toFixed(2)}"`,
    height: `${height.toFixed(2)}"`,
  };
}
