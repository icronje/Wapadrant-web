export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Ongeoorloofd - admin regte vereis" },
        { status: 403 }
      );
    }

    const { id: albumId, photoId } = await params;

    await prisma.photo.deleteMany({
      where: { id: photoId, albumId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Kon nie foto verwyder nie" },
      { status: 500 }
    );
  }
}
