export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Geen lêer ontvang nie' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Slegs JPEG, PNG, WebP of GIF lêers word toegelaat' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB for data URI inline)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Lêer is te groot (maksimum 2MB)' },
        { status: 400 }
      )
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert to base64 data URI — works through portal proxy without extra requests
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    // Also save to disk for future use when deployed directly
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .slice(0, 50)
    const timestamp = Date.now()
    const filename = `${safeName}-${timestamp}.${ext}`

    const imagesDir = join(process.cwd(), 'public', 'images')
    if (!existsSync(imagesDir)) {
      await mkdir(imagesDir, { recursive: true })
    }
    await writeFile(join(imagesDir, filename), buffer)

    return NextResponse.json({ 
      success: true, 
      imageUrl: dataUri,
      filename,
      fileSize: file.size,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Kon nie beeld oplaai nie' },
      { status: 500 }
    )
  }
}