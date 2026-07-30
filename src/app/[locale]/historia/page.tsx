import { setRequestLocale } from 'next-intl/server'
import { getPayloadClient, getHeroPhotoMix } from '@/lib/payload'
import SiteHeader from '../_components/SiteHeader'
import HeroPhotoGrid from '../_components/HeroPhotoGrid'

export const dynamic = 'force-dynamic'

export default async function HistoriaPage({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const [historia, heroPhotos] = await Promise.all([
    payload.findGlobal({ slug: 'historia', locale }),
    getHeroPhotoMix('craft', 0, 60),
  ])

  return (
    <>
      <SiteHeader />
      <section className="hero">
        <HeroPhotoGrid images={heroPhotos} />
        <div className="hero-inner">
          <span className="hero-tag">{historia.heroTitle}</span>
          <h1>{historia.heroTitle}</h1>
          {historia.heroIntro && <p className="hero-sub">{historia.heroIntro}</p>}
        </div>
      </section>

      <section className="historia">
        <div className="container timeline-list">
          {(historia.timeline ?? []).map((entry, i) => (
            <div key={entry.id ?? i} className="timeline-entry">
              <div className="timeline-date">{entry.date}</div>
              <div className="timeline-body">
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
              </div>
            </div>
          ))}

          {historia.closingQuote && (
            <blockquote className="timeline-quote">{historia.closingQuote}</blockquote>
          )}
        </div>
      </section>
    </>
  )
}
