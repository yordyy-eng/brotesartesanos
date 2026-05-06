import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getArtisansSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Validar con Zod
  const result = getArtisansSchema.safeParse({
    category: searchParams.get('category') || undefined,
    q: searchParams.get('q') || undefined
  })

  if (!result.success) {
    return NextResponse.json({ error: 'Parámetros inválidos', details: result.error.format() }, { status: 400 })
  }

  const { category, q } = result.data

  const artisans = await db.artisan.findMany({
    where: {
      ...(category && category !== 'todos' ? { categoryId: category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { craft: { contains: q, mode: 'insensitive' } },
              { location: { contains: q, mode: 'insensitive' } },
              { bio: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(artisans)
}
