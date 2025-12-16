import { useState } from "react";
import { Share2, Copy, Check, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
  imageUrl: string;
  caption: string;
}

export function ShareButtons({ imageUrl, caption }: ShareButtonsProps) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Copy caption only
  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedCaption(true);
      toast.success("تم نسخ التعليق");
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch (error) {
      toast.error("فشل في نسخ التعليق");
    }
  };

  // Copy caption + image URL
  const handleCopyAll = async () => {
    try {
      const text = `${caption}\n\n📸 ${imageUrl}`;
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      toast.success("تم نسخ التعليق والرابط");
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (error) {
      toast.error("فشل في النسخ");
    }
  };

  // Web Share API (native sharing)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Try to fetch and share the image as a file
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "content.png", { type: "image/png" });

        await navigator.share({
          title: "محتوى جديد",
          text: caption,
          files: [file],
        });
        toast.success("تم فتح المشاركة");
      } catch (error) {
        // Fallback: share without file
        try {
          await navigator.share({
            title: "محتوى جديد",
            text: `${caption}\n\n${imageUrl}`,
          });
        } catch (e) {
          // User cancelled or error
          console.log("Share cancelled");
        }
      }
    } else {
      // Fallback for browsers without Web Share API
      handleCopyAll();
      toast.info("تم نسخ المحتوى - يمكنك لصقه في أي تطبيق");
    }
  };

  // Open Instagram (deep link)
  const openInstagram = () => {
    // Copy caption first for easy pasting
    navigator.clipboard.writeText(caption);
    toast.info("تم نسخ التعليق - افتح انستقرام والصق التعليق");
    
    // Try to open Instagram app
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS || isAndroid) {
      window.location.href = "instagram://camera";
    } else {
      window.open("https://www.instagram.com/", "_blank");
    }
  };

  // Open Facebook
  const openFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent(caption)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // Open TikTok
  const openTikTok = () => {
    navigator.clipboard.writeText(caption);
    toast.info("تم نسخ التعليق - افتح تيك توك والصق التعليق");
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS || isAndroid) {
      window.location.href = "snssdk1233://";
    } else {
      window.open("https://www.tiktok.com/", "_blank");
    }
  };

  return (
    <div className="space-y-3">
      {/* Primary Share */}
      <Button
        onClick={handleShare}
        className="w-full h-11 bg-gradient-purple-blue hover:opacity-90"
      >
        <Share2 className="w-4 h-4 ml-2" />
        مشاركة
      </Button>

      {/* Social Media Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          onClick={openInstagram}
          className="h-10 border-border hover:border-pink-500 hover:text-pink-500"
        >
          <Instagram className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          onClick={openFacebook}
          className="h-10 border-border hover:border-blue-500 hover:text-blue-500"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          onClick={openTikTok}
          className="h-10 border-border hover:border-foreground"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </Button>
      </div>

      {/* Copy Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={handleCopyCaption}
          className="h-10 border-border"
        >
          {copiedCaption ? (
            <Check className="w-4 h-4 ml-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 ml-2" />
          )}
          نسخ التعليق
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyAll}
          className="h-10 border-border"
        >
          {copiedAll ? (
            <Check className="w-4 h-4 ml-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 ml-2" />
          )}
          نسخ الكل
        </Button>
      </div>
    </div>
  );
}