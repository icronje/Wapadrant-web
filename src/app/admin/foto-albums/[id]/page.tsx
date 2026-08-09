import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PhotoAlbumEditForm } from "./photo-album-edit-form";
import type { PhotoAlbum, Photo } from "@prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

interface AlbumWithPhotos extends PhotoAlbum {
  photos: Photo[];
}

export default async function AdminEditPhotoAlbumPage({ params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const album = await prisma.photoAlbum.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });

  if (!album) {
    notFound();
  }

  const serialized: AlbumWithPhotos = {
    ...album,
    photos: album.photos,
  };

  return <PhotoAlbumEditForm album={serialized} />;
}
