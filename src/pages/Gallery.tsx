import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trash2, Download, Search, Calendar, Loader2, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShareButtons } from "@/components/studio/ShareButtons";

interface GeneratedContent {
  id: string;
  image_url: string;
  caption: string | null;
  mood: string | null;
  platform: string | null;
  business_description: string | null;
  created_at: string;
}

export default function Gallery() {
  const [content, setContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<GeneratedContent | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("generated_content")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("فشل في تحميل المحتوى");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from("generated_content")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // Try to delete from storage if it's a storage URL
      if (imageUrl.includes("generated-images")) {
        const path = imageUrl.split("generated-images/")[1];
        if (path) {
          await supabase.storage.from("generated-images").remove([path]);
        }
      }

      setContent(prev => prev.filter(item => item.id !== id));
      setSelectedImage(null);
      toast.success("تم حذف المحتوى");
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("فشل في حذف المحتوى");
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `content-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("تم تحميل الصورة");
    } catch (error) {
      toast.error("فشل في تحميل الصورة");
    }
  };

  const filteredContent = content.filter(item =>
    item.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.business_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mood?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span>العودة</span>
        </Link>

        <h1 className="text-xl font-bold neon-text">معرض المحتوى</h1>

        <Link to="/studio">
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
            إنشاء محتوى جديد
          </Button>
        </Link>
      </header>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في المحتوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-secondary border-border"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{content.length} عنصر</span>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ImageOff className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا يوجد محتوى</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "لم يتم العثور على نتائج" : "ابدأ بإنشاء محتوى جديد من الاستوديو"}
            </p>
            <Link to="/studio">
              <Button className="bg-gradient-purple-blue">ابدأ الإنشاء</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-secondary cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.image_url}
                    alt="Generated content"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm line-clamp-2">{item.caption}</p>
                      <p className="text-white/60 text-xs mt-1">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-secondary neon-glow-purple">
                <img
                  src={selectedImage.image_url}
                  alt="Generated content"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold neon-text">تفاصيل المحتوى</h2>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Caption */}
                <div className="flex-1 mb-4">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border h-full">
                    <h4 className="font-semibold mb-2">التعليق</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedImage.caption || "لا يوجد تعليق"}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {selectedImage.mood && (
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                      <span className="text-xs text-muted-foreground">المزاج</span>
                      <p className="font-medium">{selectedImage.mood}</p>
                    </div>
                  )}
                  {selectedImage.platform && (
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                      <span className="text-xs text-muted-foreground">المنصة</span>
                      <p className="font-medium">{selectedImage.platform}</p>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {formatDate(selectedImage.created_at)}
                </p>

                {/* Share Buttons */}
                <ShareButtons
                  imageUrl={selectedImage.image_url}
                  caption={selectedImage.caption || ""}
                />

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={() => handleDownload(selectedImage.image_url, 0)}
                    className="flex-1 h-11 bg-gradient-purple-blue hover:opacity-90"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedImage.id, selectedImage.image_url)}
                    className="h-11 px-4 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}