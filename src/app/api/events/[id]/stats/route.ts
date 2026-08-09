export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET(
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

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: {
          include: {
            _count: {
              select: { tickets: true }
            }
          }
        },
        tickets: {
          include: {
            ticketType: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Geleentheid nie gevind nie' },
        { status: 404 }
      )
    }

    // Calculate statistics
    let totalTicketsSold = 0
    let totalRevenue = 0
    let totalCapacity = 0

    const ticketTypeBreakdown = event.ticketTypes.map(tt => {
      const sold = tt.sold
      const revenue = tt.price.toNumber() * sold
      const remaining = tt.quantity - sold
      
      totalTicketsSold += sold
      totalRevenue += revenue
      totalCapacity += tt.quantity

      return {
        name: tt.name,
        sold,
        quantity: tt.quantity,
        revenue,
        remaining,
      }
    })

    const remainingCapacity = totalCapacity - totalTicketsSold

    // Get last 10 ticket purchases
    const last10Purchases = event.tickets.map(ticket => ({
      id: ticket.id,
      buyerName: ticket.buyerName,
      buyerEmail: ticket.buyerEmail,
      ticketTypeName: ticket.ticketType.name,
      quantity: ticket.quantity,
      totalAmount: ticket.totalAmount.toNumber(),
      status: ticket.status,
      createdAt: ticket.createdAt,
    }))

    return NextResponse.json({
      totalTicketsSold,
      totalRevenue,
      remainingCapacity,
      ticketTypeBreakdown,
      last10Purchases,
    })
  } catch (error) {
    console.error('Error fetching event statistics:', error)
    return NextResponse.json(
      { error: 'Kon nie statistieke ophaal nie' },
      { status: 500 }
    )
  }
}
