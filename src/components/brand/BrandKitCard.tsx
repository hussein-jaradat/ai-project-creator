import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";

interface BrandKit {
  id: string;
  name: string;
  color_palette: { name: string; hex: string }[];
  typography: { heading?: string; body?: string };
  tone_of_voice: string | null;
  keywords: string[] | null;
  is_default: boolean;
  logo_urls: string[];
}

interface BrandKitCardProps {
  brandKit: BrandKit;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function BrandKitCard({ brandKit, onEdit, onDelete, onSetDefault }: BrandKitCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            {brandKit.name}
            {brandKit.is_default && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Default
              </Badge>
            )}
          </CardTitle>
          {brandKit.tone_of_voice && (
            <p className="text-sm text-muted-foreground">{brandKit.tone_of_voice}</p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={() => onEdit(brandKit.id)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(brandKit.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Color Palette */}
        {brandKit.color_palette && brandKit.color_palette.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Colors</p>
            <div className="flex gap-2">
              {brandKit.color_palette.slice(0, 6).map((color, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full border border-border shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Typography */}
        {brandKit.typography && (brandKit.typography.heading || brandKit.typography.body) && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Typography</p>
            <div className="text-sm space-y-1">
              {brandKit.typography.heading && (
                <p style={{ fontFamily: brandKit.typography.heading }}>
                  Heading: {brandKit.typography.heading}
                </p>
              )}
              {brandKit.typography.body && (
                <p style={{ fontFamily: brandKit.typography.body }}>
                  Body: {brandKit.typography.body}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Keywords */}
        {brandKit.keywords && brandKit.keywords.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Keywords</p>
            <div className="flex flex-wrap gap-1">
              {brandKit.keywords.slice(0, 5).map((keyword, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!brandKit.is_default && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => onSetDefault(brandKit.id)}
          >
            <Star className="w-3 h-3 mr-2" />
            Set as Default
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
