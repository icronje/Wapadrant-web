"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, ImageIcon, Plus, Pencil, Trash2 } from "lucide-react";
import type { PhotoAlbum, Photo } from "@prisma/client";

interface AlbumWithPhotos extends PhotoAlbum {
  photos: Photo[];
}

export default function AdminPhotoAlbumsPage() {
  const [albums, setAlbums] = useState<AlbumWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/photo-albums");
        if (res.ok) {
          const data = await res.json();
          setAlbums(Array.isArray(data) ? data : []);
        }
      } catch {
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Is jy seker jy wil hierdie album verwyder?")) return;
    try {
      const res = await fetch(`/api/photo-albums/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlbums((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Foto Albums</h1>
          <p className="text-sm text-gray-500">Bestuur foto albums.</p>
        </div>
        <Link href="/admin/foto-albums/skep"><Button >
            <Plus className="mr-2 h-4 w-4" />
            Skep Album
          </Button></Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Laai albums…</p>
      ) : albums.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <Camera className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-900">Geen foto albums nie.</p>
          <p className="mt-2 text-sm text-gray-500">Skep die eerste album om te begin.</p>
          <Link href="/admin/foto-albums/skep"><Button className="mt-4">Skep Album</Button></Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => {
            const cover = album.coverUrl || album.photos[0]?.url;
            return (
              <div
                key={album.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {cover ? (
                    <img
                      src={cover}
                      alt={album.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                    {album.photos.length} foto
                    {album.photos.length === 1 ? "" : "’s"}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{album.title}</h3>
                  {album.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {album.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Link href={`/admin/foto-albums/${album.id}`}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Wysig
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(album.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
