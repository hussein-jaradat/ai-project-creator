import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Palette } from "lucide-react";

interface ColorItem {
  name: string;
  hex: string;
}

interface BrandKitFormData {
  name: string;
  tone_of_voice: string;
  typography: { heading: string; body: string };
  color_palette: ColorItem[];
  keywords: string[];
  words_to_avoid: string[];
  additional_guidelines: string;
}

interface BrandKitFormProps {
  initialData?: Partial<BrandKitFormData>;
  onSubmit: (data: BrandKitFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BrandKitForm({ initialData, onSubmit, onCancel, isLoading }: BrandKitFormProps) {
  const [formData, setFormData] = useState<BrandKitFormData>({
    name: initialData?.name || "",
    tone_of_voice: initialData?.tone_of_voice || "",
    typography: initialData?.typography || { heading: "", body: "" },
    color_palette: initialData?.color_palette || [],
    keywords: initialData?.keywords || [],
    words_to_avoid: initialData?.words_to_avoid || [],
    additional_guidelines: initialData?.additional_guidelines || "",
  });

  const [newKeyword, setNewKeyword] = useState("");
  const [newAvoidWord, setNewAvoidWord] = useState("");
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const removeKeyword = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== idx)
    }));
  };

  const addAvoidWord = () => {
    if (newAvoidWord.trim()) {
      setFormData(prev => ({
        ...prev,
        words_to_avoid: [...prev.words_to_avoid, newAvoidWord.trim()]
      }));
      setNewAvoidWord("");
    }
  };

  const removeAvoidWord = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      words_to_avoid: prev.words_to_avoid.filter((_, i) => i !== idx)
    }));
  };

  const addColor = () => {
    if (newColor.name.trim()) {
      setFormData(prev => ({
        ...prev,
        color_palette: [...prev.color_palette, { ...newColor }]
      }));
      setNewColor({ name: "", hex: "#000000" });
    }
  };

  const removeColor = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      color_palette: prev.color_palette.filter((_, i) => i !== idx)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Kit Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Primary Brand, Summer Campaign"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone of Voice</Label>
            <Input
              id="tone"
              value={formData.tone_of_voice}
              onChange={(e) => setFormData(prev => ({ ...prev, tone_of_voice: e.target.value }))}
              placeholder="e.g., Professional yet approachable, Bold and energetic"
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {formData.color_palette.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-muted rounded-lg p-2">
                <div
                  className="w-8 h-8 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm">{color.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeColor(idx)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="color"
              value={newColor.hex}
              onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
              className="w-14 h-10 p-1 cursor-pointer"
            />
            <Input
              value={newColor.name}
              onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Color name"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={addColor}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Typography</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="headingFont">Heading Font</Label>
            <Input
              id="headingFont"
              value={formData.typography.heading}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                typography: { ...prev.typography, heading: e.target.value }
              }))}
              placeholder="e.g., Montserrat, Playfair Display"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyFont">Body Font</Label>
            <Input
              id="bodyFont"
              value={formData.typography.body}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                typography: { ...prev.typography, body: e.target.value }
              }))}
              placeholder="e.g., Inter, Open Sans"
            />
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brand Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword, idx) => (
              <Badge key={idx} variant="secondary" className="gap-1">
                {keyword}
                <button type="button" onClick={() => removeKeyword(idx)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add a keyword"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
            />
            <Button type="button" variant="outline" onClick={addKeyword}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Words to Avoid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Words to Avoid</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.words_to_avoid.map((word, idx) => (
              <Badge key={idx} variant="destructive" className="gap-1">
                {word}
                <button type="button" onClick={() => removeAvoidWord(idx)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newAvoidWord}
              onChange={(e) => setNewAvoidWord(e.target.value)}
              placeholder="Add word to avoid"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAvoidWord())}
            />
            <Button type="button" variant="outline" onClick={addAvoidWord}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.additional_guidelines}
            onChange={(e) => setFormData(prev => ({ ...prev, additional_guidelines: e.target.value }))}
            placeholder="Any other brand guidelines, dos and don'ts, or special instructions..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !formData.name.trim()}>
          {isLoading ? "Saving..." : initialData?.name ? "Update Brand Kit" : "Create Brand Kit"}
        </Button>
      </div>
    </form>
  );
}
