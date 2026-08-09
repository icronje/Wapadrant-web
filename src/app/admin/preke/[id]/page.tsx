import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SermonEditForm } from "./sermon-edit-form";
import type { Sermon } from "@prisma/client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditSermonPage({ params }: Props) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const sermon = await prisma.sermon.findUnique({ where: { id } });

  if (!sermon) {
    notFound();
  }

  const serialized: Sermon = {
    ...sermon,
    date: sermon.date,
    createdAt: sermon.createdAt,
    updatedAt: sermon.updatedAt,
  };

  return <SermonEditForm sermon={serialized} />;
}
