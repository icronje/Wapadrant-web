export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


function formatCurrency(amount: number): string {
  return `R ${amount.toFixed(2)}`
}

function formatDateAfrikaans(date: Date): string {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}


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

    const tickets = await prisma.ticket.findMany({
      where: { eventId: id },
      include: {
        ticketType: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    // CSV headers in Afrikaans
    const headers = ['Reference', 'Naam', 'E-pos', 'Telefoon', 'Tiket Tipe', 'Hoeveelheid', 'Bedrag', 'Status', 'Datum']
    
    // Build CSV rows
    const rows = tickets.map(ticket => {
      const reference = `WPR-${id}-${ticket.id.substring(0, 6).toUpperCase()}`
      const name = ticket.buyerName.replace(/"/g, '""')
      const email = ticket.buyerEmail.replace(/"/g, '""')
      const phone = (ticket.buyerPhone || '').replace(/"/g, '""')
      const ticketType = ticket.ticketType.name.replace(/"/g, '""')
      const amount = formatCurrency(ticket.totalAmount.toNumber())
      const status = ticket.status
      const date = formatDateAfrikaans(ticket.createdAt)
      
      return [
        reference,
        `"${name}"`,
        `"${email}"`,
        `"${phone}"`,
        `"${ticketType}"`,
        String(ticket.quantity),
        amount,
        status,
        date,
      ].join(',')
    })

    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="kaartjies-${id}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting tickets:', error)
    return NextResponse.json(
      { error: 'Kon nie kaartjies eksporteer nie' },
      { status: 500 }
    )
  }
}
