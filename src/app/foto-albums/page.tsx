import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Camera } from "lucide-react";
import type { PhotoAlbum, Photo } from "@prisma/client";

export const metadata = {
  title: "Foto Albums | Wapadrant Gemeente",
  description:
    "Blaai deur foto’s van geleenthede, dienste en gemeenskap by Wapadrant Gemeente.",
};

interface AlbumWithPhotos extends PhotoAlbum {
  photos: Photo[];
}

async function getAlbums(): Promise<AlbumWithPhotos[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/photo-albums`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function FotoAlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-church-pattern py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Foto Albums
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Foto’s wat herinneringe van ons familie vasvang.
            </p>
          </div>
        </Container>
      </section>

      <section className="flex-1 py-12 sm:py-20">
        <Container>
          {albums.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
              <Camera className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
              <p className="font-heading text-lg font-semibold text-foreground">
                Tans geen albums om te vertoon nie.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Kom binnekort terug – daar is altyd iets om te vier in ons
                familie.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

function AlbumCard({ album }: { album: AlbumWithPhotos }) {
  const firstPhoto = album.photos[0]?.url || album.coverUrl;
  return (
    <Link href={`/foto-albums/${album.id}`} className="group block">
      <Card className="overflow-hidden border-border/60 bg-card transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-muted to-muted/60">
          {firstPhoto ? (
            <img
              src={firstPhoto}
              alt={album.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            {album.photos.length} foto{album.photos.length === 1 ? "" : "’s"}
          </div>
        </div>
        <CardHeader className="p-4">
          <CardTitle className="font-heading text-base">{album.title}</CardTitle>
          {album.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {album.description}
            </p>
          ) : null}
        </CardHeader>
      </Card>
    </Link>
  );
}
