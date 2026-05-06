import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const categories = await db.category.findMany({
    include: { _count: { select: { artisans: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categories)
}
