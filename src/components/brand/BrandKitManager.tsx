import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BrandKitCard } from "./BrandKitCard";
import { BrandKitForm } from "./BrandKitForm";
import { Plus, Palette } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BrandKit {
  id: string;
  workspace_id: string;
  name: string;
  color_palette: { name: string; hex: string }[];
  typography: { heading?: string; body?: string };
  tone_of_voice: string | null;
  keywords: string[] | null;
  words_to_avoid: string[] | null;
  additional_guidelines: string | null;
  is_default: boolean;
  logo_urls: string[];
  reference_examples: unknown[];
  created_at: string;
  updated_at: string;
}

interface BrandKitManagerProps {
  workspaceId: string;
}

export function BrandKitManager({ workspaceId }: BrandKitManagerProps) {
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<BrandKit | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBrandKits();
  }, [workspaceId]);

  const fetchBrandKits = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("brand_kits")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load brand kits");
      console.error(error);
    } else {
      setBrandKits((data || []).map(kit => ({
        ...kit,
        color_palette: (kit.color_palette as { name: string; hex: string }[]) || [],
        typography: (kit.typography as { heading?: string; body?: string }) || {},
        logo_urls: (kit.logo_urls as string[]) || [],
        reference_examples: (kit.reference_examples as unknown[]) || [],
      })));
    }
    setIsLoading(false);
  };

  const handleCreate = async (data: {
    name: string;
    tone_of_voice: string;
    typography: { heading: string; body: string };
    color_palette: { name: string; hex: string }[];
    keywords: string[];
    words_to_avoid: string[];
    additional_guidelines: string;
  }) => {
    setIsSaving(true);
    const { error } = await supabase.from("brand_kits").insert({
      workspace_id: workspaceId,
      name: data.name,
      tone_of_voice: data.tone_of_voice || null,
      typography: data.typography,
      color_palette: data.color_palette,
      keywords: data.keywords.length > 0 ? data.keywords : null,
      words_to_avoid: data.words_to_avoid.length > 0 ? data.words_to_avoid : null,
      additional_guidelines: data.additional_guidelines || null,
      is_default: brandKits.length === 0,
    });

    if (error) {
      toast.error("Failed to create brand kit");
      console.error(error);
    } else {
      toast.success("Brand kit created");
      setIsFormOpen(false);
      fetchBrandKits();
    }
    setIsSaving(false);
  };

  const handleUpdate = async (data: {
    name: string;
    tone_of_voice: string;
    typography: { heading: string; body: string };
    color_palette: { name: string; hex: string }[];
    keywords: string[];
    words_to_avoid: string[];
    additional_guidelines: string;
  }) => {
    if (!editingKit) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("brand_kits")
      .update({
        name: data.name,
        tone_of_voice: data.tone_of_voice || null,
        typography: data.typography,
        color_palette: data.color_palette,
        keywords: data.keywords.length > 0 ? data.keywords : null,
        words_to_avoid: data.words_to_avoid.length > 0 ? data.words_to_avoid : null,
        additional_guidelines: data.additional_guidelines || null,
      })
      .eq("id", editingKit.id);

    if (error) {
      toast.error("Failed to update brand kit");
      console.error(error);
    } else {
      toast.success("Brand kit updated");
      setEditingKit(null);
      fetchBrandKits();
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("brand_kits")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast.error("Failed to delete brand kit");
      console.error(error);
    } else {
      toast.success("Brand kit deleted");
      fetchBrandKits();
    }
    setDeleteId(null);
  };

  const handleSetDefault = async (id: string) => {
    // First, unset all defaults
    await supabase
      .from("brand_kits")
      .update({ is_default: false })
      .eq("workspace_id", workspaceId);

    // Then set the new default
    const { error } = await supabase
      .from("brand_kits")
      .update({ is_default: true })
      .eq("id", id);

    if (error) {
      toast.error("Failed to set default");
      console.error(error);
    } else {
      toast.success("Default brand kit updated");
      fetchBrandKits();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Brand Kits
          </h2>
          <p className="text-muted-foreground">
            Manage your brand identities for consistent content generation
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Brand Kit
        </Button>
      </div>

      {brandKits.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No brand kits yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first brand kit to ensure consistent content generation
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Brand Kit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandKits.map((kit) => (
            <BrandKitCard
              key={kit.id}
              brandKit={kit}
              onEdit={(id) => setEditingKit(brandKits.find(k => k.id === id) || null)}
              onDelete={(id) => setDeleteId(id)}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Brand Kit</DialogTitle>
          </DialogHeader>
          <BrandKitForm
            onSubmit={handleCreate}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingKit} onOpenChange={() => setEditingKit(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand Kit</DialogTitle>
          </DialogHeader>
          {editingKit && (
            <BrandKitForm
              initialData={{
                name: editingKit.name,
                tone_of_voice: editingKit.tone_of_voice || "",
                typography: {
                  heading: editingKit.typography?.heading || "",
                  body: editingKit.typography?.body || "",
                },
                color_palette: editingKit.color_palette,
                keywords: editingKit.keywords || [],
                words_to_avoid: editingKit.words_to_avoid || [],
                additional_guidelines: editingKit.additional_guidelines || "",
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingKit(null)}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand Kit?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the brand kit
              and remove it from any projects using it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
