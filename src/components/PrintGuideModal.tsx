
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Scale, FileCheck, AlertTriangle, CheckCircle } from "lucide-react";

interface PrintGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function PrintGuideModal({ isOpen, onClose, onConfirm }: PrintGuideModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Printer className="w-5 h-5 text-accent" />
                        Perfect Print Guide
                    </DialogTitle>
                    <DialogDescription>
                        Follow these settings to ensure your cards print at the correct size.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                            <Scale className="w-5 h-5 text-accent mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Set Scale to 100%</p>
                                <p className="text-xs text-muted-foreground">In your printer settings, select "Actual Size" or "Scale 100%". Do not select "Fit to Page".</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                            <FileCheck className="w-5 h-5 text-accent mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Paper Recommendation</p>
                                <p className="text-xs text-muted-foreground">For best results, use heavy cardstock paper (250gsm - 300gsm) with a matte finish.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-500">Check Margins</p>
                                <p className="text-xs text-amber-500/80">Ensure "Background Graphics" is enabled if printing from browser directly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} className="gap-2 bg-success hover:bg-success/90 text-white">
                        <CheckCircle className="w-4 h-4" />
                        I Understand, Download Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
