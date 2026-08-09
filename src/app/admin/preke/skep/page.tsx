"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  User,
  Calendar,
  BookOpen,
  PlayCircle,
  Headphones,
  Save,
  X,
} from "lucide-react";

interface FormErrors {
  title?: string;
  speaker?: string;
  date?: string;
  form?: string;
}

export default function CreateSermonPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    date: "",
    series: "",
    videoUrl: "",
    audioUrl: "",
    description: "",
  });

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.title.trim()) next.title = "Titel is vereis.";
    if (!formData.speaker.trim()) next.speaker = "Spreker is vereis.";
    if (!formData.date) next.date = "Datum is vereis.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (res.ok) {
        router.push("/admin/preke");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error || "Kon nie preek byvoeg nie." });
      }
    } catch {
      setErrors({ form: "Kon nie preek byvoeg nie." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Voeg Preek By</h1>
        <p className="text-sm text-gray-500">Vul die besonderhede in om ‘n nuwe preek by te voeg.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-gray-400" />
            Titel *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setField("title", e.target.value)}
            className={errors.title ? "border-destructive" : ""}
            placeholder="bv. Die Gawe van Genade"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="speaker" className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              Spreker *
            </Label>
            <Input
              id="speaker"
              value={formData.speaker}
              onChange={(e) => setField("speaker", e.target.value)}
              className={errors.speaker ? "border-destructive" : ""}
              placeholder="bv. Ds. Johan van Wyk"
            />
            {errors.speaker && (
              <p className="text-sm text-destructive">{errors.speaker}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              Datum *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setField("date", e.target.value)}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="series" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-400" />
            Reeks
          </Label>
          <Input
            id="series"
            value={formData.series}
            onChange={(e) => setField("series", e.target.value)}
            placeholder="bv. Sondaag Oggend Reeks 2026"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoUrl" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4 text-gray-400" />
            Video URL
          </Label>
          <Input
            id="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setField("videoUrl", e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioUrl" className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-gray-400" />
            Klank URL
          </Label>
          <Input
            id="audioUrl"
            type="url"
            value={formData.audioUrl}
            onChange={(e) => setField("audioUrl", e.target.value)}
            placeholder="https://example.com/audio.mp3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Beskrywing</Label>
          <Textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Opsionele notas oor die preek..."
          />
        </div>

        {errors.form && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
            <Link href="/admin/preke">
              <X className="mr-2 h-4 w-4" />
              Kanselleer
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Stoor…" : "Stoor Preek"}
          </Button>
        </div>
      </form>
    </div>
  );
}
