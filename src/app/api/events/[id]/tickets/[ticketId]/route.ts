export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ticketId: string }> }
) {
  try {
    const session = await auth()
    
    // Require admin or editor to view ticket details
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id, ticketId } = await params

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: true,
        ticketType: true,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Kaartjie nie gevind nie' },
        { status: 404 }
      )
    }

    if (ticket.eventId !== id) {
      return NextResponse.json(
        { error: 'Kaartjie behoort nie tot hierdie geleentheid nie' },
        { status: 404 }
      )
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Kon nie kaartjie ophaal nie' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ticketId: string }> }
) {
  try {
    const session = await auth()
    
    // Only admin can update ticket status
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id, ticketId } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['confirmed', 'cancelled', 'refunded']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Ongeldige status. Geldige waardes: confirmed, cancelled, refunded' },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        ticketType: true,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Kaartjie nie gevind nie' },
        { status: 404 }
      )
    }

    if (ticket.eventId !== id) {
      return NextResponse.json(
        { error: 'Kaartjie behoort nie tot hierdie geleentheid nie' },
        { status: 404 }
      )
    }

    // Update ticket status and adjust sold count if cancelling/refunding
    const updatedTicket = await prisma.$transaction(async (tx) => {
      const oldStatus = ticket.status
      
      // If changing to cancelled or refunded from confirmed, decrement sold count
      if ((status === 'cancelled' || status === 'refunded') && oldStatus === 'confirmed') {
        await tx.ticketType.update({
          where: { id: ticket.ticketTypeId },
          data: {
            sold: { decrement: ticket.quantity },
          },
        })
      }
      
      // If changing from cancelled/refunded back to confirmed, increment sold count
      if (status === 'confirmed' && (oldStatus === 'cancelled' || oldStatus === 'refunded')) {
        const ticketType = await tx.ticketType.findUnique({
          where: { id: ticket.ticketTypeId },
        })
        
        if (ticketType && ticketType.sold + ticket.quantity > ticketType.quantity) {
          throw new Error('Nie genoeg beskikbare kaartjies nie')
        }
        
        await tx.ticketType.update({
          where: { id: ticket.ticketTypeId },
          data: {
            sold: { increment: ticket.quantity },
          },
        })
      }

      return tx.ticket.update({
        where: { id: ticketId },
        data: { status },
        include: {
          event: true,
          ticketType: true,
        },
      })
    })

    return NextResponse.json(updatedTicket)
  } catch (error: any) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: error.message || 'Kon nie kaartjie opdateer nie' },
      { status: 500 }
    )
  }
}
