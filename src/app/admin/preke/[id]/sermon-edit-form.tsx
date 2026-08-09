"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mic,
  User,
  Calendar,
  BookOpen,
  PlayCircle,
  Headphones,
  Save,
  X,
  Trash2,
} from "lucide-react";
import { formatAfrikaansDateShort } from "@/lib/date-format";
import type { Sermon } from "@prisma/client";

interface FormErrors {
  title?: string;
  speaker?: string;
  date?: string;
  form?: string;
}

function formatDateForInput(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

interface SermonEditFormProps {
  sermon: Sermon;
}

export function SermonEditForm({ sermon }: SermonEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: sermon.title,
    speaker: sermon.speaker,
    date: formatDateForInput(sermon.date),
    series: sermon.series,
    videoUrl: sermon.videoUrl,
    audioUrl: sermon.audioUrl,
    description: sermon.description,
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
      const res = await fetch(`/api/sermons/${sermon.id}`, {
        method: "PUT",
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
        setErrors({ form: data.error || "Kon nie preek opdateer nie." });
      }
    } catch {
      setErrors({ form: "Kon nie preek opdateer nie." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/sermons/${sermon.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/preke");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error || "Kon nie preek verwyder nie." });
      }
    } catch {
      setErrors({ form: "Kon nie preek verwyder nie." });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wysig Preek</h1>
          <p className="text-sm text-gray-500">
            Laas opgedateer: {formatAfrikaansDateShort(sermon.updatedAt)}
          </p>
        </div>
        <Dialog>
          <DialogTrigger >
            <Button variant="destructive" disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              Verwyder Preek
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verwyder preek?</DialogTitle>
              <DialogDescription>
                Hierdie aksie kan nie ontdoen word nie. “{sermon.title}” sal
                permanent verwyder word.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Verwyder…" : "Ja, Verwyder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          />
        </div>

        {errors.form && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" disabled={isLoading}>
            <Link href="/admin/preke">
              <X className="mr-2 h-4 w-4" />
              Kanselleer
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Stoor…" : "Stoor Wysigings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
