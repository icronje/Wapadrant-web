import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnnouncementEditForm } from "./announcement-edit-form";
import type { Announcement } from "@prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditAnnouncementPage({ params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({ where: { id } });

  if (!announcement) {
    notFound();
  }

  const serialized: Announcement = {
    ...announcement,
    publishedAt: announcement.publishedAt,
    expiresAt: announcement.expiresAt,
  };

  return <AnnouncementEditForm announcement={serialized} />;
}
