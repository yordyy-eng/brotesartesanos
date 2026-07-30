import { setRequestLocale } from 'next-intl/server'
import { getPayloadClient, getHeroPhotoMix } from '@/lib/payload'
import { richTextToPlainText } from '@/lib/richtext'
import type { Media } from '@/payload-types'
import CatalogClient, { type Artisan, type Category } from './catalog-client'
import SiteHeader from '../_components/SiteHeader'

export default async function BrotesDeChilePage({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()

  const [artisansResult, categoriesResult, homeHero, heroPhotos] = await Promise.all([
    payload.find({ collection: 'artisans', locale, depth: 1, limit: 200, sort: 'name' }),
    payload.find({ collection: 'categories', locale, depth: 0, limit: 50 }),
    payload.findGlobal({ slug: 'home-hero', locale }),
    getHeroPhotoMix('-name', 160, 150),
  ])

  const artisans: Artisan[] = artisansResult.docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    initials: doc.initials ?? null,
    image: doc.image && typeof doc.image === 'object' ? (doc.image as Media).url ?? null : null,
    craft: doc.craft ?? null,
    bioText: richTextToPlainText(doc.bio),
    location: doc.location ?? null,
    instagram: doc.instagram ?? null,
    categoryId: typeof doc.category === 'object' ? doc.category.id : doc.category,
    categoryName:
      typeof doc.category === 'object' ? doc.category.name : (doc.category as unknown as string),
  }))

  const categories: Category[] = categoriesResult.docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    count: artisans.filter((a) => a.categoryId === doc.id).length,
  }))

  return (
    <>
      <SiteHeader />
      <CatalogClient
        initialArtisans={artisans}
        initialCategories={categories}
        hero={homeHero}
        heroPhotos={heroPhotos}
      />
    </>
  )
}
