"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ImageIcon, Save, X } from "lucide-react";

interface FormErrors {
  title?: string;
  form?: string;
}

export default function CreatePhotoAlbumPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverUrl: "",
  });

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.title.trim()) next.title = "Titel is vereis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/photo-albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/foto-albums");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error || "Kon nie album skep nie." });
      }
    } catch {
      setErrors({ form: "Kon nie album skep nie." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skep Foto Album</h1>
        <p className="text-sm text-gray-500">Skep ‘n nuwe album en voeg later foto’s by.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-400" />
            Titel *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setField("title", e.target.value)}
            className={errors.title ? "border-destructive" : ""}
            placeholder="bv. Jeugkamp 2026"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beskrywing</Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Kort beskrywing van die album..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverUrl" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-gray-400" />
            Omslag URL
          </Label>
          <Input
            id="coverUrl"
            type="url"
            value={formData.coverUrl}
            onChange={(e) => setField("coverUrl", e.target.value)}
            placeholder="https://example.com/cover.jpg"
          />
          <p className="text-xs text-gray-500">
            Laat oop om die eerste foto as omslag te gebruik.
          </p>
        </div>

        {errors.form && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" disabled={isLoading}>
            <Link href="/admin/foto-albums">
              <X className="mr-2 h-4 w-4" />
              Kanselleer
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Stoor…" : "Stoor Album"}
          </Button>
        </div>
      </form>
    </div>
  );
}
