import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft, ImageIcon } from "lucide-react";
import { PhotoLightbox } from "./photo-lightbox";
import type { PhotoAlbum, Photo } from "@prisma/client";

interface AlbumDetailPageProps {
  params: Promise<{ id: string }>;
}

interface AlbumWithPhotos extends PhotoAlbum {
  photos: Photo[];
}

async function getAlbum(id: string): Promise<AlbumWithPhotos | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/photo-albums/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: AlbumDetailPageProps) {
  const { id } = await params;
  const album = await getAlbum(id);
  return {
    title: album
      ? `${album.title} | Foto Album | Wapadrant Gemeente`
      : "Foto Album | Wapadrant Gemeente",
    description: album?.description || "Wapadrant Gemeente foto album.",
  };
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const { id } = await params;
  const album = await getAlbum(id);

  if (!album) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-12 sm:py-20">
        <Container>
          <Button variant="ghost" className="mb-4 -ml-2">
            <Link href="/foto-albums" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Terug na Albums
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {album.title}
            </h1>
            {album.description ? (
              <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
                {album.description}
              </p>
            ) : null}
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              {album.photos.length} foto{album.photos.length === 1 ? "" : "’s"}
            </div>
          </div>

          {album.photos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
              <ImageIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
              <p className="font-heading text-lg font-semibold text-foreground">
                Hierdie album het nog geen foto’s nie.
              </p>
            </div>
          ) : (
            <PhotoLightbox photos={album.photos} />
          )}
        </Container>
      </section>
    </div>
  );
}
