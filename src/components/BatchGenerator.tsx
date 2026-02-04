import { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X, FileDown } from 'lucide-react';
import { type CSVRow, parseCSV, downloadSampleCSV } from '@/lib/csv-parser';
import { batchExport } from '@/lib/batch-export';

interface BatchGeneratorProps {
    onClose: () => void;
}

export default function BatchGenerator({ onClose }: BatchGeneratorProps) {
    const [csvData, setCSVData] = useState<CSVRow[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const result = parseCSV(content);

            setCSVData(result.data);
            setErrors(result.errors);
            setWarnings(result.warnings);
        };
        reader.readAsText(file);
    };

    const handleExport = async (format: 'zip' | 'pdf') => {
        if (csvData.length === 0) return;

        setIsProcessing(true);
        setExportProgress({ current: 0, total: csvData.length });

        try {
            // This is a simplified version - in production, you'd need to:
            // 1. Generate QR codes for each row
            // 2. Create card elements for each row
            // 3. Render them off-screen
            // 4. Export using batch-export utilities

            // For now, show a message that this requires integration with the main app
            alert('Batch export requires integration with the card generation system. This will be completed in the next phase.');

            setExportProgress(null);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-card border border-border rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-serif font-medium">Batch Card Generator</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create multiple cards at once from a CSV file
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">1. Upload CSV File</h3>
                            <button
                                onClick={downloadSampleCSV}
                                className="flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition-colors"
                            >
                                <FileDown className="w-4 h-4" />
                                Download Template
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center gap-3 mx-auto"
                            >
                                <Upload className="w-12 h-12 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Click to upload CSV</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        or drag and drop your file here
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* CSV Format Info */}
                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                            <p className="text-xs font-medium mb-2">Required CSV Columns:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• <code className="text-accent">businessName</code> - Name of the business (required)</li>
                                <li>• <code className="text-accent">feedbackUrl</code> - Google Review or feedback URL (required)</li>
                                <li>• <code className="text-accent">message</code> - Card message (optional)</li>
                                <li>• <code className="text-accent">ctaText</code> - Call to action text (optional)</li>
                                <li>• <code className="text-accent">logoUrl</code> - Logo image URL (optional)</li>
                                <li>• <code className="text-accent">qrLogoUrl</code> - QR code logo URL (optional)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-destructive mb-2">Errors Found:</p>
                                    <ul className="text-xs text-destructive/80 space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index}>• {error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Warnings */}
                    {warnings.length > 0 && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-600 mb-2">Warnings:</p>
                                    <ul className="text-xs text-yellow-600/80 space-y-1">
                                        {warnings.map((warning, index) => (
                                            <li key={index}>• {warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview Table */}
                    {csvData.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">2. Preview Cards ({csvData.length})</h3>
                                <div className="flex items-center gap-2 text-xs text-success">
                                    <CheckCircle className="w-4 h-4" />
                                    Ready to export
                                </div>
                            </div>

                            <div className="border border-border rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-secondary/50 border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">#</th>
                                                <th className="px-4 py-3 text-left font-medium">Business Name</th>
                                                <th className="px-4 py-3 text-left font-medium">Message</th>
                                                <th className="px-4 py-3 text-left font-medium">CTA</th>
                                                <th className="px-4 py-3 text-left font-medium">URL</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {csvData.map((row, index) => (
                                                <tr key={index} className="hover:bg-secondary/30 transition-colors">
                                                    <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                                                    <td className="px-4 py-3 font-medium">{row.businessName}</td>
                                                    <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">
                                                        {row.message || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-accent">{row.ctaText || '-'}</td>
                                                    <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-xs">
                                                        {row.feedbackUrl}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Export Section */}
                    {csvData.length > 0 && errors.length === 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">3. Export Cards</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleExport('zip')}
                                    disabled={isProcessing}
                                    className="btn-secondary flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export as ZIP
                                </button>
                                <button
                                    onClick={() => handleExport('pdf')}
                                    disabled={isProcessing}
                                    className="btn-secondary flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Export as PDF
                                </button>
                            </div>

                            {exportProgress && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Generating card {exportProgress.current} of {exportProgress.total}
                                        </span>
                                        <span className="text-accent">
                                            {Math.round((exportProgress.current / exportProgress.total) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent transition-all duration-300"
                                            style={{
                                                width: `${(exportProgress.current / exportProgress.total) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
