import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const sermon = await prisma.sermon.findUnique({
      where: { id },
    })

    if (!sermon) {
      return NextResponse.json(
        { error: 'Preek nie gevind nie' },
        { status: 404 }
      )
    }

    return NextResponse.json(sermon)
  } catch (error) {
    console.error('Error fetching sermon:', error)
    return NextResponse.json(
      { error: 'Kon nie preek ophaal nie' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, speaker, date, videoUrl, audioUrl, series, description } = body

    const sermon = await prisma.sermon.update({
      where: { id },
      data: {
        title,
        speaker,
        date: date ? new Date(date) : undefined,
        videoUrl,
        audioUrl,
        series,
        description,
      },
    })

    return NextResponse.json(sermon)
  } catch (error) {
    console.error('Error updating sermon:', error)
    return NextResponse.json(
      { error: 'Kon nie preek opdateer nie' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id } = await params
    
    await prisma.sermon.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sermon:', error)
    return NextResponse.json(
      { error: 'Kon nie preek verwyder nie' },
      { status: 500 }
    )
  }
}
