export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET() {
  try {
    const albums = await prisma.photoAlbum.findMany({
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return NextResponse.json(albums)
  } catch (error) {
    console.error('Error fetching photo albums:', error)
    return NextResponse.json(
      { error: 'Kon nie foto albums ophaal nie' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, coverUrl } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Titel is vereis' },
        { status: 400 }
      )
    }

    const album = await prisma.photoAlbum.create({
      data: {
        title,
        description: description || '',
        coverUrl: coverUrl || '',
      },
    })

    return NextResponse.json(album, { status: 201 })
  } catch (error) {
    console.error('Error creating photo album:', error)
    return NextResponse.json(
      { error: 'Kon nie foto album skep nie' },
      { status: 500 }
    )
  }
}
