import { useState } from "react";
import { Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EmailShareProps {
  businessName: string;
  onDownloadFirst: () => Promise<void>;
  isDownloading: boolean;
}

export function EmailShare({ businessName, onDownloadFirst, isDownloading }: EmailShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const cardName = businessName || "Review Card";
  const emailSubject = encodeURIComponent(`${cardName} - QR Review Card Design`);
  const emailBody = encodeURIComponent(
    `Hi,\n\nI've created a QR review card design for "${cardName}" using QR Card Studio.\n\nPlease find the card design attached to this email.\n\nBest regards`
  );

  const handleWebShare = async () => {
    setIsSharing(true);
    
    try {
      // First download the image
      await onDownloadFirst();
      
      // Check if Web Share API is available
      if (navigator.share) {
        toast({
          title: "Image Downloaded",
          description: "Now use your device's share menu to send via email.",
        });
      } else {
        // Open mailto link for desktop
        window.location.href = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;
        toast({
          title: "Email Client Opened",
          description: "Don't forget to attach the downloaded card image!",
        });
      }
      
      setIsOpen(false);
    } catch {
      toast({
        title: "Share Failed",
        description: "Please try downloading the card and sharing manually.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleQuickShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardName} - QR Review Card`,
          text: `Check out this QR review card design for ${cardName}!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share - ignore
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            if (navigator.share) {
              e.preventDefault();
              handleQuickShare();
            }
          }}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share via Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Card via Email</DialogTitle>
          <DialogDescription>
            Download your card and share it via email. The image will be downloaded first, then your email client will open.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email (optional)</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="recipient@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={handleWebShare}
            disabled={isSharing || isDownloading}
            className="w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            {isSharing || isDownloading ? "Preparing..." : "Download & Open Email"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Your card will be downloaded as an image. Attach it to the email that opens.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
