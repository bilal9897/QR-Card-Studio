/**
 * Batch Export Utilities
 * Generate multiple cards and export as ZIP or multi-page PDF
 */

import JSZip from 'jszip';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export interface BatchExportOptions {
    format: 'zip' | 'pdf';
    cardElements: HTMLElement[];
    fileNames: string[];
    onProgress?: (current: number, total: number) => void;
}

/**
 * Export multiple cards as a ZIP file containing individual PNG files
 */
export async function exportAsZip(
    cardElements: HTMLElement[],
    fileNames: string[],
    onProgress?: (current: number, total: number) => void
): Promise<void> {
    const zip = new JSZip();
    const scale = 3; // HD quality

    for (let i = 0; i < cardElements.length; i++) {
        const element = cardElements[i];
        const fileName = fileNames[i];

        // Update progress
        if (onProgress) {
            onProgress(i + 1, cardElements.length);
        }

        try {
            // Generate PNG
            const dataUrl = await toPng(element, {
                pixelRatio: scale,
                quality: 1,
            });

            // Convert data URL to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            // Add to ZIP
            zip.file(`${fileName}.png`, blob);
        } catch (error) {
            console.error(`Failed to generate card ${i + 1}:`, error);
            throw new Error(`Failed to generate card: ${fileName}`);
        }
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Download ZIP
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `qr-cards-batch-${Date.now()}.zip`;
    link.click();
}

/**
 * Export multiple cards as a multi-page PDF
 */
export async function exportAsMultiPagePDF(
    cardElements: HTMLElement[],
    fileNames: string[],
    onProgress?: (current: number, total: number) => void
): Promise<void> {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter', // 8.5 x 11 inches
    });

    const scale = 3; // HD quality
    const pageWidth = 8.5;
    const pageHeight = 11;
    const margin = 0.5;

    for (let i = 0; i < cardElements.length; i++) {
        const element = cardElements[i];

        // Update progress
        if (onProgress) {
            onProgress(i + 1, cardElements.length);
        }

        try {
            // Generate PNG
            const dataUrl = await toPng(element, {
                pixelRatio: scale,
                quality: 1,
            });

            // Add new page for each card (except first)
            if (i > 0) {
                pdf.addPage();
            }

            // Get element dimensions
            const rect = element.getBoundingClientRect();
            const aspectRatio = rect.width / rect.height;

            // Calculate dimensions to fit on page with margin
            let imgWidth = pageWidth - 2 * margin;
            let imgHeight = imgWidth / aspectRatio;

            // If height exceeds page, scale down
            if (imgHeight > pageHeight - 2 * margin) {
                imgHeight = pageHeight - 2 * margin;
                imgWidth = imgHeight * aspectRatio;
            }

            // Center on page
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            // Add image to PDF
            pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);

            // Add page number and file name at bottom
            pdf.setFontSize(8);
            pdf.setTextColor(150);
            pdf.text(
                `${i + 1} of ${cardElements.length} - ${fileNames[i]}`,
                pageWidth / 2,
                pageHeight - 0.25,
                { align: 'center' }
            );
        } catch (error) {
            console.error(`Failed to generate card ${i + 1}:`, error);
            throw new Error(`Failed to generate card: ${fileNames[i]}`);
        }
    }

    // Download PDF
    pdf.save(`qr-cards-batch-${Date.now()}.pdf`);
}

/**
 * Main batch export function
 */
export async function batchExport(options: BatchExportOptions): Promise<void> {
    const { format, cardElements, fileNames, onProgress } = options;

    if (cardElements.length === 0) {
        throw new Error('No cards to export');
    }

    if (cardElements.length !== fileNames.length) {
        throw new Error('Number of cards and file names must match');
    }

    if (format === 'zip') {
        await exportAsZip(cardElements, fileNames, onProgress);
    } else if (format === 'pdf') {
        await exportAsMultiPagePDF(cardElements, fileNames, onProgress);
    } else {
        throw new Error(`Unknown export format: ${format}`);
    }
}
