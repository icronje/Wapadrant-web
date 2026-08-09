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

    const album = await prisma.photoAlbum.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (!album) {
      return NextResponse.json(
        { error: 'Foto album nie gevind nie' },
        { status: 404 }
      )
    }

    return NextResponse.json(album)
  } catch (error) {
    console.error('Error fetching photo album:', error)
    return NextResponse.json(
      { error: 'Kon nie foto album ophaal nie' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const { id } = await params
    const body = await request.json()
    const { title, description, coverUrl } = body

    const album = await prisma.photoAlbum.update({
      where: { id },
      data: {
        title,
        description,
        coverUrl,
      },
    })

    return NextResponse.json(album)
  } catch (error) {
    console.error('Error updating photo album:', error)
    return NextResponse.json(
      { error: 'Kon nie foto album opdateer nie' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { id } = await params
    
    await prisma.photoAlbum.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting photo album:', error)
    return NextResponse.json(
      { error: 'Kon nie foto album verwyder nie' },
      { status: 500 }
    )
  }
}
