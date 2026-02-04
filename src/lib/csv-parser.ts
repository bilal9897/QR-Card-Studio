/**
 * CSV Parser for Batch Card Generation
 * Parses CSV files and validates data for batch card creation
 */

export interface CSVRow {
    businessName: string;
    message: string;
    ctaText: string;
    feedbackUrl: string;
    logoUrl?: string;
    qrLogoUrl?: string;
}

export interface ParseResult {
    success: boolean;
    data: CSVRow[];
    errors: string[];
    warnings: string[];
}

/**
 * Parse CSV content into structured data
 */
export function parseCSV(csvContent: string): ParseResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const data: CSVRow[] = [];

    try {
        const lines = csvContent.trim().split('\n');

        if (lines.length === 0) {
            return {
                success: false,
                data: [],
                errors: ['CSV file is empty'],
                warnings: [],
            };
        }

        // Parse header
        const headerLine = lines[0];
        const headers = parseCSVLine(headerLine);

        // Validate required headers
        const requiredHeaders = ['businessName', 'feedbackUrl'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
            return {
                success: false,
                data: [],
                errors: [`Missing required columns: ${missingHeaders.join(', ')}`],
                warnings: [],
            };
        }

        // Create header index map
        const headerMap: Record<string, number> = {};
        headers.forEach((header, index) => {
            headerMap[header.trim()] = index;
        });

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines

            const values = parseCSVLine(line);

            // Validate row has enough columns
            if (values.length < headers.length) {
                warnings.push(`Row ${i + 1}: Incomplete data, some fields may be empty`);
            }

            const row: CSVRow = {
                businessName: getValue(values, headerMap, 'businessName'),
                message: getValue(values, headerMap, 'message'),
                ctaText: getValue(values, headerMap, 'ctaText'),
                feedbackUrl: getValue(values, headerMap, 'feedbackUrl'),
                logoUrl: getValue(values, headerMap, 'logoUrl'),
                qrLogoUrl: getValue(values, headerMap, 'qrLogoUrl'),
            };

            // Validate required fields
            if (!row.businessName || row.businessName.trim().length === 0) {
                errors.push(`Row ${i + 1}: Business name is required`);
                continue;
            }

            if (!row.feedbackUrl || row.feedbackUrl.trim().length === 0) {
                errors.push(`Row ${i + 1}: Feedback URL is required`);
                continue;
            }

            // Validate URL format
            try {
                new URL(row.feedbackUrl);
            } catch {
                errors.push(`Row ${i + 1}: Invalid feedback URL format`);
                continue;
            }

            // Validate logo URLs if provided
            if (row.logoUrl) {
                try {
                    new URL(row.logoUrl);
                } catch {
                    warnings.push(`Row ${i + 1}: Invalid logo URL format, will be skipped`);
                    row.logoUrl = undefined;
                }
            }

            if (row.qrLogoUrl) {
                try {
                    new URL(row.qrLogoUrl);
                } catch {
                    warnings.push(`Row ${i + 1}: Invalid QR logo URL format, will be skipped`);
                    row.qrLogoUrl = undefined;
                }
            }

            data.push(row);
        }

        return {
            success: errors.length === 0,
            data,
            errors,
            warnings,
        };
    } catch (error) {
        return {
            success: false,
            data: [],
            errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`],
            warnings: [],
        };
    }
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Escaped quote
                currentValue += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            // End of value
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    // Add last value
    values.push(currentValue.trim());

    return values;
}

/**
 * Get value from CSV row by header name
 */
function getValue(values: string[], headerMap: Record<string, number>, headerName: string): string {
    const index = headerMap[headerName];
    if (index === undefined) return '';
    return values[index] || '';
}

/**
 * Generate sample CSV template
 */
export function generateSampleCSV(): string {
    const headers = ['businessName', 'message', 'ctaText', 'feedbackUrl', 'logoUrl', 'qrLogoUrl'];
    const sampleRows = [
        [
            'The Golden Spoon',
            'Your feedback helps us serve you better. We\'d love to hear about your experience.',
            'Scan to Review',
            'https://g.page/r/example1',
            '',
            '',
        ],
        [
            'Bella Salon',
            'Feeling fabulous? Share your experience with us!',
            'Leave a Review',
            'https://g.page/r/example2',
            '',
            '',
        ],
        [
            'Tech Hub Store',
            'Love your purchase? Let us know what you think!',
            'Rate Us',
            'https://g.page/r/example3',
            '',
            '',
        ],
    ];

    const csvLines = [
        headers.join(','),
        ...sampleRows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ];

    return csvLines.join('\n');
}

/**
 * Download sample CSV file
 */
export function downloadSampleCSV(): void {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'qr-cards-template.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
