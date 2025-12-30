import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cleanInput } from "@/lib/validation";
import type { CardFormat, CardSize } from "@/lib/card-sizes";
import type { CardColors } from "@/lib/card-colors";

interface CopyLinkButtonProps {
  format: CardFormat;
  size: CardSize;
  businessName: string;
  message: string;
  ctaText: string;
  feedbackUrl: string;
  logoUrl: string | null;
  cardColors: CardColors;
}

export function CopyLinkButton({
  format,
  size,
  businessName,
  message,
  ctaText,
  feedbackUrl,
  logoUrl,
  cardColors,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    const params = new URLSearchParams({
      format,
      size,
      businessName: cleanInput(businessName),
      message: cleanInput(message),
      ctaText: cleanInput(ctaText),
      feedbackUrl: feedbackUrl.trim(),
      bg: cardColors.background,
      text: cardColors.text,
      accent: cardColors.accent,
      qr: cardColors.qrColor,
    });
    
    if (cardColors.gradient) params.set('gradient', cardColors.gradient);
    if (cardColors.borderGradient) params.set('borderGradient', cardColors.borderGradient);
    if (logoUrl) params.set('logoUrl', logoUrl);
    
    const shareUrl = `${window.location.origin}/?${params.toString()}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Card configuration URL copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Please try again or manually copy the URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      className="flex-1"
      onClick={handleCopyLink}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Link
        </>
      )}
    </Button>
  );
}
