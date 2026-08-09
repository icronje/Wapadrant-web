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
  Camera,
  ImageIcon,
  Save,
  X,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";
import type { PhotoAlbum, Photo } from "@prisma/client";

interface AlbumWithPhotos extends PhotoAlbum {
  photos: Photo[];
}

interface FormErrors {
  title?: string;
  form?: string;
}

export function PhotoAlbumEditForm({ album }: { album: AlbumWithPhotos }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    title: album.title,
    description: album.description,
    coverUrl: album.coverUrl,
  });
  const [photos, setPhotos] = useState<Photo[]>(album.photos);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");

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
      const res = await fetch(`/api/photo-albums/${album.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/foto-albums");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error || "Kon nie album opdateer nie." });
      }
    } catch {
      setErrors({ form: "Kon nie album opdateer nie." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/photo-albums/${album.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/foto-albums");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error || "Kon nie album verwyder nie." });
      }
    } catch {
      setErrors({ form: "Kon nie album verwyder nie." });
    } finally {
      setIsDeleting(false);
    }
  };

  const addPhoto = async () => {
    if (!newPhotoUrl.trim()) return;
    try {
      const res = await fetch(`/api/photo-albums/${album.id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newPhotoUrl,
          caption: newPhotoCaption,
          sortOrder: photos.length,
        }),
      });
      if (res.ok) {
        const photo: Photo = await res.json();
        setPhotos((prev) => [...prev, photo]);
        setNewPhotoUrl("");
        setNewPhotoCaption("");
      }
    } catch {
      // ignore
    }
  };

  const removePhoto = async (photoId: string) => {
    if (!confirm("Verwyder hierdie foto?")) return;
    try {
      const res = await fetch(`/api/photo-albums/${album.id}/photos/${photoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wysig Album</h1>
          <p className="text-sm text-gray-500">{photos.length} foto{photos.length === 1 ? "" : "’s"}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              <Trash2 className="mr-2 h-4 w-4" />
              Verwyder Album
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verwyder album?</DialogTitle>
              <DialogDescription>
                Hierdie aksie kan nie ontdoen word nie. “{album.title}” en al
                sy foto’s sal permanent verwyder word.
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
            <Camera className="h-4 w-4 text-gray-400" />
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

        <div className="space-y-2">
          <Label htmlFor="description">Beskrywing</Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setField("description", e.target.value)}
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
        </div>

        {errors.form && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm font-medium text-destructive">
            {errors.form}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" asChild disabled={isLoading}>
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

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Foto’s</h2>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Input
            type="url"
            placeholder="Foto URL"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Byskrif (opsioneel)"
            value={newPhotoCaption}
            onChange={(e) => setNewPhotoCaption(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={addPhoto}>
            <Plus className="mr-2 h-4 w-4" />
            Voeg By
          </Button>
        </div>

        {photos.length === 0 ? (
          <p className="text-sm text-gray-500">Nog geen foto’s in hierdie album nie.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || `Foto ${idx + 1}`}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/40 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="icon-xs"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-white">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
