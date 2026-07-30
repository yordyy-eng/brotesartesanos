import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getPayloadClient, getHeroPhotoMix } from '@/lib/payload'
import SiteHeader from '../_components/SiteHeader'
import HeroPhotoGrid from '../_components/HeroPhotoGrid'

export const dynamic = 'force-dynamic'

export default async function SobreNosotrosPage({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const [sobreNosotros, heroPhotos] = await Promise.all([
    payload.findGlobal({ slug: 'sobre-nosotros', locale }),
    getHeroPhotoMix('location', 40, 150),
  ])
  const t = await getTranslations('sobreNosotros')

  return (
    <>
      <SiteHeader />
      <section className="hero">
        <HeroPhotoGrid images={heroPhotos} />
        <div className="hero-inner">
          <span className="hero-tag">{sobreNosotros.heroTitle}</span>
          <h1>{sobreNosotros.heroTitle}</h1>
        </div>
      </section>

      <section className="memorias">
        <div className="container mision-vision-grid">
          {sobreNosotros.mision && (
            <div>
              <span className="section-tag">{t('mision')}</span>
              <p className="mision-vision-text">{sobreNosotros.mision}</p>
            </div>
          )}
          {sobreNosotros.vision && (
            <div>
              <span className="section-tag">{t('vision')}</span>
              <p className="mision-vision-text">{sobreNosotros.vision}</p>
            </div>
          )}
        </div>
      </section>

      <section className="gracias">
        <div className="container">
          <span className="section-tag">{t('valoresTag')}</span>
          <h2>{t('valoresTitle')}</h2>
          <div className="gracias-grid">
            {(sobreNosotros.valores ?? []).map((valor, i) => (
              <div key={valor.id ?? i} className="gracias-item">
                <h4>{valor.icon} {valor.title}</h4>
                <p>{valor.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
