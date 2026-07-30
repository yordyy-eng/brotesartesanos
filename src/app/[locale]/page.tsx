import { setRequestLocale } from 'next-intl/server'
import { getPayloadClient, getHeroPhotoMix, getGalleryPhotos } from '@/lib/payload'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import SiteHeader from './_components/SiteHeader'
import HeroPhotoGrid from './_components/HeroPhotoGrid'

export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const [home, heroPhotos, galleryPhotos] = await Promise.all([
    payload.findGlobal({ slug: 'agrupacion-home', locale }),
    getHeroPhotoMix('name', 120, 60),
    getGalleryPhotos(0, 20),
  ])

  const cardPhotos = galleryPhotos.slice(0, 4)
  const gallery = galleryPhotos.slice(4)

  return (
    <>
      <SiteHeader />
      <section className="hero">
        <HeroPhotoGrid images={heroPhotos} />
        <div className="hero-inner">
          <span className="hero-tag">{home.tag}</span>
          <h1>
            {home.titlePrefix} <em>{home.titleEmphasis}</em>
          </h1>
          {home.subtitle && <p className="hero-sub">{home.subtitle}</p>}

          {home.stats && home.stats.length > 0 && (
            <div className="hero-meta">
              {home.stats.map((stat, i) => (
                <div key={stat.id ?? i} className="hero-meta-item">
                  <span className="num">{stat.value}</span>
                  <span className="label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="catalogo">
        <div className="container home-cards-grid">
          {(home.cards ?? []).map((card, i) => (
            <Link key={card.id ?? i} href={card.href ?? '/'} className="home-card">
              {cardPhotos[i] && (
                <div className="home-card-image">
                  <Image src={cardPhotos[i].url} alt="" fill sizes="25vw" style={{ objectFit: 'cover' }} />
                </div>
              )}
              <div className="home-card-body">
                <h3>{card.title}</h3>
                {card.description && <p>{card.description}</p>}
                <span className="home-card-cta">
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="gracias">
          <div className="container">
            <span className="section-tag">Galería</span>
            <h2>La vida de la agrupación</h2>
            <div className="photo-gallery-grid">
              {gallery.map((photo, i) => (
                <div key={photo.url + i} className="photo-gallery-tile">
                  <Image src={photo.url} alt="" fill sizes="25vw" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
