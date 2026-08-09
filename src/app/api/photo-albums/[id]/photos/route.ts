export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const photos = await prisma.photo.findMany({
      where: { albumId: id },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Kon nie foto\'s ophaal nie' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id: albumId } = await params
    const body = await request.json()
    const { url, caption, sortOrder } = body

    // Verify album exists
    const album = await prisma.photoAlbum.findUnique({
      where: { id: albumId },
    })

    if (!album) {
      return NextResponse.json(
        { error: 'Foto album nie gevind nie' },
        { status: 404 }
      )
    }

    const photo = await prisma.photo.create({
      data: {
        albumId,
        url,
        caption: caption || null,
        sortOrder: sortOrder || 0,
      },
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json(
      { error: 'Kon nie foto oplaai nie' },
      { status: 500 }
    )
  }
}
