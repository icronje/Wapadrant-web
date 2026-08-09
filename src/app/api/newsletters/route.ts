import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const newsletters = await prisma.newsletter.findMany({})

    return NextResponse.json(newsletters)
  } catch (error) {
    console.error('Error fetching newsletters:', error)
    return NextResponse.json(
      { error: 'Kon nie nuusbriewe ophaal nie' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, fileUrl } = body

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: 'Titel en leêr URL is vereis' },
        { status: 400 }
      )
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        fileUrl,
      },
    })

    return NextResponse.json(newsletter, { status: 201 })
  } catch (error) {
    console.error('Error creating newsletter:', error)
    return NextResponse.json(
      { error: 'Kon nie nuusbrief skep nie' },
      { status: 500 }
    )
  }
}
