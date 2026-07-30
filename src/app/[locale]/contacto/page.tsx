import { setRequestLocale } from 'next-intl/server'
import { Mail, MapPin, Camera, ExternalLink } from 'lucide-react'
import { getPayloadClient, getHeroPhotoMix } from '@/lib/payload'
import SiteHeader from '../_components/SiteHeader'
import HeroPhotoGrid from '../_components/HeroPhotoGrid'

export const dynamic = 'force-dynamic'

export default async function ContactoPage({ params }: { params: Promise<{ locale: 'es' | 'en' }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const payload = await getPayloadClient()
  const [contacto, heroPhotos] = await Promise.all([
    payload.findGlobal({ slug: 'contacto', locale }),
    getHeroPhotoMix('-craft', 80, 60),
  ])

  return (
    <>
      <SiteHeader />
      <section className="hero">
        <HeroPhotoGrid images={heroPhotos} />
        <div className="hero-inner">
          <span className="hero-tag">{contacto.heroTitle}</span>
          <h1>{contacto.heroTitle}</h1>
          {contacto.intro && <p className="hero-sub">{contacto.intro}</p>}
        </div>
      </section>

      <section className="catalogo">
        <div className="container contact-card">
          <h2>{contacto.orgName}</h2>
          <div className="contact-list">
            {contacto.email && (
              <a href={`mailto:${contacto.email}`} className="contact-row">
                <Mail size={18} />
                <span>{contacto.email}</span>
              </a>
            )}
            {contacto.address && (
              <div className="contact-row">
                <MapPin size={18} />
                <span>{contacto.address}</span>
              </div>
            )}
            {contacto.instagramUrl && (
              <a href={contacto.instagramUrl} target="_blank" rel="noopener noreferrer" className="contact-row">
                <Camera size={18} />
                <span>Instagram</span>
              </a>
            )}
            {contacto.facebookUrl && (
              <a href={contacto.facebookUrl} target="_blank" rel="noopener noreferrer" className="contact-row">
                <ExternalLink size={18} />
                <span>Facebook</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
