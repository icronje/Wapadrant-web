export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET() {
  try {
    const sermons = await prisma.sermon.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(sermons)
  } catch (error) {
    console.error('Error fetching sermons:', error)
    return NextResponse.json(
      { error: 'Kon nie preke ophaal nie' },
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
    const { title, speaker, date, videoUrl, audioUrl, series, description } = body

    if (!title || !speaker || !date) {
      return NextResponse.json(
        { error: 'Titel, spreker en datum is vereis' },
        { status: 400 }
      )
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        speaker,
        date: new Date(date),
        videoUrl: videoUrl || '',
        audioUrl: audioUrl || '',
        series: series || '',
        description: description || '',
      },
    })

    return NextResponse.json(sermon, { status: 201 })
  } catch (error) {
    console.error('Error creating sermon:', error)
    return NextResponse.json(
      { error: 'Kon nie preek skep nie' },
      { status: 500 }
    )
  }
}
