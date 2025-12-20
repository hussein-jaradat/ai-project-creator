import { GripVertical, X, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { ReferenceImage, CATEGORY_CONFIG } from "@/types/reference";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface ReferenceImageCardProps {
  image: ReferenceImage;
  onToggleEnabled: (id: string) => void;
  onRemove: (id: string) => void;
  onPreview: (image: ReferenceImage) => void;
  dragHandleProps?: any;
}

export function ReferenceImageCard({
  image,
  onToggleEnabled,
  onRemove,
  onPreview,
  dragHandleProps,
}: ReferenceImageCardProps) {
  const categoryConfig = CATEGORY_CONFIG[image.category];

  return (
    <motion.div
      layout
      className={`
        group relative flex items-center gap-2 p-2 rounded-lg border transition-all
        ${image.enabled 
          ? 'bg-secondary/50 border-border' 
          : 'bg-secondary/20 border-border/50 opacity-60'
        }
      `}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-secondary rounded"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Thumbnail */}
      <div 
        className="relative w-14 h-14 rounded-md overflow-hidden bg-secondary flex-shrink-0 cursor-pointer group/thumb"
        onClick={() => onPreview(image)}
      >
        <img
          src={image.url}
          alt="Reference"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-4 h-4" />
        </div>
        
        {/* Priority badge */}
        <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-background/80 text-[10px] flex items-center justify-center font-medium">
          {image.priority + 1}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryConfig.color}`}>
          <span className="ml-0.5">{categoryConfig.icon}</span>
          {categoryConfig.label}
        </Badge>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Switch
                  checked={image.enabled}
                  onCheckedChange={() => onToggleEnabled(image.id)}
                  className="scale-75"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{image.enabled ? 'معطل للتوليد' : 'تفعيل للتوليد'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <button
          onClick={() => onRemove(image.id)}
          className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
